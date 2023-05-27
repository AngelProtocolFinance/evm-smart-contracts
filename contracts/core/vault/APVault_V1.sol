// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IVault} from "./interfaces/IVault.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {ERC4626AP} from "./ERC4626AP.sol";
import {APStrategy_V1} from "../strategy/APStrategy_V1.sol";
import {IRegistrar} from "../registrar/interfaces/IRegistrar.sol";
import {LocalRegistrarLib} from "../registrar/lib/LocalRegistrarLib.sol";

contract APVault_V1 is IVault, ERC4626AP {

  VaultConfig vaultConfig;

  constructor(VaultConfig memory _config) 
    ERC4626AP(
      IERC20Metadata(_config.yieldAsset),
      _config.apTokenName, 
      _config.apTokenSymbol
    )
  {
    vaultConfig = _config;
  }

  function getVaultConfig() external view override virtual returns (VaultConfig memory) {
    return vaultConfig;
  }

  function deposit(uint32 accountId, address token, uint256 amt) payable external override virtual {

  }

  function redeem(uint32 accountId, address token, uint256 amt) payable external override virtual returns (RedemptionResponse memory){

  }

  function redeemAll(uint32 accountId) payable external override virtual returns (uint256){

  }

  function harvest(uint32[] calldata accountIds) external override virtual{

  }

  function _isOperator(address _operator) internal override returns (bool) {
    return IRegistrar(vaultConfig.registrar).getVaultOperatorApproved(_operator);
  }

  function _isApprovedRouter() internal override returns (bool) {
    LocalRegistrarLib.AngelProtocolParams memory apParams = IRegistrar(vaultConfig.registrar).getAngelProtocolParams();
    return (_msgSender() == apParams.routerAddr);
  }
}