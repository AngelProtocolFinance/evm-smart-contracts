// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

// Angel Protocol
import { IVaultLocked } from "../../interfaces/IVaultLocked.sol";
import { IRegistrar } from "../../interfaces/IRegistrar.sol";

// Integrations
import { IStakingRewards } from "./IStakingRewards.sol";

contract GoldfinchLockedVault is IVaultLocked {

    bytes4 constant STRATEGY_ID = bytes4(keccak256(abi.encode("Goldfinch")));

    constructor(address _registrar, address _stakingPool, address _crvPool) {

    }
    /// @notice returns the vault type
    /// @dev a vault must declare its Type upon initialization/construction 
    function getVaultType() external pure returns (VaultType) {
        return VaultType.LIQUID;
    }

    /// @notice deposit tokens into vault position of specified Account 
    /// @dev the deposit method allows the Vault contract to create or add to an existing 
    /// position for the specified Account. In the case that multiple different tokens can be deposited,
    /// the method requires the deposit token address and amount. The transfer of tokens to the Vault 
    /// contract must occur before the deposit method is called.   
    /// @param accountId a unique Id for each Angel Protocol account
    /// @param token the deposited token
    /// @param amt the amount of the deposited token 
    function deposit(uint32 accountId, address token, uint256 amt) payable external {

    }

    /// @notice redeem value from the vault contract
    /// @dev allows an Account to redeem from its staked value. The behavior is different dependent on VaultType.
    /// @param accountId a unique Id for each Angel Protocol account
    /// @param token the deposited token
    /// @param amt the amount of the deposited token 
    function redeem(uint32 accountId, address token, uint256 amt) payable external{

    }

    /// @notice restricted method for harvesting accrued rewards 
    /// @dev Claim reward tokens accumulated to the staked value. The underlying behavior will vary depending 
    /// on the target yield strategy and VaultType. Only callable by an Angel Protocol Keeper
    /// @param accountId Used to specify whether the harvest should be called against a specific account or, if left as 0,
    /// against all accounts. A vault must implement the 0 = default functionality.  
    function harvest(uint32 accountId) external{

    }
}