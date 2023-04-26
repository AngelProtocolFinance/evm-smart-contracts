// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../struct.sol";

library AccountStorage {
    struct Config {
        address owner;
        address registrarContract;
        uint256 nextAccountId;
        uint256 maxGeneralCategoryId;
    }

    struct Endowment {
        address owner;
        string name; // name of the Endowment
        AngelCoreStruct.Categories categories; // SHOULD NOT be editable for now (only the Config.owner, ie via the Gov contract or AP CW3 Multisig can set/update)
        uint256 tier; // SHOULD NOT be editable for now (only the Config.owner, ie via the Gov contract or AP CW3 Multisig can set/update)
        AngelCoreStruct.EndowmentType endow_type;
        string logo;
        string image;
        AngelCoreStruct.EndowmentStatus status;
        bool depositApproved; // approved to receive donations & transact
        bool withdrawApproved; // approved to withdraw funds
        uint256 maturityTime; // datetime int of endowment maturity
        //OG:AngelCoreStruct.AccountStrategies
        // uint256 strategies; // vaults and percentages for locked/liquid accounts donations where auto_invest == TRUE
        AngelCoreStruct.AccountStrategies strategies;
        AngelCoreStruct.OneOffVaults oneoffVaults; // vaults not covered in account startegies (more efficient tracking of vaults vs. looking up allll vaults)
        AngelCoreStruct.RebalanceDetails rebalance; // parameters to guide rebalancing & harvesting of gains from locked/liquid accounts
        bool kycDonorsOnly; // allow owner to state a preference for receiving only kyc'd donations (where possible) //TODO:
        uint256 pendingRedemptions; // number of vault redemptions currently pending for this endowment
        uint256 copycatStrategy; // endowment ID to copy their strategy
        uint256 proposalLink; // link back the CW3 Proposal that created an endowment
        address dao;
        address daoToken;
        bool donationMatchActive; //TODO: check this de we need to do this
        address donationMatchContract;
        address[] whitelistedBeneficiaries;
        address[] whitelistedContributors;
        address[] maturityWhitelist;
        AngelCoreStruct.EndowmentFee earningsFee; //TODO: we can remove all this
        AngelCoreStruct.EndowmentFee withdrawFee; //TODO: we can remove all this
        AngelCoreStruct.EndowmentFee depositFee; //TODO: we can remove all this
        AngelCoreStruct.EndowmentFee aumFee; //TODO: we can remove all this
        AngelCoreStruct.SettingsController settingsController; //TODO: we can remove all this
        uint256 parent; //TODO: not using this one also
        bool ignoreUserSplits;
        AngelCoreStruct.SplitDetails splitToLiquid;
    }

    ///TODO: Have changed name from state to endowmentState to manage solidity code
    struct EndowmentState {
        AngelCoreStruct.DonationsReceived donationsReceived;
        AngelCoreStruct.BalanceInfo balances;
        bool closingEndowment;
        AngelCoreStruct.Beneficiary closingBeneficiary;
    }

    struct AllowanceData {
        uint256 height;
        uint256 timestamp;
        bool expires;
        uint256 allowanceAmount;
        bool configured;
    }

    struct State {
        mapping(uint256 => uint256) DAOTOKENBALANCE;
        mapping(uint256 => EndowmentState) STATES;
        mapping(uint256 => Endowment) ENDOWMENTS;
        mapping(uint256 => AngelCoreStruct.Profile) PROFILES;
        //owner -> spender -> token -> Allowance Struct
        mapping(address => mapping(address => mapping(address => AllowanceData))) ALLOWANCES;
        Config config;
        address subDao;
        address gateway;
        address gasRevicer;
        bool reentrancyGuardLocked;
        //1 => Locked => GOLDFINCH => 10000
        //endowmentId => accountType => vault => balance
        mapping(bytes4 => string) stratagyId;

        mapping(uint256 => mapping(AngelCoreStruct.AccountType => mapping(string => uint256))) vaultBalance;
    }
}

contract Storage {
    AccountStorage.State state;
}
