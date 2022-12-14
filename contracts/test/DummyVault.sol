// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
// pragma
pragma solidity >=0.8.0;
import {IVault} from "../interfaces/IVault.sol";

contract DummyVault is IVault {

    IVault.VaultType vaultType;

    constructor(IVault.VaultType _type) {
        vaultType = _type;
    }

    function getVaultType() external view override returns (VaultType) {
        return vaultType;
    }

    function deposit(uint32 accountId, address token, uint256 amt) payable external override {
        emit DepositMade(accountId, vaultType, token, amt);
    }

    function redeem(uint32 accountId, address token, uint256 amt) payable external override returns (uint256) {
        emit Redemption(accountId, vaultType, token, amt);
        return amt + 1;
    }

    function redeemAll(uint32 accountId) payable external override returns (uint256) {
        uint256 dummyAmt = 1;
        emit Redemption(accountId, vaultType, address(this), dummyAmt);
        return dummyAmt;
    } 

    function harvest(uint32[] calldata accountIds) external override {
        emit Harvest(accountIds);
    }

    function _isApprovedRouter() internal override returns (bool) {
        
    }
}