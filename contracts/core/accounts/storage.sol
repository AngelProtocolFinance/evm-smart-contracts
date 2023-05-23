// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../struct.sol";
import {LocalRegistrarLib} from "../registrar/lib/LocalRegistrarLib.sol";

library AccountStorage {
    struct Config {
        address owner;
        string version;
        address registrarContract;
        uint32 nextAccountId;
        uint256 maxGeneralCategoryId;
        address subDao;
        address gateway;
        address gasReceiver;
        bool reentrancyGuardLocked;
        AngelCoreStruct.EndowmentFee earlyLockedWithdrawFee;
    }

    struct Endowment {
        address owner;
        string name; // name of the Endowment
        AngelCoreStruct.Categories categories; // SHOULD NOT be editable for now (only the Config.owner, ie via the Gov contract or AP Team Multisig can set/update)
        uint256 tier; // SHOULD NOT be editable for now (only the Config.owner, ie via the Gov contract or AP Team Multisig can set/update)
        AngelCoreStruct.EndowmentType endowType;
        string logo;
        string image;
        uint256 maturityTime; // datetime int of endowment maturity
        //OG:AngelCoreStruct.AccountStrategies
        // uint256 strategies; // vaults and percentages for locked/liquid accounts donations where auto_invest == TRUE
        AngelCoreStruct.AccountStrategies strategies;
        AngelCoreStruct.OneOffVaults oneoffVaults; // vaults not covered in account startegies (more efficient tracking of vaults vs. looking up allll vaults)
        LocalRegistrarLib.RebalanceParams rebalance; // parameters to guide rebalancing & harvesting of gains from locked/liquid accounts
        bool kycDonorsOnly; // allow owner to state a preference for receiving only kyc'd donations (where possible) //TODO:
        uint256 pendingRedemptions; // number of vault redemptions rently pending for this endowment
        uint256 proposalLink; // link back the Applications Team Multisig Proposal that created an endowment (if a Charity)
        address multisig;
        address dao;
        address daoToken;
        bool donationMatchActive;
        address donationMatchContract;
        address[] allowlistedBeneficiaries;
        address[] allowlistedContributors;
        address[] maturityAllowlist;
        AngelCoreStruct.EndowmentFee earlyLockedWithdrawFee;
        AngelCoreStruct.EndowmentFee withdrawFee;
        AngelCoreStruct.EndowmentFee depositFee;
        AngelCoreStruct.EndowmentFee balanceFee;
        AngelCoreStruct.SettingsController settingsController;
        uint32 parent;
        bool ignoreUserSplits;
        AngelCoreStruct.SplitDetails splitToLiquid;
        uint256 referralId;
    }

    struct EndowmentState {
        AngelCoreStruct.DonationsReceived donationsReceived;
        AngelCoreStruct.BalanceInfo balances;
        bool closingEndowment;
        AngelCoreStruct.Beneficiary closingBeneficiary;
        mapping(bytes4 => bool) activeStrategies;
    }

    struct State {
        mapping(uint32 => uint256) DAOTOKENBALANCE;
        mapping(uint32 => EndowmentState) STATES;
        mapping(uint32 => Endowment) ENDOWMENTS;
        // endow ID -> spender Addr -> token Addr -> amount
        mapping(uint32 => mapping(address => mapping(address => uint256))) ALLOWANCES;
        Config config;
        // mapping(bytes4 => string) stratagyId;
        // mapping(uint32 => mapping(AngelCoreStruct.AccountType => mapping(string => uint256))) vaultBalance;
    }
}

contract Storage {
    AccountStorage.State state;
}
