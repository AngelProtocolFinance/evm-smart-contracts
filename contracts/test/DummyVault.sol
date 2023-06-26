// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

// import {APVault_V1} from "../core/vault/APVault_V1.sol";
import {IVault} from "../core/vault/interfaces/IVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DummyVault is IVault {
  VaultConfig vaultConfig;
  uint256 dummyAmt;

  /// Test helpers
  function setDummyAmt(uint256 _newDummyAmt) external {
    dummyAmt = _newDummyAmt;
  }

  /// Vault impl
  constructor(VaultConfig memory _config) {
    vaultConfig = _config;
  }

  function setVaultConfig(VaultConfig memory _newConfig) external override {
    vaultConfig = _newConfig;
  }

  function getVaultConfig() external view virtual override returns (VaultConfig memory) {
    return vaultConfig;
  }

  function deposit(uint32 accountId, address token, uint256 amt) public payable override {
    emit Deposit(accountId, vaultConfig.vaultType, token, amt);
  }

  function redeem(
    uint32 accountId,
    uint256 amt
  ) public payable override returns (RedemptionResponse memory) {
    IERC20(vaultConfig.baseToken).approve(msg.sender, amt);
    emit Redeem(accountId, vaultConfig.vaultType, vaultConfig.baseToken, amt);
    return RedemptionResponse({amount: amt, status: VaultActionStatus.SUCCESS});
  }

  function redeemAll(uint32 accountId) public payable override returns (RedemptionResponse memory) {
    IERC20(vaultConfig.baseToken).approve(msg.sender, dummyAmt);
    emit Redeem(accountId, vaultConfig.vaultType, address(this), dummyAmt);
    return RedemptionResponse({amount: dummyAmt, status: VaultActionStatus.POSITION_EXITED});
  }

  function harvest(uint32[] calldata accountIds) public override {
    emit RewardsHarvested(accountIds);
  }

  function _isApprovedRouter() internal view override returns (bool) {}

  function _isSiblingVault() internal view override returns (bool) {}
}
