// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "./lib/LibAccounts.sol";
import {LocalRegistrarLib} from "../registrar/lib/LocalRegistrarLib.sol";

library AccountMessages {
  struct CreateEndowmentRequest {
    bool withdrawBeforeMaturity;
    uint256 maturityTime;
    string name;
    uint256[] sdgs;
    LibAccounts.Tier tier;
    LibAccounts.EndowmentType endowType;
    string logo;
    string image;
    address[] members;
    uint256 threshold;
    uint256 duration;
    address[] allowlistedBeneficiaries;
    address[] allowlistedContributors;
    LibAccounts.FeeSetting earlyLockedWithdrawFee;
    LibAccounts.FeeSetting withdrawFee;
    LibAccounts.FeeSetting depositFee;
    LibAccounts.FeeSetting balanceFee;
    uint256 proposalLink;
    LibAccounts.SettingsController settingsController;
    uint32 parent;
    address[] maturityAllowlist;
    bool ignoreUserSplits;
    LibAccounts.SplitDetails splitToLiquid;
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
    LibAccounts.SplitDetails splitToLiquid;
    bool ignoreUserSplits;
  }

  struct UpdateEndowmentControllerRequest {
    uint32 id;
    LibAccounts.SettingsController settingsController;
  }

  struct UpdateEndowmentDetailsRequest {
    uint32 id;
    address owner;
    string name;
    uint256[] sdgs;
    string logo;
    string image;
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
    string networkName;
    address registrarContract;
    uint256 nextAccountId;
  }

  struct StateResponse {
    bool closingEndowment;
    LibAccounts.Beneficiary closingBeneficiary;
  }

  struct EndowmentDetailsResponse {
    address owner;
    address dao;
    address daoToken;
    string description;
    LibAccounts.EndowmentType endowType;
    uint256 maturityTime;
    LocalRegistrarLib.RebalanceParams rebalance;
    address donationMatchContract;
    address[] maturityAllowlist;
    string logo;
    string image;
    string name;
    uint256[] sdgs;
    LibAccounts.Tier tier;
    uint256 copycatStrategy;
    uint256 proposalLink;
    uint256 parent;
    LibAccounts.SettingsController settingsController;
  }

  struct DepositRequest {
    uint32 id;
    uint256 lockedPercentage;
    uint256 liquidPercentage;
    address donationMatch;
  }

  struct InvestRequest {
    bytes4 strategy;
    string token;
    uint256 lockAmt;
    uint256 liquidAmt;
    uint256 gasFee;
  }

  struct RedeemRequest {
    bytes4 strategy;
    string token;
    uint256 lockAmt;
    uint256 liquidAmt;
    uint256 gasFee;
  }

  struct RedeemAllRequest {
    bytes4 strategy;
    string token;
    bool redeemLocked;
    bool redeemLiquid;
    uint256 gasFee;
  }

  struct UpdateFeeSettingRequest {
    uint32 id;
    LibAccounts.FeeSetting earlyLockedWithdrawFee;
    LibAccounts.FeeSetting depositFee;
    LibAccounts.FeeSetting withdrawFee;
    LibAccounts.FeeSetting balanceFee;
  }

  enum DonationMatchEnum {
    HaloTokenReserve,
    ERC20TokenReserve
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
