// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IterableMappingAddr} from "../../../lib/IterableMappingAddr.sol";
import {AccountStorage} from "../storage.sol";

library LibAccounts {
  bytes32 constant AP_ACCOUNTS_DIAMOND_STORAGE_POSITION = keccak256("accounts.diamond.storage");

  function diamondStorage() internal pure returns (AccountStorage.State storage ds) {
    bytes32 position = AP_ACCOUNTS_DIAMOND_STORAGE_POSITION;
    assembly {
      ds.slot := position
    }
  }

  enum EndowmentType {
    Charity, // Charity Endowment
    Ast, // Angel Smart Treasury (AST)
    Daf // Donor Advised Fund
  }

  enum Tier {
    None,
    Level1,
    Level2,
    Level3
  }

  enum AllowlistType {
    AllowlistedBeneficiaries,
    AllowlistedContributors,
    MaturityAllowlist
  }

  struct BeneficiaryData {
    uint32 endowId;
    address addr;
  }

  enum BeneficiaryEnum {
    EndowmentId,
    Wallet,
    None
  }

  struct Beneficiary {
    BeneficiaryData data;
    BeneficiaryEnum enumData;
  }

  struct SplitDetails {
    uint256 max;
    uint256 min;
    uint256 defaultSplit; // for when a user splits are not used
  }

  struct Delegate {
    address addr;
    uint256 expires; // datetime int of delegation expiry
  }

  struct SettingsPermission {
    bool locked;
    Delegate delegate;
  }

  struct SettingsController {
    SettingsPermission acceptedTokens;
    SettingsPermission lockedInvestmentManagement;
    SettingsPermission liquidInvestmentManagement;
    SettingsPermission allowlistedBeneficiaries;
    SettingsPermission allowlistedContributors;
    SettingsPermission maturityAllowlist;
    SettingsPermission maturityTime;
    SettingsPermission earlyLockedWithdrawFee;
    SettingsPermission withdrawFee;
    SettingsPermission depositFee;
    SettingsPermission balanceFee;
    SettingsPermission name;
    SettingsPermission image;
    SettingsPermission logo;
    SettingsPermission sdgs;
    SettingsPermission splitToLiquid;
    SettingsPermission ignoreUserSplits;
  }

  enum FeeTypes {
    Default,
    Harvest,
    Deposit,
    DepositCharity,
    Withdraw,
    WithdrawCharity,
    EarlyLockedWithdraw,
    EarlyLockedWithdrawCharity,
    Balance,
    BalanceCharity
  }

  struct FeeSetting {
    address payoutAddress;
    uint256 bps;
  }

  // Trade Constants
  uint256 constant ACCEPTABLE_PRICE_DELAY = 300; // 5 minutes, in seconds

  uint256 constant FEE_BASIS = 10000; // gives 0.01% precision for fees (ie. Basis Points)
  uint256 constant PERCENT_BASIS = 100; // gives 1% precision for declared percentages
  uint256 constant BIG_NUMBA_BASIS = 1e24;

  // upper & lower bounds for Endowment UN SDG elements
  uint256 constant MAX_SDGS_NUM = 17;
  uint256 constant MIN_SDGS_NUM = 1;

  // Interface IDs
  bytes4 constant InterfaceId_Invalid = 0xffffffff;
  bytes4 constant InterfaceId_ERC165 = 0x01ffc9a7;
  bytes4 constant InterfaceId_ERC721 = 0x80ac58cd;
}
