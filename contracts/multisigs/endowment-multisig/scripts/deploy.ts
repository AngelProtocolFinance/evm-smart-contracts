import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  EndowmentMultiSigEmitter__factory,
  EndowmentMultiSigFactory__factory,
  EndowmentMultiSig__factory,
} from "typechain-types";
import {Deployment, ProxyDeployment} from "types";
import {deploy, deployBehindProxy, logger, updateAddresses} from "utils";

export async function deployEndowmentMultiSig(
  registrar: string,
  proxyAdmin: string,
  factoryOwner: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<{
  emitter: ProxyDeployment<EndowmentMultiSigEmitter__factory>;
  factory: Deployment<EndowmentMultiSigFactory__factory>;
  implementation: Deployment<EndowmentMultiSig__factory>;
}> {
  logger.out("Deploying EndowmentMultiSig contracts...");

  // deploy implementation contract
  const implementation = await deploy(new EndowmentMultiSig__factory(deployer));

  // deploy factory
  const factory = await deploy(new EndowmentMultiSigFactory__factory(deployer), [
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

  // emitter data setup
  const Emitter = new EndowmentMultiSigEmitter__factory(deployer);
  const initData = Emitter.interface.encodeFunctionData("initEndowmentMultiSigEmitter", [
    factory.contract.address,
  ]);
  // deploy emitter
  const emitter = await deployBehindProxy(Emitter, proxyAdmin, initData);

  // update address file
  await updateAddresses(
    {
      multiSig: {
        endowment: {
          emitter: {
            implementation: emitter.implementation.contract.address,
            proxy: emitter.proxy.contract.address,
          },
          factory: factory.contract.address,
          implementation: implementation.contract.address,
        },
      },
    },
    hre
  );

  return {
    emitter,
    factory,
    implementation,
  };
}
