import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {EndowmentMultiSig__factory} from "typechain-types";
import {Deployment} from "types";
import {deploy, logger, updateAddresses} from "utils";

export async function deployEndowmentMultiSig(
  deployer: Signer,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment<EndowmentMultiSig__factory>> {
  logger.out("Deploying EndowmentMultiSig...");

  // deploy implementation contract
  const implementation = await deploy(new EndowmentMultiSig__factory(deployer));

  // update address file
  await updateAddresses(
    {
      multiSig: {
        endowment: {
          implementation: implementation.contract.address,
        },
      },
    },
    hre
  );

  return implementation;
}
