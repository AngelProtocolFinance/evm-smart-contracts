// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library AngelCoreStruct {
  
  enum AccountType {
    Locked,
    Liquid
  }

  enum Tier {
    None,
    Level1,
    Level2,
    Level3
  }

  enum EndowmentType {
    Charity,
    Normal
  }

  struct TokenInfo {
    address addr;
    uint256 amnt;
  }

  struct BalanceInfo {
    mapping(address => uint256) locked;
    mapping(address => uint256) liquid;
  }

  struct IndexFund {
    uint256 id;
    string name;
    string description;
    uint32[] members;
    //Fund Specific: over-riding SC level setting to handle a fixed split value
    // Defines the % to split off into liquid account, and if defined overrides all other splits
    uint256 splitToLiquid;
    // Used for one-off funds that have an end date (ex. disaster recovery funds)
    uint256 expiryTime; // datetime int of index fund expiry
  }

  ///TODO: need to test this same names already declared in other libraries
  struct BeneficiaryData {
    uint32 endowId;
    uint256 fundId;
    address addr;
  }

  enum BeneficiaryEnum {
    EndowmentId,
    IndexFund,
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

  struct NetworkInfo {
    string name;
    uint256 chainId;
    address router; //SHARED
    address axelarGateway;
    string ibcChannel; // Should be removed
    string transferChannel;
    address gasReceiver; // Should be removed
    uint256 gasLimit; // Should be used to set gas limit
  }

  ///TODO: need to check this and have a look at this
  enum VaultType {
    Native, // Juno native Vault contract
    Ibc, // the address of the Vault contract on it's Cosmos(non-Juno) chain
    Evm, // the address of the Vault contract on it's EVM chain
    None
  }

  enum veTypeEnum {
    Constant,
    Linear,
    SquarRoot
  }

  struct veTypeData {
    uint128 value;
    uint256 scale;
    uint128 slope;
    uint128 power;
  }

  struct veType {
    veTypeEnum ve_type;
    veTypeData data;
  }

  enum TokenType {
    Existing,
    New,
    VeBonding
  }

  struct DaoTokenData {
    address existingData;
    uint256 newInitialSupply;
    string newName;
    string newSymbol;
    veType veBondingType;
    string veBondingName;
    string veBondingSymbol;
    uint256 veBondingDecimals;
    address veBondingReserveDenom;
    uint256 veBondingReserveDecimals;
    uint256 veBondingPeriod;
  }

  struct DaoToken {
    TokenType token;
    DaoTokenData data;
  }

  struct DaoSetup {
    uint256 quorum; //: Decimal,
    uint256 threshold; //: Decimal,
    uint256 votingPeriod; //: u64,
    uint256 timelockPeriod; //: u64,
    uint256 expirationPeriod; //: u64,
    uint128 proposalDeposit; //: Uint128,
    uint256 snapshotPeriod; //: u64,
    DaoToken token; //: DaoToken,
  }

  struct Delegate {
    address addr;
    uint256 expires; // datetime int of delegation expiry
  }

  enum DelegateAction {
    Set,
    Revoke
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

  enum ControllerSettingOption {
    AcceptedTokens,
    LockedInvestmentManagement,
    LiquidInvestmentManagement,
    AllowlistedBeneficiaries,
    AllowlistedContributors,
    MaturityAllowlist,
    EarlyLockedWithdrawFee,
    MaturityTime,
    WithdrawFee,
    DepositFee,
    BalanceFee,
    Name,
    Image,
    Logo,
    Sdgs,
    SplitToLiquid,
    IgnoreUserSplits
  }

  enum FeeTypes {
    Default,
    Harvest,
    WithdrawCharity,
    WithdrawNormal,
    EarlyLockedWithdrawCharity,
    EarlyLockedWithdrawNormal
  }

  struct FeeSetting {
    address payoutAddress;
    uint256 bps;
  }

  uint256 constant FEE_BASIS = 10000; // gives 0.01% precision for fees (ie. Basis Points)
  uint256 constant PERCENT_BASIS = 100; // gives 1% precision for declared percentages
  uint256 constant BIG_NUMBA_BASIS = 1e24;

  // Interface IDs
  bytes4 constant InterfaceId_Invalid = 0xffffffff;
  bytes4 constant InterfaceId_ERC165 = 0x01ffc9a7;
  bytes4 constant InterfaceId_ERC721 = 0x80ac58cd;
}
