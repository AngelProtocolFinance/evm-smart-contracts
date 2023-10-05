// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity ^0.8.19;

import {IVault} from "../vault/interfaces/IVault.sol";

library RouterLib {
  /*////////////////////////////////////////////////
                        METHODS
    */ ////////////////////////////////////////////////

  // Data packing methods
  function unpackCalldata(
    bytes memory _calldata
  ) internal pure returns (IVault.VaultActionData memory) {
    (
      string memory destinationChain,
      bytes4 strategyId,
      bytes4 selector,
      uint32 accountId,
      address token,
      uint256 lockAmt,
      uint256 liqAmt,
      uint256[] memory lockMinTokensOut,
      uint256[] memory liqMinTokensOut,
      IVault.VaultActionStatus status
    ) = abi.decode(
        _calldata,
        (
          string,
          bytes4,
          bytes4,
          uint32,
          address,
          uint256,
          uint256,
          uint256[],
          uint256[],
          IVault.VaultActionStatus
        )
      );

    return
      IVault.VaultActionData(
        destinationChain,
        strategyId,
        selector,
        accountId,
        token,
        lockAmt,
        liqAmt,
        lockMinTokensOut,
        liqMinTokensOut,
        status
      );
  }

  function packCallData(
    IVault.VaultActionData memory _calldata
  ) internal pure returns (bytes memory) {
    return
      abi.encode(
        _calldata.destinationChain,
        _calldata.strategyId,
        _calldata.selector,
        _calldata.accountId,
        _calldata.token,
        _calldata.lockAmt,
        _calldata.liqAmt,
        _calldata.lockMinTokensOut,
        _calldata.liqMinTokensOut,
        _calldata.status
      );
  }
}
