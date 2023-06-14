// import { deployFundraising } from "contracts/accessory/fundraising/scripts/deploy"
import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  ADDRESS_ZERO,
  getAddresses,
  isLocalNetwork,
  logger,
  resetAddresses,
  updateAddresses,
} from "utils";

import {deployAccountsDiamond} from "contracts/core/accounts/scripts/deploy";
import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deployRouter} from "contracts/core/router/scripts/deploy";
// import { deployHaloImplementation } from "contracts/halo/scripts/deploy"
import {deployCharityApplication} from "contracts/multisigs/charity_applications/scripts/deploy";
import {deployAPTeamMultiSig, deployApplicationsMultiSig} from "contracts/multisigs/scripts/deploy";
import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
// import {deployEmitters} from "contracts/normalized_endowment/scripts/deployEmitter";
// import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";

import {getSigners} from "utils/getSigners";

import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ERC20__factory, ISwapRouter__factory} from "typechain-types";
import {deployCommonLibraries} from "./deployCommonLibraries";
import {deployMockUSDC, deployMockWMatic} from "./mocks";
import {updateRegistrarConfig, updateRegistrarNetworkConnections} from "./updateRegistrar";

export async function deployAngelProtocol(
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
): Promise<void> {
  const {proxyAdmin, treasury} = await getSigners(hre);

  await resetAddresses(hre);

  logger.out(`Deploying the contracts with the account: ${proxyAdmin.address}`);

  const uniswapSwapRouter = isLocalNetwork(hre)
    ? await deployMockUniswapSwapRouter(proxyAdmin, hre)
    : await getUniswapSwapRouter(proxyAdmin, hre);

  const usdcToken = isLocalNetwork(hre)
    ? await deployMockUSDC(proxyAdmin, hre)
    : await getUSDCToken(proxyAdmin, hre);

  const wmaticToken = isLocalNetwork(hre)
    ? await deployMockWMatic(proxyAdmin, hre)
    : await getWMaticToken(proxyAdmin, hre);

  const {angelCoreStruct} = await deployCommonLibraries(verify_contracts, hre);

  const apTeamMultisig = await deployAPTeamMultiSig(verify_contracts, hre);

  const applicationsMultiSig = await deployApplicationsMultiSig(verify_contracts, hre);

  const registrar = await deployRegistrar(
    ADDRESS_ZERO,
    apTeamMultisig.proxy.address,
    verify_contracts,
    hre
  );

  // Router deployment will require updating Registrar config's "router" address
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

  const indexFund = await deployIndexFund(
    registrar.proxy.address,
    apTeamMultisig.proxy.address,
    verify_contracts,
    hre
  );

  const endowmentMultiSig = await deployEndowmentMultiSig(verify_contracts, hre);

  // logger.out('implementations deployed at:', implementations);

  // const GiftCardDataInput = {
  //     keeper: apTeamMultisig.proxy.address,
  //     registrarContract: REGISTRAR_ADDRESS,
  // }

  // const giftCardAddress = await giftCard(GiftCardDataInput, angelCoreStruct.address, verify_contracts, hre)

  // const FundraisingDataInput = {
  //     registrarContract: REGISTRAR_ADDRESS,
  //     nextId: config.FundraisingDataInput.nextId,
  //     campaignPeriodSeconds: config.FundraisingDataInput.campaignPeriodSeconds,
  //     taxRate: config.FundraisingDataInput.taxRate,
  //     acceptedTokens: config.FundraisingDataInput.acceptedTokens,
  // }
  // const fundraisingAddress = await deployFundraising(
  //     FundraisingDataInput,
  //     angelCoreStruct.address,
  //     verify_contracts,
  //     hre
  // )

  // TODO:
  // UNCOMMENT WHEN HALO CONTRACTS ARE READY FOR DEPLOYMENT
  //
  // var haloAddress = await deployHaloImplementation(SWAP_ROUTER.UNISWAP_ROUTER_ADDRESS, verify_contracts, hre)

  // addressWriter.haloAddress = haloAddress

  // const haloToken = ERC20__factory.connect(haloAddress.Halo, proxyAdmin)

  // logger.out("halo token deployed at: ", haloToken.address)

  // logger.out("halo token balance: ", await haloToken.balanceOf(proxyAdmin.address))

  // if (isLocalNetwork(network)) {
  //     // if network is 'hardhat' then usdcToken should always be initialized
  //     // but TS forces us to confirm this is the case
  //     usdcToken = usdcToken!

  //     const UniswapUtils = new UniswapUtils__factory(proxyAdmin)
  //     const uniswap_utils = await UniswapUtils.deploy()
  //     await uniswap_utils.deployed()

  //     // create a uniswap pool for HALO and USDC
  //     logger.out("halo", haloToken.address.toString())
  //     logger.out("usdc", usdcToken.address.toString())
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

  //     logger.out("Created HALO pool")

  //     // create a uniswap pool for WMATIC and USDC
  //     logger.out("WMATIC address: ", config.REGISTRAR_UPDATE_CONFIG.wmaticAddress)
  //     logger.out("USDC address: ", usdcToken.address.toString())

  //     sqrtPrice = "79228162514264334008320"
  //     if (usdcToken.address < config.REGISTRAR_UPDATE_CONFIG.wmaticAddress) {
  //         sqrtPrice = "79228162514264337593543950336000000"
  //     }
  //     const createUniswapPoolParams2 = {
  //         tokenA: usdcToken.address,
  //         tokenB: config.REGISTRAR_UPDATE_CONFIG.wmaticAddress,
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

  //     logger.out("Created WMATIC pool")

  //     // deploy DAI
  //     const DAI = new MockERC20__factory(proxyAdmin)
  //     const dai = await DAI.deploy("DAI", "DAI", "1000000000")
  //     await dai.deployed()
  //     config.REGISTRAR_UPDATE_CONFIG.DAI_address = dai.address
  //     config.DONATION_MATCH_CHARITY_DATA.DAI_address = dai.address
  //     config.REGISTRAR_DATA.acceptedTokens.cw20.push(dai.address)

  //     // mint DAI
  //     await dai.mint(proxyAdmin.address, ethers.utils.parseEther("100000000"))

  //     logger.out(dai.address)

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
  //     logger.out("Created DAI pool")
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
  //   donationMatchCharityData.usdcAddress = usdcToken!.address;
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

  await updateRegistrarConfig(
    registrar.proxy.address,
    apTeamMultisig.proxy.address,
    {
      accountsContract: accountsDiamond.address, //Address
      splitMax: config.REGISTRAR_DATA.splitToLiquid.max, //uint256
      splitMin: config.REGISTRAR_DATA.splitToLiquid.min, //uint256
      splitDefault: config.REGISTRAR_DATA.splitToLiquid.defaultSplit, //uint256
      collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare, //uint256
      indexFundContract: indexFund.proxy.address, //address
      treasury: treasury.address,
      haloTokenLpContract: config.REGISTRAR_UPDATE_CONFIG.haloTokenLpContract, //address
      applicationsReview: applicationsMultiSig.proxy.address, //address
      uniswapSwapRouter: uniswapSwapRouter.address, //address
      multisigFactory: endowmentMultiSig.factory.address, //address
      multisigEmitter: endowmentMultiSig.emitter.proxy.address, //address
      charityProposal: charityApplication.proxy.address, //address
      proxyAdmin: proxyAdmin.address, //address
      usdcAddress: usdcToken.address,
      wMaticAddress: wmaticToken.address,
    },
    hre
  );

  // Registrar NetworkInfo's Router address must be updated for the current network
  await updateRegistrarNetworkConnections(
    registrar.proxy.address,
    apTeamMultisig.proxy.address,
    {router: router.proxy.address},
    hre
  );

  logger.out("Successfully deployed Angel Protocol contracts.");
}

async function deployMockUniswapSwapRouter(
  admin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
) {
  // just use some placeholder address until actual mock deployment is created
  const address = admin.address;
  logger.out("Updating");

  await updateAddresses({uniswapSwapRouter: address}, hre);

  logger.out("Saving uniswap");
  const contract = ISwapRouter__factory.connect(address, admin);
  logger.out("Saved");
  return contract;
}

async function getUniswapSwapRouter(signer: SignerWithAddress, hre: HardhatRuntimeEnvironment) {
  const addresses = await getAddresses(hre);
  const contract = ISwapRouter__factory.connect(addresses.uniswapSwapRouter, signer);
  return contract;
}

async function getUSDCToken(signer: SignerWithAddress, hre: HardhatRuntimeEnvironment) {
  const addresses = await getAddresses(hre);
  const contract = ERC20__factory.connect(addresses.tokens.usdc, signer);
  return contract;
}

async function getWMaticToken(signer: SignerWithAddress, hre: HardhatRuntimeEnvironment) {
  const addresses = await getAddresses(hre);
  const contract = ERC20__factory.connect(addresses.tokens.wmatic, signer);
  return contract;
}
