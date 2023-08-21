// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity >=0.8.0;

/// @notice ERC4626 interface.
interface IERC4626AP {
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
                        DEPOSIT/WITHDRAWAL LOGIC
  //////////////////////////////////////////////////////////////*/

  function depositERC4626(
    address strategy,
    uint256 assets,
    uint32 receiver
  ) external returns (uint256 shares);

  function mint(uint256 shares, uint32 receiver) external returns (uint256 assets);

  function withdraw(
    uint256 assets,
    address receiver,
    uint32 owner
  ) external returns (uint256 shares);

  function redeemERC4626(
    uint256 shares,
    address receiver,
    uint32 owner
  ) external returns (uint256 assets);

  /*//////////////////////////////////////////////////////////////
                            ACCOUNTING LOGIC
  //////////////////////////////////////////////////////////////*/

  function totalAssets() external view returns (uint256);

  function convertToShares(uint256 assets) external view returns (uint256);

  function convertToAssets(uint256 shares) external view returns (uint256);

  function previewDeposit(uint256 assets) external view returns (uint256);

  function previewMint(uint256 shares) external view returns (uint256);

  function previewWithdraw(uint256 assets) external view returns (uint256);

  function previewRedeem(uint256 shares) external view returns (uint256);

  function getPricePerFullShare() external view returns (uint256);

  /*//////////////////////////////////////////////////////////////
                     DEPOSIT/WITHDRAWAL LIMIT LOGIC
  //////////////////////////////////////////////////////////////*/

  function maxDeposit(uint32) external view returns (uint256);

  function maxMint(uint32) external view returns (uint256);

  function maxWithdraw(uint32 owner) external view returns (uint256);

  function maxRedeem(uint32 owner) external view returns (uint256);
}
