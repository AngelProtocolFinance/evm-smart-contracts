// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

abstract contract IVault {
    
    /// @notice Angel Protocol Vault Type 
    /// @dev Vaults have different behavior depending on type. Specifically access to redemptions and 
    /// principle balance
    enum VaultType {
        LOCKED,
        LIQUID
    }

    /// @notice Event emited on each Deposit call
    /// @dev Upon deposit, emit this event. Index the account and staking contract for analytics 
    event DepositMade(
        uint32 indexed accountId, 
        VaultType vaultType, 
        address tokenDeposited, 
        uint256 amtDeposited); 

    /// @notice Event emited on each Redemption call 
    /// @dev Upon redemption, emit this event. Index the account and staking contract for analytics 
    event Redemption(
        uint32 indexed accountId, 
        VaultType vaultType, 
        address tokenRedeemed, 
        uint256 amtRedeemed);

    /// @notice Event emited on each Harvest call
    /// @dev Upon harvest, emit this event. Index the accounts harvested for. 
    /// Rewards that are re-staked or otherwise reinvested will call other methods which will emit events
    /// with specific yield/value details
    /// @param accountIds a list of the Accounts harvested for
    event Harvest(uint32[] indexed accountIds);

    /*////////////////////////////////////////////////
                    EXTERNAL METHODS
    */////////////////////////////////////////////////

    /// @notice returns the vault type
    /// @dev a vault must declare its Type upon initialization/construction 
    function getVaultType() external view virtual returns (VaultType);

    /// @notice deposit tokens into vault position of specified Account 
    /// @dev the deposit method allows the Vault contract to create or add to an existing 
    /// position for the specified Account. In the case that multiple different tokens can be deposited,
    /// the method requires the deposit token address and amount. The transfer of tokens to the Vault 
    /// contract must occur before the deposit method is called.   
    /// @param accountId a unique Id for each Angel Protocol account
    /// @param token the deposited token
    /// @param amt the amount of the deposited token 
    function deposit(uint32 accountId, address token, uint256 amt) payable external virtual;

    /// @notice redeem value from the vault contract
    /// @dev allows an Account to redeem from its staked value. The behavior is different dependent on VaultType.
    /// Before returning the redemption amt, the vault must approve the Router to spend the tokens. 
    /// @param accountId a unique Id for each Angel Protocol account
    /// @param token the deposited token
    /// @param amt the amount of the deposited token 
    /// @return redemptionAmt returns the number of tokens redeemed by the call; this may differ from 
    /// the called `amt` due to slippage/trading/fees
    function redeem(uint32 accountId, address token, uint256 amt) payable external virtual returns (uint256);

    /// @notice redeem all of the value from the vault contract
    /// @dev allows an Account to redeem all of its staked value. Good for rebasing tokens wherein the value isn't
    /// known explicitly. Before returning the redemption amt, the vault must approve the Router to spend the tokens.
    /// @param accountId a unique Id for each Angel Protocol account
    /// @return redemptionAmt returns the number of tokens redeemed by the call
    function redeemAll(uint32 accountId) payable external virtual returns (uint256); 

    /// @notice restricted method for harvesting accrued rewards 
    /// @dev Claim reward tokens accumulated to the staked value. The underlying behavior will vary depending 
    /// on the target yield strategy and VaultType. Only callable by an Angel Protocol Keeper
    /// @param accountIds Used to specify which accounts to call harvest against. Structured so that this can
    /// be called in batches to avoid running out of gas.
    function harvest(uint32[] calldata accountIds) external virtual;

    /*////////////////////////////////////////////////
                INTERNAL HELPER METHODS
    */////////////////////////////////////////////////

    /// @notice nternal method for validating that calls came from the approved AP router 
    /// @dev The registrar will hold a record of the approved Router address. This method must implement a method of 
    /// checking that the msg.sender == ApprovedRouter
    function _isApprovedRouter() internal virtual returns (bool);
}