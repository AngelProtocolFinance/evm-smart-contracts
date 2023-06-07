// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../struct.sol";

library IndexFundStorage {
  struct Config {
    address owner; // DANO Address
    address registrarContract; // Address of Registrar SC
    uint256 fundRotation; // how many blocks are in a rotation cycle for the active IndexFund
    uint256 fundMemberLimit; // limit to number of members an IndexFund can have
    uint256 fundingGoal; // donation funding limit (in UUSD) to trigger early cycle of the Active IndexFund
  }

  struct _State {
    uint256 totalFunds;
    uint256 activeFund; // ID of the Active IndexFund in the rent rotation set
    uint256 roundDonations; // total donations given to active charity this round
    uint256 nextRotationBlock; // block height to perform next rotation on
    uint256 nextFundId;
  }

  struct DonationMessages {
    uint32[] member_ids;
    uint256[] locked_donation_amount;
    uint256[] liquid_donation_amount;
    uint256[] lockedSplit;
    uint256[] liquidSplit;
  }

  struct State {
    Config config;
    _State state;
    mapping(uint256 => AngelCoreStruct.IndexFund) FUNDS;
    mapping(uint32 => uint256[]) FUNDS_BY_ENDOWMENT; // Endow ID >> [Fund IDs]
    uint256[] rotatingFunds; // list of active, rotating funds (ex. 17 funds, 1 for each of the UNSDGs)
    DonationMessages donationMessages;
  }
}

contract StorageIndexFund {
  IndexFundStorage.State state;
}
