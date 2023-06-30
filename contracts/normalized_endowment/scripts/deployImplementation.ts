// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {getSigners, logger, updateAddresses, verify} from "utils";

import {DonationMatchMessages} from "typechain-types/contracts/normalized_endowment/donation-match/DonationMatch.sol/DonationMatch";
import {SubDaoToken__factory} from "typechain-types/factories/contracts/normalized_endowment/subdao-token/subdao-token.sol";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const deployDonationMatch = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
  try {
    const {network, run, ethers} = hre;
    const DonationMatch = await ethers.getContractFactory("DonationMatch");
    const donationMatchImplementation = await DonationMatch.deploy();
    await donationMatchImplementation.deployed();

    if (verify_contracts) {
      await verify(hre, {address: donationMatchImplementation.address});
    }

    return Promise.resolve(donationMatchImplementation.address);
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};

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
      await verify(hre, {address: IncentivisedVotingLockupImplementation.address});
    }

    return Promise.resolve(IncentivisedVotingLockupImplementation.address);
  } catch (error) {
    logger.out(error, logger.Level.Error);
    return Promise.reject(error);
  }
};

const deployDonationMatchCharity = async (
  proxyAdmin: string,
  deployDonationMatchCharity: DonationMatchMessages.InstantiateMessageStruct,
  verify_contracts: boolean,
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

    logger.out(`DonationMatchCharityProxy Address (Proxy): ${DonationMatchProxy.address}`);

    if (verify_contracts) {
      await verify(hre, {address: DonationMatchImplementation.address});

      await verify(hre, {
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

const deploySubDao = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
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
      await verify(hre, {address: SUB_DAO_LIB.address});

      await verify(hre, {address: SubDaoImplementation.address});
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
      await verify(hre, {address: subDaoERC20Implementation.address});
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
    const subDaoVeBondingToken = new SubDaoToken__factory();
    const subDaoVeBondingTokenImpl = await subDaoVeBondingToken.deploy();
    await subDaoVeBondingTokenImpl.deployed();

    if (verify_contracts) {
      await verify(hre, {address: subDaoVeBondingTokenImpl.address});
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
      await verify(hre, {address: IncentivisedVotingLockupImplementation.address});
    }

    return Promise.resolve(IncentivisedVotingLockupImplementation.address);
  } catch (e) {
    console.error(e);
    return Promise.reject(e);
  }
};

export async function deployImplementation(
  donationMatchCharityData: DonationMatchMessages.InstantiateMessageStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {proxyAdmin} = await getSigners(hre);

    const implementations = {
      cw900lv: await deployCw900lvImplementation(verify_contracts, hre),
      donationMatch: {
        implementation: await deployDonationMatch(verify_contracts, hre),
      },
      donationMatchCharity: await deployDonationMatchCharity(
        proxyAdmin.address,
        donationMatchCharityData,
        verify_contracts,
        hre
      ),
      feeDistributor: await deployFeeDistributor(verify_contracts, hre),
      incentivisedVotingLockup: {
        implementation: await deployIncentivisedVotingLockup(verify_contracts, hre),
      },
      subDao: {
        implementation: await deploySubDao(verify_contracts, hre),
        token: await deploySubDaoERC20(verify_contracts, hre),
        veBondingToken: await deploySubDaoVeBondingToken(verify_contracts, hre),
      },
    };

    const {cw900lv, feeDistributor, ...toUpdate} = implementations;

    logger.out("Saving addresses to contract-address.json...");
    // update address file
    await updateAddresses(toUpdate, hre);

    return Promise.resolve(implementations);
  } catch (error) {
    return Promise.reject(error);
  }
}
