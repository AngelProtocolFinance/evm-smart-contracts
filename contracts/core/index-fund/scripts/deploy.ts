import {HardhatRuntimeEnvironment} from "hardhat/types";
import {IndexFund__factory} from "typechain-types";
import {getSigners, updateAddresses} from "utils";

import {IndexFundMessage} from "typechain-types/contracts/core/index-fund/IndexFund";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export async function deployIndexFund(
  initFactoryData: IndexFundMessage.InstantiateMessageStruct,
  owner: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {network, run, ethers} = hre;

    const {deployer, proxyAdmin} = await getSigners(ethers);
    const IndexContract = await ethers.getContractFactory("IndexFund", proxyAdmin);
    const indexContract = await IndexContract.deploy();
    await indexContract.deployed();

    console.log("Index fund implementation address:", indexContract.address);

    const ProxyContract = await ethers.getContractFactory("ProxyContract", deployer);

    const IndexFundContractData = indexContract.interface.encodeFunctionData("initIndexFund", [
      initFactoryData,
    ]);

    const IndexFundContractProxy = await ProxyContract.deploy(
      indexContract.address,
      proxyAdmin.address,
      IndexFundContractData
    );
    await IndexFundContractProxy.deployed();

    console.log("Updating IndexFund owner to: ", owner, "...");
    const proxiedIndexFund = IndexFund__factory.connect(IndexFundContractProxy.address, deployer);
    const tx = await proxiedIndexFund.updateOwner(owner);
    await tx.wait();

    await updateAddresses(
      {
        indexFund: {
          proxy: IndexFundContractProxy.address,
          implementation: indexContract.address,
        },
      },
      hre
    );

    if (verify_contracts) {
      await run("verify:verify", {
        address: indexContract.address,
        constructorArguments: [],
      });
      await run("verify:verify", {
        address: IndexFundContractProxy.address,
        constructorArguments: [indexContract.address, proxyAdmin.address, IndexFundContractData],
      });
    }

    return Promise.resolve(IndexFundContractProxy.address);
  } catch (error) {
    console.log(error);
    return Promise.reject(false);
  }
}
