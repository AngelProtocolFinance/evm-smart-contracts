// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {AccountMessages} from "../../core/accounts/message.sol";

library CharityApplicationsStorage {
    enum Status {
        None,
        Pending,
        Approved,
        Rejected
    }

    struct CharityApplicationProposal {
        uint256 proposalId;
        address proposer;
        AccountMessages.CreateEndowmentRequest charityApplication;
        string meta;
        uint256 expiry;
        Status status;
    }

    struct Config {
        uint256 proposalExpiry;
        address applicationMultisig;
        address accountsContract;
        uint256 seedSplitToLiquid;
        bool newEndowGasMoney;
        uint256 gasAmount;
        bool fundSeedAsset;
        address seedAsset;
        uint256 seedAssetAmount;
    }
}

contract CharityStorage {
    /*
     *  Storage
     */
    mapping(uint256 => CharityApplicationsStorage.CharityApplicationProposal)
        public proposals;
    CharityApplicationsStorage.Config public config;
    uint256 proposalCounter;
}
