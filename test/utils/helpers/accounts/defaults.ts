import {ethers} from "hardhat";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {LibAccounts} from "typechain-types/contracts/multisigs/CharityApplications";
import {IAccountsStrategy, IRegistrar} from "typechain-types";
import {NetworkInfoStruct} from "../types";

export const DEFAULT_PERMISSIONS_STRUCT: LibAccounts.SettingsPermissionStruct = {
  locked: false,
  delegate: {
    addr: ethers.constants.AddressZero,
    expires: 0,
  },
};

export const DEFAULT_SETTINGS_STRUCT: LibAccounts.SettingsControllerStruct = {
    acceptedTokens: DEFAULT_PERMISSIONS_STRUCT,
    lockedInvestmentManagement: DEFAULT_PERMISSIONS_STRUCT,
    liquidInvestmentManagement: DEFAULT_PERMISSIONS_STRUCT,
    allowlistedBeneficiaries: DEFAULT_PERMISSIONS_STRUCT,
    allowlistedContributors: DEFAULT_PERMISSIONS_STRUCT,
    maturityAllowlist: DEFAULT_PERMISSIONS_STRUCT,
    maturityTime: DEFAULT_PERMISSIONS_STRUCT,
    earlyLockedWithdrawFee: DEFAULT_PERMISSIONS_STRUCT,
    withdrawFee: DEFAULT_PERMISSIONS_STRUCT,
    depositFee: DEFAULT_PERMISSIONS_STRUCT,
    balanceFee: DEFAULT_PERMISSIONS_STRUCT,
    name: DEFAULT_PERMISSIONS_STRUCT,
    image: DEFAULT_PERMISSIONS_STRUCT,
    logo: DEFAULT_PERMISSIONS_STRUCT,
    sdgs: DEFAULT_PERMISSIONS_STRUCT,
    splitToLiquid: DEFAULT_PERMISSIONS_STRUCT,
    ignoreUserSplits: DEFAULT_PERMISSIONS_STRUCT,
}

export const DEFAULT_FEE_STRUCT: LibAccounts.FeeSettingStruct = {
  payoutAddress: ethers.constants.AddressZero,
  bps: 0,
};

export const DEFAULT_SPLIT_STRUCT: LibAccounts.SplitDetailsStruct = {
  max: 100,
  min: 0,
  defaultSplit: 50,
};

export const DEFAULT_CHARITY_ENDOWMENT: AccountStorage.EndowmentStruct = {
  owner: ethers.constants.AddressZero,
  name: "DEFAULT_PERMISSIONS_STRUCT",
  sdgs: [],
  tier: 0,
  endowType: 0,
  logo: "",
  image: "",
  maturityTime: 0,
  rebalance: {
    rebalanceLiquidProfits: true,
    lockedPrincipleToLiquid: false,
    interestDistribution: 0,
    lockedRebalanceToLiquid: 50,
    principleDistribution: 0,
    basis: 100,
  },
  proposalLink: 0,
  multisig: ethers.constants.AddressZero,
  dao: ethers.constants.AddressZero,
  daoToken: ethers.constants.AddressZero,
  donationMatchActive: false,
  donationMatchContract: ethers.constants.AddressZero,
  allowlistedBeneficiaries: [],
  allowlistedContributors: [],
  maturityAllowlist: [],
  earlyLockedWithdrawFee: DEFAULT_FEE_STRUCT,
  withdrawFee: DEFAULT_FEE_STRUCT,
  depositFee: DEFAULT_FEE_STRUCT,
  balanceFee: DEFAULT_FEE_STRUCT,
  settingsController: DEFAULT_SETTINGS_STRUCT,
  parent: 0,
  ignoreUserSplits: false,
  splitToLiquid: DEFAULT_SPLIT_STRUCT,
  referralId: 0,
};

export const DEFAULT_ACCOUNTS_CONFIG: AccountStorage.ConfigStruct = {
  owner: ethers.constants.AddressZero,
  networkName: "",
  version: "",
  registrarContract: ethers.constants.AddressZero,
  nextAccountId: 0,
  maxGeneralCategoryId: 0,
  subDao: ethers.constants.AddressZero,
  gateway: ethers.constants.AddressZero,
  gasReceiver: ethers.constants.AddressZero,
  reentrancyGuardLocked: false,
  earlyLockedWithdrawFee: DEFAULT_FEE_STRUCT,
};

export const DEFAULT_NETWORK_INFO: NetworkInfoStruct = {
  chainId: 0,
  router: ethers.constants.AddressZero,
  axelarGateway: ethers.constants.AddressZero,
  ibcChannel: "",
  transferChannel: "",
  gasReceiver: ethers.constants.AddressZero,
  gasLimit: 0,
};
