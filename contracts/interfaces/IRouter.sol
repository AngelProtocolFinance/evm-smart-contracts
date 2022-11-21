// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {IAxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";
import {IVault} from "./IVault.sol";
import {IRegistrar} from "./IRegistrar.sol";

abstract contract IRouter is IAxelarExecutable {
    /// @notice Gerneric AP Vault action data that can be packed and sent through the GMP
    /// @dev Data will arrive from the GMP encoded as a string of bytes. For internal methods/processing,
    /// we can restructure it to look like VaultActionData to improve readability.
    /// @param strategyId The 4 byte truncated keccak256 hash of the strategy name, i.e. bytes4(keccak256("Goldfinch"))
    /// @param selector The Vault method that should be called
    /// @param accountId The endowment uid
    /// @param token The token (if any) that was forwarded along with the calldata packet by GMP
    /// @param amt The amount of said token that is intended to be used along with the calldata
    struct VaultActionData {
        bytes4 strategyId;
        bytes4 selector;
        uint32 accountId;
        address token;
        uint256 amt;
    }

    modifier onlySelf() {
        require(msg.sender == address(this));
        _;
    }

    // Internal methods
    function _unpackCalldata(bytes calldata _calldata)
        internal
        virtual
        returns (VaultActionData memory)
    {
        (
            bytes4 strategyId,
            bytes4 selector,
            uint32 accountId,
            address token,
            uint256 amt
        ) = abi.decode(_calldata, (bytes4, bytes4, uint32, address, uint256));
        return VaultActionData(strategyId, selector, accountId, token, amt);
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
                _calldata.accountId,
                _calldata.token,
                _calldata.amt
            );
    }

    function _callSwitch(IRegistrar.StrategyParams memory _params, VaultActionData memory _action, string calldata _tokenSymbol)
        internal
        virtual;
    
    function _determineSplit(IRegistrar.StrategyParams memory _params, VaultActionData memory _action) internal virtual returns (uint256, uint256) {


    }

}
