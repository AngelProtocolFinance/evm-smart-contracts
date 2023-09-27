import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {EndowmentMultiSigFactory__factory} from "typechain-types";
import {ProxyDeployment} from "types";
import {deployBehindProxy, updateAddresses} from "utils";

export async function deployEndowmentMultiSigFactory(
  implementation: string,
  registrar: string,
  proxyAdmin: string,
  factoryOwner: string,
  deployer: Signer,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<EndowmentMultiSigFactory__factory>> {
  // deploy factory
  const data = EndowmentMultiSigFactory__factory.createInterface().encodeFunctionData(
    "initialize",
    [implementation, proxyAdmin, registrar, factoryOwner]
  );
  const factory = await deployBehindProxy(
    new EndowmentMultiSigFactory__factory(deployer),
    proxyAdmin,
    data
  );

  // update address file
  await updateAddresses(
    {
      multiSig: {
        endowment: {
          factory: {
            implementation: factory.implementation.contract.address,
            proxy: factory.proxy.contract.address,
          },
        },
      },
    },
    hre
  );

  return factory;
}
