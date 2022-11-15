// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

interface IVault {
    
    /// @notice Angel Protocol Vault Type 
    /// @dev Vaults have different behavior depending on type. Specifically access to redemptions and 
    /// principle balance
    enum VaultType {
        LOCKED,
        LIQUID
    }

    struct VaultParams {
        VaultType vaultType;
        bytes4 strategySelector;   
    }

    /// @notice Event emited on each Deposit call
    /// @dev Upon deposit, emit this event. Index the account and staking contract for analytics 
    event DepositMade(
        uint32 indexed accountId, 
        VaultType vaultType, 
        address tokenDeposited, 
        uint256 amtDeposited, 
        address indexed stakingContract); 

    /// @notice Event emited on each Redemption call 
    /// @dev Upon redemption, emit this event. Index the account and staking contract for analytics 
    event Redemption(
        uint32 indexed accountId, 
        VaultType vaultType, 
        address tokenRedeemed, 
        uint256 amtRedeemed, 
        address indexed stakingContract);

    /// @notice Event emited on each Harvest call
    /// @dev Upon harvest, emit this event. Index the accounts harvested for. 
    /// Rewards that are re-staked or otherwise reinvested will call other methods which will emit events
    /// with specific yield/value details
    /// @param accountIds a list of the Accounts harvested for
    event Harvest(uint32[] indexed accountIds);

    /// @notice deposit tokens into vault position of specified Account 
    /// @dev the deposit method allows the Vault contract to create or add to an existing 
    /// position for the specified Account. In the case that multiple different tokens can be deposited,
    /// the method requires the deposit token address and amount. The transfer of tokens to the Vault 
    /// contract must occur before the deposit method is called.   
    /// @param accountId a unique Id for each Angel Protocol account
    /// @param token the deposited token
    /// @param amt the amount of the deposited token 
    function deposit(uint32 accountId, address token, uint256 amt) payable external;

    /// @notice redeem value from the vault contract
    /// @dev allows an Account to redeem from its staked value. The behavior is different dependent on VaultType.
    /// @param accountId a unique Id for each Angel Protocol account
    /// @param token the deposited token
    /// @param amt the amount of the deposited token 
    function redeem(uint32 accountId, address token, uint256 amt) payable external;

    /// @notice restricted method for harvesting accrued rewards 
    /// @dev Claim reward tokens accumulated to the staked value. The underlying behavior will vary depending 
    /// on the target yield strategy and VaultType. Only callable by an Angel Protocol Keeper
    function harvest() external;
}