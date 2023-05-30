const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getSigners, updateAddresses} from "utils";
import {IndexFundMessage} from "typechain-types/contracts/core/index-fund/IndexFund";

export async function deployIndexFund(
  initFactoryData: IndexFundMessage.InstantiateMessageStruct,
  owner: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {network, run, ethers} = hre;

    const {proxyAdmin} = await getSigners(ethers);
    const IndexContract = await ethers.getContractFactory("IndexFund", proxyAdmin);
    const indexContract = await IndexContract.deploy();
    await indexContract.deployed();

    console.log("Index fund implementation address:", indexContract.address);

    console.log("Updating IndexFund owner to: ", owner, "...");
    const tx = await indexContract.updateOwner(owner);
    await tx.wait();

    const ProxyContract = await ethers.getContractFactory("ProxyContract", proxyAdmin);

    const IndexFundContractData = indexContract.interface.encodeFunctionData("initIndexFund", [
      initFactoryData,
    ]);

    const IndexFundContractProxy = await ProxyContract.deploy(
      indexContract.address,
      proxyAdmin.address,
      IndexFundContractData
    );
    await IndexFundContractProxy.deployed();

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
