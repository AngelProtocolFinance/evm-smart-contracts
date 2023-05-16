// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IBasicToken} from "./lib/shared/IBasicToken.sol";
import {IIncentivisedVotingLockup} from "./interface/IIncentivisedVotingLockup.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";
import {StableMath} from "./lib/StableMath.sol";
import {Root} from "./lib/Root.sol";

/**
 * @title  IncentivisedVotingLockup
 * @author Voting Weight tracking & Decay
 *             -> Curve Finance (MIT) - forked & ported to Solidity
 *             -> https://github.com/curvefi/curve-dao-contracts/blob/master/contracts/VotingEscrow.vy
 *         osolmaz - Research & Reward distributions
 *         alsco77 - Solidity implementation
 * @notice Lockup MTA, receive vMTA (voting weight that decays over time), and earn
 *         rewards based on staticWeight
 * @dev    Supports:
 *            1) Tracking MTA Locked up (LockedBalance)
 *            2) Pull Based Reward allocations based on Lockup (Static Balance)
 *            3) Decaying voting weight lookup through CheckpointedERC20 (balanceOf)
 *            4) Ejecting fully decayed participants from reward allocation (eject)
 *            5) Migration of points to v2 (used as multiplier in future) ***** (rewardsPaid)
 *            6) Closure of contract (expire)
 */
