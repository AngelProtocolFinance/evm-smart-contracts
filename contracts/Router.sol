// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

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
    IRegistrar public registrar;
    IAxelarGasService public gasReceiver;

    mapping(address => string) symbolFromAddress; // reverse lookup for Axelar token symbol

    /*///////////////////////////////////////////////
                        PROXY INIT
    *////////////////////////////////////////////////

    function initialize(
        address _gateway,
        address _gasReceiver,
        address _registrar
    ) public initializer {
        registrar = IRegistrar(_registrar);
        gasReceiver = IAxelarGasService(_gasReceiver);
        __AxelarExecutable_init_unchained(_gateway);
        __Ownable_init_unchained();
    }

    /*///////////////////////////////////////////////
                    ANGEL PROTOCOL ROUTER
    *////////////////////////////////////////////////

    modifier onlyOneAccount(VaultActionData memory _action) {
        require(_action.accountIds.length == 1);
        _;
    }

    function _callSwitch(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal override {
        // DEPOSIT
        if (_action.selector == IVault.deposit.selector) {
            _deposit(_params, _action);
        }
        // REDEEM
        else if (_action.selector == IVault.redeem.selector) {
            _redeem(_params, _action);
        }
        // REDEEM ALL
        else if (_action.selector == IVault.redeemAll.selector) {
            _redeemAll(_params, _action);
        }
        // HARVEST
        else if (_action.selector == IVault.harvest.selector) {
            _harvest(_params, _action);
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
        lockedVault.deposit(
            _action.accountIds[0],
            _action.token,
            _action.lockAmt
        );
        liquidVault.deposit(
            _action.accountIds[0],
            _action.token,
            _action.liqAmt
        );
    }

    // Vault action::Redeem
    function _redeem(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal onlyOneAccount(_action) {
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);

        // Redeem tokens from vaults which sends them from the vault to this contract
        uint256 _redeemedLockAmt = lockedVault.redeem(
            _action.accountIds[0],
            _action.token,
            _action.lockAmt
        );
        IERC20Upgradeable(_action.token).transferFrom(_params.Locked.vaultAddr, address(this), _redeemedLockAmt);

        uint256 _redeemedLiqAmt = liquidVault.redeem(
            _action.accountIds[0],
            _action.token,
            _action.liqAmt
        );
        IERC20Upgradeable(_action.token).transferFrom(_params.Liquid.vaultAddr, address(this), _redeemedLiqAmt);

        // Pack and send the tokens back through GMP 
        uint256 _redeemedAmt = _redeemedLockAmt + _redeemedLiqAmt; 
        _prepareAndSendTokens(_action, _redeemedAmt);
    }

    // Vault action::RedeemAll
        function _redeemAll(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal onlyOneAccount(_action) {
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);

        // Redeem tokens from vaults and txfer them to the Router
        uint256 _redeemedLockAmt;
        if(_action.lockAmt > 0) {       // only do a redeemAll if the lock amt is nonzero
            _redeemedLockAmt = lockedVault.redeemAll(
                _action.accountIds[0]);
            IERC20Upgradeable(_action.token)
                .transferFrom(_params.Locked.vaultAddr, address(this), _redeemedLockAmt);
        }

        uint256 _redeemedLiqAmt;
        if(_action.liqAmt > 0) {        // only do a redeemAll if the liquid amt is nonzero
            _redeemedLiqAmt = liquidVault.redeemAll(
                _action.accountIds[0]);
            IERC20Upgradeable(_action.token)
                .transferFrom(_params.Liquid.vaultAddr, address(this), _redeemedLiqAmt);
        }

        // Pack and send the tokens back through GMP 
        uint256 _redeemedAmt = _redeemedLockAmt + _redeemedLiqAmt; 
        _prepareAndSendTokens(_action, _redeemedAmt);
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

    /*////////////////////////////////////////////////
                        AXELAR IMPL.
    */////////////////////////////////////////////////

    modifier onlyPrimaryChain(string calldata _sourceChain) {
        IRegistrar.AngelProtocolParams memory APParams = registrar
            .getAngelProtocolParams();
        require(
            keccak256(bytes(_sourceChain)) ==
                keccak256(bytes(APParams.primaryChain)),
            "Unauthorized Call"
        );
        _;
    }

    modifier onlyPrimaryRouter(string calldata _sourceAddress) {
        IRegistrar.AngelProtocolParams memory APParams = registrar
            .getAngelProtocolParams();
        require(
            StringToAddress.toAddress(_sourceAddress) ==
                StringToAddress.toAddress(APParams.primaryChainRouter),
            "Unauthorized Call"
        );
        _;
    }

    function _prepareAndSendTokens(
        VaultActionData memory _action, 
        uint256 _redeemedAmt
        ) internal {

        // Pack the tokens and calldata for bridging back out over GMP
        IRegistrar.AngelProtocolParams memory apParams = registrar
            .getAngelProtocolParams();
        bytes memory payload = _packCallData(_action);

        // Prepare gas 
        uint256 gasFee = registrar.getGasByToken(_action.token);
        uint256 amtLessGasFee = _redeemedAmt - gasFee;

        _sendTokens(
            apParams.primaryChain,
            apParams.primaryChainRouter,
            payload,
            symbolFromAddress[_action.token],
            amtLessGasFee,
            _action.token,
            gasFee
        );
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

        IRegistrar.AngelProtocolParams memory apParams = registrar
            .getAngelProtocolParams();
        if (msg.value > 0) {
            gasReceiver.payGasForContractCallWithToken(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amount,
                gasToken, // always pay with the token (USDC)
                gasFeeAmt, // get from Angel Protocol params
                apParams.protocolTaxCollector // tax collector
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
        require(registrar.isTokenAccepted(tokenAddress), "Token not accepted");

        // check that the token fwd by GMP is the same as the actionable token
        require(
            tokenAddress == action.token,
            "Token designation does not match"
        );

        // check that the action amts equal the amt fwd'd by GMP
        require(amount == (action.liqAmt + action.lockAmt), "Amount mismatch");

        // Get parameters from registrar if approved
        require(registrar.isStrategyApproved(action.strategyId), "Strategy not approved");
        IRegistrar.StrategyParams memory params = registrar
            .getStrategyParamsById(action.strategyId);

        // Update the address -> symbol mapping
        symbolFromAddress[action.token] = tokenSymbol;

        // Switch for calling appropriate vault/method
        _callSwitch(params, action);
    }

    function _execute(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    )
        internal
        override
        onlyPrimaryChain(sourceChain)
        onlyPrimaryRouter(sourceAddress)
    {
        // decode payload
        VaultActionData memory action = _unpackCalldata(payload);

        // Get parameters from registrar if approved
        require(registrar.isStrategyApproved(action.strategyId));
        IRegistrar.StrategyParams memory params = registrar
            .getStrategyParamsById(action.strategyId);

        // Switch for calling appropriate vault/method
        _callSwitch(params, action);
    }
}
