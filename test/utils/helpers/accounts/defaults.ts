import {ethers} from "hardhat";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsStrategy";
import {LibAccounts} from "typechain-types/contracts/multisigs/CharityApplications";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {BigNumber} from "ethers";
import {IVaultHelpers, DEFAULT_STRATEGY_SELECTOR} from "test/utils";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {IAccountsStrategy} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";


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
};

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
  gasFwd: ethers.constants.AddressZero,
};

export const DEFAULT_ACCOUNTS_CONFIG: AccountStorage.ConfigStruct = {
  owner: ethers.constants.AddressZero,
  networkName: "",
  version: "",
  registrarContract: ethers.constants.AddressZero,
  nextAccountId: 0,
  reentrancyGuardLocked: false,
};

export const DEFAULT_NETWORK_INFO: IAccountsStrategy.NetworkInfoStruct = {
  chainId: 0,
  router: ethers.constants.AddressZero,
  axelarGateway: ethers.constants.AddressZero,
  ibcChannel: "",
  transferChannel: "",
  gasReceiver: ethers.constants.AddressZero,
  gasLimit: 0,
};

export const DEFAULT_REGISTRAR_CONFIG: RegistrarStorage.ConfigStruct = {
  indexFundContract: ethers.constants.AddressZero,
  accountsContract: ethers.constants.AddressZero,
  treasury: ethers.constants.AddressZero,
  subdaoGovContract: ethers.constants.AddressZero, // Sub dao implementation
  subdaoTokenContract: ethers.constants.AddressZero, // NewERC20 implementation
  subdaoBondingTokenContract: ethers.constants.AddressZero, // Continous Token implementation
  subdaoCw900Contract: ethers.constants.AddressZero,
  subdaoDistributorContract: ethers.constants.AddressZero,
  subdaoEmitter: ethers.constants.AddressZero,
  donationMatchContract: ethers.constants.AddressZero,
  splitToLiquid: {max: 0, min: 0, defaultSplit: 0} as any,
  haloToken: ethers.constants.AddressZero,
  haloTokenLpContract: ethers.constants.AddressZero,
  govContract: ethers.constants.AddressZero,
  donationMatchEmitter: ethers.constants.AddressZero,
  collectorShare: BigNumber.from(50),
  charitySharesContract: ethers.constants.AddressZero,
  fundraisingContract: ethers.constants.AddressZero,
  uniswapRouter: ethers.constants.AddressZero,
  uniswapFactory: ethers.constants.AddressZero,
  lockedWithdrawal: ethers.constants.AddressZero,
  proxyAdmin: ethers.constants.AddressZero,
  usdcAddress: ethers.constants.AddressZero,
  wMaticAddress: ethers.constants.AddressZero,
  cw900lvAddress: ethers.constants.AddressZero,
  charityApplications: ethers.constants.AddressZero,
  multisigFactory: ethers.constants.AddressZero,
  multisigEmitter: ethers.constants.AddressZero,
  donationMatchCharitesContract: ethers.constants.AddressZero,
  gasFwdFactory: ethers.constants.AddressZero,
};

export const DEFAULT_INVEST_REQUEST: AccountMessages.InvestRequestStruct = {
  strategy: DEFAULT_STRATEGY_SELECTOR,
  token: "TKN",
  lockAmt: 0,
  liquidAmt: 0,
  gasFee: 0,
};

export const DEFAULT_REDEEM_REQUEST: AccountMessages.RedeemRequestStruct = {
  strategy: DEFAULT_STRATEGY_SELECTOR,
  token: "TKN",
  lockAmt: 0,
  liquidAmt: 0,
  gasFee: 0,
};

export const DEFAULT_REDEEM_ALL_REQUEST: AccountMessages.RedeemAllRequestStruct = {
  strategy: DEFAULT_STRATEGY_SELECTOR,
  token: "TKN",
  redeemLocked: false,
  redeemLiquid: false,
  gasFee: 0,
};

export const DEFAULT_STRATEGY_PARAMS: LocalRegistrarLib.StrategyParamsStruct = {
  approvalState: 0,
  network: "",
  Locked: {
    Type: 0,
    vaultAddr: ethers.constants.AddressZero,
  },
  Liquid: {
    Type: 1,
    vaultAddr: ethers.constants.AddressZero,
  },
};

export const DEFAULT_AP_PARAMS: LocalRegistrarLib.AngelProtocolParamsStruct = {
  refundAddr: ethers.constants.AddressZero,
  routerAddr: ethers.constants.AddressZero,
};

export const DEFAULT_ACTION_DATA: IVaultHelpers.VaultActionDataStruct = {
  destinationChain: "",
  strategyId: DEFAULT_STRATEGY_SELECTOR,
  selector: "",
  accountIds: [],
  token: "",
  lockAmt: 0,
  liqAmt: 0,
  status: 0,
}
