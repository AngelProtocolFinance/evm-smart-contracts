import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {CONFIG} from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {IndexFund__factory} from "typechain-types";
import {ProxyDeployment, deployBehindProxy, logger, updateAddresses} from "utils";

export async function deployIndexFund(
  registrar: string,
  owner: string,
  proxyAdmin: string,
  deployer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<ProxyDeployment<IndexFund__factory>> {
  const initData = IndexFund__factory.createInterface().encodeFunctionData("initialize", [
    registrar,
    CONFIG.INDEX_FUND_DATA.fundRotation,
    CONFIG.INDEX_FUND_DATA.fundingGoal,
  ]);
  const {implementation, proxy} = await deployBehindProxy(
    new IndexFund__factory(deployer),
    proxyAdmin,
    initData
  );

  // update owner
  logger.out(`Transferring ownership to: ${owner}...`);
  const proxiedIndexFund = IndexFund__factory.connect(proxy.contract.address, deployer);
  const tx = await proxiedIndexFund.transferOwnership(owner);
  logger.out(`Tx hash: ${tx.hash}`);
  await tx.wait();
  const newOwner = await proxiedIndexFund.owner();
  if (newOwner !== owner) {
    throw new Error(`Error updating owner: expected '${owner}', actual: '${newOwner}'`);
  }

  // update address file
  await updateAddresses(
    {
      indexFund: {
        proxy: proxy.contract.address,
        implementation: implementation.contract.address,
      },
    },
    hre
  );

  return {implementation, proxy};
}
