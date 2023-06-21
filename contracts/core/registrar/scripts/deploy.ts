import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, Registrar__factory} from "typechain-types";
import {
  Deployment,
  getContractName,
  getSigners,
  logger,
  updateAddresses,
  validateAddress,
  verify,
} from "utils";

export async function deployRegistrar(
  axelarGateway = "",
  axelarGasService = "",
  router = "", // no need to verify address validity, as Registrar will be deployed before the router
  owner = "",
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment | undefined> {
  logger.out("Deploying Registrar...");

  const {deployer, proxyAdmin, treasury} = await getSigners(hre);

  try {
    validateAddress(axelarGateway, "axelarGateway");
    validateAddress(axelarGasService, "axelarGasService");
    validateAddress(owner, "owner");

    // deploy implementation
    logger.out("Deploying implementation...");
    const factory = new Registrar__factory(proxyAdmin);
    const registrar = await factory.deploy();
    await registrar.deployed();
    logger.out(`Address: ${registrar.address}`);

    // deploy proxy
    logger.out("Deploying proxy...");
    const data = registrar.interface.encodeFunctionData(
      "initialize((address,(uint256,uint256,uint256),address,address,address))",
      [
        {
          treasury: treasury.address,
          splitToLiquid: config.REGISTRAR_DATA.splitToLiquid,
          router,
          axelarGateway,
          axelarGasRecv: axelarGasService,
        },
      ]
    );
    const proxyFactory = new ProxyContract__factory(deployer);
    const proxy = await proxyFactory.deploy(registrar.address, proxyAdmin.address, data);
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

    if (verify_contracts) {
      await verify(hre, {address: registrar.address});
      await verify(hre, {
        address: proxy.address,
        constructorArguments: [registrar.address, proxyAdmin.address, data],
      });
    }

    return {address: proxy.address, contractName: getContractName(factory)};
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
