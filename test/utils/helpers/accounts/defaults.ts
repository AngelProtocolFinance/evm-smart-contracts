import { ethers } from "hardhat"
import { AccountStorage } from "typechain-types/contracts/test/accounts/TestFacetProxyContract"
import { LibAccounts } from "typechain-types/contracts/multisigs/CharityApplications"

export const DEFAULT_PERMISSIONS_STRUCT: LibAccounts.SettingsPermissionStruct = {
  locked: false,
  delegate: {
    addr: ethers.constants.AddressZero,
    expires: 0,
  },
};

export const DEFAULT_FEE_STRUCT: LibAccounts.FeeSettingStruct = {
  payoutAddress: ethers.constants.AddressZero,
  bps: 0,
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
    basis: 100
  },
  pendingRedemptions: 0,
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
  settingsController: {
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
  },
  parent: 0,
  ignoreUserSplits: false,
  splitToLiquid: {
    max: 100,
    min: 0,
    defaultSplit: 50,
  },
  referralId: 0
};