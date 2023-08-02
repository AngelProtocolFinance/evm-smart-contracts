// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {IIndexFund} from "../../index-fund/IIndexFund.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsUpdateStatusEndowments} from "../interfaces/IAccountsUpdateStatusEndowments.sol";

/**
 * @title AccountsUpdateStatusEndowments
 * @notice This contract facet updates the endowments status
 * @dev This contract facet updates the endowments status, updates rights are with owner of accounts contracts (AP Team Multisig)
 */
contract AccountsUpdateStatusEndowments is
  IAccountsUpdateStatusEndowments,
  ReentrancyGuardFacet,
  IAccountsEvents
{
  /**
   * @notice Closes an endowment, setting the endowment state to "closingEndowment" and the closing beneficiary to the provided beneficiary.
   * @param id The ID of the endowment to be closed.
   * @param beneficiary The beneficiary that will receive any remaining funds in the endowment.
   * @dev The function will revert if a redemption is rently in progress.
   * @dev Emits an `EndowmentStateUpdated` event with the updated state of the endowment.
   */
  function closeEndowment(
    uint32 id,
    LibAccounts.Beneficiary memory beneficiary
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

    require(msg.sender == tempEndowment.owner, "Unauthorized");
    require(!state.STATES[id].closingEndowment, "Endowment is closed");
    require(checkFullyExited(id), "Not fully exited");

    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    require(
      beneficiary.enumData != LibAccounts.BeneficiaryEnum.None ||
        registrar_config.indexFundContract != address(0),
      "Beneficiary is NONE & Index Fund Contract is not configured in Registrar"
    );

    // If NONE was passed for beneficiary, send balance to the AP Treasury (if not in any funds)
    // or send to the first index fund if it is in one.
    uint256[] memory funds = IIndexFund(registrar_config.indexFundContract).queryInvolvedFunds(id);
    if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.None) {
      if (funds.length == 0) {
        beneficiary = LibAccounts.Beneficiary({
          data: LibAccounts.BeneficiaryData({
            endowId: 0,
            fundId: 0,
            addr: registrar_config.treasury
          }),
          enumData: LibAccounts.BeneficiaryEnum.Wallet
        });
      } else {
        beneficiary = LibAccounts.Beneficiary({
          data: LibAccounts.BeneficiaryData({endowId: 0, fundId: funds[0], addr: address(0)}),
          enumData: LibAccounts.BeneficiaryEnum.IndexFund
        });
        // remove closing endowment from all Index Funds that it is in
        IIndexFund(registrar_config.indexFundContract).removeMember(id);
      }
    }

    state.STATES[id].closingEndowment = true;
    state.STATES[id].closingBeneficiary = beneficiary;
    emit EndowmentClosed(id);
  }

  function checkFullyExited(uint32 id) internal view returns (bool) {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    bytes4[] memory allStrategies = IRegistrar(state.config.registrarContract).queryAllStrategies();
    for (uint256 i; i < allStrategies.length; i++) {
      if (state.STATES[id].activeStrategies[allStrategies[i]]) {
        return false;
      }
    }
    return true;
  }

  /**
   * @notice Force a strategy inactive for `checkFullyExited` to pass
   * @dev We optimistically expect that a cross-chain `deposit` call will be successful
   * and then set the strategy active accordingly. In the event that a strategy is erroneously active,
   * we need a hook for an endow owner to close out.
   * @param id The ID of the endowment to be closed.
   * @param strategySelector The `stuck state` strategy
   */
  function forceSetStrategyInactive(uint32 id, bytes4 strategySelector) public {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    require(msg.sender == state.ENDOWMENTS[id].owner, "Unauthorized");
    state.STATES[id].activeStrategies[strategySelector] = false;
  }
}
