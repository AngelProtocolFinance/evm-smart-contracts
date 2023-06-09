import dotenv from "dotenv";
import {ethers} from "ethers";

dotenv.config({path: __dirname + "/./../.env"});

const EXPORT_CONFIG = {
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
      cw20: [
        "0xaBCe32FBA4C591E8Ea5A5f711F7112dC08BCee74",
        "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
      ],
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
    axelarGateway: "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
    axelarGasRecv: "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
  },
  CHARITY_APPLICATION_DATA: {
    expiry: 0,
    seedSplitToLiquid: 0,
    newEndowGasMoney: false,
    gasAmount: 0,
    fundSeedAsset: false,
    seedAsset: "0x06499E212Ce9F9D4a2147e82242F137c5e32f8C8",
    seedAssetAmount: 100,
  },
  DONATION_MATCH_CHARITY_DATA: {
    reserveToken: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    uniswapFactory: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    registrarContract: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    poolFee: 300,
    usdcAddress: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
    DAI_address: "",
  },
  REGISTRAR_UPDATE_CONFIG: {
    collectorShare: 1,
    haloTokenLpContract: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    wmaticAddress: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    usdcAddress: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
    DAI_address: "",
  },
  SWAP_ROUTER_DATA: {
    UNISWAP_ROUTER_ADDRESS: "0x0c00F32a3603ba39f6D1eACD21a0D60d2c58675c",
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
    curTimelock: "0x8747cF2bd9BB0F46ced4adA1b472E995d1A3174A",
    GovHodlerOwner: "0x8B1386F6fE42995Db5F7f7018af90496103CD39e",
    CommunitySpendLimit: 5000,
    distributorSpendLimit: 5000,
    // vestingOwner : "0x1F98431c8aD98523631AE4a59f267346ea31F984",
    // vestingGenesisTime : 50000
  },
};

export default EXPORT_CONFIG;
