import dotenv from "dotenv";
import {ethers} from "ethers";
import {Config} from "./types";

dotenv.config({path: __dirname + "/./../.env"});

const config: Config = {
  AP_TEAM_MULTISIG_DATA: {
    threshold: 1,
    requireExecution: false,
    transactionExpiry: 100000,
  },
  REGISTRAR_DATA: {
    taxRate: 1,
    acceptedTokens: {
      erc20: ["usdc"],
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
  CHARITY_APPLICATIONS_DATA: {
    threshold: 1,
    requireExecution: false,
    transactionExpiry: 100000,
    seedSplitToLiquid: 0,
    gasAmount: 0,
    seedAmount: 100,
  },
  DONATION_MATCH_CHARITY_DATA: {
    poolFee: 300,
  },
  REGISTRAR_UPDATE_CONFIG: {
    collectorShare: 1,
  },
  INDEX_FUND_DATA: {
    fundRotation: 0,
    fundMemberLimit: 30,
    fundingGoal: ethers.utils.parseUnits("10000", 6),
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
