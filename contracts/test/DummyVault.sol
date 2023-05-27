// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {APVault_V1} from "../core/vault/APVault_V1.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DummyVault is APVault_V1 {

  uint256 dummyAmt;
  address router;

  /// Test helpers
  function setDefaultToken(address _addr) external {
    vaultConfig.yieldAsset = _addr;
  }

  function setDummyAmt(uint256 _newDummyAmt) external {
    dummyAmt = _newDummyAmt;
  }

  function setRouterAddress(address _addr) external {
    router = _addr;
  }

  /// Vault impl
  constructor(VaultConfig memory _config)
    APVault_V1(_config) {}

  function getVaultConfig() external view virtual returns (VaultConfig memory) {
    return vaultConfig;
  }

  function deposit(uint32 accountId, address token, uint256 amt) external payable override {
    emit DepositMade(accountId, vaultConfig.vaultType, token, amt);
  }

  function redeem(
    uint32 accountId,
    address token,
    uint256 amt
  ) external payable override returns (RedemptionResponse memory) {
    IERC20(token).approve(msg.sender, amt);
    emit Redemption(accountId, vaultConfig.vaultType, token, amt);
    return RedemptionResponse({amount: amt, status: VaultActionStatus.SUCCESS});
  }

  function redeemAll(uint32 accountId) external payable override returns (uint256) {
    IERC20(vaultConfig.yieldAsset).approve(msg.sender, dummyAmt);
    emit Redemption(accountId, vaultConfig.vaultType, address(this), dummyAmt);
    return dummyAmt;
  }

  function harvest(uint32[] calldata accountIds) external override {
    emit Harvest(accountIds);
  }

  function _isApprovedRouter() internal override returns (bool) {}
}
