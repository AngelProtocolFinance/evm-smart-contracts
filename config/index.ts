import dotenv from "dotenv";
import {ethers} from "ethers";
import {Config} from "./types";
import {BigNumber} from "ethers";
dotenv.config({path: __dirname + "/./../.env"});

const config: Config = {
  AP_TEAM_MULTISIG_DATA: {
    threshold: 1,
    requireExecution: false,
    transactionExpiry: 604800,
  },
  PROXY_ADMIN_MULTISIG_DATA: {
    threshold: 1,
    requireExecution: false,
    transactionExpiry: 0,
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
  },
  CHARITY_APPLICATIONS_DATA: {
    threshold: 1,
    requireExecution: false,
    transactionExpiry: 345600,
    seedSplitToLiquid: 0,
    gasAmount: BigNumber.from("180000000000000000"), // 0.18 Ether
    seedAmount: 0,
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
  PROD_CONFIG: {
    APTeamMultiSigOwners: [
      "0xF71eba1cf57997B6C52eA33D7939A330D6D85502",
      "0x165d1f1361490974ea2F2A4079b5828E81F13b11",
      "0x109641d919da899c7bd1ce27413d0c02b3bb611d",
      "0x13C9060a611e4277a93ca259068256271fC2d7B4",
    ],
    CharityApplicationsOwners: [
      "0xF71eba1cf57997B6C52eA33D7939A330D6D85502",
      "0x165d1f1361490974ea2F2A4079b5828E81F13b11",
      "0x13C9060a611e4277a93ca259068256271fC2d7B4",
    ],
    Treasury: "0x4C6cDdFC00064D73E64B34aE453884de1Bf6D639",
  },
};

export default config;
