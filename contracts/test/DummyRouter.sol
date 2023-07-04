// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IRouter} from "../core/router/IRouter.sol";
import {IVault} from "../core/vault/interfaces/IVault.sol";
import {IAxelarGateway} from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarExecutable.sol';

contract DummyRouter is IRouter {

  /*////////////////////////////////////////////////
                    TEST HELPERS
  */ ////////////////////////////////////////////////
  IVault.VaultActionData response;

  function setResponseStruct(IVault.VaultActionData memory _response) external {
    response = _response;
  }
  
  /*////////////////////////////////////////////////
                    IMPLEMENTATION
  */ ////////////////////////////////////////////////

  function executeLocal(
    string calldata,
    string calldata,
    bytes calldata
  ) external returns (IVault.VaultActionData memory) {
    return response;
  }

  function executeWithTokenLocal(
    string calldata,
    string calldata,
    bytes calldata,
    string calldata,
    uint256
  ) external returns (IVault.VaultActionData memory) {
    return response;
  }
  
  function gateway() external view returns (IAxelarGateway) {
    return IAxelarGateway(address(this));
  }

  function execute(
      bytes32,
      string calldata,
      string calldata,
      bytes calldata
  ) external {}

  function executeWithToken(
      bytes32,
      string calldata,
      string calldata,
      bytes calldata,
      string calldata,
      uint256
  ) external {}
}