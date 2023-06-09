// import { deployFundraising } from "contracts/accessory/fundraising/scripts/deploy"
import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {cleanAddresses, isLocalNetwork, logger} from "utils";

import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
import {deploySwapRouter} from "contracts/core/swap-router/scripts/deploy";
// import { deployHaloImplementation } from "contracts/halo/scripts/deploy"
import {deployCharityApplication} from "contracts/multisigs/charity_applications/scripts/deploy";
import {deployAPTeamMultiSig, deployApplicationsMultiSig} from "contracts/multisigs/scripts/deploy";
import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
// import {deployEmitters} from "contracts/normalized_endowment/scripts/deployEmitter";
// import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";

import {RegistrarMessages} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";

import {getSigners} from "utils/getSigners";

import {deployLibraries} from "./deployLibraries";
import {deployMockUSDC} from "./deployMockUSDC";
import {updateRegistrarNetworkConnection} from "./updateRegistrar";

export async function deployAngelProtocol(
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const {proxyAdmin, treasury, apTeamMultisigOwners} = await getSigners(hre);

  await cleanAddresses(hre);

  console.log("Deploying the contracts with the account:", proxyAdmin.address);

  // Mock setup required for testing
  const mockUSDC = isLocalNetwork(hre) ? await deployMockUSDC(proxyAdmin, hre) : undefined;

  const {angelCoreStruct, stringLib} = await deployLibraries(verify_contracts, hre);

  const apTeamMultisig = await deployAPTeamMultiSig(verify_contracts, hre);

  const applicationsMultiSig = await deployApplicationsMultiSig(verify_contracts, hre);

  const registrar = await deployRegistrar(
    hre.ethers.constants.AddressZero,
    apTeamMultisig.proxy.address,
    verify_contracts,
    hre
  );

  // Router deployment includes updating Registrar config's "router" address
  const router = await deployRouter(
    config.REGISTRAR_DATA.axelarGateway,
    config.REGISTRAR_DATA.axelarGasRecv,
    registrar.proxy.address,
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

  // const emitters = await deployEmitters(accountsDiamond.address, verify_contracts, hre);

  const charityApplication = await deployCharityApplication(
    applicationsMultiSig.proxy.address,
    accountsDiamond.address,
    verify_contracts,
    hre
  );

  const swapRouter = await deploySwapRouter(
    registrar.proxy.address,
    accountsDiamond.address,
    config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS,
    config.SWAP_ROUTER_DATA.SWAP_ROUTER_ADDRESS,
    verify_contracts,
    hre
  );

  const indexFund = await deployIndexFund(
    registrar.proxy.address,
    apTeamMultisig.proxy.address,
    verify_contracts,
    hre
  );

  const endowmentMultiSig = await deployEndowmentMultiSig(verify_contracts, hre);

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
  //     // if network is 'hardhat' then mockUSDC should always be initialized
  //     // but TS forces us to confirm this is the case
  //     mockUSDC = mockUSDC!

  //     const UniswapUtils = new UniswapUtils__factory(proxyAdmin)
  //     const uniswap_utils = await UniswapUtils.deploy()
  //     await uniswap_utils.deployed()

  //     // create a uniswap pool for HALO and USDC
  //     console.log("halo", haloToken.address.toString())
  //     console.log("usdc", mockUSDC.address.toString())
  //     const sqrtPrice = "79228162514264334008320"
  //     if (mockUSDC.address < haloToken.address.toString()) {
  //         sqrtPrice = "79228162514264337593543950336000000"
  //     }
  //     const createUniswapPoolParams = {
  //         projectToken: haloToken.address,
  //         usdcToken: mockUSDC.address,
  //         uniswapFee: 3000,
  //         amountA: ethers.utils.parseEther("100000000"),
  //         amountB: ethers.utils.parseUnits("100000000", 6),
  //         sqrtPriceX96: sqrtPrice,
  //         tickLower: "-598680",
  //         tickUpper: "506580",
  //     }
  //     haloToken.approve(uniswap_utils.address, ethers.utils.parseEther("100000000"))
  //     mockUSDC.approve(uniswap_utils.address, ethers.utils.parseUnits("100000000", 6))
  //     await uniswap_utils.createPoolAndMintPositionErC20(createUniswapPoolParams)

  //     console.log("Created HALO pool")

  //     // create a uniswap pool for WMATIC and USDC
  //     console.log("WMATIC address: ", config.REGISTRAR_UPDATE_CONFIG.wmaticAddress)
  //     console.log("USDC address: ", mockUSDC.address.toString())

  //     sqrtPrice = "79228162514264334008320"
  //     if (mockUSDC.address < config.REGISTRAR_UPDATE_CONFIG.wmaticAddress) {
  //         sqrtPrice = "79228162514264337593543950336000000"
  //     }
  //     const createUniswapPoolParams2 = {
  //         tokenA: mockUSDC.address,
  //         tokenB: config.REGISTRAR_UPDATE_CONFIG.wmaticAddress,
  //         uniswapFee: 3000,
  //         amountA: ethers.utils.parseUnits("1000", 6),
  //         sqrtPriceX96: sqrtPrice,
  //         tickLower: "-598680",
  //         tickUpper: "506580",
  //     }
  //     mockUSDC.approve(uniswap_utils.address, ethers.utils.parseUnits("1000", 6))
  //     await uniswap_utils.createPoolAndMintPosition(createUniswapPoolParams2, {
  //         value: ethers.utils.parseEther("1000"),
  //     })

  //     console.log("Created WMATIC pool")

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
  //     if (mockUSDC.address < dai.address.toString()) {
  //         sqrtPrice = "79228162514264337593543950336000000"
  //     }
  //     const createUniswapPoolParams3 = {
  //         projectToken: dai.address,
  //         usdcToken: mockUSDC.address,
  //         uniswapFee: 3000,
  //         amountA: ethers.utils.parseEther("100000000"),
  //         amountB: ethers.utils.parseUnits("100000000", 6),
  //         sqrtPriceX96: sqrtPrice,
  //         tickLower: "-598680",
  //         tickUpper: "506580",
  //     }
  //     dai.approve(uniswap_utils.address, ethers.utils.parseEther("100000000"))
  //     mockUSDC.approve(uniswap_utils.address, ethers.utils.parseUnits("100000000", 6))
  //     await uniswap_utils.createPoolAndMintPositionErC20(createUniswapPoolParams3)
  //     console.log("Created DAI pool")
  // }

  //  requires setting up of a HALO - MockUSDC pool on forked uniswap in deployment
  // if on non-production network

  // const donationMatchCharityData = {
  //   reserveToken: config.DONATION_MATCH_CHARITY_DATA.reserveToken,
  //   uniswapFactory: config.DONATION_MATCH_CHARITY_DATA.uniswapFactory,
  //   registrarContract: registrar.proxy.address,
  //   poolFee: config.DONATION_MATCH_CHARITY_DATA.poolFee,
  //   usdcAddress: config.DONATION_MATCH_CHARITY_DATA.usdcAddress,
  // };

  // if (isLocalNetwork(hre)) {
  //   // haloToken
  //   // donationMatchCharityData.reserveToken = haloToken.address
  //   donationMatchCharityData.uniswapFactory = config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS;
  //   donationMatchCharityData.poolFee = 3000;
  //   donationMatchCharityData.usdcAddress = mockUSDC!.address;
  // }

  // transfer 100000000 HALO to donation match charities

  // const implementations = await deployImplementation(
  //   angelCoreStruct.address,
  //   donationMatchCharityData,
  //   verify_contracts,
  //   hre
  // );

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
    subdaoGovContract: hre.ethers.constants.AddressZero, //address
    subdaoTokenContract: hre.ethers.constants.AddressZero, //address
    subdaoBondingTokenContract: hre.ethers.constants.AddressZero, //address
    subdaoCw900Contract: hre.ethers.constants.AddressZero, //address
    subdaoDistributorContract: hre.ethers.constants.AddressZero,
    subdaoEmitter: hre.ethers.constants.AddressZero, //TODO:
    donationMatchContract: hre.ethers.constants.AddressZero, //address
    indexFundContract: indexFund.proxy.address, //address
    govContract: hre.ethers.constants.AddressZero, //address
    treasury: treasury.address,
    donationMatchCharitesContract: hre.ethers.constants.AddressZero, // once uniswap is setup //address
    donationMatchEmitter: hre.ethers.constants.AddressZero,
    haloToken: hre.ethers.constants.AddressZero, //address
    haloTokenLpContract: config.REGISTRAR_UPDATE_CONFIG.haloTokenLpContract, //address
    charitySharesContract: hre.ethers.constants.AddressZero, //TODO: //address
    fundraisingContract: hre.ethers.constants.AddressZero, //TODO: //address
    applicationsReview: applicationsMultiSig.proxy.address, //address
    swapsRouter: swapRouter.proxy.address, //address
    multisigFactory: endowmentMultiSig.factory.address, //address
    multisigEmitter: endowmentMultiSig.emitter.proxy.contract.address, //address
    charityProposal: charityApplication.proxy.address, //address
    lockedWithdrawal: hre.ethers.constants.AddressZero,
    proxyAdmin: proxyAdmin.address, //address
    usdcAddress: mockUSDC ? mockUSDC.address : config.REGISTRAR_UPDATE_CONFIG.usdcAddress, //address
    wMaticAddress: config.REGISTRAR_UPDATE_CONFIG.wmaticAddress,
    cw900lvAddress: hre.ethers.constants.AddressZero,
  };

  console.log("Updating Registrar config with new addresses...");
  const registrarContract = Registrar__factory.connect(
    registrar.proxy.address,
    apTeamMultisigOwners[0]
  );
  const updateConfigData = registrarContract.interface.encodeFunctionData("updateConfig", [
    updateConfig,
  ]);
  const apTeamMultisigContract = APTeamMultiSig__factory.connect(
    apTeamMultisig.proxy.address,
    apTeamMultisigOwners[0]
  );
  const tx = await apTeamMultisigContract.submitTransaction(
    "Update Registrar config",
    "Update Registrar config",
    registrar.proxy.address,
    0,
    updateConfigData,
    "0x"
  );
  await tx.wait();
  console.log("Successfully updated config:-", tx.hash);

  // Registrar NetworkInfo's Router address must be updated for the current network
  const network = await hre.ethers.provider.getNetwork();
  logger.out(
    `Fetching current Registrar's network connection data for chain ID:${network.chainId}...`
  );
  const curNetworkConnection = await registrarContract.queryNetworkConnection(network.chainId);
  logger.out(JSON.stringify(curNetworkConnection, undefined, 2));
  await updateRegistrarNetworkConnection(
    registrar.proxy.address,
    {...curNetworkConnection, router: router.proxy.address},
    apTeamMultisig.proxy.address,
    hre
  );
}
