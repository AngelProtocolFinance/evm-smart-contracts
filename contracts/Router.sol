// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

// @Todo eliminate upgradability and ownability. this can be deployed as an immutable contract 
// and if it ever needs to be updated/upgraded, a new one can simply be deployed

import {IRouter} from "./interfaces/IRouter.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IVaultLiquid} from "./interfaces/IVaultLiquid.sol";
import {IVaultLocked} from "./interfaces/IVaultLocked.sol";
import {IRegistrar} from "./interfaces/IRegistrar.sol";
import {StringToAddress} from "./lib/StringAddressUtils.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {AxelarExecutable} from "./axelar/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

contract Router is IRouter, AxelarExecutable, OwnableUpgradeable {
    IRegistrar public registar;
    IAxelarGasService public gasReceiver;

    /*////////////////////////////////////////////////
                        PROXY INIT
    */////////////////////////////////////////////////

    function initialize(
        address _gateway,
        address _gasReceiver,
        address _registrar
    ) public initializer {
        registar = IRegistrar(_registrar);
        gasReceiver = IAxelarGasService(_gasReceiver);
        __AxelarExecutable_init_unchained(_gateway);
        __Ownable_init_unchained();
    }

    /*////////////////////////////////////////////////
                    ANGEL PROTOCOL ROUTER
    */////////////////////////////////////////////////

    modifier onlyOneAccount(VaultActionData memory _action) {
        require(_action.accountIds.length == 1);
        _;
    }

    function _callSwitch(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action,
        string calldata _tokenSymbol
    ) internal override {
        // DEPOSIT
        if (_action.selector == IVault.deposit.selector) {
            _deposit(_params, _action);
        }
        // REDEEM
        else if (_action.selector == IVault.redeem.selector) {
            _redeem(_params, _action, _tokenSymbol);
        }
        // HARVEST
        else if (_action.selector == IVault.harvest.selector) {
            _harvest(_params, _action);
        }
        // REINVESTTOLOCKED
        else if (_action.selector == IVaultLiquid.reinvestToLocked.selector) {
            _reinvestToLocked(_params, _action);
        }
        // INVALID SELCTOR
        else {
            revert("Invalid function selector provided");
        }
    }

    // Vault action::Deposit
    function _deposit(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal onlyOneAccount(_action) {
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        lockedVault.deposit(_action.accountIds[0], _action.token, _action.lockAmt);
        liquidVault.deposit(_action.accountIds[0], _action.token, _action.liqAmt);
    }

    // Vault action::Redeem
    function _redeem(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action,
        string calldata _tokenSymbol
    ) internal onlyOneAccount(_action) {
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);

        // Redeem tokens from vaults which sends them from the vault to this contract
        uint256 _redeemedLockAmt = lockedVault.redeem(_action.accountIds[0], _action.token, _action.lockAmt);
        uint256 _redeemedLiqAmt = liquidVault.redeem(_action.accountIds[0], _action.token, _action.liqAmt);

        // Pack the tokens and calldata for bridging back out over GMP
        IRegistrar.AngelProtocolParams memory apParams = registar
            .getAngelProtocolParams();
        bytes memory payload = _packCallData(_action);
        uint256 amt = _redeemedLockAmt + _redeemedLiqAmt;
        uint256 amtLessGasFee = amt - apParams.gasFee;
        _sendTokens(
            apParams.primaryChain,
            apParams.primaryChainRouter,
            payload,
            _tokenSymbol,
            amtLessGasFee,
            _action.token,
            apParams.gasFee
        );
    }

    // Vault action::Harvest
    function _harvest(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal {
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        liquidVault.harvest(_action.accountIds);
        lockedVault.harvest(_action.accountIds);
    }

    // Liquid Vault action::Reinvest To Locked 
    function _reinvestToLocked(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal onlyOneAccount(_action){
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);
        liquidVault.reinvestToLocked(
            _action.accountIds[0],
            _action.token,
            _action.liqAmt
        );
    }

    /*////////////////////////////////////////////////
                        AXELAR IMPL.
    */////////////////////////////////////////////////

    modifier onlyPrimaryChain(string calldata _sourceChain) {
        IRegistrar.AngelProtocolParams memory APParams = registar
            .getAngelProtocolParams();
        require(
            keccak256(bytes(_sourceChain)) ==
                keccak256(bytes(APParams.primaryChain))
        );
        _;
    }

    modifier onlyPrimaryRouter(string calldata _sourceAddress) {
        IRegistrar.AngelProtocolParams memory APParams = registar
            .getAngelProtocolParams();
        require(
            StringToAddress.toAddress(_sourceAddress) ==
                StringToAddress.toAddress(APParams.primaryChainRouter),
            "Unauthorized Call"
        );
        _;
    }

     function _sendTokens(
        string memory destinationChain,
        string memory destinationAddress,
        bytes memory payload,
        string memory symbol,
        uint256 amount,
        address gasToken, 
        uint256 gasFeeAmt
    ) internal {

        address tokenAddress = gateway.tokenAddresses(symbol);
        IERC20Upgradeable(tokenAddress).approve(address(gateway), amount);

        IRegistrar.AngelProtocolParams memory apParams = registar.getAngelProtocolParams();
        if (msg.value > 0) {
            gasReceiver.payGasForContractCallWithToken(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amount,
                gasToken,       // always pay with the token (USDC)
                gasFeeAmt,      // get from Angel Protocol params
                apParams.protocolTaxCollector    // tax collector 
            );
        }
        gateway.callContractWithToken(
            destinationChain,
            destinationAddress,
            payload,
            symbol,
            amount
        );
    }

    // This is called on the source chain before calling the gateway to execute a remote contract.
    // function payGasForContractCallWithToken(
    //     address sender,
    //     string calldata destinationChain,
    //     string calldata destinationAddress,
    //     bytes calldata payload,
    //     string calldata symbol,
    //     uint256 amount,
    //     address gasToken,
    //     uint256 gasFeeAmount,
    //     address refundAddress
    // ) external;
    function _executeWithToken(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    )
        internal
        override
        onlyPrimaryChain(sourceChain)
        onlyPrimaryRouter(sourceAddress)
    {
        // decode payload
        VaultActionData memory action = _unpackCalldata(payload);

        // check payload matches GMP param
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);

        // check that token is accepted by angel protocol
        require(registar.isTokenAccepted(tokenAddress),"Token not accepted");

        // check that the token fwd by GMP is the same as the actionable token
        require(
            tokenAddress == action.token,
            "Token designation does not match"
        );

        // check that the action amts equal the amt fwd'd by GMP
        require(amount == (action.liqAmt + action.lockAmt), "Amount mismatch");

        // check that fwd'd token amts match expected action amts
        if (action.selector == IVault.deposit.selector) {
            require(amount == (action.liqAmt + action.lockAmt), "Action amts mismatch fwd amt");
        }

        // Get parameters from registrar if approved
        require(registar.isStrategyApproved(action.strategyId));
        IRegistrar.StrategyParams memory params = registar
            .getStrategyParamsById(action.strategyId);        

        // Switch for calling appropriate vault/method
        _callSwitch(params, action, tokenSymbol);
    }
}