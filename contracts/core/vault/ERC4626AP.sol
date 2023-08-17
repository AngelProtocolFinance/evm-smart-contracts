// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.21;

import {ERC20AP} from "../erc20ap/ERC20AP.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {FixedPointMathLib} from "../../lib/FixedPointMathLib.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @notice Minimal ERC4626 tokenized Vault implementation.
/// @author Solmate (https://github.com/transmissions11/solmate/blob/main/src/mixins/ERC4626.sol)

abstract contract ERC4626AP is ERC20AP, ReentrancyGuard {
  using FixedPointMathLib for uint256;
  using SafeERC20 for IERC20Metadata;

  /*//////////////////////////////////////////////////////////////
                                 EVENTS
  //////////////////////////////////////////////////////////////*/

  event DepositERC4626(address caller, uint32 owner, uint256 assets, uint256 shares);

  event WithdrawERC4626(
    address caller,
    address receiver,
    uint32 owner,
    uint256 assets,
    uint256 shares
  );

  /*//////////////////////////////////////////////////////////////
                               IMMUTABLES
  //////////////////////////////////////////////////////////////*/

  IERC20Metadata public immutable asset;

  constructor(
    IERC20Metadata _asset,
    string memory _ERC20name,
    string memory _ERC20symbol
  ) ERC20AP(_ERC20name, _ERC20symbol, _asset.decimals()) {
    asset = _asset;
  }

  /*//////////////////////////////////////////////////////////////
                        DEPOSIT/WITHDRAWAL LOGIC
  //////////////////////////////////////////////////////////////*/

  function depositERC4626(
    address strategy,
    uint256 assets,
    uint32 receiver
  ) public virtual operatorOnly nonReentrant returns (uint256 shares) {
    // Check for rounding error since we round down in previewDeposit.
    require((shares = previewDeposit(assets)) != 0, "ZERO_SHARES");

    // Need to transfer before minting or ERC777s could reenter.
    asset.safeTransferFrom(strategy, address(this), assets);

    _mint(receiver, shares);

    emit DepositERC4626(_msgSender(), receiver, assets, shares);

    _afterDeposit(assets, shares);
  }

  function mint(
    uint256 shares,
    uint32 receiver
  ) public virtual operatorOnly nonReentrant returns (uint256 assets) {
    assets = previewMint(shares); // No need to check for rounding error, previewMint rounds up.

    // Need to transfer before minting or ERC777s could reenter.
    asset.safeTransferFrom(_msgSender(), address(this), assets);

    _mint(receiver, shares);

    emit DepositERC4626(_msgSender(), receiver, assets, shares);

    _afterDeposit(assets, shares);
  }

  function withdraw(
    uint256 assets,
    address receiver,
    uint32 owner
  ) public virtual operatorOnly nonReentrant returns (uint256 shares) {
    shares = previewWithdraw(assets); // No need to check for rounding error, previewWithdraw rounds up.

    uint256 allowed = allowances[owner][_msgSender()]; // Saves gas for limited approvals.

    if (allowed != type(uint256).max) allowances[owner][_msgSender()] = allowed - shares;

    _beforeWithdraw(assets, shares);

    _burn(owner, shares);

    emit WithdrawERC4626(_msgSender(), receiver, owner, assets, shares);

    asset.safeTransfer(receiver, assets);
  }

  function redeemERC4626(
    uint256 shares,
    address receiver,
    uint32 owner
  ) public virtual operatorOnly nonReentrant returns (uint256 assets) {
    // Check for rounding error since we round down in previewRedeem.
    require((assets = previewRedeem(shares)) != 0, "ZERO_ASSETS");

    _beforeWithdraw(assets, shares);

    _burn(owner, shares);

    emit WithdrawERC4626(_msgSender(), receiver, owner, assets, shares);

    asset.safeApprove(receiver, assets);
  }

  /*//////////////////////////////////////////////////////////////
                            ACCOUNTING LOGIC
  //////////////////////////////////////////////////////////////*/

  function totalAssets() public view virtual returns (uint256) {
    return asset.balanceOf(address(this));
  }

  function convertToShares(uint256 assets) public view virtual returns (uint256) {
    uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.

    return supply == 0 ? assets : assets.mulDivDown(supply, totalAssets());
  }

  function convertToAssets(uint256 shares) public view virtual returns (uint256) {
    uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.

    return supply == 0 ? shares : shares.mulDivDown(totalAssets(), supply);
  }

  function previewDeposit(uint256 assets) public view virtual returns (uint256) {
    return convertToShares(assets);
  }

  function previewMint(uint256 shares) public view virtual returns (uint256) {
    uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.

    return supply == 0 ? shares : shares.mulDivUp(totalAssets(), supply);
  }

  function previewWithdraw(uint256 assets) public view virtual returns (uint256) {
    uint256 supply = totalSupply(); // Saves an extra SLOAD if totalSupply is non-zero.

    return supply == 0 ? assets : assets.mulDivUp(supply, totalAssets());
  }

  function previewRedeem(uint256 shares) public view virtual returns (uint256) {
    return convertToAssets(shares);
  }

  function getPricePerFullShare() public view virtual returns (uint256) {
    return
      totalSupply() == 0
        ? decimals()
        : (asset.balanceOf(address(this)) * decimals()) / totalSupply();
  }

  /*//////////////////////////////////////////////////////////////
                     DEPOSIT/WITHDRAWAL LIMIT LOGIC
  //////////////////////////////////////////////////////////////*/

  function maxDeposit(uint32) public view virtual returns (uint256) {
    return type(uint256).max;
  }

  function maxMint(uint32) public view virtual returns (uint256) {
    return type(uint256).max;
  }

  function maxWithdraw(uint32 owner) public view virtual returns (uint256) {
    return convertToAssets(balanceOf(owner));
  }

  function maxRedeem(uint32 owner) public view virtual returns (uint256) {
    return balanceOf(owner);
  }

  /*//////////////////////////////////////////////////////////////
                          INTERNAL HOOKS LOGIC
  //////////////////////////////////////////////////////////////*/

  function _beforeWithdraw(uint256 assets, uint256 shares) internal virtual {}

  function _afterDeposit(uint256 assets, uint256 shares) internal virtual {}
}
