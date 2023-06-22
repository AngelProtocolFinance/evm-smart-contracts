import {task, types} from "hardhat/config";
import {Deployment, confirmAction, isLocalNetwork, logger, verify} from "utils";
// import { deployFundraising } from "contracts/accessory/fundraising/scripts/deploy"
import config from "config";
import {ADDRESS_ZERO, getSigners, resetAddresses} from "utils";

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

import {
  deployCommonLibraries,
  getOrDeployThirdPartyContracts,
  updateRegistrarConfig,
  updateRegistrarNetworkConnections,
} from "../helpers";

task("deploy:AngelProtocol", "Will deploy complete Angel Protocol")
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .addOptionalParam("yes", "Automatic yes to prompt.", false, types.boolean)
  .setAction(async (taskArgs: {verify: boolean; yes: boolean}, hre) => {
    try {
      const isConfirmed =
        taskArgs.yes || (await confirmAction("Deploying all Angel Protocol contracts..."));
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      const verify_contracts = !isLocalNetwork(hre) && taskArgs.verify;

      const {proxyAdmin, treasury} = await getSigners(hre);

      await resetAddresses(hre);

      logger.out(`Deploying the contracts with the account: ${proxyAdmin.address}`);

      const thirdPartyAddresses = await getOrDeployThirdPartyContracts(proxyAdmin, hre);

      const commonLibraries = await deployCommonLibraries(hre);

      const apTeamMultisig = await deployAPTeamMultiSig(hre);

      const applicationsMultiSig = await deployApplicationsMultiSig(hre);

      const registrar = await deployRegistrar(
        thirdPartyAddresses.axelarGateway.address,
        thirdPartyAddresses.axelarGasService.address,
        ADDRESS_ZERO,
        apTeamMultisig?.address,
        hre
      );

      // Router deployment will require updating Registrar config's "router" address
      const router = await deployRouter(
        thirdPartyAddresses.axelarGateway.address,
        thirdPartyAddresses.axelarGasService.address,
        registrar?.address,
        hre
      );

      const accounts = await deployAccountsDiamond(
        apTeamMultisig?.address,
        registrar?.address,
        commonLibraries?.angelCoreStruct.address,
        hre
      );

      // const emitters = await deployEmitters(accountsDiamond.address, hre);

      const charityApplication = await deployCharityApplication(
        applicationsMultiSig?.address,
        accounts?.diamond.address,
        thirdPartyAddresses.seedAsset.address,
        hre
      );

      const indexFund = await deployIndexFund(registrar?.address, apTeamMultisig?.address, hre);

      const endowmentMultiSig = await deployEndowmentMultiSig(hre);

      // logger.out('implementations deployed at:', implementations);

      // const GiftCardDataInput = {
      //     keeper: apTeamMultisig?.address,
      //     registrarContract: REGISTRAR_ADDRESS,
      // }

      // const giftCardAddress = await giftCard(GiftCardDataInput, commonLibraries?.angelCoreStruct.address, hre)

      // const FundraisingDataInput = {
      //     registrarContract: REGISTRAR_ADDRESS,
      //     nextId: config.FundraisingDataInput.nextId,
      //     campaignPeriodSeconds: config.FundraisingDataInput.campaignPeriodSeconds,
      //     taxRate: config.FundraisingDataInput.taxRate,
      //     acceptedTokens: config.FundraisingDataInput.acceptedTokens,
      // }
      // const fundraisingAddress = await deployFundraising(
      //     FundraisingDataInput,
      //     commonLibraries?.angelCoreStruct.address,
      //     verify_contracts,
      //     hre
      // )

      // TODO:
      // UNCOMMENT WHEN HALO CONTRACTS ARE READY FOR DEPLOYMENT
      //
      // var haloAddress = await deployHaloImplementation(SWAP_ROUTER.UNISWAP_ROUTER_ADDRESS, hre)

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
      //   registrarContract: registrar?.address,
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
      //   commonLibraries?.angelCoreStruct.address,
      //   donationMatchCharityData,
      //   verify_contracts,
      //   hre
      // );

      // if (isLocalNetwork(network)) {
      //     await haloToken.transfer(implementations.donationMatchCharity.proxy, ethers.utils.parseEther("100000000"))
      // }

      // config.REGISTRAR_DATA.acceptedTokens.cw20.push(haloToken.address)

      await updateRegistrarConfig(
        registrar?.address,
        apTeamMultisig?.address,
        {
          accountsContract: accounts?.diamond.address, //Address
          splitMax: config.REGISTRAR_DATA.splitToLiquid.max, //uint256
          splitMin: config.REGISTRAR_DATA.splitToLiquid.min, //uint256
          splitDefault: config.REGISTRAR_DATA.splitToLiquid.defaultSplit, //uint256
          collectorShare: config.REGISTRAR_UPDATE_CONFIG.collectorShare, //uint256
          indexFundContract: indexFund?.address, //address
          treasury: treasury.address,
          // haloTokenLpContract: addresses.halo.tokenLp,
          applicationsReview: applicationsMultiSig?.address, //address
          uniswapRouter: thirdPartyAddresses.uniswap.swapRouter.address, //address
          uniswapFactory: thirdPartyAddresses.uniswap.factory.address, //address
          multisigFactory: endowmentMultiSig?.factory.address, //address
          multisigEmitter: endowmentMultiSig?.emitter.address, //address
          charityProposal: charityApplication?.charityApplication.address, //address
          proxyAdmin: proxyAdmin.address, //address
          usdcAddress: thirdPartyAddresses.usdcToken.address,
          wMaticAddress: thirdPartyAddresses.wmaticToken.address,
        },
        hre
      );

      // Registrar NetworkInfo's Router address must be updated for the current network
      if (router) {
        await updateRegistrarNetworkConnections(
          registrar?.address,
          apTeamMultisig?.address,
          {router: router.address},
          hre
        );
      }

      if (verify_contracts) {
        const deployments: Array<Deployment | undefined> = [
          commonLibraries?.angelCoreStruct,
          commonLibraries?.stringLib,
          apTeamMultisig,
          applicationsMultiSig,
          registrar,
          router,
          accounts?.diamond,
          ...(accounts?.facets || []),
          charityApplication?.charityApplication,
          charityApplication?.charityApplicationLib,
          indexFund,
          endowmentMultiSig?.emitter,
          endowmentMultiSig?.factory,
          endowmentMultiSig?.implementation,
        ];

        for (const deployment of deployments) {
          if (deployment) {
            await verify(hre, deployment);
          }
        }
      }

      logger.out("Successfully deployed Angel Protocol contracts.");
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
