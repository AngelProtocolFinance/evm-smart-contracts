import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {LocalRegistrar__factory, Registrar__factory} from "typechain-types";
import {ProxyDeployment} from "types";
import {deployBehindProxy, getAxlNetworkName, logger, updateAddresses} from "utils";

type RegistrarDeployData = {
  axelarGateway: string;
  axelarGasService: string;
  router: string;
  owner: string;
  deployer: SignerWithAddress;
  proxyAdmin: string;
  treasury: string;
  apTeamMultisig: string;
};

export async function deployRegistrar(
  {
    axelarGateway,
    axelarGasService,
    router,
    owner,
    deployer,
    proxyAdmin,
    treasury,
    apTeamMultisig,
  }: RegistrarDeployData,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<Registrar__factory>> {
  const networkName = await getAxlNetworkName(hre);

  // data setup
  const Registrar = new Registrar__factory(deployer);
  const initData = Registrar.interface.encodeFunctionData(
    "initialize((address,address,address,address,address,string,address))",
    [
      {
        apTeamMultisig: apTeamMultisig,
        treasury: treasury,
        router: router,
        axelarGateway: axelarGateway,
        axelarGasService: axelarGasService,
        networkName: networkName,
        refundAddr: owner,
      },
    ]
  );
  // deploy
  const {implementation, proxy} = await deployBehindProxy(Registrar, proxyAdmin, initData);

  // update owner
  logger.out(`Updating Registrar owner to '${owner}'..."`);
  const proxiedRegistrar = Registrar__factory.connect(proxy.contract.address, deployer);
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
