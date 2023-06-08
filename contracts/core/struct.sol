// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

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

  struct Pair {
    //This should be asset info
    string[] asset;
    address contractAddress;
  }

  struct Asset {
    address addr;
    string name;
  }

  enum AssetInfoBase {
    Cw20,
    Native,
    None
  }

  struct AssetBase {
    AssetInfoBase info;
    uint256 amount;
    address addr;
    string name;
  }

  //By default array are empty
  struct Categories {
    uint256[] sdgs;
    uint256[] general;
  }

  enum EndowmentType {
    Charity,
    Normal
  }

  enum AllowanceAction {
    Add,
    Remove
  }

  struct AccountStrategies {
    string[] locked_vault;
    uint256[] lockedPercentage;
    string[] liquid_vault;
    uint256[] liquidPercentage;
  }

  function accountStratagyLiquidCheck(
    AccountStrategies storage strategies,
    OneOffVaults storage oneoffVaults
  ) public {
    for (uint256 i = 0; i < strategies.liquid_vault.length; i++) {
      bool checkFlag = true;
      for (uint256 j = 0; j < oneoffVaults.liquid.length; j++) {
        if (
          keccak256(abi.encodePacked(strategies.liquid_vault[i])) ==
          keccak256(abi.encodePacked(oneoffVaults.liquid[j]))
        ) {
          checkFlag = false;
        }
      }

      if (checkFlag) {
        oneoffVaults.liquid.push(strategies.liquid_vault[i]);
      }
    }
  }

  function accountStratagyLockedCheck(
    AccountStrategies storage strategies,
    OneOffVaults storage oneoffVaults
  ) public {
    for (uint256 i = 0; i < strategies.locked_vault.length; i++) {
      bool checkFlag = true;
      for (uint256 j = 0; j < oneoffVaults.locked.length; j++) {
        if (
          keccak256(abi.encodePacked(strategies.locked_vault[i])) ==
          keccak256(abi.encodePacked(oneoffVaults.locked[j]))
        ) {
          checkFlag = false;
        }
      }

      if (checkFlag) {
        oneoffVaults.locked.push(strategies.locked_vault[i]);
      }
    }
  }

  function accountStrategiesDefaut() public pure returns (AccountStrategies memory) {
    AccountStrategies memory empty;
    return empty;
  }

  //TODO: handle the case when we invest into vault or redem from vault
  struct OneOffVaults {
    string[] locked;
    uint256[] lockedAmount;
    string[] liquid;
    uint256[] liquidAmount;
  }

  function removeLast(string[] storage vault, string memory remove) public {
    for (uint256 i = 0; i < vault.length - 1; i++) {
      if (keccak256(abi.encodePacked(vault[i])) == keccak256(abi.encodePacked(remove))) {
        vault[i] = vault[vault.length - 1];
        break;
      }
    }

    vault.pop();
  }

  function oneOffVaultsDefault() public pure returns (OneOffVaults memory) {
    OneOffVaults memory empty;
    return empty;
  }

  function checkTokenInOffVault(
    string[] storage availible,
    uint256[] storage cerAvailibleAmount,
    string memory token
  ) public {
    bool check = true;
    for (uint8 j = 0; j < availible.length; j++) {
      if (keccak256(abi.encodePacked(availible[j])) == keccak256(abi.encodePacked(token))) {
        check = false;
      }
    }
    if (check) {
      availible.push(token);
      cerAvailibleAmount.push(0);
    }
  }

  struct Coin {
    string denom;
    uint128 amount;
  }

  struct CoinVerified {
    uint128 amount;
    address addr;
  }

  struct GenericBalance {
    uint256 coinNativeAmount;
    mapping(address => uint256) balancesByToken;
  }

  function addToken(GenericBalance storage temp, address tokenAddress, uint256 amount) public {
    temp.balancesByToken[tokenAddress] += amount;
  }

  function subToken(GenericBalance storage temp, address tokenAddress, uint256 amount) public {
    temp.balancesByToken[tokenAddress] -= amount;
  }

  function deductTokens(uint256 amount, uint256 deductamount) public pure returns (uint256) {
    require(amount > deductamount, "Insufficient Funds");
    amount -= deductamount;
    return amount;
  }

  function getTokenAmount(
    address[] memory addresses,
    uint256[] memory amounts,
    address token
  ) public pure returns (uint256) {
    uint256 amount = 0;
    for (uint8 i = 0; i < addresses.length; i++) {
      if (addresses[i] == token) {
        amount = amounts[i];
      }
    }

    return amount;
  }

  struct TokenInfo {
    address addr;
    uint256 amnt;
  }

  struct BalanceInfo {
    GenericBalance locked;
    GenericBalance liquid;
  }

  ///TODO: need to test this same names already declared in other libraries
  struct EndowmentId {
    uint32 id;
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
    uint256 expiryHeight; // block equiv of the expiry_datetime
  }

  struct Wallet {
    string addr;
  }

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

  function beneficiaryDefault() public pure returns (Beneficiary memory) {
    Beneficiary memory temp = Beneficiary({
      enumData: BeneficiaryEnum.None,
      data: BeneficiaryData({endowId: 0, fundId: 0, addr: address(0)})
    });

    return temp;
  }

  struct SplitDetails {
    uint256 max;
    uint256 min;
    uint256 defaultSplit; // for when a user splits are not used
  }

  function checkSplits(
    SplitDetails memory splits,
    uint256 userLocked,
    uint256 userLiquid,
    bool userOverride
  ) public pure returns (uint256, uint256) {
    // check that the split provided by a user meets the endowment's
    // requirements for splits (set per Endowment)
    if (userOverride) {
      // ignore user splits and use the endowment's default split
      return (100 - splits.defaultSplit, splits.defaultSplit);
    } else if (userLiquid > splits.max) {
      // adjust upper range up within the max split threshold
      return (splits.max, 100 - splits.max);
    } else if (userLiquid < splits.min) {
      // adjust lower range up within the min split threshold
      return (100 - splits.min, splits.min);
    } else {
      // use the user entered split as is
      return (userLocked, userLiquid);
    }
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

  struct Ibc {
    string ica;
  }

  ///TODO: need to check this and have a look at this
  enum VaultType {
    Native, // Juno native Vault contract
    Ibc, // the address of the Vault contract on it's Cosmos(non-Juno) chain
    Evm, // the address of the Vault contract on it's EVM chain
    None
  }

  enum BoolOptional {
    False,
    True,
    None
  }

  struct Member {
    address addr;
    uint256 weight;
  }

  struct DurationData {
    uint256 height;
    uint256 time;
  }

  enum DurationEnum {
    Height,
    Time
  }

  struct Duration {
    DurationEnum enumData;
    DurationData data;
  }

  enum ExpirationEnum {
    atHeight,
    atTime,
    Never
  }

  struct ExpirationData {
    uint256 height;
    uint256 time;
  }

  struct Expiration {
    ExpirationEnum enumData;
    ExpirationData data;
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

  function delegateIsValid(
    Delegate storage delegate,
    address sender,
    uint256 envTime
  ) public view returns (bool) {
    return (delegate.addr != address(0) &&
      sender == delegate.addr &&
      (delegate.expires == 0 || envTime <= delegate.expires));
  }

  function canChange(
    SettingsPermission storage permissions,
    address sender,
    address owner,
    uint256 envTime
  ) public view returns (bool) {
    // Can be changed if both critera are satisfied:
    // 1. permission is not locked forever (read: `locked` == true)
    // 2. sender is a valid delegate address and their powers have not expired OR
    //    sender is the endow owner (ie. owner must first revoke their delegation)
    return (!permissions.locked &&
      (delegateIsValid(permissions.delegate, sender, envTime) || sender == owner));
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
    SettingsPermission categories;
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
    Categories,
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

  function validateFee(FeeSetting memory fee) public view {
    if (fee.payoutAddress == address(0)) {
      revert("Invalid fee payout zero address given");
    } else if (fee.bps > FEE_BASIS) {
      revert("Invalid fee basis points given. Should be between 0 and 10000.");
    }
  }

  uint256 constant FEE_BASIS = 10000; // gives 0.01% precision for fees (ie. Basis Points)
  
  enum Status {
    None,
    Pending,
    Open,
    Rejected,
    Passed,
    Executed
  }
  enum Vote {
    Yes,
    No,
    Abstain,
    Veto
  }
}
