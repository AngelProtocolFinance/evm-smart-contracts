// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

// import {APVault_V1} from "../core/vault/APVault_V1.sol";
import {Vault} from "../core/vault/Vault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract DummyVault is Vault {
  VaultConfig vaultConfig;
  uint256 dummyAmt;

  /// Test helpers
  function setDummyAmt(uint256 _newDummyAmt) external {
    dummyAmt = _newDummyAmt;
  }

  /// Vault impl
  constructor(
    VaultConfig memory _config
  ) Vault(IERC20Metadata(_config.yieldToken), _config.apTokenName, _config.apTokenSymbol) {
    vaultConfig = _config;
    emit VaultConfigUpdated(_config);
  }

  function setVaultConfig(VaultConfig memory _newConfig) external override {
    vaultConfig = _newConfig;
    emit VaultConfigUpdated(_newConfig);
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
    return
      RedemptionResponse({
        token: vaultConfig.baseToken,
        amount: amt,
        status: VaultActionStatus.SUCCESS
      });
  }

  function redeemAll(uint32 accountId) public payable override returns (RedemptionResponse memory) {
    IERC20(vaultConfig.baseToken).approve(msg.sender, dummyAmt);
    emit Redeem(accountId, vaultConfig.vaultType, address(this), dummyAmt);
    return
      RedemptionResponse({
        token: vaultConfig.baseToken,
        amount: dummyAmt,
        status: VaultActionStatus.POSITION_EXITED
      });
  }

  function harvest(uint32[] calldata accountIds) public override {
    emit RewardsHarvested(accountIds);
  }

  function _isApprovedRouter() internal view override returns (bool) {}

  function _isSiblingVault() internal view override returns (bool) {}

  function _isOperator(address _operator) internal view override returns (bool) {}
}
