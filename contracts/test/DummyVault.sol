// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity ^0.8.19;

// import {APVault_V1} from "../core/vault/APVault_V1.sol";
import {IVault} from "../core/vault/interfaces/IVault.sol";
import {IVaultEmitter} from "../core/vault/interfaces/IVaultEmitter.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DummyVault is IVault {
  VaultConfig vaultConfig;
  uint256 dummyAmt;
  address emitterAddress;

  /// Test helpers
  function setDummyAmt(uint256 _newDummyAmt) external {
    dummyAmt = _newDummyAmt;
  }

  /// Test helpers
  function setEmitterAddress(address _newEmitterAddress) external {
    emitterAddress = _newEmitterAddress;
  }

  /// Vault impl
  constructor(VaultConfig memory _config) {
    vaultConfig = _config;
  }

  function setVaultConfig(VaultConfigUpdate memory _newConfig) external override {
    vaultConfig.strategy = _newConfig.strategy;
    vaultConfig.registrar = _newConfig.registrar;    
    IVaultEmitter(emitterAddress).vaultConfigUpdated(address(this), _newConfig);
  }

  function getVaultConfig() external view virtual override returns (VaultConfig memory) {
    return vaultConfig;
  }

  function deposit(uint32 accountId, address, uint256 amt) public payable override {
    IVaultEmitter(emitterAddress).deposit(accountId, address(this), amt, amt);
  }

  function redeem(
    uint32 accountId,
    uint256 amt
  ) public payable override returns (RedemptionResponse memory) {
    IERC20(vaultConfig.baseToken).approve(msg.sender, amt);
    IVaultEmitter(emitterAddress).redeem(accountId, address(this), amt, amt);
    return
      RedemptionResponse({
        token: vaultConfig.baseToken,
        amount: amt,
        status: VaultActionStatus.SUCCESS
      });
  }

  function redeemAll(uint32 accountId) public payable override returns (RedemptionResponse memory) {
    IERC20(vaultConfig.baseToken).approve(msg.sender, dummyAmt);
    IVaultEmitter(emitterAddress).redeem(accountId, address(this), dummyAmt, dummyAmt);
    return
      RedemptionResponse({
        token: vaultConfig.baseToken,
        amount: dummyAmt,
        status: VaultActionStatus.POSITION_EXITED
      });
  }

  function harvest(uint32[] calldata accountIds) public override {
    for (uint32 i; i < accountIds.length; i++) {
      IVaultEmitter(emitterAddress).redeem(accountIds[i], address(this), dummyAmt, dummyAmt);
    }
  }

  function _isApprovedRouter() internal view override returns (bool) {}

  function _isSiblingVault() internal view override returns (bool) {}
}
