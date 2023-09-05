// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {IIndexFund} from "../../index-fund/IIndexFund.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsGasManager} from "../interfaces/IAccountsGasManager.sol";
import {IAccountsUpdateStatusEndowments} from "../interfaces/IAccountsUpdateStatusEndowments.sol";
import {IAccountsDepositWithdrawEndowments} from "../interfaces/IAccountsDepositWithdrawEndowments.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";
import {IterableMappingStrategy} from "../../../lib/IterableMappingStrategy.sol";

/**
 * @title AccountsUpdateStatusEndowments
 * @notice This contract facet updates the endowments status
 * @dev This contract facet updates the endowments status, updates rights are with owner of accounts contracts (AP Team Multisig)
 */
contract AccountsUpdateStatusEndowments is
  IAccountsUpdateStatusEndowments,
  ReentrancyGuardFacet,
  IAccountsEvents,
  IterableMappingStrategy
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
    AccountStorage.Endowment storage tempEndowment = state.Endowments[id];

    require(msg.sender == tempEndowment.owner, "Unauthorized");
    require(!state.States[id].closingEndowment, "Endowment is closed");
    require(state.ActiveStrategies[id].keys.length == 0, "Not fully exited");

    RegistrarStorage.Config memory registrarConfig = IRegistrar(state.config.registrarContract)
      .queryConfig();

    // ** Closing logic summary **
    // Charity Endowments: If specified an endowment ID to move their funds to do so (must be another Charity-type). Cannot send to 3rd-party wallet.
    // DAF Endowments: If specified an endowment ID to move their funds to do so (must in AP Approved Endowments list). Cannot send to 3rd-party wallet.
    // Normal Endowments: Can send to any other endowment ID or 3rd party wallet desired.
    // If NONE was passed for beneficiary, then we send all balances to the AP Treasury to be manually re-invested to Endowments chosen by AP MultiSig/Governance.

    // Ensure Charity & DAF Type endowments meet closing beneficiary restrictions
    if (
      tempEndowment.endowType == LibAccounts.EndowmentType.Charity ||
      tempEndowment.endowType == LibAccounts.EndowmentType.Daf
    ) {
      require(
        beneficiary.enumData != LibAccounts.BeneficiaryEnum.Wallet,
        "Cannot pass Wallet beneficiary"
      );
      // If an Endowment ID is not passed we can skip the checks below
      if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.EndowmentId) {
        if (tempEndowment.endowType == LibAccounts.EndowmentType.Daf) {
          require(
            state.DafApprovedEndowments[beneficiary.data.endowId],
            "Not an approved Endowment for DAF withdrawals"
          );
        } else if (tempEndowment.endowType == LibAccounts.EndowmentType.Charity) {
          require(
            state.Endowments[beneficiary.data.endowId].endowType ==
              LibAccounts.EndowmentType.Charity,
            "Beneficiary must be a Charity Endowment type"
          );
        }
      }
    }

    // final check to ensure beneficiary data is set correctly for the desired type
    if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.Wallet) {
      require(beneficiary.data.addr != address(0), "Cannot set to zero address");
      beneficiary.data.endowId = 0;
      state.BeneficiaryWallet[beneficiary.data.addr].push(id);
    } else if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.EndowmentId) {
      require(
        beneficiary.data.endowId > 0 && beneficiary.data.endowId < state.config.nextAccountId,
        "Invalid final Beneficiary Endowment ID passed"
      );
      require(id != beneficiary.data.endowId, "Cannot set own Endowment as final Beneficiary");
      require(
        !state.States[beneficiary.data.endowId].closingEndowment,
        "Cannot set a closed Endowment as final Beneficiary"
      );
      beneficiary.data.addr = address(0);
      state.BeneficiaryEndowment[beneficiary.data.endowId].push(id);
      // Beneficiary of NONE passed, set as Wallet Type and make the AP Treasury the Beneficiary
    } else if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.None) {
      beneficiary = LibAccounts.Beneficiary({
        data: LibAccounts.BeneficiaryData({endowId: 0, addr: registrarConfig.treasury}),
        enumData: LibAccounts.BeneficiaryEnum.Wallet
      });
    }

    // lookup closed endowments that the currently closing Endowment is a beneficiary
    // of in order to re-link them to the new Beneficiary to ensure access is not lost.
    uint32[] memory closedEndows = state.BeneficiaryEndowment[id];
    for (uint256 i = 0; i < closedEndows.length; i++) {
      if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.Wallet) {
        state.BeneficiaryWallet[beneficiary.data.addr].push(closedEndows[i]);
      } else if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.Wallet) {
        state.BeneficiaryEndowment[beneficiary.data.endowId].push(closedEndows[i]);
      }
      state.States[closedEndows[i]].closingBeneficiary = beneficiary;
    }
    // remove closing endowment beneficiary record now that it has been reassigned
    delete state.BeneficiaryEndowment[id];

    // lookup closed endowments that the currently closing Endowment is a beneficiary
    // of in order to re-link them to the new Beneficiary to ensure access is not lost.
    uint32[] memory closedEndows = state.BeneficiaryEndowment[id];
    for (uint256 i = 0; i < closedEndows.length; i++) {
      if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.Wallet) {
        state.BeneficiaryWallet[beneficiary.data.addr].push(closedEndows[i]);
      } else if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.Wallet) {
        state.BeneficiaryEndowment[beneficiary.data.endowId].push(closedEndows[i]);
      }
      state.States[closedEndows[i]].closingBeneficiary = beneficiary;
      // emit for each re-linking so that SubGraph is aware of the change.
      emit EndowmentClosed(closedEndows[i], beneficiary);
    }
    // remove closing endowment beneficiary record now that it has been reassigned
    delete state.BeneficiaryEndowment[id];

    // remove closed fund from all Index Funds that it's involved with
    IIndexFund(registrarConfig.indexFundContract).removeMember(id);

    state.States[id].closingEndowment = true;
    state.States[id].closingBeneficiary = beneficiary;
    emit EndowmentClosed(id, beneficiary, closedEndows);
  }

  /**
   * @notice Force a strategy inactive for `checkFullyExited` to pass
   * @dev We optimistically expect that a cross-chain `deposit` call will be successful
   * and then set the strategy active accordingly. In the event that a strategy is erroneously active,
   * we need a hook for an endow owner to close out.
   * @param id The ID of the endowment to be closed.
   * @param strategyId The `stuck state` strategy
   */
  function forceSetStrategyInactive(uint32 id, bytes4 strategyId) public {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    require(msg.sender == state.Endowments[id].owner, "Unauthorized");
    IterableMappingStrategy.set(state.ActiveStrategies[id], strategyId, false);
  }
}
