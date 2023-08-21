import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {LocalRegistrar__factory, ProxyContract__factory, Registrar__factory} from "typechain-types";
import {
  Deployment,
  getContractName,
  getAxlNetworkName,
  logger,
  updateAddresses,
  validateAddress,
} from "utils";

type RegistrarDeployData = {
  axelarGateway: string;
  axelarGasService: string;
  router: string;
  owner?: string;
  deployer: SignerWithAddress;
  proxyAdmin: SignerWithAddress;
  treasury: string;
  apTeamMultisig?: string;
};

export async function deployRegistrar(
  {
    axelarGateway,
    axelarGasService,
    router,
    owner = "",
    deployer,
    proxyAdmin,
    treasury,
    apTeamMultisig = "",
  }: RegistrarDeployData,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment | undefined> {
  logger.out("Deploying Registrar...");

  try {
    const networkName = await getAxlNetworkName(hre);

    validateAddress(axelarGateway, "axelarGateway");
    validateAddress(axelarGasService, "axelarGasService");
    validateAddress(owner, "owner");
    validateAddress(apTeamMultisig, "apTeamMultisig");
    // no need to verify router address validity, as Registrar will be deployed before the router

    // deploy implementation
    logger.out("Deploying implementation...");
    const factory = new Registrar__factory(proxyAdmin);
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
    const proxy = await proxyFactory.deploy(registrar.address, proxyAdmin.address, initData);
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

    return {address: proxy.address, contractName: getContractName(factory)};
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}

type LocalRegistrarDeployData = {
  owner?: string;
  deployer: SignerWithAddress;
  proxyAdmin: SignerWithAddress;
};

export async function deployLocalRegistrar(
  {owner = "", deployer, proxyAdmin}: LocalRegistrarDeployData,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment | undefined> {
  logger.out("Deploying Local Registrar...");

  try {
    validateAddress(owner, "owner");
    // deploy implementation
    logger.out("Deploying implementation...");
    const factory = new LocalRegistrar__factory(proxyAdmin);
    const localRegistrar = await factory.deploy();
    await localRegistrar.deployed();
    logger.out(`Address: ${localRegistrar.address}`);

    // deploy proxy
    logger.out("Deploying proxy...");
    const proxyFactory = new ProxyContract__factory(deployer);
    const initData = localRegistrar.interface.encodeFunctionData("initialize", [
      await getAxlNetworkName(hre),
    ]);
    const proxy = await proxyFactory.deploy(localRegistrar.address, proxyAdmin.address, initData);
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

    return {address: proxy.address, contractName: getContractName(factory)};
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
