const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import config from 'config'
import { updateAddresses } from "utils"
import { IndexFundMessage } from "typechain-types/contracts/core/index-fund/IndexFund"

export async function deployIndexFund(initFactoryData: IndexFundMessage.InstantiateMessageStruct, verify_contracts: boolean, hre: HardhatRuntimeEnvironment) {
    try {
        const {network,run,ethers} = hre;

        let [deployer, _proxyAdmin] = await ethers.getSigners();
        const IndexContract = await ethers.getContractFactory("IndexFund");

        const indexContract = await IndexContract.deploy();
        await indexContract.deployed();

        console.log(
            "Index fund implementation address:",
            indexContract.address
        );

        const ProxyContract = await ethers.getContractFactory("ProxyContract");

        const IndexFundContractData =
            indexContract.interface.encodeFunctionData(
                "initIndexFund",
                [initFactoryData]
            );

        const IndexFundContractProxy = await ProxyContract.deploy(
            indexContract.address,
            _proxyAdmin.address,
            IndexFundContractData
        );
        await IndexFundContractProxy.deployed();

        await updateAddresses(
            { 
                indexFundAddress: {
                    indexFundProxy: IndexFundContractProxy.address,
                    indexFundImplementation: indexContract.address,
                }
            },
            hre
        );

        if(verify_contracts){
            await run("verify:verify", {
                address: indexContract.address,
                constructorArguments: [],
            });
            await run("verify:verify", {
                address: IndexFundContractProxy.address,
                constructorArguments: [indexContract.address,_proxyAdmin.address,IndexFundContractData],
            });
        }

        return Promise.resolve(IndexFundContractProxy.address);
    } catch (error) {
        console.log(error);
        return Promise.reject(false);
    }
}
