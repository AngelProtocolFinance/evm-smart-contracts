// Env handling: 
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "../.env") });


const DEPLOYER: string | undefined = process.env.DEPLOYER_KEY;
if (!DEPLOYER) {
  throw new Error("Please set your DEPLOYER_KEY in a .env file");
}

const PROXYADMIN: string | undefined = process.env.PROXY_ADMIN_KEY;
if (!PROXYADMIN) {
  throw new Error("Please set your USER_KEY in a .env file");
}

const AP_TEAM_1: string | undefined = process.env.AP_TEAM_1_KEY;
if (!AP_TEAM_1) {
  throw new Error("Please set your USER_KEY in a .env file");
}

const AP_TEAM_2: string | undefined = process.env.AP_TEAM_2_KEY;
if (!AP_TEAM_2) {
  throw new Error("Please set your USER_KEY in a .env file");
}

const AP_TEAM_3: string | undefined = process.env.AP_TEAM_3_KEY;
if (!AP_TEAM_3) {
  throw new Error("Please set your USER_KEY in a .env file");
}

const mainnetRPC: string | undefined = process.env.MAINNET_URL;
if (!mainnetRPC) {
  throw new Error("Please set your MAINNET_URL in a .env file");
}

const goerliRPC: string | undefined = process.env.GOERLI_RPC_URL
if (!goerliRPC) {
  throw new Error("Please set the alchemy GoArby RPC url the .env file")
}

const polygonRPC: string | undefined = process.env.POLYGON_RPC_URL;
if (!polygonRPC) {
  throw new Error("Please set your MAINNET_URL in a .env file");
}

const mumbaiRPC: string | undefined = process.env.MUMBAI_RPC_URL;
if (!mumbaiRPC) {
  throw new Error("Please set the alchemy GoArby RPC url the .env file");
}

const etherscanAPIKey: string | undefined = process.env.ETHERSCAN_API_KEY;
if (!etherscanAPIKey) {
  throw new Error("Please add the Etherscan API key to your .env file");
}

const polyscanAPIKey: string | undefined = process.env.POLYSCAN_API_KEY;
if (!polyscanAPIKey) {
  throw new Error("Please add the Etherscan API key to your .env file");
}

// HALO Deploy && DeployTask script env vars needed
const PROD: boolean = process.env.PROD;
const HALO_IMPLEMENTATION_DATA = {
  curTimelock: "0x8747cF2bd9BB0F46ced4adA1b472E995d1A3174A",
  GovHodlerOwner: "0x8B1386F6fE42995Db5F7f7018af90496103CD39e",
  airdropOwner: process.env.AP_TEAM_1_ADDRESS,
  CommunitySpendLimit: 5000,
  distributorWhitelist: [
    process.env.AP_TEAM_2_ADDRESS,
    process.env.AP_TEAM_3_ADDRESS,
  ],
  distributorSpendLimit: 5000,
  // vestingOwner : "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  // vestingGenesisTime : 50000
};
const AP_TEAM_MULTISIG_DATA = {
  admins: [process.env.AP_TEAM_1_ADDRESS, process.env.AP_TEAM_2_ADDRESS],
  threshold: 1,
  requireExecution: false,
};
const TIME_LOCK_ADMIN = process.env.AP_TEAM_1_ADDRESS;
const APPLICATION_MULTISIG_DATA = {
  admins: [process.env.AP_TEAM_2_ADDRESS, process.env.AP_TEAM_3_ADDRESS],
  threshold: 1,
  requireExecution: false,
};
const REGISTRAR_DATA = {
  treasury: process.env.AP_TEAM_1_ADDRESS,
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
  router: process.env.AP_TEAM_1_ADDRESS,
  axelerGateway: "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
};
const DONATION_MATCH_CHARITY_DATA = {
  reserveToken: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  uniswapFactory: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  registrarContract: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  poolFee: 300,
  usdcAddress: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
  DAI_address: "",
};
const REGISTRAR_UPDATE_CONFIG = {
  collectorShare: 1,
  haloTokenLpContract: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  wethAddress: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
  usdcAddress: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
  DAI_address: "",
};
const CHARITY_APPLICATION_DATA = {
  expiry: 0,
  seedSplitToLiquid: 0,
  newEndowGasMoney: false,
  gasAmount: 0,
  fundSeedAsset: false,
  seedAsset: "0x06499E212Ce9F9D4a2147e82242F137c5e32f8C8",
  seedAssetAmount: 100,
};
const SWAP_ROUTER_DATA = {
  SWAP_FACTORY_ADDRESS: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
  SWAP_ROUTER_ADDRESS: "0x0c00F32a3603ba39f6D1eACD21a0D60d2c58675c",
};
const INDEX_FUND_DATA = {
  fundRotation: 1000,
  fundMemberLimit: 30,
  fundingGoal: 10000 * 10^16,
};
const FundraisingDataInput = {
  nextId: 0,
  campaignPeriodSeconds: 10 * 24 * 60 * 60,
  taxRate: 10,
  acceptedTokens: {
    coinNativeAmount: 0,
    Cw20CoinVerified_amount: [],
    Cw20CoinVerified_addr: [],
  },
};

export var accounts = [DEPLOYER, PROXYADMIN, AP_TEAM_1, AP_TEAM_2, AP_TEAM_3];

export var envConfig = {
  DEPLOYER: DEPLOYER,
  PROXYADMIN: PROXYADMIN,
  AP_TEAM_1: AP_TEAM_1,
  AP_TEAM_2: AP_TEAM_2,
  AP_TEAM_3: AP_TEAM_3,
  mainnetRPC: mainnetRPC,
  goerliRPC: goerliRPC,
  polygonRPC: polygonRPC,
  mumbaiRPC: mumbaiRPC,
  etherscanAPIKey: etherscanAPIKey,
  polyscanAPIKey: polyscanAPIKey,
  // used in deploy scripts
  PROD: PROD,
  HALO_IMPLEMENTATION_DATA: HALO_IMPLEMENTATION_DATA,
  AP_TEAM_MULTISIG_DATA: AP_TEAM_MULTISIG_DATA,
  REGISTRAR_DATA: REGISTRAR_DATA,
  REGISTRAR_UPDATE_CONFIG: REGISTRAR_UPDATE_CONFIG,
  DONATION_MATCH_CHARITY_DATA: DONATION_MATCH_CHARITY_DATA,
  APPLICATION_MULTISIG_DATA: APPLICATION_MULTISIG_DATA,
  CHARITY_APPLICATION_DATA: CHARITY_APPLICATION_DATA,
  SWAP_ROUTER_DATA: SWAP_ROUTER_DATA,
  INDEX_FUND_DATA: INDEX_FUND_DATA,
};
