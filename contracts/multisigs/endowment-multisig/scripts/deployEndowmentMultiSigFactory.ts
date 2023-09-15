import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {EndowmentMultiSigFactory__factory} from "typechain-types";
import {Deployment} from "types";
import {deploy, logger, updateAddresses} from "utils";

export async function deployEndowmentMultiSigFactory(
  implementation: string,
  registrar: string,
  proxyAdmin: string,
  factoryOwner: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment<EndowmentMultiSigFactory__factory>> {
  logger.out("Deploying EndowmentMultiSigFactory...");

  // deploy factory
  const factory = await deploy(new EndowmentMultiSigFactory__factory(deployer), [
    implementation,
    proxyAdmin,
    registrar,
  ]);

  logger.out(`Transferring ownership to: ${factoryOwner}...`);
  const tx = await factory.contract.transferOwnership(factoryOwner);
  logger.out(`Tx hash: ${tx.hash}`);
  await tx.wait();
  const newOwner = await factory.contract.owner();
  if (newOwner !== factoryOwner) {
    throw new Error(`Error updating owner: expected '${factoryOwner}', actual: '${newOwner}'`);
  }

  // update address file
  await updateAddresses(
    {
      multiSig: {
        endowment: {
          factory: factory.contract.address,
        },
      },
    },
    hre
  );

  return factory;
}
