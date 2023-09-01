import {HardhatRuntimeEnvironment} from "hardhat/types";
import {StakingMessages} from "typechain-types/contracts/halo/staking/Staking.sol/Staking";
import {
  getContractName,
  getProxyAdminOwner,
  isLocalNetwork,
  logger,
  updateAddresses,
  verify,
} from "utils";

export async function deployStaking(
  StakingDataInput: StakingMessages.InstantiateMsgStruct,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {ethers, run, network} = hre;
    const proxyAdmin = await getProxyAdminOwner(hre);
    const Staking = await ethers.getContractFactory("Staking");
    const StakingInstance = await Staking.deploy();
    await StakingInstance.deployed();
    logger.out(`Staking implementation address: ${StakingInstance.address}"`);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const StakingData = StakingInstance.interface.encodeFunctionData("initialize", [
      StakingDataInput,
    ]);
    const StakingProxy = await ProxyContract.deploy(
      StakingInstance.address,
      proxyAdmin.address,
      StakingData
    );
    await StakingProxy.deployed();
    logger.out(`Staking Address (Proxy): ${StakingProxy.address}"`);

    // update address file & verify contracts
    await updateAddresses(
      {
        halo: {
          staking: {
            proxy: StakingProxy.address,
            implementation: StakingInstance.address,
          },
        },
      },
      hre
    );

    if (!isLocalNetwork(hre) && verify_contracts) {
      await verify(hre, {contractName: getContractName(Staking), address: StakingInstance.address});
      await verify(hre, {
        contractName: getContractName(ProxyContract),
        address: StakingProxy.address,
      });
    }

    return Promise.resolve(StakingProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
}
