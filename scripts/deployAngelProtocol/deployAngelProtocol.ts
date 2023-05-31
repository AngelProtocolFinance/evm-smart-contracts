// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import {deployDiamond} from "contracts/core/accounts/scripts/deploy";
import {deployIndexFund} from "contracts/core/index-fund/scripts/deploy";
import {deployRegistrar} from "contracts/core/registrar/scripts/deploy";
import {deploySwapRouter} from "contracts/core/swap-router/scripts/deploy";
// import { deployHaloImplementation } from "contracts/halo/scripts/deploy"
import {charityApplications} from "contracts/multisigs/charity_applications/scripts/deploy";
import {deployMultisig} from "contracts/multisigs/scripts/deploy";
import {deployEndowmentMultiSig} from "contracts/normalized_endowment/endowment-multisig/scripts/deploy";
import {deployImplementation} from "contracts/normalized_endowment/scripts/deployImplementation";
// import { deployFundraising } from "contracts/accessory/fundraising/scripts/deploy"
import config from "config";
import {deployEmitters} from "contracts/normalized_endowment/scripts/deployEmitter";
import {Contract} from "ethers";
import hre from "hardhat";
import {
  APTeamMultiSig,
  ApplicationsMultiSig,
  IndexFund__factory,
  MockUSDC__factory,
  Registrar__factory,
} from "typechain-types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/interfaces/IRegistrar";
import {ContractFunctionParams, cleanAddresses, isLocalNetwork, updateAddresses} from "utils";
import {deployLibraries} from "./deployLibraries";
import {getSigners} from "utils/getSigners";

