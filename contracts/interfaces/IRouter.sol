// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IAxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";
import {IVault} from "./IVault.sol";
import {IRegistrar} from "./IRegistrar.sol";

abstract contract IRouter is IAxelarExecutable {


    /*////////////////////////////////////////////////
                    CUSTOM TYPES
    */////////////////////////////////////////////////

    /// @notice Gerneric AP Vault action data that can be packed and sent through the GMP
    /// @dev Data will arrive from the GMP encoded as a string of bytes. For internal methods/processing,
    /// we can restructure it to look like VaultActionData to improve readability.
    /// @param strategyId The 4 byte truncated keccak256 hash of the strategy name, i.e. bytes4(keccak256("Goldfinch"))
    /// @param selector The Vault method that should be called
    /// @param accountId The endowment uid
    /// @param token The token (if any) that was forwarded along with the calldata packet by GMP
    /// @param lockAmt The amount of said token that is intended to interact with the locked vault
    /// @param liqAmt The amount of said token that is intended to interact with the liquid vault
    struct VaultActionData {
        bytes4 strategyId;
        bytes4 selector;
        uint32[] accountIds;
        address token;
        uint256 lockAmt;
        uint256 liqAmt;
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
            bytes4 strategyId,
            bytes4 selector,
            uint32[] memory accountIds,
            address token,
            uint256 lockAmt,
            uint256 liqAmt
        ) = abi.decode(
                _calldata,
                (bytes4, bytes4, uint32[], address, uint256, uint256)
            );

        return
            VaultActionData(
                strategyId,
                selector,
                accountIds,
                token,
                lockAmt,
                liqAmt
            );
    }

    function _packCallData(VaultActionData memory _calldata)
        internal
        virtual
        returns (bytes memory)
    {
        return
            abi.encode(
                _calldata.strategyId,
                _calldata.selector,
                _calldata.accountIds,
                _calldata.token,
                _calldata.lockAmt,
                _calldata.liqAmt
            );
    }

    function _callSwitch(
        IRegistrar.StrategyParams memory _params,
        VaultActionData memory _action
    ) internal virtual;
}
