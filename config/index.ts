import {BigNumber, ethers} from "ethers";
import {Config} from "./types";

export const CONFIG: Config = {
  AP_TEAM_MULTISIG_DATA: {
    threshold: 1,
    requireExecution: false,
    transactionExpiry: 604800,
  },
  PROXY_ADMIN_MULTISIG_DATA: {
    threshold: 1,
    requireExecution: false,
    transactionExpiry: 345600,
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
    ProxyAdminMultiSigOwners: [
      "0xF71eba1cf57997B6C52eA33D7939A330D6D85502",
      "0x109641d919da899c7bd1ce27413d0c02b3bb611d",
      "0x0f6d331f26C0B64fc6EACddABd5645b55cf2d8e0",
    ],
    Treasury: "0x30f07D09F7f0E22be0a6879eF505dc810b76D6b6",
    GiftCardKeeper: "0x824477EE69d19Eb9B21725195Cc7eE22aCe5881C",
  },
};

export * from "./env.config";
export * from "./fees";
