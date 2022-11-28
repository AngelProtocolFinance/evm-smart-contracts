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
    }

    /*////////////////////////////////////////////////
                    ANGEL PROTOCOL ROUTER
    */////////////////////////////////////////////////

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

    function _deposit(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal {
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        lockedVault.deposit(_action.accountId, _action.token, _action.lockAmt);
        liquidVault.deposit(_action.accountId, _action.token, _action.liqAmt);
    }

    function _redeem(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action,
        string calldata _tokenSymbol
    ) internal {
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);

        // Redeem tokens from vaults wwhich sends them from the vault to this contract
        uint256 _redeemedLockAmt = lockedVault.redeem(_action.accountId, _action.token, _action.lockAmt);
        uint256 _redeemedLiqAmt = liquidVault.redeem(_action.accountId, _action.token, _action.liqAmt);

        // Pack the tokens and calldata for bridging back out over GMP
        IRegistrar.AngelProtocolParams memory apParams = registar
            .getAngelProtocolParams();
        bytes memory payload = _packCallData(_action);
        uint256 amt = _redeemedLockAmt + _redeemedLiqAmt;
        sendTokens(
            apParams.primaryChain,
            apParams.primaryChainRouter,
            payload,
            _tokenSymbol,
            amt
        );
    }

    function _harvest(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal {
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        liquidVault.harvest(_action.accountId);
        lockedVault.harvest(_action.accountId);
    }

    function _reinvestToLocked(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal {
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);
        liquidVault.reinvestToLocked(
            _action.accountId,
            _action.token,
            _action.liqAmt
        );
    }

    /*////////////////////////////////////////////////
                        AXELAR IMPL.
    */////////////////////////////////////////////////

    modifier onlySelf() {
        require(msg.sender == address(this));
        _;
    }

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

    // @TODO the gas fwd is going to get hairy -- the originating TX will happen on the primary chain and this is
    // intended to operate as the atomic call back when tokens are redeemed or withdrawn. Some complexity can be
    // avoided by regularly funding the contract with native token to pay for gas but that's an open operations q.
    function sendTokens(
        string memory destinationChain,
        string memory destinationAddress,
        bytes memory payload,
        string memory symbol,
        uint256 amount
    ) public payable onlySelf {
        address tokenAddress = gateway.tokenAddresses(symbol);
        IERC20Upgradeable(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        IERC20Upgradeable(tokenAddress).approve(address(gateway), amount);
        if (msg.value > 0) {
            gasReceiver.payNativeGasForContractCallWithToken{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                symbol,
                amount,
                msg.sender
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

    // @Todo depending on how we pack splits in the VaultAction data, we might want to validate that amount == action.amt
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
        require(
            tokenAddress == action.token,
            "Token designation does not match"
        );

        // check that fwd'd token amts match expected action amts
        if (action.selector == IVault.deposit.selector) {
            require(amount == (action.liqAmt + action.lockAmt), "Action amts mismatch fwd amt");
        }

        // Get parameters from registrar
        IRegistrar.StrategyParams memory params = registar
            .getStrategyParamsById(action.strategyId);
        // Switch for calling appropriate vault/method
        _callSwitch(params, action, tokenSymbol);
    }
}
