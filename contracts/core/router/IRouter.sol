// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IAxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";
import {IVault} from "../../interfaces/IVault.sol";

abstract contract IRouter is IAxelarExecutable {
    /*////////////////////////////////////////////////
                        EVENTS
    */////////////////////////////////////////////////

    event TokensSent(VaultActionData action, uint256 amount);
    event FallbackRefund(VaultActionData action, uint256 amount);
    event Deposit(VaultActionData action);
    event Redemption(VaultActionData action, uint256 amount);
    event Harvest(VaultActionData action);
    event LogError(VaultActionData action, string message);
    event LogErrorBytes(VaultActionData action, bytes data);

    /*////////////////////////////////////////////////
                    CUSTOM TYPES
    */////////////////////////////////////////////////

    /// @notice Gerneric AP Vault action data that can be packed and sent through the GMP
    /// @dev Data will arrive from the GMP encoded as a string of bytes. For internal methods/processing,
    /// we can restructure it to look like VaultActionData to improve readability.
    /// @param destinationChain The Axelar string name of the blockchain that will receive redemptions/refunds
    /// @param strategyId The 4 byte truncated keccak256 hash of the strategy name, i.e. bytes4(keccak256("Goldfinch"))
    /// @param selector The Vault method that should be called
    /// @param accountId The endowment uid
    /// @param token The token (if any) that was forwarded along with the calldata packet by GMP
    /// @param lockAmt The amount of said token that is intended to interact with the locked vault
    /// @param liqAmt The amount of said token that is intended to interact with the liquid vault
    struct VaultActionData {
        string destinationChain;
        bytes4 strategyId;
        bytes4 selector;
        uint32[] accountIds;
        address token;
        uint256 lockAmt;
        uint256 liqAmt;
        VaultActionStatus status;
    }

    enum VaultActionStatus {
        UNPROCESSED,
        SUCCESS,
        FAIL_TOKENS_RETURNED,
        FAIL_TOKENS_REFUNDED,
        POSITION_EXITED
    }

    /*////////////////////////////////////////////////
                        METHODS
    */////////////////////////////////////////////////

    // Internal data packing methods
    function _unpackCalldata(bytes memory _calldata)
        internal
        virtual
        returns (VaultActionData memory)
    {
        (
            string memory destinationChain,
            bytes4 strategyId,
            bytes4 selector,
            uint32[] memory accountIds,
            address token,
            uint256 lockAmt,
            uint256 liqAmt,
            VaultActionStatus status
        ) = abi.decode(
                _calldata,
                (string, bytes4, bytes4, uint32[], address, uint256, uint256, VaultActionStatus)
            );

        return
            VaultActionData(
                destinationChain,
                strategyId,
                selector,
                accountIds,
                token,
                lockAmt,
                liqAmt,
                status
            );
    }

    function _packCallData(VaultActionData memory _calldata)
        internal
        virtual
        returns (bytes memory)
    {
        return
            abi.encode(
                _calldata.destinationChain,
                _calldata.strategyId,
                _calldata.selector,
                _calldata.accountIds,
                _calldata.token,
                _calldata.lockAmt,
                _calldata.liqAmt,
                _calldata.status
            );
    }

    function executeLocal(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) external virtual returns (VaultActionData memory);

    function executeWithTokenLocal(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata tokenSymbol,
        uint256 amount
    ) external virtual returns (VaultActionData memory);
}
