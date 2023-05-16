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
        address[] alliance_members;
    }

    struct _State {
        uint256 totalFunds;
        uint256 activeFund; // index ID of the Active IndexFund
        uint256 round_donations; // total donations given to active charity this round
        uint256 nextRotationBlock; // block height to perform next rotation on
        uint256 nextFundId;
    }

    struct DonationMessages {
        uint256[] member_ids;
        uint256[] locked_donation_amount;
        uint256[] liquid_donation_amount;
        uint256[] lockedSplit;
        uint256[] liquidSplit;
    }

    struct State {
        Config config;
        _State state;
        // mapping(address => AngelCoreStruct.GenericBalance) TCA_DONATIONS;
        // mapping(address => AngelCoreStruct.AllianceMember) ALLIANCE_MEMBERS;
        // address[] ALLIANCE_MEMBERS_LIST;
        mapping(uint256 => AngelCoreStruct.IndexFund) FUND;
        uint256[] FUND_LIST;
        DonationMessages donationMessages;
        bool initIndexFund;
    }
}

contract StorageIndexFund {
    IndexFundStorage.State state;
}
