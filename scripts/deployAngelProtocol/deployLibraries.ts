import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {AngelCoreStruct__factory, StringArray__factory} from "typechain-types";
import {isLocalNetwork, updateAddresses} from "utils";

export async function deployLibraries(
  verify_contracts: boolean,
  signer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
) {
  const angelCoreStructFactory = new AngelCoreStruct__factory(signer);
  const angelCoreStruct = await angelCoreStructFactory.deploy();
  await angelCoreStruct.deployed();

  const stringLibFactory = new StringArray__factory(signer);
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

  if (!isLocalNetwork(hre.network) && verify_contracts) {
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
