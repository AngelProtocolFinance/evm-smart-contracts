import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {LocalRegistrar__factory, Registrar__factory} from "typechain-types";
import {Deployment, deployBehindProxy, getAxlNetworkName, logger, updateAddresses} from "utils";

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
  const {implementation, proxy} = await deployBehindProxy(
    Registrar__factory,
    deployer,
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

  // update address file & verify contracts
  await updateAddresses(
    {
      registrar: {
        implementation: implementation.contract.address,
        proxy: proxy.contract.address,
      },
    },
    hre
  );

  return {
    implementation: {
      address: implementation.contract.address,
      contractName: implementation.contractName,
      constructorArguments: implementation.constructorArguments,
    },
    proxy: {
      address: proxy.contract.address,
      contractName: proxy.contractName,
      constructorArguments: proxy.constructorArguments,
    },
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
  const initData = LocalRegistrar__factory.createInterface().encodeFunctionData("initialize", [
    await getAxlNetworkName(hre),
  ]);
  const {implementation, proxy} = await deployBehindProxy(
    LocalRegistrar__factory,
    deployer,
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

  // update address file & verify contracts
  await updateAddresses(
    {
      registrar: {
        implementation: implementation.contract.address,
        proxy: proxy.contract.address,
      },
    },
    hre
  );

  return {
    implementation: {
      address: implementation.contract.address,
      contractName: implementation.contractName,
      constructorArguments: implementation.constructorArguments,
    },
    proxy: {
      address: proxy.contract.address,
      contractName: proxy.contractName,
      constructorArguments: proxy.constructorArguments,
    },
  };
}
