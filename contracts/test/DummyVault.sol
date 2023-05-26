// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IVault} from "../interfaces/IVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRouter} from "../core/router/IRouter.sol";

contract DummyVault is IVault {
  IVault.VaultType vaultType;
  address defaultToken;
  address router;
  uint256 dummyAmt;

  /// Test helpers
  function setDefaultToken(address _addr) external {
    defaultToken = _addr;
  }

  function setDummyAmt(uint256 _newDummyAmt) external {
    dummyAmt = _newDummyAmt;
  }

  function setRouterAddress(address _addr) external {
    router = _addr;
  }

  /// Vault impl
  constructor(IVault.VaultType _type) {
    vaultType = _type;
  }

  function getVaultType() external view override returns (VaultType) {
    return vaultType;
  }

  function deposit(uint32 accountId, address token, uint256 amt) external payable override {
    emit DepositMade(accountId, vaultType, token, amt);
  }

  function redeem(
    uint32 accountId,
    address token,
    uint256 amt
  ) external payable override returns (IRouter.RedemptionResponse memory) {
    IERC20(token).approve(msg.sender, amt);
    emit Redemption(accountId, vaultType, token, amt);
    return IRouter.RedemptionResponse({amount: amt, status: IRouter.VaultActionStatus.SUCCESS});
  }

  function redeemAll(uint32 accountId) external payable override returns (uint256) {
    IERC20(defaultToken).approve(msg.sender, dummyAmt);
    emit Redemption(accountId, vaultType, address(this), dummyAmt);
    return dummyAmt;
  }

  function harvest(uint32[] calldata accountIds) external override {
    emit Harvest(accountIds);
  }

  function _isApprovedRouter() internal override returns (bool) {}
}
