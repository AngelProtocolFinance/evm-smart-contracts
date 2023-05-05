// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.8;

import {IRouter} from "./interfaces/IRouter.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IVaultLiquid} from "./interfaces/IVaultLiquid.sol";
import {IVaultLocked} from "./interfaces/IVaultLocked.sol";
import {ILocalRegistrar} from "./interfaces/ILocalRegistrar.sol";
import {StringToAddress} from "./lib/StringAddressUtils.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {AxelarExecutable} from "./axelar/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {IAxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";

contract Router is IRouter, OwnableUpgradeable, AxelarExecutable {
    string public chain;
    ILocalRegistrar public registrar;
    IAxelarGasService public gasReceiver;

    uint256 constant PRECISION = 10 ** 6;

    /*///////////////////////////////////////////////
                        PROXY INIT
    */ ///////////////////////////////////////////////

    function initialize(
        string calldata _chain,
        address _gateway,
        address _gasReceiver,
        address _registrar
    ) public initializer {
        chain = _chain;
        registrar = ILocalRegistrar(_registrar);
        gasReceiver = IAxelarGasService(_gasReceiver);
        __AxelarExecutable_init_unchained(_gateway);
        __Ownable_init_unchained();
    }

    /*///////////////////////////////////////////////
                    MODIFIERS
    */ ///////////////////////////////////////////////

    modifier onlyOneAccount(VaultActionData memory _action) {
        require(_action.accountIds.length == 1, "Only one account allowed");
        _;
    }

    modifier onlySelf() {
        require(msg.sender == address(this));
        _;
    }

    modifier validateDeposit(
        VaultActionData memory action,
        string calldata tokenSymbol,
        uint256 amount
    ) {
        // Only one account accepted for deposit calls
        require(action.accountIds.length == 1, "Only one account allowed");
        // deposit only
        require(
            action.selector == IVault.deposit.selector,
            "Only deposit accepts tokens"
        );
        // token fwd is token expected
        address tokenAddress = gateway.tokenAddresses(tokenSymbol);
        require(tokenAddress == action.token, "Token mismatch");
        // amt fwd equal expected amt
        require(amount == (action.liqAmt + action.lockAmt), "Amount mismatch");
        // check that at least one vault is expected to receive a deposit
        require(
            action.lockAmt > 0 || action.liqAmt > 0,
            "No vault deposit specified"
        );
        // check that token is accepted by angel protocol
        require(registrar.isTokenAccepted(tokenAddress), "Token not accepted");
        // Get parameters from registrar if approved
        require(
            registrar.getStrategyApprovalState(action.strategyId) ==
                ILocalRegistrar.StrategyApprovalState.APPROVED,
            "Strategy not approved"
        );
        _;
    }

    modifier validateCall(VaultActionData memory action) {
        require(
            (registrar.getStrategyApprovalState(action.strategyId) ==
                ILocalRegistrar.StrategyApprovalState.APPROVED) ||
                registrar.getStrategyApprovalState(action.strategyId) ==
                ILocalRegistrar.StrategyApprovalState.WITHDRAW_ONLY,
            "Strategy not approved"
        );
        _;
    }

    /*///////////////////////////////////////////////
                    ANGEL PROTOCOL ROUTER
    */ ///////////////////////////////////////////////

    function _callSwitch(
        ILocalRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal validateCall(_action) returns (VaultActionData memory) {
        // REDEEM
        if (_action.selector == IVault.redeem.selector) {
            return _redeem(_params, _action);
        }
        // REDEEM ALL
        else if (_action.selector == IVault.redeemAll.selector) {
            return _redeemAll(_params, _action);
        }
        // HARVEST
        else if (_action.selector == IVault.harvest.selector) {
            return _harvest(_params, _action);
        }
        // INVALID SELCTOR
        else {
            revert("Invalid function selector provided");
        }
    }

    // Vault action::Deposit
    /// @notice Deposit into the associated liquid or locked vaults
    /// @dev onlySelf restricted public method to enable try/catch in caller
    function deposit(
        VaultActionData memory action,
        string calldata tokenSymbol,
        uint256 amount
    ) public onlySelf validateDeposit(action, tokenSymbol, amount) {
        ILocalRegistrar.StrategyParams memory params = registrar
            .getStrategyParamsById(action.strategyId);

        if (action.lockAmt > 0) {
            // Send tokens to locked vault and call deposit
            require(
                IERC20Metadata(action.token).transfer(
                    params.Locked.vaultAddr,
                    action.lockAmt
                )
            );
            IVaultLocked lockedVault = IVaultLocked(params.Locked.vaultAddr);
            lockedVault.deposit(
                action.accountIds[0],
                action.token,
                action.lockAmt
            );
        }

        if (action.liqAmt > 0) {
            // Send tokens to liquid vault and call deposit
            require(
                IERC20Metadata(action.token).transfer(
                    params.Liquid.vaultAddr,
                    action.liqAmt
                )
            );
            IVaultLiquid liquidVault = IVaultLiquid(params.Liquid.vaultAddr);
            liquidVault.deposit(
                action.accountIds[0],
                action.token,
                action.liqAmt
            );
        }
    }

    // Vault action::Redeem
    function _redeem(
        ILocalRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal onlyOneAccount(_action) returns (VaultActionData memory) {
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);

        // Redeem tokens from vaults which sends them from the vault to this contract
        uint256 _redeemedLockAmt = lockedVault.redeem(
            _action.accountIds[0],
            _action.token,
            _action.lockAmt
        );
        require(
            IERC20Metadata(_action.token).transferFrom(
                _params.Locked.vaultAddr,
                address(this),
                _redeemedLockAmt
            )
        );

        uint256 _redeemedLiqAmt = liquidVault.redeem(
            _action.accountIds[0],
            _action.token,
            _action.liqAmt
        );
        require(
            IERC20Metadata(_action.token).transferFrom(
                _params.Liquid.vaultAddr,
                address(this),
                _redeemedLiqAmt
            )
        );

        // Pack and send the tokens back through GMP
        uint256 _redeemedAmt = _redeemedLockAmt + _redeemedLiqAmt;
        _action.lockAmt = _redeemedLockAmt;
        _action.liqAmt = _redeemedLiqAmt;
        _action = _prepareToSendTokens(_action, _redeemedAmt);
        emit Redemption(_action, _redeemedAmt);
        return _action;
    }

    // Vault action::RedeemAll
    // @todo redemption amts need to affect _action data
    function _redeemAll(
        ILocalRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal onlyOneAccount(_action) returns (VaultActionData memory) {
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);

        // Redeem tokens from vaults and txfer them to the Router
        uint256 _redeemedLockAmt;
        if (_action.lockAmt > 0) {
            _redeemedLockAmt = lockedVault.redeemAll(_action.accountIds[0]);
            require(
                IERC20Metadata(_action.token).transferFrom(
                    _params.Locked.vaultAddr,
                    address(this),
                    _redeemedLockAmt
                )
            );
            _action.lockAmt = _redeemedLockAmt;
        }

        uint256 _redeemedLiqAmt;
        if (_action.liqAmt > 0) {
            _redeemedLiqAmt = liquidVault.redeemAll(_action.accountIds[0]);
            require(
                IERC20Metadata(_action.token).transferFrom(
                    _params.Liquid.vaultAddr,
                    address(this),
                    _redeemedLiqAmt
                )
            );
            _action.liqAmt = _redeemedLiqAmt;
        }

        // Pack and send the tokens back through GMP
        uint256 _redeemedAmt = _redeemedLockAmt + _redeemedLiqAmt;
        _action = _prepareToSendTokens(_action, _redeemedAmt);
        emit Redemption(_action, _redeemedAmt);
        return _action;
    }

    // Vault action::Harvest
    // @todo redemption amts need to affect _action data
    function _harvest(
        ILocalRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal returns (VaultActionData memory) {
        IVaultLiquid liquidVault = IVaultLiquid(_params.Liquid.vaultAddr);
        IVaultLocked lockedVault = IVaultLocked(_params.Locked.vaultAddr);
        liquidVault.harvest(_action.accountIds);
        lockedVault.harvest(_action.accountIds);
        emit Harvest(_action);
        return _action;
    }

    /*////////////////////////////////////////////////
                        AXELAR IMPL.
    */ ////////////////////////////////////////////////

    function executeLocal(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) external override onlyLocalAccountsContract returns (VaultActionData memory) {
        return _execute(sourceChain, sourceAddress, payload);
    }

    function executeWithTokenLocal(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) external override onlyLocalAccountsContract returns (VaultActionData memory) {
        return
            _executeWithToken(
                sourceChain,
                sourceAddress,
                payload,
                tokenSymbol,
                amount
            );
    }

    modifier onlyLocalAccountsContract() {
        string memory accountAddress = registrar
            .getAccountsContractAddressByChain(chain);
        require(
            StringToAddress.toAddress(accountAddress) == msg.sender,
            "Unauthorized local call"
        );
        _;
    }

    modifier onlyAccountsContract(
        string calldata _sourceChain,
        string calldata _sourceAddress
    ) {
        string memory accountsContractAddress = registrar
            .getAccountsContractAddressByChain(_sourceChain);
        require(
            keccak256(bytes(_sourceAddress)) ==
                keccak256(bytes(accountsContractAddress)),
            "Unauthorized Call"
        );
        _;
    }

    modifier notZeroAddress(string calldata _sourceAddress) {
        require(
            StringToAddress.toAddress(_sourceAddress) != address(0),
            "Unauthorized Call"
        );
        _;
    }

    function _prepareToSendTokens(
        VaultActionData memory _action,
        uint256 _sendAmt
    ) internal returns (VaultActionData memory) {
        if (
            keccak256(bytes(_action.destinationChain)) ==
            keccak256(bytes(chain))
        ) {
            return _prepareAndSendTokensLocal(_action, _sendAmt);
        } else {
            return _prepareAndSendTokensGMP(_action, _sendAmt);
        }
    }

    function _prepareAndSendTokensLocal(
        VaultActionData memory _action,
        uint256 _sendAmt
    ) internal returns (VaultActionData memory) {
        string memory accountsContractAddress = registrar
            .getAccountsContractAddressByChain((_action.destinationChain));
        IERC20Metadata(_action.token).transfer(
            StringToAddress.toAddress(accountsContractAddress),
            _sendAmt
        );
        emit TokensSent(_action, _sendAmt);
        return _action;
    }

    function _prepareAndSendTokensGMP(
        VaultActionData memory _action,
        uint256 _sendAmt
    ) internal returns (VaultActionData memory) {
        // Pack the tokens and calldata for bridging back out over GMP
        ILocalRegistrar.AngelProtocolParams memory apParams = registrar
            .getAngelProtocolParams();

        // Prepare gas
        uint256 gasFee = registrar.getGasByToken(_action.token);
        require(_sendAmt > gasFee, "Send amount does not cover gas");
        uint256 amtLessGasFee = _sendAmt - gasFee;

        // Split gas proportionally between liquid and lock amts
        uint256 liqGas = (gasFee * ((_action.liqAmt * PRECISION) / _sendAmt)) /
            PRECISION;
        uint256 lockGas = gasFee - liqGas;
        _action.liqAmt -= liqGas;
        _action.lockAmt -= lockGas;

        bytes memory payload = _packCallData(_action);
        try
            this.sendTokens(
                _action.destinationChain,
                registrar.getAccountsContractAddressByChain(
                    _action.destinationChain
                ),
                payload,
                IERC20Metadata(_action.token).symbol(),
                amtLessGasFee,
                _action.token,
                gasFee
            )
        {
            emit TokensSent(_action, amtLessGasFee);
        } catch Error(string memory reason) {
            emit LogError(_action, reason);
            IERC20Metadata(_action.token).transfer(
                apParams.refundAddr,
                _sendAmt
            );
            emit FallbackRefund(_action, _sendAmt);
        } catch (bytes memory data) {
            emit LogErrorBytes(_action, data);
            IERC20Metadata(_action.token).transfer(
                apParams.refundAddr,
                _sendAmt
            );
            emit FallbackRefund(_action, _sendAmt);
        }
        return _action;
    }

    function sendTokens(
        string memory destinationChain,
        string memory destinationAddress,
        bytes memory payload,
        string memory symbol,
        uint256 amount,
        address gasToken,
        uint256 gasFeeAmt
    ) public onlySelf {
        address tokenAddress = gateway.tokenAddresses(symbol);
        require(IERC20Metadata(tokenAddress).approve(address(gateway), amount));
        require(
            IERC20Metadata(gasToken).approve(address(gasReceiver), gasFeeAmt)
        );

        ILocalRegistrar.AngelProtocolParams memory apParams = registrar
            .getAngelProtocolParams();

        gasReceiver.payGasForContractCallWithToken(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            symbol,
            amount,
            gasToken,
            gasFeeAmt,
            apParams.protocolTaxCollector
        );

        gateway.callContractWithToken(
            destinationChain,
            destinationAddress,
            payload,
            symbol,
            amount
        );
    }

    function _executeWithToken(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    )
        internal
        override
        onlyAccountsContract(sourceChain, sourceAddress)
        notZeroAddress(sourceAddress)
        returns (VaultActionData memory)
    {
        // decode payload
        VaultActionData memory action = _unpackCalldata(payload);

        // Leverage this.call() to enable try/catch logic
        try this.deposit(action, tokenSymbol, amount) {
            emit Deposit(action);
            return action;
        } catch Error(string memory reason) {
            emit LogError(action, reason);
            return _prepareToSendTokens(action, amount);
        } catch (bytes memory data) {
            emit LogErrorBytes(action, data);
            return _prepareToSendTokens(action, amount);
        }
    }

    function _execute(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    )
        internal
        override
        onlyAccountsContract(sourceChain, sourceAddress)
        notZeroAddress(sourceAddress)
        returns (VaultActionData memory)
    {
        // decode payload
        VaultActionData memory action = _unpackCalldata(payload);
        ILocalRegistrar.StrategyParams memory params = registrar
            .getStrategyParamsById(action.strategyId);

        // Switch for calling appropriate vault/method
        return _callSwitch(params, action);
    }
}
