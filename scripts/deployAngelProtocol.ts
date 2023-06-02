import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {deploySwapRouter} from "contracts/core/swap-router/scripts/deploy";
import {ADDRESS_ZERO, envConfig, isLocalNetwork, updateAddresses} from "utils";
// import { deployHaloImplementation } from "contracts/halo/scripts/deploy"
import {charityApplications} from "contracts/multisigs/charity_applications/scripts/deploy";
import {deployAPTeamMultiSig, deployApplicationsMultiSig} from "contracts/multisigs/scripts/deploy";
import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";
// import { deployFundraising } from "contracts/accessory/fundraising/scripts/deploy"
import config from "config";
// import {deployEmitters} from "contracts/normalized_endowment/scripts/deployEmitter";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ERC20, ERC20__factory, IndexFund__factory, Registrar__factory} from "typechain-types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";
import {cleanAddresses} from "utils";
import {getSigners} from "utils/getSigners";
import {deployLibraries} from "./deployLibraries";
import {deployMockUSDC} from "./deployMockUSDC";
import {deployDonationMatchContracts} from "contracts/normalized_endowment/donation-match/scripts/deploy";

export async function deployAngelProtocol(
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const {network, ethers} = hre;

  const {proxyAdmin, treasury} = await getSigners(ethers);

  await cleanAddresses(hre);

  console.log("Deploying the contracts with the account:", proxyAdmin.address);

  // Mock setup required for testing
  const usdcToken = isLocalNetwork(network)
    ? await deployMockUSDC(proxyAdmin, hre)
    : await connectUSDC(hre);

  const {angelCoreStruct, stringLib} = await deployLibraries(verify_contracts, hre);

  const apTeamMultisig = await deployAPTeamMultiSig(verify_contracts, hre);

  const applicationsMultiSig = await deployApplicationsMultiSig(verify_contracts, hre);

  const registrarData = {
    treasury: treasury.address,
    taxRate: config.REGISTRAR_DATA.taxRate,
    rebalance: config.REGISTRAR_DATA.rebalance,
    splitToLiquid: config.REGISTRAR_DATA.splitToLiquid,
    acceptedTokens: config.REGISTRAR_DATA.acceptedTokens,
    router: ADDRESS_ZERO,
    axelarGateway: config.REGISTRAR_DATA.axelarGateway,
    axelarGasRecv: config.REGISTRAR_DATA.axelarGasRecv,
  };

  const registrar = await deployRegistrar(
    registrarData,
    apTeamMultisig.proxy.address,
    verify_contracts,
    hre
  );

  // Router deployment includes updating Registrar config's "router" address
  const router = await deployRouter(
    config.REGISTRAR_DATA.axelarGateway,
    config.REGISTRAR_DATA.axelarGasRecv,
    registrar.proxy.address,
    apTeamMultisig.proxy.address,
    verify_contracts,
    hre
  );

  const accountsDiamond = await deployAccountsDiamond(
    apTeamMultisig.proxy.address,
    registrar.proxy.address,
    angelCoreStruct.address,
    verify_contracts,
    hre
  );

  const {donationMatch, donationMatchCharity, donationMatchEmitter} =
    await deployDonationMatchContracts(
      accountsDiamond.address,
      registrar.proxy.address,
      usdcToken.address,
      verify_contracts,
      hre
    );

  const charityApplicationsData: Parameters<typeof charityApplications>[0] = [
    config.CHARITY_APPLICATION_DATA.expiry,
    applicationsMultiSig.proxy.address,
    accountsDiamond.address,
    config.CHARITY_APPLICATION_DATA.seedSplitToLiquid,
    config.CHARITY_APPLICATION_DATA.newEndowGasMoney,
    config.CHARITY_APPLICATION_DATA.gasAmount,
    config.CHARITY_APPLICATION_DATA.fundSeedAsset,
    config.CHARITY_APPLICATION_DATA.seedAsset,
    config.CHARITY_APPLICATION_DATA.seedAssetAmount,
  ];

  const charityApplicationsAddress = await charityApplications(
    charityApplicationsData,
    verify_contracts,
    hre
  );
  console.log("charityApplicationsAddress deployed at:-", charityApplicationsAddress);

  const SWAP_ROUTER = await deploySwapRouter(
    registrar.proxy.address,
    accountsDiamond.address,
    config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS,
    config.SWAP_ROUTER_DATA.SWAP_ROUTER_ADDRESS,
    verify_contracts,
    hre
  );

  console.log("SWAP_ROUTER contract deployed at:-", SWAP_ROUTER);

  const indexFundData = {
    registrarContract: registrar.proxy.address,
    fundRotation: config.INDEX_FUND_DATA.fundRotation,
    fundMemberLimit: config.INDEX_FUND_DATA.fundMemberLimit,
    fundingGoal: config.INDEX_FUND_DATA.fundingGoal,
  };

  const INDEX_FUND_ADDRESS = await deployIndexFund(
    indexFundData,
    apTeamMultisig.proxy.address,
    verify_contracts,
    hre
  );

  console.log("INDEX_FUND_ADDRESS contract deployed at:-", INDEX_FUND_ADDRESS);

  const multisigDat = await deployEndowmentMultiSig(verify_contracts, hre);

  console.log("multisigDat contract deployed at:-", multisigDat);
  // console.log('implementations deployed at:', implementations);

  // const GiftCardDataInput = {
  //     keeper: apTeamMultisig.proxy.address,
  //     registrarContract: REGISTRAR_ADDRESS,
  // }

  // const giftCardAddress = await giftCard(GiftCardDataInput, ANGEL_CORE_STRUCT.address, verify_contracts, hre)

  // const FundraisingDataInput = {
  //     registrarContract: REGISTRAR_ADDRESS,
  //     nextId: config.FundraisingDataInput.nextId,
  //     campaignPeriodSeconds: config.FundraisingDataInput.campaignPeriodSeconds,
  //     taxRate: config.FundraisingDataInput.taxRate,
  //     acceptedTokens: config.FundraisingDataInput.acceptedTokens,
  // }
  // const fundraisingAddress = await deployFundraising(
  //     FundraisingDataInput,
  //     ANGEL_CORE_STRUCT.address,
  //     verify_contracts,
  //     hre
  // )

  // TODO:
  // UNCOMMENT WHEN HALO CONTRACTS ARE READY FOR DEPLOYMENT
  //
  // var haloAddress = await deployHaloImplementation(SWAP_ROUTER, verify_contracts, hre)

  // addressWriter.haloAddress = haloAddress

  // const haloToken = ERC20__factory.connect(haloAddress.Halo, proxyAdmin)

  // console.log("halo token deployed at: ", haloToken.address)

  // console.log("halo token balance: ", await haloToken.balanceOf(proxyAdmin.address))

  // if (isLocalNetwork(network)) {
  //     const UniswapUtils = new UniswapUtils__factory(proxyAdmin)
  //     const uniswap_utils = await UniswapUtils.deploy()
  //     await uniswap_utils.deployed()

  //     // create a uniswap pool for HALO and USDC
  //     console.log("halo", haloToken.address.toString())
  //     console.log("usdc", usdcToken.address.toString())
  //     const sqrtPrice = "79228162514264334008320"
  //     if (usdcToken.address < haloToken.address.toString()) {
  //         sqrtPrice = "79228162514264337593543950336000000"
  //     }
  //     const createUniswapPoolParams = {
  //         projectToken: haloToken.address,
  //         usdcToken: usdcToken.address,
  //         uniswapFee: 3000,
  //         amountA: ethers.utils.parseEther("100000000"),
  //         amountB: ethers.utils.parseUnits("100000000", 6),
  //         sqrtPriceX96: sqrtPrice,
  //         tickLower: "-598680",
  //         tickUpper: "506580",
  //     }
  //     haloToken.approve(uniswap_utils.address, ethers.utils.parseEther("100000000"))
  //     usdcToken.approve(uniswap_utils.address, ethers.utils.parseUnits("100000000", 6))
  //     await uniswap_utils.createPoolAndMintPositionErC20(createUniswapPoolParams)

  //     console.log("Created HALO pool")

  //     // create a uniswap pool for WETH and USDC
  //     console.log("WETH address: ", config.REGISTRAR_UPDATE_CONFIG.wethAddress)
  //     console.log("USDC address: ", usdcToken.address.toString())

  //     sqrtPrice = "79228162514264334008320"
  //     if (usdcToken.address < config.REGISTRAR_UPDATE_CONFIG.wethAddress) {
  //         sqrtPrice = "79228162514264337593543950336000000"
  //     }
  //     const createUniswapPoolParams2 = {
  //         tokenA: usdcToken.address,
  //         tokenB: config.REGISTRAR_UPDATE_CONFIG.wethAddress,
  //         uniswapFee: 3000,
  //         amountA: ethers.utils.parseUnits("1000", 6),
  //         sqrtPriceX96: sqrtPrice,
  //         tickLower: "-598680",
  //         tickUpper: "506580",
  //     }
  //     usdcToken.approve(uniswap_utils.address, ethers.utils.parseUnits("1000", 6))
  //     await uniswap_utils.createPoolAndMintPosition(createUniswapPoolParams2, {
  //         value: ethers.utils.parseEther("1000"),
  //     })

  //     console.log("Created WETH pool")

  //     // deploy DAI
  //     const DAI = new MockERC20__factory(proxyAdmin)
  //     const dai = await DAI.deploy("DAI", "DAI", "1000000000")
  //     await dai.deployed()
  //     config.REGISTRAR_UPDATE_CONFIG.DAI_address = dai.address
  //     config.DONATION_MATCH_CHARITY_DATA.DAI_address = dai.address
  //     config.REGISTRAR_DATA.acceptedTokens.cw20.push(dai.address)

  //     // mint DAI
  //     await dai.mint(proxyAdmin.address, ethers.utils.parseEther("100000000"))

  //     console.log(dai.address)

  //     // create a uniswap pool for DAI and USDC
  //     sqrtPrice = "79228162514264334008320"
  //     if (usdcToken.address < dai.address.toString()) {
  //         sqrtPrice = "79228162514264337593543950336000000"
  //     }
  //     const createUniswapPoolParams3 = {
  //         projectToken: dai.address,
  //         usdcToken: usdcToken.address,
  //         uniswapFee: 3000,
  //         amountA: ethers.utils.parseEther("100000000"),
  //         amountB: ethers.utils.parseUnits("100000000", 6),
  //         sqrtPriceX96: sqrtPrice,
  //         tickLower: "-598680",
  //         tickUpper: "506580",
  //     }
  //     dai.approve(uniswap_utils.address, ethers.utils.parseEther("100000000"))
  //     usdcToken.approve(uniswap_utils.address, ethers.utils.parseUnits("100000000", 6))
  //     await uniswap_utils.createPoolAndMintPositionErC20(createUniswapPoolParams3)
  //     console.log("Created DAI pool")
  // }

  //  requires setting up of a HALO - usdcToken pool on forked uniswap in deployment
  // if on non-production network

  const donationMatchCharityData = {
    reserveToken: config.DONATION_MATCH_CHARITY_DATA.reserveToken,
    uniswapFactory: config.DONATION_MATCH_CHARITY_DATA.uniswapFactory,
    registrarContract: registrar.proxy.address,
    poolFee: config.DONATION_MATCH_CHARITY_DATA.poolFee,
    usdcAddress: usdcToken.address,
  };

  if (isLocalNetwork(network)) {
    // haloToken
    // donationMatchCharityData.reserveToken = haloToken.address
    donationMatchCharityData.uniswapFactory = config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS;
    donationMatchCharityData.poolFee = 3000;
  }

  // transfer 100000000 HALO to donation match charities

  const implementations = await deployImplementation(
    angelCoreStruct.address,
    verify_contracts,
    hre
  );

  // if (isLocalNetwork(network)) {
  //     await haloToken.transfer(implementations.donationMatchCharity.proxy, ethers.utils.parseEther("100000000"))
  // }

  // config.REGISTRAR_DATA.acceptedTokens.cw20.push(haloToken.address)

  const updateConfig: RegistrarMessages.UpdateConfigRequestStruct = {
    accountsContract: accountsDiamond.address, //Address
    approved_charities: [], //string[]
    splitMax: config.REGISTRAR_DATA.splitToLiquid.max, //uint256
    splitMin: config.REGISTRAR_DATA.splitToLiquid.min, //uint256
    splitDefault: config.REGISTRAR_DATA.splitToLiquid.defaultSplit, //uint256
    collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare, //uint256
    subdaoGovContract: implementations.subDao.implementation, //address
    subdaoTokenContract: implementations.subDao.token, //address
    subdaoBondingTokenContract: implementations.subDao.veBondingToken, //address
    subdaoCw900Contract: implementations.incentivisedVotingLockup.implementation, //address
    subdaoDistributorContract: ethers.constants.AddressZero,
    subdaoEmitter: ethers.constants.AddressZero, //TODO:
    donationMatchContract: donationMatch.proxy.address, //address
    indexFundContract: INDEX_FUND_ADDRESS, //address
    govContract: ethers.constants.AddressZero, //address
    treasury: treasury.address,
    donationMatchCharitesContract: donationMatchCharity.proxy.address, // once uniswap is setup //address
    donationMatchEmitter: donationMatchEmitter.proxy.address,
    haloToken: ethers.constants.AddressZero, //address
    haloTokenLpContract: config.REGISTRAR_UPDATE_CONFIG.haloTokenLpContract, //address
    charitySharesContract: ethers.constants.AddressZero, //TODO: //address
    fundraisingContract: ethers.constants.AddressZero, //TODO: //address
    applicationsReview: applicationsMultiSig.proxy.address, //address
    swapsRouter: SWAP_ROUTER, //address
    multisigFactory: multisigDat.MultiSigWalletFactory, //address
    multisigEmitter: multisigDat.EndowmentMultiSigEmitter, //address
    charityProposal: charityApplicationsAddress, //address
    lockedWithdrawal: ethers.constants.AddressZero,
    proxyAdmin: proxyAdmin.address, //address
    usdcAddress: config.REGISTRAR_UPDATE_CONFIG.usdcAddress, //address
    wethAddress: config.REGISTRAR_UPDATE_CONFIG.wethAddress,
    cw900lvAddress: implementations.cw900lv,
  };

  const REGISTRAR_CONTRACT = Registrar__factory.connect(registrar.proxy.address, proxyAdmin);

  const data = await REGISTRAR_CONTRACT.updateConfig(updateConfig);
  console.log("Successfully updated config:-", data.hash);

  const newOwner = await REGISTRAR_CONTRACT.transferOwnership(apTeamMultisig.proxy.address);
  console.log("Successfully transferred Ownership:-", newOwner.hash);

  const INDEX_FUND_CONTRACT = IndexFund__factory.connect(INDEX_FUND_ADDRESS, proxyAdmin);

  const new_owner_index = await INDEX_FUND_CONTRACT.updateOwner(apTeamMultisig.proxy.address);
  console.log("Successfully transferred Ownership:-", new_owner_index.hash);
}

async function connectUSDC(hre: HardhatRuntimeEnvironment): Promise<ERC20> {
  const {proxyAdmin} = await getSigners(hre.ethers);
  const usdcAddress =
    hre.network.name === "mumbai" ? envConfig.USDC_ADDRESS_MUMBAI : envConfig.USDC_ADDRESS;
  const usdc = ERC20__factory.connect(usdcAddress, proxyAdmin);

  await updateAddresses({tokens: {usdc: usdc.address}}, hre);

  return usdc;
}
