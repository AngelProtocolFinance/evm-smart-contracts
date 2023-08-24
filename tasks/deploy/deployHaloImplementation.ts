import {task} from "hardhat/config";
import config from "config";
import {getAddresses, isLocalNetwork, logger, getSigners, verify} from "utils";
import {HardhatRuntimeEnvironment} from "hardhat/types";

import {deployAirdrop} from "contracts/halo/airdrop/scripts/deploy";
import {deployCollector} from "contracts/halo/collector/scripts/deploy";
import {deployCommunity} from "contracts/halo/community/scripts/deploy";
import {deployGov} from "contracts/halo/gov/scripts/deploy";
import {deployStaking} from "contracts/halo/staking/scripts/deploy";
import {deployVesting} from "contracts/halo/vesting/scripts/deploy";

task("deploy:HaloImplementation", "Will deploy HaloImplementation contract")
  .addFlag("skipVerify", "Skip contract verification")
  .addOptionalParam(
    "registrar",
    "Registrar contract address. Will do a local lookup from contract-address.json if none is provided."
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
    const {proxyAdmin} = await getSigners(hre);

    const ERC20 = await ethers.getContractFactory("ERC20");
    const ERC20Instance = await ERC20.deploy();
    await ERC20Instance.deployed();

    if (verify_contracts) {
      await verify(hre, {address: ERC20Instance.address});
    }
    console.log("Halo Address (ERC20):", ERC20Instance.address);

    return Promise.resolve(ERC20Instance.address);
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
    const {CommunitySpendLimit, distributorSpendLimit} = config.HALO_IMPLEMENTATION_DATA;

    const {ethers, run, network} = hre;
    const {proxyAdmin, airdropOwner, apTeam1} = await getSigners(hre);

    const halo = registrarContract; // await deployHalo(verify_contracts, hre);
    const gov = registrarContract; //await deployGov({ _token: halo, _timelock: apTeam1.address }, verify_contracts, hre);
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
        { haloToken: halo },
        verify_contracts,
        hre
      ),
      Staking: await deployStaking(
        {
          haloToken: halo,
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
