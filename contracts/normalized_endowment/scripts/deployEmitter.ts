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

    const SubdaoEmitter = await ethers.getContractFactory("SubdaoEmitter");
    const SubdaoEmitterImplementation = await SubdaoEmitter.deploy();
    await SubdaoEmitterImplementation.deployed();

    logger.out(`SubdaoEmitterAddress (Implementation): ${SubdaoEmitterImplementation.address}"`);

    const SubdaoEmitterData = SubdaoEmitterImplementation.interface.encodeFunctionData(
      "initEmitter",
      [accountAddress]
    );

    const SubdaoEmitterProxy = await ProxyContract.deploy(
      SubdaoEmitterImplementation.address,
      proxyAdmin,
      SubdaoEmitterData
    );

    await SubdaoEmitterProxy.deployed();

    logger.out(`SubdaoEmitterProxy Address (Proxy): ${SubdaoEmitterProxy.address}"`);

    logger.out("Saving addresses to contract-address.json...");
    // update address file & verify contracts
    await updateAddresses(
      {
        subDao: {
          emitter: {
            implementation: SubdaoEmitterImplementation.address,
            proxy: SubdaoEmitterProxy.address,
          },
        },
      },
      hre
    );

    if (verify_contracts) {
      await verify(hre, {address: SubdaoEmitterImplementation.address});
      await verify(hre, {
        address: SubdaoEmitterProxy.address,
        constructorArguments: [SubdaoEmitterImplementation.address, proxyAdmin, SubdaoEmitterData],
      });
    }

    return Promise.resolve(SubdaoEmitterProxy.address);
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
