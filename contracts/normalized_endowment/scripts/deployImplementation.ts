// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import {HardhatRuntimeEnvironment} from "hardhat/types";
import {DonationMatchMessages} from "typechain-types/contracts/normalized_endowment/donation-match/DonationMatch.sol/DonationMatch";
import {getSigners, logger, updateAddresses} from "utils";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const deployDonationMatch = async (verify: boolean, hre: HardhatRuntimeEnvironment) => {
  try {
    const {network, run, ethers} = hre;
    const DonationMatch = await ethers.getContractFactory("DonationMatch");
    const donationMatchImplementation = await DonationMatch.deploy();
    await donationMatchImplementation.deployed();

    if (verify) {
      await run("verify:verify", {
        address: donationMatchImplementation.address,
        constructorArguments: [],
      });
    }

    return Promise.resolve(donationMatchImplementation.address);
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};

const deployCw900lvImplementation = async (verify: boolean, hre: HardhatRuntimeEnvironment) => {
  try {
    const {network, run, ethers} = hre;
    const IncentivisedVotingLockup = await ethers.getContractFactory("IncentivisedVotingLockup");
    const IncentivisedVotingLockupImplementation = await IncentivisedVotingLockup.deploy();
    await IncentivisedVotingLockupImplementation.deployed();

    if (verify) {
      await run("verify:verify", {
        address: IncentivisedVotingLockupImplementation.address,
        constructorArguments: [],
      });
    }

    return Promise.resolve(IncentivisedVotingLockupImplementation.address);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

const deployDonationMatchCharity = async (
  proxyAdmin: string,
  deployDonationMatchCharity: DonationMatchMessages.InstantiateMessageStruct,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) => {
  try {
    const {network, run, ethers} = hre;
    // Getting Proxy contract
    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const DonationMatch = await ethers.getContractFactory("DonationMatchCharity");
    const DonationMatchImplementation = await DonationMatch.deploy();
    await DonationMatchImplementation.deployed();

    // const DonationMatchEmitter = await ethers.getContractFactory('DonationMatchEmitter');
    // const DonationMatchEmitterImplementation = await DonationMatchEmitter.deploy();
    // await DonationMatchEmitterImplementation.deployed();

    const DonationMatchData = DonationMatchImplementation.interface.encodeFunctionData(
      "initialize",
      [deployDonationMatchCharity]
    );

    const DonationMatchProxy = await ProxyContract.deploy(
      DonationMatchImplementation.address,
      proxyAdmin,
      DonationMatchData
    );

    await DonationMatchProxy.deployed();

    console.log("DonationMatchCharityProxy Address (Proxy):", DonationMatchProxy.address);

    if (verify) {
      await run("verify:verify", {
        address: DonationMatchImplementation.address,
        constructorArguments: [],
      });

      await run("verify:verify", {
        address: DonationMatchProxy.address,
        constructorArguments: [DonationMatchImplementation.address, proxyAdmin, DonationMatchData],
      });
    }

    return Promise.resolve({
      implementation: DonationMatchImplementation.address,
      proxy: DonationMatchProxy.address,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const deploySubDao = async (
  ANGEL_CORE_STRUCT: string,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) => {
  try {
    const {network, run, ethers} = hre;
    const SubDaoLib = await ethers.getContractFactory("SubDaoLib");

    let SUB_DAO_LIB = await SubDaoLib.deploy();
    await SUB_DAO_LIB.deployed();

    const SubDao = await ethers.getContractFactory("SubDao", {
      libraries: {
        SubDaoLib: SUB_DAO_LIB.address,
      },
    });
    const SubDaoImplementation = await SubDao.deploy();
    await SubDaoImplementation.deployed();

    if (verify) {
      await run("verify:verify", {
        address: SUB_DAO_LIB.address,
        constructorArguments: [],
      });

      await run("verify:verify", {
        address: SubDaoImplementation.address,
        constructorArguments: [],
      });
    }

    return Promise.resolve(SubDaoImplementation.address);
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};

const deploySubDaoERC20 = async (verify: boolean, hre: HardhatRuntimeEnvironment) => {
  try {
    const {network, run, ethers} = hre;
    const subDaoERC20 = await ethers.getContractFactory("NewERC20");
    const subDaoERC20Implementation = await subDaoERC20.deploy();
    await subDaoERC20Implementation.deployed();

    if (verify) {
      await run("verify:verify", {
        address: subDaoERC20Implementation.address,
        constructorArguments: [],
      });
    }

    return Promise.resolve(subDaoERC20Implementation.address);
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};

const deploySubDaoVeBondingToken = async (verify: boolean, hre: HardhatRuntimeEnvironment) => {
  try {
    const {network, run, ethers} = hre;

    const subDaoVeBondingToken = await ethers.getContractFactory("SubDaoToken");
    const subDaoVeBondingTokenImpl = await subDaoVeBondingToken.deploy();
    await subDaoVeBondingTokenImpl.deployed();

    if (verify) {
      await run("verify:verify", {
        address: subDaoVeBondingTokenImpl.address,
        constructorArguments: [],
      });
    }

    return Promise.resolve(subDaoVeBondingTokenImpl.address);
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};

const deployFeeDistributor = async (verify: boolean, hre: HardhatRuntimeEnvironment) => {
  try {
    const {network, run, ethers} = hre;
    // const FeeDistributor = await ethers.getContractFactory('FeeDistributorveToken');
    // const feeDistributorImplementation = await FeeDistributor.deploy();
    // await feeDistributorImplementation.deployed();

    return Promise.resolve(ADDRESS_ZERO);
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};

const deployIncentivisedVotingLockup = async (verify: boolean, hre: HardhatRuntimeEnvironment) => {
  try {
    const {network, run, ethers} = hre;
    const IncentivisedVotingLockup = await ethers.getContractFactory("IncentivisedVotingLockup");
    const IncentivisedVotingLockupImplementation = await IncentivisedVotingLockup.deploy();
    await IncentivisedVotingLockupImplementation.deployed();

    if (verify) {
      await run("verify:verify", {
        address: IncentivisedVotingLockupImplementation.address,
        constructorArguments: [],
      });
    }

    return Promise.resolve(IncentivisedVotingLockupImplementation.address);
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};

export async function deployImplementation(
  ANGEL_CORE_STRUCT: string,
  donationMatchCharityData: DonationMatchMessages.InstantiateMessageStruct,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {proxyAdmin} = await getSigners(hre.ethers);

    const implementations = {
      cw900lv: await deployCw900lvImplementation(verify, hre),
      donationMatch: {
        implementation: await deployDonationMatch(verify, hre),
      },
      donationMatchCharity: await deployDonationMatchCharity(
        proxyAdmin.address,
        donationMatchCharityData,
        verify,
        hre
      ),
      feeDistributor: await deployFeeDistributor(verify, hre),
      incentivisedVotingLockup: {
        implementation: await deployIncentivisedVotingLockup(verify, hre),
      },
      subDao: {
        implementation: await deploySubDao(ANGEL_CORE_STRUCT, verify, hre),
        token: await deploySubDaoERC20(verify, hre),
        veBondingToken: await deploySubDaoVeBondingToken(verify, hre),
      },
    };

    const {cw900lv, feeDistributor, ...toUpdate} = implementations;

    logger.out("Saving addresses to contract-address.json...");
    await updateAddresses(toUpdate, hre);

    return Promise.resolve(implementations);
  } catch (error) {
    return Promise.reject(error);
  }
}
