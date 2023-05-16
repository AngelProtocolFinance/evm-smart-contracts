// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./storage.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import {IAccountsDepositWithdrawEndowments} from "./../../core/accounts/interface/IAccountsDepositWithdrawEndowments.sol";
import {SubDaoTokenMessage} from "./message.sol";
import {subDaoTokenStorage} from "./storage.sol";
// import {ISubdaoTokenEmitter} from "./ISubdaoTokenEmitter.sol";
import {ContinuousToken} from "./Token/Continous.sol";

/**
 *@title SubDaoToken
 * @dev SubDaoToken contract
 */
contract SubDaoToken is Storage, ContinuousToken {
    using SafeMath for uint256;

    // bool initFlag = false;
    address emitterAddress;

    /**
     * @dev Initialize contract
     * @param curMsg SubDaoTokenMessage.InstantiateMsg used to initialize contract
     * @param curEmitteraddress address
     */
    function continuosToken(
        SubDaoTokenMessage.InstantiateMsg memory curMsg,
        address curEmitteraddress
    ) public initializer {
        require(curEmitteraddress != address(0), "Invalid Address");
        emitterAddress = curEmitteraddress;
        initCurveToken(
            curMsg.name,
            curMsg.symbol,
            subDaoTokenStorage.getReserveRatio(curMsg.curve_type),
            curMsg.reserveDenom
        );

        tokenInfo.name = curMsg.name;
        tokenInfo.symbol = curMsg.symbol;
        tokenInfo.decimals = 18; //Equivalue to curMsg.decimals
        tokenInfo.mint = subDaoTokenStorage.MinterData({
            minter: address(this),
            cap: 0,
            hasCap: false
        });

        reserveDenom = curMsg.reserveDenom;

        config.unbondingPeriod = AngelCoreStruct.Duration({
            enumData: AngelCoreStruct.DurationEnum.Time,
            data: AngelCoreStruct.DurationData({
                height: 0,
                time: curMsg.unbondingPeriod
            })
        });
        // ISubdaoTokenEmitter(emitterAddress).initializeSubdaoToken(curMsg);
    }

    //TODO: check we have a un used parameter
    /**
     * @dev This function is used to transfer an amount from the sender to the contract and divide it into four parts: donor's share, endowment's share, burn and the deposit in an endowment contract.
     * @param curAmount uint256
     * @param curAccountscontract address
     * @param curEndowmentId uint256
     * @param curDonor address
     */
    function executeDonorMatch(
        uint256 curAmount,
        address curAccountscontract,
        uint32 curEndowmentId,
        address curDonor
    ) public {
        require(curAmount > 100, "InvalidZeroAmount");

        //  changing flow as each mint operation changes the amount of tokens that are minted

        // total possible subdao mint for curAmount  (give 40 % to donor, 40% to endowment, rest burn)
        uint256 totalMinted = mint(curAmount, address(this));

        uint256 donorAmount = (totalMinted.mul(40)).div(100);
        uint256 endowmentAmount = (totalMinted.mul(40)).div(100);
        uint256 burnAmount = totalMinted.sub(donorAmount).sub(endowmentAmount);

        require(
            IERC20(address(this)).transfer(curDonor, donorAmount),
            "Transfer failed"
        ); // 40% to donor

        burn(burnAmount, address(this)); // 20% burn

        require(
            IERC20(address(this)).approve(curAccountscontract, endowmentAmount),
            "Approve failed"
        );

        IAccountsDepositWithdrawEndowments(curAccountscontract)
            .depositDonationMatchErC20(
                curEndowmentId,
                address(this),
                endowmentAmount
            );

        // transfer reserve token from sender to this contract
        require(
            IERC20(reserveDenom).transferFrom(
                msg.sender,
                address(this),
                curAmount
            ),
            "TransferFrom failed"
        );
    }

    /**
     * @dev This function is used to transfer an amount from the sender to the contract and mint the same amount for the sender.
     * @param curAmount uint256
     */
    function executeBuyCw20(uint256 curAmount) public {
        require(curAmount > 100, "InvalidZeroAmount");
        require(
            IERC20(reserveDenom).transferFrom(
                msg.sender,
                address(this),
                curAmount
            ),
            "TransferFrom failed"
        );
        // ISubdaoTokenEmitter(emitterAddress).transferFromSt(
        //     reserveDenom,
        //     msg.sender,
        //     address(this),
        //     curAmount
        // );

        mint(curAmount, msg.sender);
        // ISubdaoTokenEmitter(emitterAddress).mintSt(
        //     address(this),
        //     curAmount,
        //     msg.sender
        // );
    }

    /**
     * @dev This function is used to transfer an amount from the contract to the given `curReciver` and burn the same amount from the sender.
     * @param curAmount uint256
     * @param curReciver address
     */
    function executeSell(address curReciver, uint256 curAmount) public {
        doSell(curReciver, curAmount);
    }

    /**
     * @dev This function is an internal function used by the `executeSell` function to perform the actual transfer and burn operations.
     * @param curAmount uint256
     * @param curReciver address
     */
    function doSell(address curReciver, uint256 curAmount) internal {
        uint256 burnedAmount = burn(curAmount, curReciver);
        // ISubdaoTokenEmitter(emitterAddress).burnSt(
        //     address(this),
        //     burnedAmount
        // );

        CLAIM_AMOUNT[msg.sender].details.push(
            subDaoTokenStorage.claimInfo({
                releaseTime: (config.unbondingPeriod.data.time +
                    block.timestamp),
                amount: burnedAmount,
                isClaimed: false
            })
        );

        // emit event
        // ISubdaoTokenEmitter(emitterAddress).addClaimSt(
        //     msg.sender,
        //     subDaoTokenStorage.claimInfo({
        //         releaseTime: (config.unbondingPeriod.data.time +
        //             block.timestamp),
        //         amount: burnedAmount,
        //         isClaimed: false
        //     })
        // );
    }

    /**
     * @notice This function is used to check and claim the token release from the unbonding period.
     */
    function claimTokens() public {
        uint256 amount = claimTokensCheck(msg.sender);

        require(amount > 0, "NothingToClaim");

        require(
            IERC20(reserveDenom).transfer(msg.sender, amount),
            "Transfer failed"
        );
        // ISubdaoTokenEmitter(emitterAddress).transferSt(
        //     reserveDenom,
        //     msg.sender,
        //     amount
        // );
    }

    /**
     * @notice This function is used to check if the release time of the token has passed and if the token can be claimed.
     * @param curSender address
     * @return amount Amount of claimable tokens
     */
    function claimTokensCheck(address curSender) internal returns (uint256) {
        uint256 amount = 0;

        for (uint256 i = 0; i < CLAIM_AMOUNT[curSender].details.length; i++) {
            if (
                CLAIM_AMOUNT[curSender].details[i].releaseTime <
                block.timestamp &&
                !CLAIM_AMOUNT[curSender].details[i].isClaimed
            ) {
                amount += CLAIM_AMOUNT[curSender].details[i].amount;
                CLAIM_AMOUNT[curSender].details[i].isClaimed = true;
                // ISubdaoTokenEmitter(emitterAddress).claimSt(curSender, i);
            }
        }

        return amount;
    }

    /**
     * @notice This function is used to check if the token can be claimed.
     * @return amount Amount of claimable tokens
     */
    function checkClaimableTokens() public view returns (uint256) {
        uint256 amount = 0;

        for (uint256 i = 0; i < CLAIM_AMOUNT[msg.sender].details.length; i++) {
            if (
                CLAIM_AMOUNT[msg.sender].details[i].releaseTime <
                block.timestamp &&
                !CLAIM_AMOUNT[msg.sender].details[i].isClaimed
            ) {
                amount += CLAIM_AMOUNT[msg.sender].details[i].amount;
            }
        }

        return amount;
    }
}
