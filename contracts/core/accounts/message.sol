// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../struct.sol";

library AccountMessages {
    struct CreateEndowmentRequest {
        address owner; // address that originally setup the endowment account
        bool withdrawBeforeMaturity; // endowment allowed to withdraw funds from locked acct before maturity date
        uint256 maturityTime; // datetime int of endowment maturity
        uint256 maturityHeight; // block equiv of the maturity_datetime
        string name; // name of the Endowment
        AngelCoreStruct.Categories categories; // SHOULD NOT be editable for now (only the Config.owner, ie via the Gov contract or AP CW3 Multisig can set/update)
        uint256 tier; // SHOULD NOT be editable for now (only the Config.owner, ie via the Gov contract or AP CW3 Multisig can set/update)
        AngelCoreStruct.EndowmentType endow_type;
        string logo;
        string image;
        // AngelCoreStruct.Member[] cw4_members;
        address[] cw4_members;
        bool kycDonorsOnly;
        AngelCoreStruct.Threshold cw3Threshold;
        AngelCoreStruct.Duration cw3MaxVotingPeriod;
        address[] whitelistedBeneficiaries;
        address[] whitelistedContributors;
        uint256 splitMax;
        uint256 splitMin;
        uint256 splitDefault;
        AngelCoreStruct.EndowmentFee earningsFee;
        AngelCoreStruct.EndowmentFee withdrawFee;
        AngelCoreStruct.EndowmentFee depositFee;
        AngelCoreStruct.EndowmentFee aumFee;
        AngelCoreStruct.DaoSetup dao;
        bool createDao;
        uint256 proposalLink;
        AngelCoreStruct.SettingsController settingsController;
        uint256 parent;
        address[] maturityWhitelist;
        bool ignoreUserSplits;
        AngelCoreStruct.SplitDetails splitToLiquid;
    }

    struct UpdateEndowmentSettingsRequest {
        uint256 id;
        bool donationMatchActive;
        address[] whitelistedBeneficiaries;
        address[] whitelistedContributors;
        address[] maturity_whitelist_add;
        address[] maturity_whitelist_remove;
        AngelCoreStruct.SplitDetails splitToLiquid;
        bool ignoreUserSplits;
    }
    struct UpdateEndowmentControllerRequest {
        uint256 id;
        AngelCoreStruct.SettingsPermission endowmentController;
        AngelCoreStruct.SettingsPermission name;
        AngelCoreStruct.SettingsPermission image;
        AngelCoreStruct.SettingsPermission logo;
        AngelCoreStruct.SettingsPermission categories;
        AngelCoreStruct.SettingsPermission kycDonorsOnly;
        AngelCoreStruct.SettingsPermission splitToLiquid;
        AngelCoreStruct.SettingsPermission ignoreUserSplits;
        AngelCoreStruct.SettingsPermission whitelistedBeneficiaries;
        AngelCoreStruct.SettingsPermission whitelistedContributors;
        AngelCoreStruct.SettingsPermission maturityWhitelist;
        AngelCoreStruct.SettingsPermission earningsFee;
        AngelCoreStruct.SettingsPermission depositFee;
        AngelCoreStruct.SettingsPermission withdrawFee;
        AngelCoreStruct.SettingsPermission aumFee;
    }

    struct UpdateEndowmentStatusRequest {
        uint256 endowmentId;
        uint256 status;
        AngelCoreStruct.Beneficiary beneficiary;
    }

    struct UpdateEndowmentDetailsRequest {
        uint256 id; /// u32,
        address owner; /// Option<String>,
        bool kycDonorsOnly; /// Option<bool>,
        AngelCoreStruct.EndowmentType endow_type; /// Option<String>,
        string name; /// Option<String>,
        AngelCoreStruct.Categories categories; /// Option<Categories>,
        uint256 tier; /// Option<u8>,
        string logo; /// Option<String>,
        string image; /// Option<String>,
        AngelCoreStruct.RebalanceDetails rebalance;
    }

    struct Strategy {
        string vault; // Vault SC Address
        uint256 percentage; // percentage of funds to invest
    }

    struct UpdateProfileRequest {
        uint256 id;
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
    }

    struct StateResponse {
        AngelCoreStruct.DonationsReceived donationsReceived;
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
        uint256 id; // u32,
        address owner; // String,
        AngelCoreStruct.EndowmentStatus status; // EndowmentStatus,
        AngelCoreStruct.EndowmentType endow_type; // EndowmentType,
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

    struct ProfileResponse {
        string name; // String,
        string overview; // String,
        AngelCoreStruct.Categories categories; // Categories,
        uint256 tier; // Option<u8>,
        string logo; // Option<String>,
        string image; // Option<String>,
        string url; // Option<String>,
        string registrationNumber; // Option<String>,
        string countryOfOrigin; // Option<String>,
        string streetAddress; // Option<String>,
        string contactEmail; // Option<String>,
        AngelCoreStruct.SocialMedialUrls socialMediaUrls; // SocialMedialUrls,
        uint16 numberOfEmployees; // Option<u16>,
        string averageAnnualBudget; // Option<String>,
        string annualRevenue; // Option<String>,
        string charityNavigatorRating; // Option<String>,
    }

    struct EndowmentDetailsResponse {
        address owner; //: Addr,
        address dao;
        address daoToken;
        string description;
        AngelCoreStruct.AccountStrategies strategies;
        AngelCoreStruct.EndowmentStatus status;
        AngelCoreStruct.EndowmentType endow_type;
        uint256 maturityTime;
        AngelCoreStruct.OneOffVaults oneoffVaults;
        AngelCoreStruct.RebalanceDetails rebalance;
        address donationMatchContract;
        bool kycDonorsOnly;
        address[] maturityWhitelist;
        bool depositApproved;
        bool withdrawApproved;
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
        uint256 id;
        uint256 lockedPercentage;
        uint256 liquidPercentage;
    }

    struct UpdateEndowmentFeeRequest {
        uint256 id;
        AngelCoreStruct.EndowmentFee earningsFee;
        AngelCoreStruct.EndowmentFee depositFee;
        AngelCoreStruct.EndowmentFee withdrawFee;
        AngelCoreStruct.EndowmentFee aumFee;
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
