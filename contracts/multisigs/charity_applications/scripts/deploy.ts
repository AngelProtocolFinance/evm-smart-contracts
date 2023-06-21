import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {CharityApplication__factory, ProxyContract__factory} from "typechain-types";
import {
  Deployment,
  getContractName,
  getSigners,
  logger,
  updateAddresses,
  validateAddress,
  verify,
} from "utils";

export async function deployCharityApplication(
  applicationsMultiSig = "",
  accountsDiamond = "",
  seedAsset = "",
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
): Promise<{charityApplication: Deployment; charityApplicationLib: Deployment} | undefined> {
  const {proxyAdmin} = await getSigners(hre);

  try {
    validateAddress(applicationsMultiSig, "applicationsMultiSig");
    validateAddress(accountsDiamond, "accountsDiamond");
    validateAddress(seedAsset, "seedAsset");

    // deploy library
    logger.out("Deploying CharityApplicationLib...");
    const charityApplicationLibFactory = await hre.ethers.getContractFactory(
      "CharityApplicationLib",
      proxyAdmin
    );
    const charityApplicationLib = await charityApplicationLibFactory.deploy();
    await charityApplicationLib.deployed();
    logger.out(`Address: ${charityApplicationLib.address}`);

    logger.out("Deploying CharityApplication...");

    // deploy implementation
    logger.out("Deploying implementation...");
    const charityApplicationFactory = new CharityApplication__factory(
      {
        "contracts/multisigs/charity_applications/CharityApplication.sol:CharityApplicationLib":
          charityApplicationLib.address,
      },
      proxyAdmin
    );
    const charityApplication = await charityApplicationFactory.deploy();
    await charityApplication.deployed();
    logger.out(`Address: ${charityApplication.address}`);

    // deploy proxy
    logger.out("Deploying proxy...");
    const initData = charityApplication.interface.encodeFunctionData("initialize", [
      config.CHARITY_APPLICATION_DATA.expiry,
      applicationsMultiSig,
      accountsDiamond,
      config.CHARITY_APPLICATION_DATA.seedSplitToLiquid,
      config.CHARITY_APPLICATION_DATA.newEndowGasMoney,
      config.CHARITY_APPLICATION_DATA.gasAmount,
      config.CHARITY_APPLICATION_DATA.fundSeedAsset,
      seedAsset,
      config.CHARITY_APPLICATION_DATA.seedAssetAmount,
    ]);
    const proxyFactory = new ProxyContract__factory(proxyAdmin);
    const charityApplicationProxy = await proxyFactory.deploy(
      charityApplication.address,
      proxyAdmin.address,
      initData
    );
    await charityApplicationProxy.deployed();
    logger.out(`Address: ${charityApplicationProxy.address}`);

    // update address file & verify contracts
    await updateAddresses(
      {
        charityApplication: {
          implementation: charityApplication.address,
          proxy: charityApplicationProxy.address,
        },
        libraries: {
          charityApplicationLib: charityApplicationLib.address,
        },
      },
      hre
    );

    if (verify_contracts) {
      await verify(hre, {address: charityApplication.address});
      await verify(hre, {
        address: charityApplicationProxy.address,
        constructorArguments: [charityApplication.address, proxyAdmin.address, initData],
      });
    }

    return {
      charityApplication: {
        address: charityApplicationProxy.address,
        contractName: getContractName(charityApplicationFactory),
      },
      charityApplicationLib: {
        address: charityApplicationLib.address,
        contractName: getContractName(charityApplicationLibFactory),
      },
    };
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
