import {HardhatRuntimeEnvironment} from "hardhat/types";
import {AngelCoreStruct__factory, StringArray__factory} from "typechain-types";
import {getSigners, updateAddresses} from "utils";

export async function deployLibraries(verify: boolean, hre: HardhatRuntimeEnvironment) {
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

  // TODO: should also update all contracts that depend on the updated libraries

  await updateAddresses(
    {
      libraries: {
        STRING_LIBRARY: stringLib.address,
        ANGEL_CORE_STRUCT_LIBRARY: angelCoreStruct.address,
      },
    },
    hre
  );

  if (verify) {
    console.log("Verifying...");
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
