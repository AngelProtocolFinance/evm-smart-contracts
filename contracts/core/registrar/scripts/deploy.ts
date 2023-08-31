import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {LocalRegistrar__factory, ProxyContract__factory, Registrar__factory} from "typechain-types";
import {Deployment, getAxlNetworkName, getContractName, logger, updateAddresses} from "utils";

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
): Promise<{
  implementation: Deployment;
  proxy: Deployment;
}> {
  logger.out("Deploying Registrar...");

  const networkName = await getAxlNetworkName(hre);

  // deploy implementation
  logger.out("Deploying implementation...");
  const factory = new Registrar__factory(deployer);
  const registrar = await factory.deploy();
  await registrar.deployed();
  logger.out(`Address: ${registrar.address}`);

  // deploy proxy
  logger.out("Deploying proxy...");
  const initData = registrar.interface.encodeFunctionData(
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
  const proxyFactory = new ProxyContract__factory(deployer);
  const proxy = await proxyFactory.deploy(registrar.address, proxyAdmin, initData);
  await proxy.deployed();
  logger.out(`Address: ${proxy.address}`);

  // update owner
  logger.out(`Updating Registrar owner to '${owner}'..."`);
  const proxiedRegistrar = Registrar__factory.connect(proxy.address, deployer);
  const tx = await proxiedRegistrar.transferOwnership(owner);
  await tx.wait();

  // update address file & verify contracts
  await updateAddresses(
    {
      registrar: {
        implementation: registrar.address,
        proxy: proxy.address,
      },
    },
    hre
  );

  return {
    implementation: {address: registrar.address, contractName: getContractName(factory)},
    proxy: {address: proxy.address, contractName: getContractName(proxyFactory)},
  };
}

type LocalRegistrarDeployData = {
  owner: string;
  deployer: SignerWithAddress;
  proxyAdmin: string;
};

export async function deployLocalRegistrar(
  {owner, deployer, proxyAdmin}: LocalRegistrarDeployData,
  hre: HardhatRuntimeEnvironment
): Promise<{
  implementation: Deployment;
  proxy: Deployment;
}> {
  logger.out("Deploying Local Registrar...");

  // deploy implementation
  logger.out("Deploying implementation...");
  const factory = new LocalRegistrar__factory(deployer);
  const localRegistrar = await factory.deploy();
  await localRegistrar.deployed();
  logger.out(`Address: ${localRegistrar.address}`);

  // deploy proxy
  logger.out("Deploying proxy...");
  const proxyFactory = new ProxyContract__factory(deployer);
  const initData = localRegistrar.interface.encodeFunctionData("initialize", [
    await getAxlNetworkName(hre),
  ]);
  const proxy = await proxyFactory.deploy(localRegistrar.address, proxyAdmin, initData);
  await proxy.deployed();
  logger.out(`Address: ${proxy.address}`);

  // update owner
  logger.out(`Updating Registrar owner to '${owner}'..."`);
  const proxiedRegistrar = LocalRegistrar__factory.connect(proxy.address, deployer);
  logger.out(`Current owner: ${await proxiedRegistrar.owner()}`);
  const tx = await proxiedRegistrar.transferOwnership(owner);
  await tx.wait();

  // update address file & verify contracts
  await updateAddresses(
    {
      registrar: {
        implementation: localRegistrar.address,
        proxy: proxy.address,
      },
    },
    hre
  );

  return {
    implementation: {address: localRegistrar.address, contractName: getContractName(factory)},
    proxy: {address: proxy.address, contractName: getContractName(proxyFactory)},
  };
}
