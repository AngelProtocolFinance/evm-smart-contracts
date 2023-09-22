import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {EndowmentMultiSigEmitter__factory} from "typechain-types";
import {ProxyDeployment} from "types";
import {deployBehindProxy, logger, updateAddresses} from "utils";

export async function deployEndowmentMultiSigEmitter(
  factory: string,
  proxyAdmin: string,
  deployer: Signer,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<EndowmentMultiSigEmitter__factory>> {
  logger.out("Deploying EndowmentMultiSigEmitter...");

  // deploy emitter
  const initData = EndowmentMultiSigEmitter__factory.createInterface().encodeFunctionData(
    "initEndowmentMultiSigEmitter",
    [factory]
  );
  const emitter = await deployBehindProxy(
    new EndowmentMultiSigEmitter__factory(deployer),
    proxyAdmin,
    initData
  );

  // update address file
  await updateAddresses(
    {
      multiSig: {
        endowment: {
          emitter: {
            implementation: emitter.implementation.contract.address,
            proxy: emitter.proxy.contract.address,
          },
        },
      },
    },
    hre
  );

  return emitter;
}
