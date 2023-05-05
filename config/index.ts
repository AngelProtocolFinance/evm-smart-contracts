import dotenv from "dotenv"
import { ethers } from "ethers"

dotenv.config({ path: __dirname + "/./../.env" })

const EXPORT_CONFIG = {
    ACCOUNT_PRIVATE_KEY: process.env.ACCOUNT_PRIVATE_KEY,
    GANACHE_PRIVATE_KEY: process.env.GANACHE_PRIVATE_KEY,
    GANACHE_RPC_URL: process.env.GANACHE_RPC_URL,
    NETWORK: process.env.NETWORK,
    OPTIMIZER_FLAG: process.env.OPTIMIZER_FLAG,
    OPTIMIZER_RUNS: process.env.OPTIMIZER_RUNS,
    PROD: process.env.PROD,
    PROXY_ADMIN_KEY: process.env.PROXY_ADMIN_KEY,
    ROUTER_ADDRESS: process.env.ROUTER_ADDRESS,
    SCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    VERIFY_CONTRACTS: process.env.VERIFY_CONTRACTS,
    PROXY_ADMIN_ADDRESS: "0x3304eD6a8D90Ab57bb7b797aF9f66447CDf09C3E", // AP Deployer
    AP_TEAM_MULTISIG_DATA: {
        admins: [
            "0xce551C1125BfCdAb88048854522D0B220f41A6Ff",
            "0x51d0e5cffb5748dD17f1E133C72E48fa94685bEc",
        ], // AP Team 1 and 2
        threshold: 1,
        requireExecution: false,
    },
    TIME_LOCK_ADMIN: "0xce551C1125BfCdAb88048854522D0B220f41A6Ff", // AP Team 1
    APPLICATION_MULTISIG_DATA: {
        admins: [
            "0x51d0e5cffb5748dD17f1E133C72E48fa94685bEc",
            "0x06eB8fcC1E02e06c0b6A47c396f14C5761C47433",
        ], // AP Team 2 and 3
        threshold: 1,
        requireExecution: false,
    },
    REGISTRAR_DATA: {
        treasury: "0xce551C1125BfCdAb88048854522D0B220f41A6Ff", // AP team 1
        taxRate: 1,
        acceptedTokens: {
            cw20: [
                "0xaBCe32FBA4C591E8Ea5A5f711F7112dC08BCee74", 
                "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747"],
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
        router: "0xce551C1125BfCdAb88048854522D0B220f41A6Ff",
        axelerGateway: "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B",
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
        wethAddress: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
        usdcAddress: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
        DAI_address: "",
    },
    SWAP_ROUTER_DATA: {
        SWAP_FACTORY_ADDRESS: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
        SWAP_ROUTER_ADDRESS: "0x0c00F32a3603ba39f6D1eACD21a0D60d2c58675c",
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
        airdropOwner: "0xce551C1125BfCdAb88048854522D0B220f41A6Ff",
        CommunitySpendLimit: 5000,
        distributorAllowlist: [
            "0x51d0e5cffb5748dD17f1E133C72E48fa94685bEc",
            "0x06eB8fcC1E02e06c0b6A47c396f14C5761C47433",
        ],
        distributorSpendLimit: 5000,
        // vestingOwner : "0x1F98431c8aD98523631AE4a59f267346ea31F984",
        // vestingGenesisTime : 50000
    },
}

export default EXPORT_CONFIG
