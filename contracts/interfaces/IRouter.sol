// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol";
import "./IVault.sol";

abstract contract IRouter is IAxelarExecutable {

    enum VaultAction {
        DEPOSIT,
        REDEEM,
        HARVEST,
        OTHER
    }

    bytes4[3] VaultSelectors = [
        IVault.deposit.selector,
        IVault.redeem.selector,
        IVault.harvest.selector
    ];

    struct VaultActionData {
        bytes4 selector;
        uint32 accountId;
        address token;
        uint256 amt;
    }

    function unpackCalldata(bytes calldata _calldata) internal virtual returns(VaultActionData memory) {
        return abi.decode(_calldata,(VaultActionData));
    }
    
    // @todo can't encode a Struct, need to unpack or rethink how we pack this
    // function packCalldata(VaultActionData calldata _action) internal virtual returns(bytes memory) {
    //     // return abi.encode(_action, VaultActionData);
    // }
}