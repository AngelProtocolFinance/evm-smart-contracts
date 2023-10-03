// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity ^0.8.19;

import "../../../core/router/IRouter.sol";

abstract contract IVault {
  /*////////////////////////////////////////////////
                    CUSTOM TYPES
  */ ////////////////////////////////////////////////
  uint256 constant PRECISION = 10 ** 24;

  /// @notice Angel Protocol Vault Type
  /// @dev Vaults have different behavior depending on type. Specifically access to redemptions and
  /// principle balance
  enum VaultType {
    LOCKED,
    LIQUID
  }

  /// @notice A config struct is stored on each deployed Vault.
  /// @param vaultType one of LOCKED | LIQUID
  /// @param strategyId the unique identifier for the strategy
  /// @param strategy the address of the strategy-specific impl.
  /// @param registrar the address of the local registrar
  /// @param baseToken the address of the expected base token
  /// @param yieldToken the address of the expected yield token
  /// @param apTokenName the name of the this vaults ERC20AP token
  /// @param apTokenSymbol the symbol of this vaults ERC20AP token
  struct VaultConfig {
    VaultType vaultType;
    bytes4 strategyId;
    address strategy;
    address registrar;
    address baseToken;
    address yieldToken;
    string apTokenName;
    string apTokenSymbol;
  }

  /// @notice The struct that can be passed for updating config fields
  /// @dev Vault type, strategyId and token params are explicitly ommitted from being
  /// @dev updateable since changing these could lead to the loss of funds
  /// @dev or are immutables in parent contracts
  /// @param strategy the new address of the strategy implementation
  /// @param registrar the address of the new registrar
  struct VaultConfigUpdate {
    address strategy;
    address registrar;
  }

  /// @notice Gerneric AP Vault action data
  /// @param destinationChain The Axelar string name of the blockchain that will receive redemptions/refunds
  /// @param strategyId The 4 byte truncated keccak256 hash of the strategy name, i.e. bytes4(keccak256("Goldfinch"))
  /// @param selector The Vault method that should be called
  /// @param accountId The endowment uid
  /// @param token The token (if any) that was forwarded along with the calldata packet by GMP
  /// @param lockAmt The amount of said token that is intended to interact with the locked vault
  /// @param liqAmt The amount of said token that is intended to interact with the liquid vault
  /// @param lockMinTokensOut An array of minimum token amts expected for the locked vault trade path (slippage tolerance)
  /// @param liqMinTokensOut An array of minimum token amts expected for the liquid vault trade path (slippage tolerance)
  /// @param status Call success status for fallback/callback logic paths
  struct VaultActionData {
    string destinationChain;
    bytes4 strategyId;
    bytes4 selector;
    uint32 accountId;
    address token;
    uint256 lockAmt;
    uint256 liqAmt;
    uint256[] lockMinTokensOut;
    uint256[] liqMinTokensOut;
    VaultActionStatus status;
  }

  /// @notice Structure for storing account principle information necessary for yield calculations
  /// @param baseToken The qty of base tokens deposited into the vault
  /// @param costBasis_withPrecision The cost per share for entry into the vault (baseToken / share)
  struct Principle {
    uint256 baseToken;
    uint256 costBasis_withPrecision;
  }

  enum VaultActionStatus {
    UNPROCESSED, // INIT state
    SUCCESS, // Ack
    POSITION_EXITED, // Position fully exited
    FAIL_TOKENS_RETURNED, // Tokens returned to accounts contract
    FAIL_TOKENS_FALLBACK // Tokens failed to be returned to accounts contract
  }

  /// @notice Structure returned upon redemption
  /// @param token The address of the token being redeemed
  /// @param amount The qty of tokens being redeemed
  /// @param status The status of the redemption request's processing
  struct RedemptionResponse {
    address token;
    uint256 amount;
    VaultActionStatus status;
  }

  /*////////////////////////////////////////////////
                        ERRORS
  */ ////////////////////////////////////////////////
  error OnlyRouter();
  error OnlyApproved();
  error OnlyBaseToken();
  error OnlyNotPaused();

  /*////////////////////////////////////////////////
                    EXTERNAL METHODS
  */ ////////////////////////////////////////////////

  /// @notice returns the vault config
  function getVaultConfig() external view virtual returns (VaultConfig memory);

  /// @notice set the vault config
  function setVaultConfig(VaultConfigUpdate memory _newConfig) external virtual;

  /// @notice deposit tokens into vault position of specified Account
  /// @dev the deposit method allows the Vault contract to create or add to an existing
  /// position for the specified Account. In the case that multiple different tokens can be deposited,
  /// the method requires the deposit token address and amount. The transfer of tokens to the Vault
  /// contract must occur before the deposit method is called.
  /// @param accountId a unique Id for each Angel Protocol account
  /// @param token the deposited token
  /// @param amt the amount of the deposited token
  /// @param minTokensOut the amount of tokens expected along each step of the invest request
  function deposit(uint32 accountId, address token, uint256 amt, uint256[] memory minTokensOut) external payable virtual;

  /// @notice redeem value from the vault contract
  /// @dev allows an Account to redeem from its staked value. The behavior is different dependent on VaultType.
  /// Before returning the redemption amt, the vault must approve the Router to spend the tokens.
  /// @param accountId a unique Id for each Angel Protocol account
  /// @param amt the amount of shares to redeem
  /// @param minTokensOut the amount of tokens expected along each step of the redemption request
  /// @return RedemptionResponse returns the number of base tokens redeemed by the call and the status
  function redeem(
    uint32 accountId,
    uint256 amt,
    uint256[] memory minTokensOut
  ) external payable virtual returns (RedemptionResponse memory);

  /// @notice redeem all of the value from the vault contract
  /// @dev allows an Account to redeem all of its staked value. Good for rebasing tokens wherein the value isn't
  /// known explicitly. Before returning the redemption amt, the vault must approve the Router to spend the tokens.
  /// @param accountId a unique Id for each Angel Protocol account
  /// @param minTokensOut the amount of tokens expected along each step of the redemption request
  /// @return RedemptionResponse returns the number of base tokens redeemed by the call and the status
  function redeemAll(uint32 accountId, uint256[] memory minTokensOut) external payable virtual returns (RedemptionResponse memory);

  /// @notice restricted method for harvesting accrued rewards
  /// @dev Claim reward tokens accumulated to the staked value. The underlying behavior will vary depending
  /// on the target yield strategy and VaultType. Only callable by an Angel Protocol Keeper
  /// @param accountIds Used to specify which accounts to call harvest against. Structured so that this can
  /// be called in batches to avoid running out of gas.
  /// @return address and qty of tokens harvested
  function harvest(
    uint32[] calldata accountIds
  ) external virtual returns (RedemptionResponse memory);

  /*////////////////////////////////////////////////
                INTERNAL HELPER METHODS
    */ ////////////////////////////////////////////////

  /// @notice internal method for validating that calls came from the approved AP router
  /// @dev The registrar will hold a record of the approved Router address. This method must implement a method of
  /// checking that the msg.sender == ApprovedRouter
  function _isApprovedRouter() internal view virtual returns (bool);

  /// @notice internal method for checking whether the caller is the paired locked/liquid vault
  /// @dev can be used for more gas efficient rebalancing between the two sibling vaults
  function _isSiblingVault() internal view virtual returns (bool);
}
