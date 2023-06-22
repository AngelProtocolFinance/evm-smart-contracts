import {HardhatRuntimeEnvironment} from "hardhat/types";
import {AngelCoreStruct__factory, StringArray__factory} from "typechain-types";
import {Deployment, getContractName, getSigners, logger, updateAddresses, verify} from "utils";

export async function deployCommonLibraries(hre: HardhatRuntimeEnvironment): Promise<
  | {
      angelCoreStruct: Deployment;
      stringLib: Deployment;
    }
  | undefined
> {
  const {proxyAdmin} = await getSigners(hre);

  try {
    logger.out("Deploying AngelCoreStruct library...");
    const angelCoreStructFactory = new AngelCoreStruct__factory(proxyAdmin);
    const angelCoreStruct = await angelCoreStructFactory.deploy();
    await angelCoreStruct.deployed();
    logger.out(`Address: ${angelCoreStruct.address}`);

    logger.out("Deploying StringArray library...");
    const stringLibFactory = new StringArray__factory(proxyAdmin);
    const stringLib = await stringLibFactory.deploy();
    await stringLib.deployed();
    logger.out(`Address: ${stringLib.address}`);

    // update address file & verify contracts
    await updateAddresses(
      {
        libraries: {
          stringArray: stringLib.address,
          angelCoreStruct: angelCoreStruct.address,
        },
      },
      hre
    );

    return {
      angelCoreStruct: {
        address: angelCoreStruct.address,
        contractName: getContractName(angelCoreStructFactory),
      },
      stringLib: {
        address: stringLib.address,
        contractName: getContractName(stringLibFactory),
      },
    };
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
