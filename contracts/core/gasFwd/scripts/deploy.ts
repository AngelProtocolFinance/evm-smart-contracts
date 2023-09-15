import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {GasFwdFactory__factory, GasFwd__factory} from "typechain-types";
import {Deployment} from "types";
import {deploy, logger, updateAddresses} from "utils";

type Data = {
  deployer: Signer;
  proxyAdmin: string;
  factoryOwner: string;
  registrar: string;
};

export async function deployGasFwd(
  {deployer, proxyAdmin, factoryOwner, registrar}: Data,
  hre: HardhatRuntimeEnvironment
): Promise<{
  factory: Deployment<GasFwdFactory__factory>;
  implementation: Deployment<GasFwd__factory>;
}> {
  const implementation = await deploy(new GasFwd__factory(deployer));

  const factory = await deploy(new GasFwdFactory__factory(deployer), [
    implementation.contract.address,
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

  await updateAddresses(
    {
      gasFwd: {
        implementation: implementation.contract.address,
        factory: factory.contract.address,
      },
    },
    hre
  );

  return {implementation, factory};
}
