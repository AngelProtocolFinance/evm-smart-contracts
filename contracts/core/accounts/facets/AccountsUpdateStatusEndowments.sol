// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

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
import {IterableMapping} from "../../../lib/IterableMappingAddr.sol";

/**
 * @title AccountsUpdateStatusEndowments
 * @notice This contract facet updates the endowments status
 * @dev This contract facet updates the endowments status, updates rights are with owner of accounts contracts (AP Team Multisig)
 */
contract AccountsUpdateStatusEndowments is
  IAccountsUpdateStatusEndowments,
  ReentrancyGuardFacet,
  IAccountsEvents,
  IterableMapping
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

    RegistrarStorage.Config memory registrarConfig = IRegistrar(state.config.registrarContract)
      .queryConfig();

    // ** Closing logic summary **
    // Charity Endowments: If specified an endowment ID to move their funds to do so (must be another Charity-type). Cannot send to 3rd-party wallet.
    // DAF Endowments: If specified an endowment ID to move their funds to do so (must in AP Approved Endowments list). Cannot send to 3rd-party wallet.
    // Normal Endowments: Can send to any other endowment ID or 3rd party wallet desired.
    // If NONE was passed for beneficiary, then we send all balances to the AP Treasury to be manually re-invested to Endowments chosen by AP MultiSig/Governance.

    // Beneficiary of NONE passed, set to the AP Treasury
    if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.None) {
      beneficiary = LibAccounts.Beneficiary({
        data: LibAccounts.BeneficiaryData({endowId: 0, addr: registrarConfig.treasury}),
        enumData: LibAccounts.BeneficiaryEnum.Wallet
      });
      // Ensure Charity & DAF Type endowments meet closing beneficiary restrictions
    } else if (
      tempEndowment.endowType == LibAccounts.EndowmentType.Charity ||
      tempEndowment.endowType == LibAccounts.EndowmentType.Daf
    ) {
      require(
        beneficiary.enumData != LibAccounts.BeneficiaryEnum.Wallet,
        "Charity cannot pass Wallet beneficiary"
      );
      // if NONE is passed we can skip the below checks
      if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.EndowmentId) {
        if (tempEndowment.endowType == LibAccounts.EndowmentType.Daf) {
          require(state.dafApprovedEndowments[id], "Not an approved Endowment for DAF withdrawals");
        } else if (tempEndowment.endowType == LibAccounts.EndowmentType.Charity) {
          require(
            state.ENDOWMENTS[beneficiary.data.endowId].endowType ==
              LibAccounts.EndowmentType.Charity,
            "Beneficiary must be a Charity Endowment type"
          );
        }
      }
    }

    // final check to ensure beneficiary data is set correctly for the desired type
    if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.Wallet) {
      beneficiary.data.endowId = 0;
    } else if (beneficiary.enumData == LibAccounts.BeneficiaryEnum.EndowmentId) {
      beneficiary.data.addr = address(0);
    }

    // remove closed fund from all Index Funds that it's involved with
    IIndexFund(registrarConfig.indexFundContract).removeMember(id);

    state.STATES[id].closingEndowment = true;
    state.STATES[id].closingBeneficiary = beneficiary;
    emit EndowmentClosed(id, beneficiary);
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
