// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "./IVault.sol";

interface IVaultLiquid is IVault {

    /// @notice allows an account to stake specified Liquid value into its sister Locked Vault 
    /// @dev An Account can choose to allocate some of its liquid balance into the locked vault.
    /// The value is specifiable and unrestricted up to the maximum value of the liquid account.
    /// @param accountId a unique Id for each Angel Protocol account
    /// @param token the deposited token
    /// @param amt the amount of the deposited token 
    function reinvestToLocked(uint32 accountId, address token, uint256 amt) external;
}