export default async function deploy() {
  try {
    const {network, ethers} = hre;

    const {applicationsMultisigOwners, apTeamMultisigOwners, proxyAdmin, treasuryAdmin} =
      await getSigners(ethers);

    await cleanAddresses(hre);

    const verify_contracts = isLocalNetwork(hre.network);

    console.log("Deploying the contracts with the account:", await proxyAdmin.getAddress());

    // Mock setup required for testing
    let mockUSDC: Contract | undefined;
    if (isLocalNetwork(network)) {
      const MockUSDC = new MockUSDC__factory(proxyAdmin);
      mockUSDC = await MockUSDC.deploy("USDC", "USDC", 100);
      await mockUSDC.deployed();
      config.REGISTRAR_DATA.acceptedTokens.cw20 = [mockUSDC.address];
      config.REGISTRAR_UPDATE_CONFIG.usdcAddress = mockUSDC.address;
      config.DONATION_MATCH_CHARITY_DATA.usdcAddress = mockUSDC.address;

      const tx = await mockUSDC.mint(
        proxyAdmin.address,
        ethers.utils.parseEther("10000000000000000000000")
      );
      await tx.wait();

      console.log("given proxyAdmin USDC");

      console.log("USDC Mock Address", mockUSDC.address);

      await updateAddresses({tokens: {usdc: mockUSDC.address}}, hre);
    }

    const {angelCoreStruct, stringLib} = await deployLibraries(verify_contracts, proxyAdmin, hre);

    var APTeamData: ContractFunctionParams<APTeamMultiSig["initialize"]> = [
      apTeamMultisigOwners.map((x) => x.address),
      config.AP_TEAM_MULTISIG_DATA.threshold,
      config.AP_TEAM_MULTISIG_DATA.requireExecution,
    ];
    var ApplicationData: ContractFunctionParams<ApplicationsMultiSig["initialize"]> = [
      applicationsMultisigOwners.map((x) => x.address),
      config.APPLICATION_MULTISIG_DATA.threshold,
      config.APPLICATION_MULTISIG_DATA.requireExecution,
    ];
    console.log(APTeamData, ApplicationData);
    const multisigAddress = await deployMultisig(
      ApplicationData,
      APTeamData,
      verify_contracts,
      hre
    );

    const registrarData = {
      treasury: treasuryAdmin.address,
      taxRate: config.REGISTRAR_DATA.taxRate,
      rebalance: config.REGISTRAR_DATA.rebalance,
      splitToLiquid: config.REGISTRAR_DATA.splitToLiquid,
      acceptedTokens: config.REGISTRAR_DATA.acceptedTokens,
      router: "", // will be updated to newly deployed router address in the next PR
      axelarGateway: config.REGISTRAR_DATA.axelarGateway,
      axelarGasRecv: config.REGISTRAR_DATA.axelarGasRecv,
    };

    const registrarAddress = await deployRegistrar(
      stringLib.address,
      registrarData,
      multisigAddress.APTeamMultiSig,
      verify_contracts,
      hre
    );

    const ACCOUNT_ADDRESS = await deployDiamond(
      multisigAddress.APTeamMultiSig,
      registrarAddress,
      angelCoreStruct.address,
      stringLib.address,
      hre,
      verify_contracts
    );

    console.log("Account contract deployed at:-", ACCOUNT_ADDRESS);

    const emitters = await deployEmitters(ACCOUNT_ADDRESS, verify_contracts, hre);

    console.log("emitters Contract deployed at:-", emitters);

    const charityApplicationsData: Parameters<typeof charityApplications>[0] = [
      config.CHARITY_APPLICATION_DATA.expiry,
      multisigAddress.ApplicationsMultiSig,
      ACCOUNT_ADDRESS,
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
      registrarAddress,
      ACCOUNT_ADDRESS,
      config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS,
      config.SWAP_ROUTER_DATA.SWAP_ROUTER_ADDRESS,
      verify_contracts,
      hre
    );

    console.log("SWAP_ROUTER contract deployed at:-", SWAP_ROUTER);

    const indexFundData = {
      registrarContract: registrarAddress,
      fundRotation: config.INDEX_FUND_DATA.fundRotation,
      fundMemberLimit: config.INDEX_FUND_DATA.fundMemberLimit,
      fundingGoal: config.INDEX_FUND_DATA.fundingGoal,
    };

    const INDEX_FUND_ADDRESS = await deployIndexFund(
      indexFundData,
      multisigAddress.APTeamMultiSig,
      verify_contracts,
      hre
    );

    console.log("INDEX_FUND_ADDRESS contract deployed at:-", INDEX_FUND_ADDRESS);

    const multisigDat = await deployEndowmentMultiSig(verify_contracts, hre);

    console.log("multisigDat contract deployed at:-", multisigDat);
    // console.log('implementations deployed at:', implementations);

    // const GiftCardDataInput = {
    //     keeper: multisigAddress.APTeamMultiSig,
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

    //     // create a uniswap pool for WETH and USDC
    //     console.log("WETH address: ", config.REGISTRAR_UPDATE_CONFIG.wethAddress)
    //     console.log("USDC address: ", mockUSDC.address.toString())

    //     sqrtPrice = "79228162514264334008320"
    //     if (mockUSDC.address < config.REGISTRAR_UPDATE_CONFIG.wethAddress) {
    //         sqrtPrice = "79228162514264337593543950336000000"
    //     }
    //     const createUniswapPoolParams2 = {
    //         tokenA: mockUSDC.address,
    //         tokenB: config.REGISTRAR_UPDATE_CONFIG.wethAddress,
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

    const donationMatchCharityData = {
      reserveToken: config.DONATION_MATCH_CHARITY_DATA.reserveToken,
      uniswapFactory: config.DONATION_MATCH_CHARITY_DATA.uniswapFactory,
      registrarContract: registrarAddress,
      poolFee: config.DONATION_MATCH_CHARITY_DATA.poolFee,
      usdcAddress: config.DONATION_MATCH_CHARITY_DATA.usdcAddress,
    };

    if (isLocalNetwork(network)) {
      // haloToken
      // donationMatchCharityData.reserveToken = haloToken.address
      donationMatchCharityData.uniswapFactory = config.SWAP_ROUTER_DATA.SWAP_FACTORY_ADDRESS;
      donationMatchCharityData.poolFee = 3000;
      donationMatchCharityData.usdcAddress = mockUSDC!.address;
    }

    // transfer 100000000 HALO to donation match charities

    const implementations = await deployImplementation(
      angelCoreStruct.address,
      donationMatchCharityData,
      verify_contracts,
      hre
    );

    // if (isLocalNetwork(network)) {
    //     await haloToken.transfer(implementations.donationMatchCharity.proxy, ethers.utils.parseEther("100000000"))
    // }

    // config.REGISTRAR_DATA.acceptedTokens.cw20.push(haloToken.address)

    const updateConfig: RegistrarMessages.UpdateConfigRequestStruct = {
      accountsContract: ACCOUNT_ADDRESS, //Address
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
      subdaoEmitter: emitters.subDaoEmitter, //TODO:
      donationMatchContract: implementations.donationMatch.implementation, //address
      indexFundContract: INDEX_FUND_ADDRESS, //address
      govContract: ethers.constants.AddressZero, //address
      treasury: treasuryAdmin.address,
      donationMatchCharitesContract: implementations.donationMatchCharity.proxy, // once uniswap is setup //address
      donationMatchEmitter: emitters.DonationMatchEmitter,
      haloToken: ethers.constants.AddressZero, //address
      haloTokenLpContract: config.REGISTRAR_UPDATE_CONFIG.haloTokenLpContract, //address
      charitySharesContract: ethers.constants.AddressZero, //TODO: //address
      fundraisingContract: ethers.constants.AddressZero, //TODO: //address
      applicationsReview: multisigAddress.ApplicationsMultiSig, //address
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

    const REGISTRAR_CONTRACT = Registrar__factory.connect(registrarAddress, proxyAdmin);

    const data = await REGISTRAR_CONTRACT.updateConfig(updateConfig);
    console.log("Successfully updated config:-", data.hash);

    const newOwner = await REGISTRAR_CONTRACT.transferOwnership(multisigAddress.APTeamMultiSig);
    console.log("Successfully transferred Ownership:-", newOwner.hash);

    const INDEX_FUND_CONTRACT = IndexFund__factory.connect(INDEX_FUND_ADDRESS, proxyAdmin);

    const new_owner_index = await INDEX_FUND_CONTRACT.updateOwner(multisigAddress.APTeamMultiSig);
    console.log("Successfully transferred Ownership:-", new_owner_index.hash);
  } catch (e) {
    console.error("Failed deploying Contracts:-", e);
    return Promise.reject(false);
  }
}
