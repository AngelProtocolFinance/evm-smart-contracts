// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../struct.sol";
import {LocalRegistrarLib} from "../registrar/lib/LocalRegistrarLib.sol";

library AccountMessages {
    struct CreateEndowmentRequest {
        address owner; // address that originally setup the endowment account
        bool withdrawBeforeMaturity; // endowment allowed to withdraw funds from locked acct before maturity date
        uint256 maturityTime; // datetime int of endowment maturity
        uint256 maturityHeight; // block equiv of the maturity_datetime
        string name; // name of the Endowment
        AngelCoreStruct.Categories categories; // SHOULD NOT be editable for now (only the Config.owner, ie via the Gov contract or AP Team Multisig can set/update)
        uint256 tier; // SHOULD NOT be editable for now (only the Config.owner, ie via the Gov contract or AP Team Multisig can set/update)
        AngelCoreStruct.EndowmentType endowType;
        string logo;
        string image;
        address[] members;
        bool kycDonorsOnly;
        uint256 threshold;
        AngelCoreStruct.Duration maxVotingPeriod;
        address[] allowlistedBeneficiaries;
        address[] allowlistedContributors;
        uint256 splitMax;
        uint256 splitMin;
        uint256 splitDefault;
        AngelCoreStruct.FeeSetting earlyLockedWithdrawFee;
        AngelCoreStruct.FeeSetting withdrawFee;
        AngelCoreStruct.FeeSetting depositFee;
        AngelCoreStruct.FeeSetting balanceFee;
        AngelCoreStruct.DaoSetup dao;
        bool createDao;
        uint256 proposalLink;
        AngelCoreStruct.SettingsController settingsController;
        uint32 parent;
        address[] maturityAllowlist;
        bool ignoreUserSplits;
        AngelCoreStruct.SplitDetails splitToLiquid;
        uint256 referralId;
    }

    struct UpdateEndowmentSettingsRequest {
        uint32 id;
        bool donationMatchActive;
        uint256 maturityTime;
        address[] allowlistedBeneficiaries;
        address[] allowlistedContributors;
        address[] maturity_allowlist_add;
        address[] maturity_allowlist_remove;
        AngelCoreStruct.SplitDetails splitToLiquid;
        bool ignoreUserSplits;
    }

    struct UpdateEndowmentControllerRequest {
        uint32 id;
        AngelCoreStruct.SettingsController settingsController;
    }

    struct UpdateEndowmentDetailsRequest {
        uint32 id;
        address owner; /// Option<String>,
        string name; /// Option<String>,
        AngelCoreStruct.Categories categories; /// Option<Categories>,
        string logo; /// Option<String>,
        string image; /// Option<String>,
        LocalRegistrarLib.RebalanceParams rebalance;
    }

    struct Strategy {
        string vault; // Vault SC Address
        uint256 percentage; // percentage of funds to invest
    }

    struct UpdateProfileRequest {
        uint32 id;
        string overview;
        string url;
        string registrationNumber;
        string countryOfOrigin;
        string streetAddress;
        string contactEmail;
        string facebook;
        string twitter;
        string linkedin;
        uint16 numberOfEmployees;
        string averageAnnualBudget;
        string annualRevenue;
        string charityNavigatorRating;
    }

    ///TODO: response struct should be below this

    struct ConfigResponse {
        address owner;
        string version;
        address registrarContract;
        uint256 nextAccountId;
        uint256 maxGeneralCategoryId;
        address subDao;
        address gateway;
        address gasReceiver;
        AngelCoreStruct.FeeSetting earlyLockedWithdrawFee;
    }

    struct StateResponse {
        bool closingEndowment;
        AngelCoreStruct.Beneficiary closingBeneficiary;
    }

    struct EndowmentBalanceResponse {
        AngelCoreStruct.BalanceInfo tokensOnHand; //: BalanceInfo,
        address[] invested_locked_string; //: Vec<(String, Uint128)>,
        uint128[] invested_locked_amount;
        address[] invested_liquid_string; //: Vec<(String, Uint128)>,
        uint128[] invested_liquid_amount;
    }

    struct EndowmentEntry {
        uint32 id; // u32,
        address owner; // String,
        AngelCoreStruct.EndowmentType endowType; // EndowmentType,
        string name; // Option<String>,
        string logo; // Option<String>,
        string image; // Option<String>,
        AngelCoreStruct.Tier tier; // Option<Tier>,
        AngelCoreStruct.Categories categories; // Categories,
        string proposalLink; // Option<u64>,
    }

    struct EndowmentListResponse {
        EndowmentEntry[] endowments;
    }

    struct EndowmentDetailsResponse {
        address owner; //: Addr,
        address dao;
        address daoToken;
        string description;
        AngelCoreStruct.AccountStrategies strategies;
        AngelCoreStruct.EndowmentType endowType;
        uint256 maturityTime;
        AngelCoreStruct.OneOffVaults oneoffVaults;
        LocalRegistrarLib.RebalanceParams rebalance;
        address donationMatchContract;
        address[] maturityAllowlist;
        uint256 pendingRedemptions;
        string logo;
        string image;
        string name;
        AngelCoreStruct.Categories categories;
        uint256 tier;
        uint256 copycatStrategy;
        uint256 proposalLink;
        uint256 parent;
        AngelCoreStruct.SettingsController settingsController;
    }

    struct DepositRequest {
        uint32 id;
        uint256 lockedPercentage;
        uint256 liquidPercentage;
    }

    struct UpdateFeeSettingRequest {
        uint32 id;
        AngelCoreStruct.FeeSetting earlyLockedWithdrawFee;
        AngelCoreStruct.FeeSetting depositFee;
        AngelCoreStruct.FeeSetting withdrawFee;
        AngelCoreStruct.FeeSetting balanceFee;
    }

    enum DonationMatchEnum {
        HaloTokenReserve,
        Cw20TokenReserve
    }

    struct DonationMatchData {
        address reserveToken;
        address uniswapFactory;
        uint24 poolFee;
    }

    struct DonationMatch {
        DonationMatchEnum enumData;
        DonationMatchData data;
    }
}
