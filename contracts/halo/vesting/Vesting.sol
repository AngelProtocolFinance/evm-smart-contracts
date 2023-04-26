// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {VestingMessage} from "./message.sol";

/**
 *@title Vesting
 * @dev Vesting contract
 * The `Vesting` contract implements a vesting mechanism for the Halo Token.
 * Vesting is the process of gradually unlocking an amount of tokens over a set period of time.
 */
contract Vesting is Ownable, ReentrancyGuard {
    event VestingInitialized(address haloToken);
    event VestingDeposit(address user, uint256 amount);
    event VestingWithdraw(address user, uint256 amount, uint256 vestingId);
    event VestingDurationModified(uint256 vestingDuration);

    address public haloToken;
    uint256 public totalVested;
    struct VestingStruct {
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        uint256 claimed;
    }
    mapping(address => mapping(uint256 => VestingStruct)) public vesting;
    mapping(address => uint256) public vestingNumber;
    uint256 public vestingDuration = 90 days;
    uint256 vestingSlope = 100; // 2 decimals

    /**
     * @dev Initialize contract
     * @param curDetails instantiate message containing halo token address
     */

    function initialize(
        VestingMessage.InstantiateMsg memory curDetails
    ) public {
        require(haloToken == address(0), "Already initialized");
        haloToken = curDetails.haloToken;
        totalVested = 0;
        emit VestingInitialized(curDetails.haloToken);
    }

    /**
     * @dev Deposits an amount of tokens into the vesting contract.
     * @param amount uint
     */
    function deposit(uint256 amount) public nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(
            IERC20(haloToken).transferFrom(msg.sender, address(this), amount),
            "TransferFrom failed"
        );
        vesting[msg.sender][vestingNumber[msg.sender]] = VestingStruct({
            amount: amount,
            startTime: block.timestamp,
            endTime: block.timestamp + vestingDuration,
            claimed: 0
        });
        vestingNumber[msg.sender] += 1;
        totalVested += amount;
        emit VestingDeposit(msg.sender, amount);
    }

    /**
     * @dev Allows the sender to withdraw the claimed tokens from the vesting contract.
     * @param vestingId uint
     */
    function withdraw(uint256 vestingId) public nonReentrant {
        if (
            vesting[msg.sender][vestingId].claimed ==
            vesting[msg.sender][vestingId].amount
        ) {
            revert("Nothing to claim");
        }
        uint256 timediff = min(
            block.timestamp,
            vesting[msg.sender][vestingId].endTime
        ) - vesting[msg.sender][vestingId].startTime;
        // uint256 totalArea = (vestingDuration * (vestingSlope * vestingDuration)/100)/2;
        // uint256 area = (timediff * (vestingSlope * timediff)/100)/2;

        // claimable = (vesting amount * area) / total area
        // the following is a simplified equation
        uint256 claimable = (vesting[msg.sender][vestingId].amount *
            timediff *
            timediff) / (vestingDuration * vestingDuration);
        require(
            claimable > vesting[msg.sender][vestingId].claimed,
            "Nothing to claim"
        );
        require(
            IERC20(haloToken).transfer(
                msg.sender,
                claimable - vesting[msg.sender][vestingId].claimed
            ),
            "Transfer failed"
        );
        totalVested -= (claimable - vesting[msg.sender][vestingId].claimed);
        vesting[msg.sender][vestingId].claimed = claimable;
        emit VestingWithdraw(
            msg.sender,
            claimable - vesting[msg.sender][vestingId].claimed,
            vestingId
        );
    }

    /**
     * @dev Allows the owner of the contract to modify the vesting duration.
     * @param curVestingduration uint
     */
    function modifyVestingDuration(
        uint256 curVestingduration
    ) public onlyOwner {
        vestingDuration = curVestingduration;
        emit VestingDurationModified(curVestingduration);
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a < b) {
            return a;
        }
        return b;
    }
}
