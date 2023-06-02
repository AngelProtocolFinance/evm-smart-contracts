// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import {HardhatRuntimeEnvironment} from "hardhat/types";
import {logger, updateAddresses} from "utils";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const deployCw900lvImplementation = async (
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) => {
  try {
    const {network, run, ethers} = hre;
    const IncentivisedVotingLockup = await ethers.getContractFactory("IncentivisedVotingLockup");
    const IncentivisedVotingLockupImplementation = await IncentivisedVotingLockup.deploy();
    await IncentivisedVotingLockupImplementation.deployed();

    if (verify_contracts) {
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

const deploySubDao = async (
  ANGEL_CORE_STRUCT: string,
  verify_contracts: boolean,
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

    if (verify_contracts) {
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

const deploySubDaoERC20 = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
  try {
    const {network, run, ethers} = hre;
    const subDaoERC20 = await ethers.getContractFactory("NewERC20");
    const subDaoERC20Implementation = await subDaoERC20.deploy();
    await subDaoERC20Implementation.deployed();

    if (verify_contracts) {
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

const deploySubDaoVeBondingToken = async (
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) => {
  try {
    const {network, run, ethers} = hre;

    const subDaoVeBondingToken = await ethers.getContractFactory("SubDaoToken");
    const subDaoVeBondingTokenImpl = await subDaoVeBondingToken.deploy();
    await subDaoVeBondingTokenImpl.deployed();

    if (verify_contracts) {
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

const deployFeeDistributor = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
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

const deployIncentivisedVotingLockup = async (
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) => {
  try {
    const {network, run, ethers} = hre;
    const IncentivisedVotingLockup = await ethers.getContractFactory("IncentivisedVotingLockup");
    const IncentivisedVotingLockupImplementation = await IncentivisedVotingLockup.deploy();
    await IncentivisedVotingLockupImplementation.deployed();

    if (verify_contracts) {
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
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const implementations = {
      cw900lv: await deployCw900lvImplementation(verify_contracts, hre),
      feeDistributor: await deployFeeDistributor(verify_contracts, hre),
      incentivisedVotingLockup: {
        implementation: await deployIncentivisedVotingLockup(verify_contracts, hre),
      },
      subDao: {
        implementation: await deploySubDao(ANGEL_CORE_STRUCT, verify_contracts, hre),
        token: await deploySubDaoERC20(verify_contracts, hre),
        veBondingToken: await deploySubDaoVeBondingToken(verify_contracts, hre),
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
