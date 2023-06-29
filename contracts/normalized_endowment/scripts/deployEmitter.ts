// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getSigners, logger, updateAddresses, verify} from "utils";

const deploySubDaoEmitter = async (
  proxyAdmin: string,
  accountAddress: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) => {
  try {
    const {run, ethers} = hre;
    // Getting Proxy contract
    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const SubDaoEmitter = await ethers.getContractFactory("SubDaoEmitter");
    const SubDaoEmitterImplementation = await SubDaoEmitter.deploy();
    await SubDaoEmitterImplementation.deployed();

    logger.out(`SubDaoEmitterAddress (Implementation): ${SubDaoEmitterImplementation.address}"`);

    const SubDaoEmitterData = SubDaoEmitterImplementation.interface.encodeFunctionData(
      "initEmitter",
      [accountAddress]
    );

    const SubDaoEmitterProxy = await ProxyContract.deploy(
      SubDaoEmitterImplementation.address,
      proxyAdmin,
      SubDaoEmitterData
    );

    await SubDaoEmitterProxy.deployed();

    logger.out(`SubDaoEmitterProxy Address (Proxy): ${SubDaoEmitterProxy.address}"`);

    logger.out("Saving addresses to contract-address.json...");
    // update address file & verify contracts
    await updateAddresses(
      {
        subDao: {
          emitter: {
            implementation: SubDaoEmitterImplementation.address,
            proxy: SubDaoEmitterProxy.address,
          },
        },
      },
      hre
    );

    if (verify_contracts) {
      await verify(hre, {address: SubDaoEmitterImplementation.address});
      await verify(hre, {
        address: SubDaoEmitterProxy.address,
        constructorArguments: [SubDaoEmitterImplementation.address, proxyAdmin, SubDaoEmitterData],
      });
    }

    return Promise.resolve(SubDaoEmitterProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
};

const deployDonationMatchEmitter = async (
  proxyAdmin: string,
  accountAddress: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) => {
  try {
    const {run, ethers} = hre;
    // Getting Proxy contract
    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const DonationMatchEmitter = await ethers.getContractFactory("DonationMatchEmitter");
    const DonationMatchEmitterImplementation = await DonationMatchEmitter.deploy();
    await DonationMatchEmitterImplementation.deployed();

    const DonationMatchEmitterData =
      DonationMatchEmitterImplementation.interface.encodeFunctionData("initDonationMatchEmiiter", [
        accountAddress,
      ]);

    const DonationMatchEmitterProxy = await ProxyContract.deploy(
      DonationMatchEmitterImplementation.address,
      proxyAdmin,
      DonationMatchEmitterData
    );

    await DonationMatchEmitterProxy.deployed();

    if (verify_contracts) {
      await verify(hre, {address: DonationMatchEmitterImplementation.address});
      await verify(hre, {
        address: DonationMatchEmitterProxy.address,
        constructorArguments: [
          DonationMatchEmitterImplementation.address,
          proxyAdmin,
          DonationMatchEmitterData,
        ],
      });
    }

    logger.out(`DonationMatchEmitterProxy Address (Proxy): ${DonationMatchEmitterProxy.address}"`);

    return Promise.resolve(DonationMatchEmitterProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
};

export async function deployEmitters(
  accountAddress: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers} = hre;

    const {proxyAdmin} = await getSigners(hre);
    const Emitters = {
      subDaoEmitter: await deploySubDaoEmitter(
        proxyAdmin.address,
        accountAddress,
        verify_contracts,
        hre
      ),
      DonationMatchEmitter: await deployDonationMatchEmitter(
        proxyAdmin.address,
        accountAddress,
        verify_contracts,
        hre
      ),
    };

    return Promise.resolve(Emitters);
  } catch (error) {
    return Promise.reject(error);
  }
}
