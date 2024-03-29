import {task} from "hardhat/config";
import {CONFIG} from "config";
import {getContractName, getAddresses, isLocalNetwork, logger, getSigners, verify} from "utils";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {Halo__factory} from "typechain-types";

import {deployAirdrop} from "contracts/halo/airdrop/scripts/deploy";
import {deployCollector} from "contracts/halo/collector/scripts/deploy";
import {deployCommunity} from "contracts/halo/community/scripts/deploy";
import {deployGov} from "contracts/halo/gov/scripts/deploy";
import {deployStaking} from "contracts/halo/staking/scripts/deploy";
import {deployVesting} from "contracts/halo/vesting/scripts/deploy";
import {cliTypes} from "tasks/types";

task("deploy:HaloImplementation", "Will deploy HaloImplementation contract")
  .addFlag("skipVerify", "Skip contract verification")
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided.",
    undefined,
    cliTypes.address
  )
  .setAction(async (taskArgs, hre) => {
    try {
      const addresses = await getAddresses(hre);

      const registrar = taskArgs.registrar || addresses.registrar.proxy;
      const verify_contracts = !isLocalNetwork(hre) && !taskArgs.skipVerify;

      await deployHaloImplementation(registrar, verify_contracts, hre);
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });

const deployHalo = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
  try {
    const {ethers, run, network} = hre;
    const {deployer} = await getSigners(hre);

    const factory = new Halo__factory(deployer);
    const Halo = await factory.deploy();
    await Halo.deployed();

    if (verify_contracts) {
      await verify(hre, {contractName: getContractName(factory), contract: Halo});
    }
    console.log("Halo Address (ERC20):", Halo.address);

    return Promise.resolve(Halo.address);
  } catch (error) {
    return Promise.reject(error);
  }
};

export async function deployHaloImplementation(
  registrarContract: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {CommunitySpendLimit, distributorSpendLimit} = CONFIG.HALO_IMPLEMENTATION_DATA;

    const {ethers, run, network} = hre;
    const {airdropOwner, apTeam1} = await getSigners(hre);

    const halo = await deployHalo(verify_contracts, hre);
    const gov = await deployGov(halo, await apTeam1.getAddress(), verify_contracts, hre);
    var response = {
      Halo: halo,
      Gov: gov,
      Airdrop: await deployAirdrop(
        {
          haloToken: halo,
        },
        verify_contracts,
        hre
      ),
      Community: await deployCommunity(
        {
          haloToken: halo,
          spendLimit: CommunitySpendLimit,
        },
        verify_contracts,
        hre
      ),
      Vesting: await deployVesting(
        {
          vestingDuration: 63072000, // 2 years (in seconds)
          vestingSlope: 100, // 2 decimals
          haloToken: halo,
        },
        verify_contracts,
        hre
      ),
      Staking: await deployStaking(
        {
          haloToken: halo,
          stakePeriod: 1814400, // 21 days in seconds
          interestRate: 10,
        },
        verify_contracts,
        hre
      ),
      Collector: await deployCollector(
        {
          registrarContract: registrarContract,
          slippage: 500,
          rewardFactor: 90,
        },
        verify_contracts,
        hre
      ),
    };

    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}
