// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IIndexFund} from "./IIndexFund.sol";

library IndexFundStorage {
  struct Fund {
    uint256 id;
    string name;
    string description;
    uint32[] endowments;
    //Fund Specific: over-riding SC level setting to handle a fixed split value
    // Defines the % to split off into liquid account, and if defined overrides all other splits
    uint256 splitToLiquid;
    // Used for one-off funds that have an end date (ex. disaster recovery funds)
    uint256 expiryTime; // datetime int of index fund expiry
  }

  struct Config {
    address owner; // DANO Address
    address registrarContract; // Address of Registrar SC
    uint256 fundRotation; // how many blocks are in a rotation cycle for the active IndexFund
    uint256 fundMemberLimit; // limit to number of endowments an IndexFund can have
    uint256 fundingGoal; // donation funding limit (in UUSD) to trigger early cycle of the Active IndexFund
  }

  struct DonationMessages {
    uint32[] endowmentIds;
    uint256[] lockedDonationAmount;
    uint256[] liquidDonationAmount;
    uint256[] lockedSplit;
    uint256[] liquidSplit;
  }

  struct State {
    Config config;
    uint256 activeFund; // ID of the Active IndexFund in the rent rotation set
    uint256 roundDonations; // total donations given to active charity this round
    uint256 nextRotationBlock; // block height to perform next rotation on
    uint256 nextFundId;
    uint256[] rotatingFunds; // list of active, rotating funds (ex. 17 funds, 1 for each of the UNSDGs)
    DonationMessages donationMessages;
    // Fund ID >> Fund
    mapping(uint256 => Fund) Funds;
    // Fund ID >> Endowment ID >> Bool
    mapping(uint256 => mapping(uint32 => bool)) FundsActiveEndowments;
    // Endow ID >> [Fund IDs]
    mapping(uint32 => uint256[]) FundsByEndowment;
  }
}

contract Storage {
  IndexFundStorage.State state;
}
