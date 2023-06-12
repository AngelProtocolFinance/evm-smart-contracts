import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, Registrar__factory} from "typechain-types";
import {ADDRESS_ZERO, getSigners, logger, updateAddresses, validateAddress, verify} from "utils";

export async function deployRegistrar(
  router: string, // no need to verify address validity, as Registrar will be deployed before the router
  owner: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  const {deployer, proxyAdmin, treasury} = await getSigners(hre);

  try {
    logger.out("Deploying Registrar...");

    validateAddress(owner, "owner");

    const factory = new Registrar__factory(proxyAdmin);
    const registrar = await factory.deploy();
    await registrar.deployed();
    console.log("Registrar implementation deployed at: ", registrar.address);

    // Deploy proxy contract
    const data = registrar.interface.encodeFunctionData(
      "initialize((address,(uint256,uint256,uint256),address,address,address))",
      [
        {
          treasury: treasury.address,
          splitToLiquid: config.REGISTRAR_DATA.splitToLiquid,
          router,
          axelarGateway: config.REGISTRAR_DATA.axelarGateway,
          axelarGasRecv: config.REGISTRAR_DATA.axelarGasRecv,
        },
      ]
    );
    const proxyFactory = new ProxyContract__factory(deployer);
    const proxy = await proxyFactory.deploy(registrar.address, proxyAdmin.address, data);
    await proxy.deployed();
    console.log("Registrar Proxy deployed at: ", proxy.address);

    console.log("Updating Registrar owner to: ", owner, "...");
    const proxiedRegistrar = Registrar__factory.connect(proxy.address, deployer);
    const tx = await proxiedRegistrar.transferOwnership(owner);
    await tx.wait();

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

    return {implementation: registrar, proxy};
  } catch (error) {
    logger.out(error, logger.Level.Error);
    return {
      implementation: Registrar__factory.connect(ADDRESS_ZERO, proxyAdmin),
      proxy: ProxyContract__factory.connect(ADDRESS_ZERO, proxyAdmin),
    };
  }
}
