import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsStrategy";
import {LibAccounts} from "typechain-types/contracts/multisigs/CharityApplications";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {BigNumber} from "ethers";
import {DEFAULT_STRATEGY_SELECTOR} from "test/utils";
import {IVault} from "typechain-types/contracts/core/accounts/facets/AccountsStrategy";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {ADDRESS_ZERO} from "utils";
import {DEFAULT_NETWORK} from "../../constants";

export const DEFAULT_PERMISSIONS_STRUCT: LibAccounts.SettingsPermissionStruct = {
  locked: false,
  delegate: {
    addr: ADDRESS_ZERO,
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
  payoutAddress: ADDRESS_ZERO,
  bps: 0,
};

export const DEFAULT_SPLIT_STRUCT: LibAccounts.SplitDetailsStruct = {
  max: 100,
  min: 0,
  defaultSplit: 50,
};

export const DEFAULT_CHARITY_ENDOWMENT: AccountStorage.EndowmentStruct = {
  owner: ADDRESS_ZERO,
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
  multisig: ADDRESS_ZERO,
  dao: ADDRESS_ZERO,
  donationMatchActive: false,
  donationMatch: ADDRESS_ZERO,
  earlyLockedWithdrawFee: DEFAULT_FEE_STRUCT,
  withdrawFee: DEFAULT_FEE_STRUCT,
  depositFee: DEFAULT_FEE_STRUCT,
  balanceFee: DEFAULT_FEE_STRUCT,
  settingsController: DEFAULT_SETTINGS_STRUCT,
  parent: 0,
  ignoreUserSplits: false,
  splitToLiquid: DEFAULT_SPLIT_STRUCT,
  referralId: 0,
  gasFwd: ADDRESS_ZERO,
};

export const DEFAULT_ACCOUNTS_CONFIG: AccountStorage.ConfigStruct = {
  owner: ADDRESS_ZERO,
  networkName: "",
  version: "",
  registrarContract: ADDRESS_ZERO,
  nextAccountId: 0,
  reentrancyGuardLocked: false,
};

export const DEFAULT_NETWORK_INFO: LocalRegistrarLib.NetworkInfoStruct = {
  chainId: 0,
  router: ADDRESS_ZERO,
  axelarGateway: ADDRESS_ZERO,
  gasReceiver: ADDRESS_ZERO,
  refundAddr: ADDRESS_ZERO,
};

export const DEFAULT_REGISTRAR_CONFIG: RegistrarStorage.ConfigStruct = {
  accountsContract: ADDRESS_ZERO,
  apTeamMultisig: ADDRESS_ZERO,
  treasury: ADDRESS_ZERO,
  indexFundContract: ADDRESS_ZERO,
  haloToken: ADDRESS_ZERO,
  govContract: ADDRESS_ZERO,
  fundraisingContract: ADDRESS_ZERO,
  uniswapRouter: ADDRESS_ZERO,
  uniswapFactory: ADDRESS_ZERO,
  multisigFactory: ADDRESS_ZERO,
  multisigEmitter: ADDRESS_ZERO,
  charityApplications: ADDRESS_ZERO,
  proxyAdmin: ADDRESS_ZERO,
  usdcAddress: ADDRESS_ZERO,
  wMaticAddress: ADDRESS_ZERO,
  gasFwdFactory: ADDRESS_ZERO,
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
  network: DEFAULT_NETWORK,
  Locked: {
    Type: 0,
    vaultAddr: ADDRESS_ZERO,
  },
  Liquid: {
    Type: 1,
    vaultAddr: ADDRESS_ZERO,
  },
};

export const DEFAULT_ACTION_DATA: IVault.VaultActionDataStruct = {
  destinationChain: "",
  strategyId: DEFAULT_STRATEGY_SELECTOR,
  selector: "",
  accountIds: [],
  token: "",
  lockAmt: 0,
  liqAmt: 0,
  status: 0,
};
