import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, Registrar__factory} from "typechain-types";
import {Deployment, getContractName, logger, updateAddresses, validateAddress} from "utils";

type Data = {
  axelarGateway: string;
  axelarGasService: string;
  router: string;
  owner?: string;
  deployer: SignerWithAddress;
  proxyAdmin: SignerWithAddress;
  treasuryAddress: string;
};

export async function deployRegistrar(
  {
    axelarGateway,
    axelarGasService,
    router,
    owner = "",
    deployer,
    proxyAdmin,
    treasuryAddress,
  }: Data,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment | undefined> {
  logger.out("Deploying Registrar...");

  try {
    validateAddress(axelarGateway, "axelarGateway");
    validateAddress(axelarGasService, "axelarGasService");
    validateAddress(owner, "owner");
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
      "initialize((address,(uint256,uint256,uint256),address,address,address))",
      [
        {
          treasury: treasuryAddress,
          splitToLiquid: config.REGISTRAR_DATA.splitToLiquid,
          router: router,
          axelarGateway: axelarGateway,
          axelarGasRecv: axelarGasService,
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
