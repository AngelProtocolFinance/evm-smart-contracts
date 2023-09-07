import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {LocalRegistrar__factory} from "typechain-types";
import {
  ProxyDeployment,
  deployBehindProxy,
  getAxlNetworkName,
  logger,
  updateAddresses,
} from "utils";

type LocalRegistrarDeployData = {
  owner: string;
  deployer: SignerWithAddress;
  proxyAdmin: string;
};

export async function deployLocalRegistrar(
  {owner, deployer, proxyAdmin}: LocalRegistrarDeployData,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<LocalRegistrar__factory>> {
  // data setup
  const LocalRegistrar = new LocalRegistrar__factory(deployer);
  const initData = LocalRegistrar.interface.encodeFunctionData("initialize", [
    await getAxlNetworkName(hre),
  ]);
  // deploy
  const {implementation, proxy} = await deployBehindProxy(LocalRegistrar, proxyAdmin, initData);

  // update owner
  logger.out(`Updating Registrar owner to '${owner}'...`);
  const proxiedRegistrar = LocalRegistrar__factory.connect(proxy.contract.address, deployer);
  const tx = await proxiedRegistrar.transferOwnership(owner);
  await tx.wait();
  const newOwner = await proxiedRegistrar.owner();
  if (newOwner !== owner) {
    throw new Error(`Error updating owner: expected '${owner}', actual: '${newOwner}'`);
  }

  // update address file
  await updateAddresses(
    {
      registrar: {
        implementation: implementation.contract.address,
        proxy: proxy.contract.address,
      },
    },
    hre
  );

  return {implementation, proxy};
}