contract IncentivisedVotingLockup is
    IIncentivisedVotingLockup,
    ReentrancyGuard
{
    using StableMath for uint256;
    using SafeERC20 for IERC20;

    /** Shared Events */
    event Deposit(
        address indexed provider,
        uint256 value,
        uint256 locktime,
        LockAction indexed action,
        uint256 ts
    );
    event Withdraw(address indexed provider, uint256 value, uint256 ts);
    event WithdrawVested(address indexed provider, uint256 value, uint256 ts);
    event Ejected(address indexed ejected, address ejector, uint256 ts);
    event Expired();
    event RewardAdded(uint256 reward);
    event RewardPaid(address indexed user, uint256 reward);

    /** Shared Globals */
    IERC20 public stakingToken;
    uint256 private constant WEEK = 7 days;
    uint256 public constant MAXTIME = 365 days;
    uint256 public END;
    bool public expired = false;
    address public admin = address(0);
    bool private initialized = false;
    /** Lockup */
    uint256 public globalEpoch;
    Point[] public pointHistory;
    mapping(address => Point[]) public userPointHistory;
    mapping(address => uint256) public userPointEpoch;
    mapping(uint256 => int128) public slopeChanges;
    mapping(address => LockedBalance) public locked;

    // Voting token - Checkpointed view only ERC20
    string public name;
    string public symbol;
    uint256 public decimals = 18;

    /** Rewards */
    // Updated upon admin deposit
    uint256 public periodFinish = 0;
    uint256 public rewardRate = 0;

    // Globals updated per stake/deposit/withdrawal
    uint256 public totalStaticWeight = 0;
    uint256 public lastUpdateTime = 0;
    uint256 public rewardPerTokenStored = 0;

    // Per user storage updated per stake/deposit/withdrawal
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public rewardsPaid;

    /** Structs */
    struct Point {
        int128 bias;
        int128 slope;
        uint256 ts;
        uint256 blk;
    }

    struct LockedBalance {
        int128 amount;
        uint256 end;
        uint256 start;
    }

    enum LockAction {
        CREATE_LOCK,
        INCREASE_LOCK_AMOUNT,
        INCREASE_LOCK_TIME,
        WITHDRAW
    }

    function initialize(
        address curStakingtoken,
        string memory curName,
        string memory curSymbol
    ) public {
        require(!initialized, "Already initialized");
        initialized = true;
        stakingToken = IERC20(curStakingtoken);
        Point memory init = Point({
            bias: int128(0),
            slope: int128(0),
            ts: block.timestamp,
            blk: block.number
        });
        pointHistory.push(init);

        decimals = IBasicToken(curStakingtoken).decimals();
        require(decimals <= 18, "Cannot have more than 18 decimals");

        name = curName;
        symbol = curSymbol;

        END = block.timestamp + MAXTIME;

        admin = msg.sender;
    }

    /** @dev Modifier to ensure contract has not yet expired */
    modifier contractNotExpired() {
        require(!expired, "Contract is expired");
        _;
    }

    /**
     * @dev Validates that the user has an expired lock && they still have capacity to earn
     * @param curAddr User address to check
     */
    modifier lockupIsOver(address curAddr) {
        LockedBalance memory userLock = locked[curAddr];
        require(
            userLock.amount > 0 && block.timestamp >= userLock.end,
            "Users lock didn't expire"
        );
        require(staticBalanceOf(curAddr) > 0, "User must have existing bias");
        _;
    }

    /***************************************
                LOCKUP - GETTERS
    ****************************************/

    /**
     * @dev Gets the last available user point
     * @param curAddr User address
     * @return bias i.e. y
     * @return slope i.e. linear gradient
     * @return ts i.e. time point was logged
     */
    function getLastUserPoint(
        address curAddr
    ) external view override returns (int128 bias, int128 slope, uint256 ts) {
        uint256 uepoch = userPointEpoch[curAddr];
        if (uepoch == 0) {
            return (0, 0, 0);
        }
        Point memory point = userPointHistory[curAddr][uepoch];
        return (point.bias, point.slope, point.ts);
    }

    /***************************************
                    LOCKUP
    ****************************************/

    /**
     * @dev Records a checkpoint of both individual and global slope
     * @param curAddr User address, or address(0) for only global
     * @param _oldLocked Old amount that user had locked, or null for global
     * @param _newLocked new amount that user has locked, or null for global
     */
    function _checkpoint(
        address curAddr,
        LockedBalance memory _oldLocked,
        LockedBalance memory _newLocked
    ) internal {
        Point memory userOldPoint;
        Point memory userNewPoint;
        int128 oldSlopeDelta = 0;
        int128 newSlopeDelta = 0;
        uint256 epoch = globalEpoch;

        if (curAddr != address(0)) {
            // Calculate slopes and biases
            // Kept at zero when they have to
            if (_oldLocked.end > block.timestamp && _oldLocked.amount > 0) {
                userOldPoint.slope =
                    _oldLocked.amount /
                    SafeCast.toInt128(int256(MAXTIME));
                userOldPoint.bias =
                    userOldPoint.slope *
                    SafeCast.toInt128(int256(_oldLocked.end - block.timestamp));
            }
            if (_newLocked.end > block.timestamp && _newLocked.amount > 0) {
                userNewPoint.slope =
                    _newLocked.amount /
                    SafeCast.toInt128(int256(MAXTIME));
                userNewPoint.bias =
                    userNewPoint.slope *
                    SafeCast.toInt128(int256(_newLocked.end - block.timestamp));
            }

            // Moved from bottom final if statement to resolve stack too deep err
            // start {
            // Now handle user history
            uint256 uEpoch = userPointEpoch[curAddr];
            if (uEpoch == 0) {
                userPointHistory[curAddr].push(userOldPoint);
            }
            // track the total static weight
            uint256 newStatic = _staticBalance(
                userNewPoint.slope,
                block.timestamp,
                _newLocked.end
            );
            uint256 additiveStaticWeight = totalStaticWeight + newStatic;
            if (uEpoch > 0) {
                uint256 oldStatic = _staticBalance(
                    userPointHistory[curAddr][uEpoch].slope,
                    userPointHistory[curAddr][uEpoch].ts,
                    _oldLocked.end
                );
                additiveStaticWeight = additiveStaticWeight - oldStatic;
            }
            totalStaticWeight = additiveStaticWeight;

            userPointEpoch[curAddr] = uEpoch + 1;
            userNewPoint.ts = block.timestamp;
            userNewPoint.blk = block.number;
            userPointHistory[curAddr].push(userNewPoint);

            // } end

            // Read values of scheduled changes in the slope
            // oldLocked.end can be in the past and in the future
            // newLocked.end can ONLY by in the FUTURE unless everything expired: than zeros
            oldSlopeDelta = slopeChanges[_oldLocked.end];
            if (_newLocked.end != 0) {
                if (_newLocked.end == _oldLocked.end) {
                    newSlopeDelta = oldSlopeDelta;
                } else {
                    newSlopeDelta = slopeChanges[_newLocked.end];
                }
            }
        }

        Point memory lastPoint = Point({
            bias: 0,
            slope: 0,
            ts: block.timestamp,
            blk: block.number
        });
        if (epoch > 0) {
            lastPoint = pointHistory[epoch];
        }
        uint256 lastCheckpoint = lastPoint.ts;

        // initialLastPoint is used for extrapolation to calculate block number
        // (approximately, for *At methods) and save them
        // as we cannot figure that out exactly from inside the contract
        Point memory initialLastPoint = Point({
            bias: 0,
            slope: 0,
            ts: lastPoint.ts,
            blk: lastPoint.blk
        });
        uint256 blockSlope = 0; // dblock/dt
        if (block.timestamp > lastPoint.ts) {
            blockSlope =
                StableMath.scaleInteger(block.number - lastPoint.blk) /
                (block.timestamp - lastPoint.ts);
        }
        // If last point is already recorded in this block, slope=0
        // But that's ok b/c we know the block in such case

        // Go over weeks to fill history and calculate what the current point is
        uint256 iterativeTime = _floorToWeek(lastCheckpoint);
        for (uint256 i = 0; i < 255; i++) {
            // Hopefully it won't happen that this won't get used in 5 years!
            // If it does, users will be able to withdraw but vote weight will be broken
            iterativeTime = iterativeTime + WEEK;
            int128 dSlope = 0;
            if (iterativeTime > block.timestamp) {
                iterativeTime = block.timestamp;
            } else {
                dSlope = slopeChanges[iterativeTime];
            }
            int128 biasDelta = lastPoint.slope *
                SafeCast.toInt128(int256((iterativeTime - lastCheckpoint)));
            lastPoint.bias = lastPoint.bias - biasDelta;
            lastPoint.slope = lastPoint.slope + dSlope;
            // This can happen
            if (lastPoint.bias < 0) {
                lastPoint.bias = 0;
            }
            // This cannot happen - just in case
            if (lastPoint.slope < 0) {
                lastPoint.slope = 0;
            }
            lastCheckpoint = iterativeTime;
            lastPoint.ts = iterativeTime;
            lastPoint.blk =
                initialLastPoint.blk +
                blockSlope.mulTruncate(iterativeTime - initialLastPoint.ts);

            // when epoch is incremented, we either push here or after slopes updated below
            epoch = epoch + 1;
            if (iterativeTime == block.timestamp) {
                lastPoint.blk = block.number;
                break;
            } else {
                // pointHistory[epoch] = lastPoint;
                pointHistory.push(lastPoint);
            }
        }

        globalEpoch = epoch;
        // Now pointHistory is filled until t=now

        if (curAddr != address(0)) {
            // If last point was in this block, the slope change has been applied already
            // But in such case we have 0 slope(s)
            lastPoint.slope =
                lastPoint.slope +
                userNewPoint.slope -
                userOldPoint.slope;
            lastPoint.bias =
                lastPoint.bias +
                userNewPoint.bias -
                userOldPoint.bias;
            if (lastPoint.slope < 0) {
                lastPoint.slope = 0;
            }
            if (lastPoint.bias < 0) {
                lastPoint.bias = 0;
            }
        }

        // Record the changed point into history
        // pointHistory[epoch] = lastPoint;
        pointHistory.push(lastPoint);

        if (curAddr != address(0)) {
            // Schedule the slope changes (slope is going down)
            // We subtract new_user_slope from [new_locked.end]
            // and add old_user_slope to [old_locked.end]
            if (_oldLocked.end > block.timestamp) {
                // oldSlopeDelta was <something> - userOldPoint.slope, so we cancel that
                oldSlopeDelta = oldSlopeDelta + userOldPoint.slope;
                if (_newLocked.end == _oldLocked.end) {
                    oldSlopeDelta = oldSlopeDelta - userNewPoint.slope; // It was a new deposit, not extension
                }
                slopeChanges[_oldLocked.end] = oldSlopeDelta;
            }
            if (_newLocked.end > block.timestamp) {
                if (_newLocked.end > _oldLocked.end) {
                    newSlopeDelta = newSlopeDelta - userNewPoint.slope; // old slope disappeared at this point
                    slopeChanges[_newLocked.end] = newSlopeDelta;
                }
                // else: we recorded it already in oldSlopeDelta
            }
        }
    }

    /**
     * @dev Deposits or creates a stake for a given address
     * @param curAddr User address to assign the stake
     * @param curValue Total units of StakingToken to lockup
     * @param curUnlocktime Time at which the stake should unlock
     * @param _oldLocked Previous amount staked by this user
     * @param curAction See LockAction enum
     */
    function _depositFor(
        address curAddr,
        uint256 curValue,
        uint256 curUnlocktime,
        LockedBalance memory _oldLocked,
        LockAction curAction
    ) internal {
        LockedBalance memory newLocked = LockedBalance({
            amount: _oldLocked.amount,
            end: _oldLocked.end,
            start: _oldLocked.start
        });

        // Adding to existing lock, or if a lock is expired - creating a new one
        newLocked.amount =
            newLocked.amount +
            SafeCast.toInt128(int256(curValue));
        if (curUnlocktime != 0) {
            newLocked.end = curUnlocktime;
        }
        locked[curAddr] = newLocked;

        // Possibilities:
        // Both _oldLocked.end could be current or expired (>/< block.timestamp)
        // value == 0 (extend lock) or value > 0 (add to lock or extend lock)
        // newLocked.end > block.timestamp (always)
        _checkpoint(curAddr, _oldLocked, newLocked);

        if (curValue != 0) {
            stakingToken.safeTransferFrom(curAddr, address(this), curValue);
        }
        emit Deposit(
            curAddr,
            curValue,
            newLocked.end,
            curAction,
            block.timestamp
        );
    }

    /**
     * @dev Public function to trigger global checkpoint
     */
    function checkpoint() external {
        LockedBalance memory empty;
        _checkpoint(address(0), empty, empty);
    }

    /**
     * @dev Creates a new lock
     * @param curValue Total units of StakingToken to lockup
     * @param curUnlocktime Time at which the stake should unlock
     */
    function createLock(
        uint256 curValue,
        uint256 curUnlocktime
    ) external override nonReentrant contractNotExpired {
        uint256 unlockTime = _floorToWeek(curUnlocktime); // Locktime is rounded down to weeks
        LockedBalance memory locked_ = LockedBalance({
            amount: locked[msg.sender].amount,
            end: locked[msg.sender].end,
            start: block.timestamp
        });

        require(curValue > 0, "Must stake non zero amount");
        require(locked_.amount == 0, "Withdraw old tokens first");

        require(
            unlockTime > block.timestamp,
            "Can only lock until time in the future"
        );
        require(
            unlockTime <= END,
            "Voting lock can be 1 year max (until recol)"
        );

        _depositFor(
            msg.sender,
            curValue,
            unlockTime,
            locked_,
            LockAction.CREATE_LOCK
        );
    }

    /**
     * @dev Increases amount of stake thats locked up & resets decay
     * @param curValue Additional units of StakingToken to add to exiting stake
     */
    function increaseLockAmount(
        uint256 curValue
    ) external override nonReentrant contractNotExpired {
        LockedBalance memory locked_ = LockedBalance({
            amount: locked[msg.sender].amount,
            end: locked[msg.sender].end,
            start: locked[msg.sender].start
        });

        require(curValue > 0, "Must stake non zero amount");
        require(locked_.amount > 0, "No existing lock found");
        require(
            locked_.end > block.timestamp,
            "Cannot add to expired lock. Withdraw"
        );

        _depositFor(
            msg.sender,
            curValue,
            0,
            locked_,
            LockAction.INCREASE_LOCK_AMOUNT
        );
    }

    /**
     * @dev Increases length of lockup & resets decay
     * @param curUnlocktime New unlocktime for lockup
     */
    function increaseLockLength(
        uint256 curUnlocktime
    ) external override nonReentrant contractNotExpired {
        LockedBalance memory locked_ = LockedBalance({
            amount: locked[msg.sender].amount,
            end: locked[msg.sender].end,
            start: block.timestamp
        });
        uint256 unlockTime = _floorToWeek(curUnlocktime); // Locktime is rounded down to weeks

        require(locked_.amount > 0, "Nothing is locked");
        require(locked_.end > block.timestamp, "Lock expired");
        require(unlockTime > locked_.end, "Can only increase lock WEEK");
        require(
            unlockTime <= END,
            "Voting lock can be 1 year max (until recol)"
        );

        _depositFor(
            msg.sender,
            0,
            unlockTime,
            locked_,
            LockAction.INCREASE_LOCK_TIME
        );
    }

    /**
     * @dev Withdraws all the senders stake, providing lockup is over
     */
    function withdraw() external override {
        _withdraw(msg.sender);
    }

    /**
     * @dev Withdraws a given users stake, providing the lockup has finished
     * @param curAddr User for which to withdraw
     */
    function _withdraw(address curAddr) internal nonReentrant {
        LockedBalance memory oldLock = LockedBalance({
            end: locked[curAddr].end,
            amount: locked[curAddr].amount,
            start: locked[curAddr].start
        });
        require(
            block.timestamp >= oldLock.end || expired,
            "The lock didn't expire"
        );
        require(oldLock.amount > 0, "Must have something to withdraw");

        uint256 value = SafeCast.toUint256(oldLock.amount);

        LockedBalance memory currentLock = LockedBalance({
            end: 0,
            amount: 0,
            start: 0
        });
        locked[curAddr] = currentLock;

        // oldLocked can have either expired <= timestamp or zero end
        // currentLock has only 0 end
        // Both can have >= 0 amount
        if (!expired) {
            _checkpoint(curAddr, oldLock, currentLock);
        }
        stakingToken.safeTransfer(curAddr, value);

        emit Withdraw(curAddr, value, block.timestamp);
    }

    /**
     * @dev Checks how much of the locked tokens are vested and can be withdrawn
     * @param curAddr User for which to withdraw
     */
    function getVestedAmount(address curAddr) external view returns (int128) {
        int128 val = (SafeCast.toInt128(int256(locked[curAddr].amount)) *
            SafeCast.toInt128(
                int256(block.timestamp - locked[curAddr].start)
            )) /
            SafeCast.toInt128(
                int256(locked[curAddr].end - locked[curAddr].start)
            );
        return val;
    }

    /**
     * @dev Lets user linearly unlock their vested tokens and withdraw them
     * @param curAddr User for which to withdraw
     * @param curValue Amount of tokens to withdraw
     */
    // function withdrawVested(address curAddr, uint256 curValue)
    //     external
    //     nonReentrant
    // {
    //     LockedBalance memory oldLock = LockedBalance({
    //         end: locked[curAddr].end,
    //         amount: locked[curAddr].amount,
    //         start: locked[curAddr].start
    //     });

    //     require(oldLock.amount > 0, "Must have something to withdraw");

    //     if (block.timestamp >= oldLock.end || expired) {
    //         _withdraw(curAddr);
    //         return;
    //     } else {
    //         int128 value = (SafeCast.toInt128(int256(oldLock.amount)) *
    //             SafeCast.toInt128(int256(block.timestamp - oldLock.start))) /
    //             SafeCast.toInt128(int256(oldLock.end - oldLock.start));

    //         require(
    //             value >= SafeCast.toInt128(int256(curValue)),
    //             "Cannot withdraw more than vested"
    //         );

    //         LockedBalance memory currentLock = LockedBalance({
    //             end: oldLock.end,
    //             amount: oldLock.amount - SafeCast.toInt128(int256(curValue)),
    //             start: block.timestamp
    //         });

    //         locked[curAddr] = currentLock;

    //         _checkpoint(curAddr, oldLock, currentLock);

    //         stakingToken.safeTransfer(curAddr, curValue);

    //         emit WithdrawVested(curAddr, curValue, block.timestamp);

    //         return;
    //     }
    // }

    /**
     * @dev Withdraws and consequently claims rewards for the sender
     */
    function exit() external override {
        _withdraw(msg.sender);
    }

    /**
     * @dev Ejects a user from the reward allocation, given their lock has freshly expired.
     * Leave it to the user to withdraw and claim their rewards.
     * @param curAddr Address of the user
     */
    function eject(
        address curAddr
    ) external override contractNotExpired lockupIsOver(curAddr) {
        _withdraw(curAddr);

        // solium-disable-next-line security/no-tx-origin
        emit Ejected(curAddr, tx.origin, block.timestamp);
    }

    /**
     * @dev Ends the contract, unlocking all stakes.
     * No more staking can happen. Only withdraw and Claim.
     */
    function expireContract() external override contractNotExpired {
        require(msg.sender == admin, "Only owner can expire contract");
        require(block.timestamp > periodFinish, "Period must be over");

        expired = true;

        emit Expired();
    }

    /***************************************
                    GETTERS
    ****************************************/

    /** @dev Floors a timestamp to the nearest weekly increment */
    function _floorToWeek(uint256 curT) internal pure returns (uint256) {
        return (curT / WEEK) * WEEK;
    }

    /**
     * @dev Uses binarysearch to find the most recent point history preceeding block
     * @param curBlock Find the most recent point history before this block
     * @param curMaxepoch Do not search pointHistories past this index
     */
    function _findBlockEpoch(
        uint256 curBlock,
        uint256 curMaxepoch
    ) internal view returns (uint256) {
        // Binary search
        uint256 min = 0;
        uint256 max = curMaxepoch;
        // Will be always enough for 128-bit numbers
        for (uint256 i = 0; i < 128; i++) {
            if (min >= max) break;
            uint256 mid = (min + max + 1) / 2;
            if (pointHistory[mid].blk <= curBlock) {
                min = mid;
            } else {
                max = mid - 1;
            }
        }
        return min;
    }

    /**
     * @dev Uses binarysearch to find the most recent user point history preceeding block
     * @param curAddr User for which to search
     * @param curBlock Find the most recent point history before this block
     */
    function _findUserBlockEpoch(
        address curAddr,
        uint256 curBlock
    ) internal view returns (uint256) {
        uint256 min = 0;
        uint256 max = userPointEpoch[curAddr];
        for (uint256 i = 0; i < 128; i++) {
            if (min >= max) {
                break;
            }
            uint256 mid = (min + max + 1) / 2;
            if (userPointHistory[curAddr][mid].blk <= curBlock) {
                min = mid;
            } else {
                max = mid - 1;
            }
        }
        return min;
    }

    /**
     * @dev Gets curent user voting weight (aka effectiveStake)
     * @param curOwner User for which to return the balance
     * @return uint256 Balance of user
     */
    function balanceOf(
        address curOwner
    ) public view override returns (uint256) {
        uint256 epoch = userPointEpoch[curOwner];
        if (epoch == 0) {
            return 0;
        }
        Point memory lastPoint = userPointHistory[curOwner][epoch];
        lastPoint.bias =
            lastPoint.bias -
            (lastPoint.slope *
                SafeCast.toInt128(int256(block.timestamp - lastPoint.ts)));
        if (lastPoint.bias < 0) {
            lastPoint.bias = 0;
        }
        return SafeCast.toUint256(lastPoint.bias);
    }

    /**
     * @dev Gets a users votingWeight at a given blockNumber
     * @param curOwner User for which to return the balance
     * @param curBlocknumber Block at which to calculate balance
     * @return uint256 Balance of user
     */
    function balanceOfAt(
        address curOwner,
        uint256 curBlocknumber
    ) public view override returns (uint256) {
        require(
            curBlocknumber <= block.number,
            "Must pass block number in the past"
        );

        // Get most recent user Point to block
        uint256 userEpoch = _findUserBlockEpoch(curOwner, curBlocknumber);
        if (userEpoch == 0) {
            return 0;
        }
        Point memory upoint = userPointHistory[curOwner][userEpoch];

        // Get most recent global Point to block
        uint256 maxEpoch = globalEpoch;
        uint256 epoch = _findBlockEpoch(curBlocknumber, maxEpoch);
        Point memory point0 = pointHistory[epoch];

        // Calculate delta (block & time) between user Point and target block
        // Allowing us to calculate the average seconds per block between
        // the two points
        uint256 dBlock = 0;
        uint256 dTime = 0;
        if (epoch < maxEpoch) {
            Point memory point1 = pointHistory[epoch + 1];
            dBlock = point1.blk - point0.blk;
            dTime = point1.ts - point0.ts;
        } else {
            dBlock = block.number - point0.blk;
            dTime = block.timestamp - point0.ts;
        }
        // (Deterministically) Estimate the time at which block curBlocknumber was mined
        uint256 blockTime = point0.ts;
        if (dBlock != 0) {
            blockTime =
                blockTime +
                ((dTime * (curBlocknumber - point0.blk)) / dBlock);
        }
        // Current Bias = most recent bias - (slope * time since update)
        upoint.bias =
            upoint.bias -
            (upoint.slope * SafeCast.toInt128(int256(blockTime - upoint.ts)));
        if (upoint.bias >= 0) {
            return SafeCast.toUint256(upoint.bias);
        } else {
            return 0;
        }
    }

    /**
     * @dev Calculates total supply of votingWeight at a given time curT
     * @param _point Most recent point before time curT
     * @param curT Time at which to calculate supply
     * @return totalSupply at given point in time
     */
    function _supplyAt(
        Point memory _point,
        uint256 curT
    ) internal view returns (uint256) {
        Point memory lastPoint = _point;
        // Floor the timestamp to weekly interval
        uint256 iterativeTime = _floorToWeek(lastPoint.ts);
        // Iterate through all weeks between _point & curT to account for slope changes
        for (uint256 i = 0; i < 255; i++) {
            iterativeTime = iterativeTime + WEEK;
            int128 dSlope = 0;
            // If week end is after timestamp, then truncate & leave dSlope to 0
            if (iterativeTime > curT) {
                iterativeTime = curT;
            }
            // else get most recent slope change
            else {
                dSlope = slopeChanges[iterativeTime];
            }

            lastPoint.bias =
                lastPoint.bias -
                (lastPoint.slope *
                    SafeCast.toInt128(int256(iterativeTime - lastPoint.ts)));
            if (iterativeTime == curT) {
                break;
            }
            lastPoint.slope = lastPoint.slope + dSlope;
            lastPoint.ts = iterativeTime;
        }

        if (lastPoint.bias < 0) {
            lastPoint.bias = 0;
        }
        return SafeCast.toUint256(lastPoint.bias);
    }

    /**
     * @dev Calculates current total supply of votingWeight
     * @return totalSupply of voting token weight
     */
    function totalSupply() public view override returns (uint256) {
        uint256 curEpoch = globalEpoch;
        Point memory lastPoint = pointHistory[curEpoch];
        return _supplyAt(lastPoint, block.timestamp);
    }

    /**
     * @dev Calculates total supply of votingWeight at a given blockNumber
     * @param curBlocknumber Block number at which to calculate total supply
     * @return totalSupply of voting token weight at the given blockNumber
     */
    function totalSupplyAt(
        uint256 curBlocknumber
    ) public view override returns (uint256) {
        require(
            curBlocknumber <= block.number,
            "Must pass block number in the past"
        );

        uint256 epoch = globalEpoch;
        uint256 targetEpoch = _findBlockEpoch(curBlocknumber, epoch);

        Point memory point = pointHistory[targetEpoch];

        // If point.blk > curBlocknumber that means we got the initial epoch & contract did not yet exist
        if (point.blk > curBlocknumber) {
            return 0;
        }

        uint256 dTime = 0;
        if (targetEpoch < epoch) {
            Point memory pointNext = pointHistory[targetEpoch + 1];
            if (point.blk != pointNext.blk) {
                dTime =
                    ((curBlocknumber - point.blk) * (pointNext.ts - point.ts)) /
                    (pointNext.blk - point.blk);
            }
        } else if (point.blk != block.number) {
            dTime =
                ((curBlocknumber - point.blk) * (block.timestamp - point.ts)) /
                (block.number - point.blk);
        }
        // Now dTime contains info on how far are we beyond point

        return _supplyAt(point, point.ts + dTime);
    }

    /**
     * @dev Gets the most recent Static Balance (bias) for a user
     * @param curAddr User for which to retrieve static balance
     * @return uint256 balance
     */
    function staticBalanceOf(address curAddr) public view returns (uint256) {
        uint256 uepoch = userPointEpoch[curAddr];
        if (uepoch == 0 || userPointHistory[curAddr][uepoch].bias == 0) {
            return 0;
        }
        return
            _staticBalance(
                userPointHistory[curAddr][uepoch].slope,
                userPointHistory[curAddr][uepoch].ts,
                locked[curAddr].end
            );
    }

    function _staticBalance(
        int128 curSlope,
        uint256 curStarttime,
        uint256 curEndtime
    ) internal pure returns (uint256) {
        if (curStarttime > curEndtime) return 0;
        // get lockup length (end - point.ts)
        uint256 lockupLength = curEndtime - curStarttime;
        // s = amount * sqrt(length)
        uint256 s = SafeCast.toUint256(curSlope * 10000) *
            Root.sqrt(lockupLength);
        return s;
    }

    function transferOwnership(address curNewowner) public {
        require(curNewowner != address(0), "New owner cannot be zero address");
        require(msg.sender == admin, "Only owner can transfer ownership");
        admin = curNewowner;
        // emit OwnershipTransferred(msg.sender, curNewowner);
    }
}
