import {Signer} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {LocalRegistrar__factory, Registrar__factory} from "typechain-types";
import {ProxyDeployment} from "types";
import {deployBehindProxy, getAxlNetworkName, logger, updateAddresses} from "utils";

type RegistrarDeployData = {
  axelarGateway: string;
  axelarGasService: string;
  router: string;
  owner: string;
  deployer: Signer;
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
  const initData = Registrar__factory.createInterface().encodeFunctionData(
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
  const {implementation, proxy} = await deployBehindProxy(
    new Registrar__factory(deployer),
    proxyAdmin,
    initData
  );

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
  deployer: Signer;
  proxyAdmin: string;
};

export async function deployLocalRegistrar(
  {owner, deployer, proxyAdmin}: LocalRegistrarDeployData,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<LocalRegistrar__factory>> {
  // data setup
  const initData = LocalRegistrar__factory.createInterface().encodeFunctionData("initialize", [
    await getAxlNetworkName(hre),
  ]);
  // deploy
  const {implementation, proxy} = await deployBehindProxy(
    new LocalRegistrar__factory(deployer),
    proxyAdmin,
    initData
  );

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
