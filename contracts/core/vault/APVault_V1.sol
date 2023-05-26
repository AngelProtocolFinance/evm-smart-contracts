// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IVault} from "../../interfaces/IVault.sol";
import {ERC4626AP} from "./ERC4626AP.sol";
import {APStrategy_V1} from "../strategy/APStrategy_V1.sol";
import {IRegistrar} from "../../interfaces/IRegistrar.sol";

abstract contract APVault_V1 is IVault, ERC4626AP {

  VaultType vaultType;
  APStrategy_V1 strategy;
  IRegistrar registrar;
  mapping (uint32 => uint256) tokenIdByAccountId;

  constructor(address _strategy, VaultType _vaultType, address _registrar) {
    strategy = APStrategy_V1(_strategy);
    vaultType = _vaultType;
    registrar = IRegistrar(_registrar);
  }

  function getVaultType() external view override virtual returns (VaultType) {
    return vaultType;
  }
  
  function getTokenIdByAccountId(uint32 accountId) external view returns (uint256) {
    return tokenIdByAccountId[accountId];
  }

  function deposit(uint32 accountId, address token, uint256 amt) payable external override virtual {

  }
  function redeem(uint32 accountId, address token, uint256 amt) payable external override virtual returns (uint256){

  }
  function redeemAll(uint32 accountId) payable external override virtual returns (uint256){

  }
  function harvest(uint32[] calldata accountIds) external override virtual{

  }


}