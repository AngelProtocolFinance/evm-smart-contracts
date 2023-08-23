import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {IndexFund__factory, ProxyContract__factory} from "typechain-types";
import {Deployment, getContractName, getSigners, logger, updateAddresses} from "utils";

export async function deployIndexFund(
  registrar: string,
  owner: string,
  hre: HardhatRuntimeEnvironment
): Promise<{
  implementation: Deployment;
  proxy: Deployment;
}> {
  logger.out("Deploying IndexFund...");

  const {deployer, proxyAdmin} = await getSigners(hre);

  // deploy implementation
  logger.out("Deploying implementation...");
  const indexFundFactory = new IndexFund__factory(proxyAdmin);
  const indexFund = await indexFundFactory.deploy();
  await indexFund.deployed();
  logger.out(`Address: ${indexFund.address}`);

  // deploy proxy
  logger.out("Deploying proxy...");
  const initData = indexFund.interface.encodeFunctionData("initialize", [
    registrar,
    config.INDEX_FUND_DATA.fundRotation,
    config.INDEX_FUND_DATA.fundingGoal,
  ]);
  const proxyFactory = new ProxyContract__factory(deployer);
  const indexFundProxy = await proxyFactory.deploy(indexFund.address, proxyAdmin.address, initData);
  await indexFundProxy.deployed();
  logger.out(`Address: ${indexFundProxy.address}`);

  // update owner
  logger.out(`Updating IndexFund owner to: ${owner}...`);
  const proxiedIndexFund = IndexFund__factory.connect(indexFundProxy.address, deployer);
  const tx = await proxiedIndexFund.transferOwnership(owner);
  await tx.wait();

  // update address file & verify contracts
  await updateAddresses(
    {
      indexFund: {
        proxy: indexFundProxy.address,
        implementation: indexFund.address,
      },
    },
    hre
  );

  return {
    implementation: {address: indexFund.address, contractName: getContractName(indexFundFactory)},
    proxy: {address: indexFundProxy.address, contractName: getContractName(proxyFactory)},
  };
}
