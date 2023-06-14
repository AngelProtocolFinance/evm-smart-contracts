import dotenv from "dotenv";
import {ethers} from "ethers";
import {Config} from "./types";

dotenv.config({path: __dirname + "/./../.env"});

const config: Config = {
  AP_TEAM_MULTISIG_DATA: {
    threshold: 1,
    requireExecution: false,
  },
  APPLICATION_MULTISIG_DATA: {
    threshold: 1,
    requireExecution: false,
  },
  REGISTRAR_DATA: {
    taxRate: 1,
    acceptedTokens: {
      cw20: ["usdc"],
    },
    rebalance: {
      rebalanceLiquidInvestedProfits: false,
      lockedInterestsToLiquid: false,
      interest_distribution: 20,
      lockedPrincipleToLiquid: false,
      principle_distribution: 0,
    },
    splitToLiquid: {
      max: 100,
      min: 0,
      defaultSplit: 50,
    },
  },
  CHARITY_APPLICATION_DATA: {
    expiry: 0,
    seedSplitToLiquid: 0,
    newEndowGasMoney: false,
    gasAmount: 0,
    fundSeedAsset: false,
    seedAssetAmount: 100,
  },
  DONATION_MATCH_CHARITY_DATA: {
    reserveToken: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    poolFee: 300,
  },
  REGISTRAR_UPDATE_CONFIG: {
    collectorShare: 1,
  },
  INDEX_FUND_DATA: {
    fundRotation: 1000,
    fundMemberLimit: 30,
    fundingGoal: ethers.utils.parseUnits("10000", 6),
  },
  FundraisingDataInput: {
    nextId: 0,
    campaignPeriodSeconds: 10 * 24 * 60 * 60,
    taxRate: 10,
    acceptedTokens: {
      coinNativeAmount: 0,
      Cw20CoinVerified_amount: [],
      Cw20CoinVerified_addr: [],
    },
  },
  HALO_IMPLEMENTATION_DATA: {
    // curTimelock: "0x8747cF2bd9BB0F46ced4adA1b472E995d1A3174A",
    GovHodlerOwner: "0x8B1386F6fE42995Db5F7f7018af90496103CD39e",
    CommunitySpendLimit: 5000,
    distributorSpendLimit: 5000,
    // vestingOwner : "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    // vestingGenesisTime : 50000
  },
};

export default config;
