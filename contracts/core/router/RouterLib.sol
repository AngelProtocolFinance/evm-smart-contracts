// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;
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
      uint32[] memory accountIds,
      address token,
      uint256 lockAmt,
      uint256 liqAmt,
      IVault.VaultActionStatus status
    ) = abi.decode(
        _calldata,
        (string, bytes4, bytes4, uint32[], address, uint256, uint256, IVault.VaultActionStatus)
      );

    return
      IVault.VaultActionData(
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

  function packCallData(
    IVault.VaultActionData memory _calldata
  ) internal pure returns (bytes memory) {
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
}
