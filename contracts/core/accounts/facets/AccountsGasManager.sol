// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsGasManager} from "../interfaces/IAccountsGasManager.sol";
import {IGasFwd} from "../../gasFwd/IGasFwd.sol";

contract AccountsGasManager is
  ReentrancyGuardFacet,
  IAccountsGasManager
{

  modifier onlyAccountsContract() {
    if(msg.sender != address(this)) {
      revert OnlyAccountsContract();
    }
    _;
  }

  modifier onlyAdmin() {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    if(msg.sender != state.config.owner) {
      revert OnlyAdmin();
    }
    _;
  }

  function sweepForClosure(uint32 id, address token) external onlyAccountsContract returns (uint256) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return IGasFwd(state.ENDOWMENTS[id].gasFwd).sweep(token);
  }

  function sweepForEndowment(uint32 id, address token) external onlyAdmin returns (uint256) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    return IGasFwd(state.ENDOWMENTS[id].gasFwd).sweep(token);
  }
}
