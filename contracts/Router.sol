// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import { IRouter } from "./interfaces/IRouter.sol";
import { IVault } from "./interfaces/IVault.sol";
import { IVaultLiquid } from "./interfaces/IVaultLiquid.sol";
import { IVaultLocked } from "./interfaces/IVaultLocked.sol";
import { IRegistrar } from "./interfaces/IRegistrar.sol";
import { IERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { AxelarExecutable } from "./axelar/AxelarExecutable.sol";
import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';

contract Router is IRouter, AxelarExecutable, OwnableUpgradeable {
    IRegistrar public registar;
    IAxelarGasService public gasReceiver;

    function initialize(address _gateway, address _gasReceiver, address _registrar) public initializer {
        registar = IRegistrar(_registrar);
        gasReceiver = IAxelarGasService(_gasReceiver);
        __AxelarExecutable_init_unchained(_gateway);
    }


    // @TODO the gas fwd is going to get hairy -- the originating TX will happen on the primary chain and this is
    // intended to operate as the atomic call back when tokens are redeemed withdrawn. Some complexity can be
    // avoided by regularly funding the contract with ether to pay for gas but its an open question still. 
    function sendTokens(
        string memory destinationChain,
        string memory destinationAddress,
        bytes memory payload,
        string memory symbol,
        uint256 amount
    ) public payable onlySelf {
        address tokenAddress = gateway.tokenAddresses(symbol);
        IERC20Upgradeable(tokenAddress).transferFrom(msg.sender, address(this), amount);
        IERC20Upgradeable(tokenAddress).approve(address(gateway), amount);
        if (msg.value > 0) {
            gasReceiver.payNativeGasForContractCallWithToken{ value: msg.value }(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amount,
                msg.sender
            );
        }
        gateway.callContractWithToken(destinationChain, destinationAddress, payload, symbol, amount);
    }

    function _callSwitch(IRegistrar.StrategyParams memory _params, VaultActionData memory _action, string calldata _tokenSymbol)
        internal
        override
    {
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);

        // DEPOSIT
        if(_action.selector == IVault.deposit.selector) {
            (uint256 liquidAmt, uint256 lockedAmt) = _determineSplit(_params, _action);
            liquidVault.deposit(_action.accountId, _action.token, liquidAmt);
            lockedVault.deposit(_action.accountId, _action.token, lockedAmt);
        }

        // REDEEM
        else if(_action.selector == IVault.redeem.selector) {
            // Redeem tokens from vaults wwhich sends them from the vault to this contract
            (uint256 liquidAmt, uint256 lockedAmt) = _determineSplit(_params, _action);
            liquidVault.redeem(_action.accountId, _action.token, liquidAmt);
            lockedVault.redeem(_action.accountId, _action.token, lockedAmt);

            // Pack the tokens and calldata for bridging back out over GMP 
            IRegistrar.AngelProtocolParams memory apParams = registar.getAngelProtocolParams();
            bytes memory payload = _packCallData(_action);
            uint256 amt = liquidAmt + lockedAmt;
            sendTokens(apParams.primaryChain, apParams.primaryChainRouter, payload, _tokenSymbol, amt);
        }

        // HARVEST 
        else if(_action.selector == IVault.harvest.selector) {
            liquidVault.harvest(_action.accountId);
            lockedVault.harvest(_action.accountId);
        }

        // REINVESTTOLOCKED
        else if(_action.selector == IVaultLiquid.reinvestToLocked.selector) {
            liquidVault.reinvestToLocked(_action.accountId, _action.token, _action.amt);
        }

        // INVALID SELCTOR 
        else {
            revert("Invalid function selector provided");
        }
    }

    function _executeWithToken(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) internal override {
        // decode payload
        VaultActionData memory action = _unpackCalldata(payload);
        
        // check payload matches GMP param
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);
        require(tokenAddress == action.token, "Token designation does not match");

        // Get parameters from registrar
        IRegistrar.StrategyParams memory params = registar.getStrategyParamsById(action.strategyId);
        // Switch for calling appropriate vault/method
        _callSwitch(params, action, tokenSymbol);
    }
}
