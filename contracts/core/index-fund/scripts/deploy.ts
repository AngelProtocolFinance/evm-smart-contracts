import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {IndexFund__factory, ProxyContract__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";

export async function deployIndexFund(
  registrar: string,
  owner: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying IndexFund...");

  const {deployer, proxyAdmin} = await getSigners(hre);

  logger.out("Deploying Implementation...");
  const indexFundFactory = new IndexFund__factory(proxyAdmin);
  const indexFund = await indexFundFactory.deploy();
  await indexFund.deployed();
  logger.out(`Address: ${indexFund.address}`);

  logger.out("Deploying Proxy...");
  const initData = indexFund.interface.encodeFunctionData("initIndexFund", [
    {
      registrarContract: registrar,
      fundRotation: config.INDEX_FUND_DATA.fundRotation,
      fundMemberLimit: config.INDEX_FUND_DATA.fundMemberLimit,
      fundingGoal: config.INDEX_FUND_DATA.fundingGoal,
    },
  ]);
  const proxyFactory = new ProxyContract__factory(deployer);
  const indexFundProxy = await proxyFactory.deploy(indexFund.address, proxyAdmin.address, initData);
  await indexFundProxy.deployed();
  logger.out(`Address: ${indexFund.address}`);

  logger.out(`Updating IndexFund owner to: ${owner}...`);
  const proxiedIndexFund = IndexFund__factory.connect(indexFundProxy.address, deployer);
  const tx = await proxiedIndexFund.updateOwner(owner);
  await tx.wait();

  await updateAddresses(
    {
      indexFund: {
        proxy: indexFundProxy.address,
        implementation: indexFund.address,
      },
    },
    hre
  );

  if (verify_contracts) {
    logger.out("Verifying...");
    await hre.run("verify:verify", {
      address: indexFund.address,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: indexFundProxy.address,
      constructorArguments: [indexFund.address, proxyAdmin.address, initData],
    });
  }

  return {implementation: indexFund, proxy: indexFundProxy};
}
