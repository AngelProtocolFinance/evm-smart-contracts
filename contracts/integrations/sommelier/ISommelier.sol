interface ISommelier {
  /**
   * @notice Deposits assets into the cellar, and returns shares to receiver.
   * @param assets amount of assets deposited by user.
   * @param receiver address to receive the shares.
   * @return shares amount of shares given for deposit.
   */
  function deposit(
    uint256 assets,
    address receiver
  ) public override nonReentrant returns (uint256 shares);

  /**
   * @notice Withdraw assets from the cellar by redeeming shares.
   * @dev Unlike conventional ERC4626 contracts, this may not always return one asset to the receiver.
   *      Since there are no swaps involved in this function, the receiver may receive multiple
   *      assets. The value of all the assets returned will be equal to the amount defined by
   *      `assets` denominated in the `asset` of the cellar (eg. if `asset` is USDC and `assets`
   *      is 1000, then the receiver will receive $1000 worth of assets in either one or many
   *      tokens).
   * @param assets equivalent value of the assets withdrawn, denominated in the cellar's asset
   * @param receiver address that will receive withdrawn assets
   * @param owner address that owns the shares being redeemed
   * @return shares amount of shares redeemed
   */
  function withdraw(
    uint256 assets,
    address receiver,
    address owner
  ) public override nonReentrant returns (uint256 shares);

  /**
   * @notice Simulate the effects of depositing assets at the current block, given current on-chain conditions.
   * @param assets amount of assets to deposit
   * @return shares that will be minted
   */
  function previewDeposit(uint256 assets) public view override returns (uint256 shares);

  /**
   * @notice Simulate the effects of withdrawing assets at the current block, given current on-chain conditions.
   * @param assets amount of assets to withdraw
   * @return shares that will be redeemed
   */
  function previewWithdraw(uint256 assets) public view override returns (uint256 shares);
}
