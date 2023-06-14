// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {IIndexFund} from "../../index-fund/Iindex-fund.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";

/**
 * @title AccountsUpdateStatusEndowments
 * @notice This contract facet updates the endowments status
 * @dev This contract facet updates the endowments status, updates rights are with owner of accounts contracts (AP Team Multisig)
 */
contract AccountsUpdateStatusEndowments is ReentrancyGuardFacet, AccountsEvents {
  /**
   * @notice Closes an endowment, setting the endowment state to "closingEndowment" and the closing beneficiary to the provided beneficiary.
   * @param id The ID of the endowment to be closed.
   * @param beneficiary The beneficiary that will receive any remaining funds in the endowment.
   * @dev The function will revert if a redemption is rently in progress.
   * @dev Emits an `UpdateEndowmentState` event with the updated state of the endowment.
   */
  function closeEndowment(
    uint32 id,
    AngelCoreStruct.Beneficiary memory beneficiary
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

    require(msg.sender == tempEndowment.owner, "Unauthorized");
    require(!state.STATES[id].closingEndowment, "Endowment is closed");
    require(tempEndowment.pendingRedemptions == 0, "RedemptionInProgress");

    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    require(
      beneficiary.enumData != AngelCoreStruct.BeneficiaryEnum.None ||
        registrar_config.indexFundContract != address(0),
      "Beneficiary is NONE & Index Fund Contract is not configured in Registrar"
    );

    // If NONE was passed for beneficiary, send balance to the AP Treasury (if not in any funds)
    // or send to the first index fund if it is in one.
    AngelCoreStruct.IndexFund[] memory funds = IIndexFund(registrar_config.indexFundContract)
      .queryInvolvedFunds(id);
    if (beneficiary.enumData == AngelCoreStruct.BeneficiaryEnum.None) {
      if (funds.length == 0) {
        beneficiary = AngelCoreStruct.Beneficiary({
          data: AngelCoreStruct.BeneficiaryData({
            endowId: 0,
            fundId: 0,
            addr: registrar_config.treasury
          }),
          enumData: AngelCoreStruct.BeneficiaryEnum.Wallet
        });
      } else {
        beneficiary = AngelCoreStruct.Beneficiary({
          data: AngelCoreStruct.BeneficiaryData({
            endowId: 0,
            fundId: funds[0].id,
            addr: address(0)
          }),
          enumData: AngelCoreStruct.BeneficiaryEnum.IndexFund
        });
        // remove closing endowment from all Index Funds that it is in
        IIndexFund(registrar_config.indexFundContract).removeMember(id);
      }
    }

    state.STATES[id].closingEndowment = true;
    state.STATES[id].closingBeneficiary = beneficiary;

    require(checkFullyExited(uint32(id)), "Not fully exited");
    state.ENDOWMENTS[id] = tempEndowment;
    emit UpdateEndowment(id, state.ENDOWMENTS[id]);
    // emit UpdateEndowmentState(id, state.STATES[id]);
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
}
