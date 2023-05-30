import {task} from "hardhat/config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {AngelCoreStruct__factory, StringArray__factory} from "typechain-types";
import {getSigners, isLocalNetwork, logger, updateAddresses} from "utils";

task("Deploy:DeployLibraries", "Will deploy Libraries").setAction(async (_, hre) => {
  try {
    await deployLibraries(hre);

    // TODO: should also update all contracts that depend on the updated libraries
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
});

export async function deployLibraries(hre: HardhatRuntimeEnvironment) {
  const {proxyAdmin} = await getSigners(hre.ethers);

  const angelCoreStructFactory = new AngelCoreStruct__factory(proxyAdmin);
  const angelCoreStruct = await angelCoreStructFactory.deploy();
  await angelCoreStruct.deployed();

  const stringLibFactory = new StringArray__factory(proxyAdmin);
  const stringLib = await stringLibFactory.deploy();
  await stringLib.deployed();

  console.log("Libraries Deployed as", {
    "STRING_LIBRARY Deployed at ": stringLib.address,
    "ANGEL_CORE_STRUCT_LIBRARY Deployed at ": angelCoreStruct.address,
  });

  await updateAddresses(
    {
      libraries: {
        STRING_LIBRARY: stringLib.address,
        ANGEL_CORE_STRUCT_LIBRARY: angelCoreStruct.address,
      },
    },
    hre
  );

  if (!isLocalNetwork(hre.network)) {
    await hre.run(`verify:verify`, {
      address: angelCoreStruct.address,
      constructorArguments: [],
    });
    await hre.run(`verify:verify`, {
      address: stringLib.address,
      constructorArguments: [],
    });
  }

  return {angelCoreStruct, stringLib};
}
