import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {IndexFund__factory, ProxyContract__factory} from "typechain-types";
import {ADDRESS_ZERO, getSigners, logger, updateAddresses, validateAddress, verify} from "utils";

export async function deployIndexFund(
  registrar: string,
  owner: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying IndexFund...");

  const {deployer, proxyAdmin} = await getSigners(hre);

  try {
    validateAddress(registrar, "registrar");
    validateAddress(owner, "owner");

    // deploy implementation
    logger.out("Deploying implementation...");
    const indexFundFactory = new IndexFund__factory(proxyAdmin);
    const indexFund = await indexFundFactory.deploy();
    await indexFund.deployed();
    logger.out(`Address: ${indexFund.address}`);

    // deploy proxy
    logger.out("Deploying proxy...");
    const initData = indexFund.interface.encodeFunctionData("initIndexFund", [
      {
        registrarContract: registrar,
        fundRotation: config.INDEX_FUND_DATA.fundRotation,
        fundMemberLimit: config.INDEX_FUND_DATA.fundMemberLimit,
        fundingGoal: config.INDEX_FUND_DATA.fundingGoal,
      },
    ]);
    const proxyFactory = new ProxyContract__factory(deployer);
    const indexFundProxy = await proxyFactory.deploy(
      indexFund.address,
      proxyAdmin.address,
      initData
    );
    await indexFundProxy.deployed();
    logger.out(`Address: ${indexFundProxy.address}`);

    // update owner
    logger.out(`Updating IndexFund owner to: ${owner}...`);
    const proxiedIndexFund = IndexFund__factory.connect(indexFundProxy.address, deployer);
    const tx = await proxiedIndexFund.updateOwner(owner);
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

    if (verify_contracts) {
      await verify(hre, {address: indexFund.address});
      await verify(hre, {
        address: indexFundProxy.address,
        constructorArguments: [indexFund.address, proxyAdmin.address, initData],
      });
    }

    return {implementation: indexFund, proxy: indexFundProxy};
  } catch (error) {
    logger.out(error, logger.Level.Error);
    return {
      implementation: IndexFund__factory.connect(ADDRESS_ZERO, proxyAdmin),
      proxy: ProxyContract__factory.connect(ADDRESS_ZERO, proxyAdmin),
    };
  }
}
