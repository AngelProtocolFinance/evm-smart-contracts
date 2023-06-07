// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {envConfig, getSigners} from "utils";

import {Airdrop} from "../halo/airdrop";
import {Collector} from "../halo/collector";
import {Community} from "../halo/community";
import {distributor} from "../halo/distributor";
import {deployGov} from "../halo/gov";
import {GovHodler} from "../halo/gov-hodler";
import {Staking} from "../halo/staking";
import {Vesting} from "../halo/vesting";

const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

const deployERC20 = async (verify_contracts: boolean, hre: HardhatRuntimeEnvironment) => {
  try {
    const {ethers, run, network} = hre;
    const {proxyAdmin} = await getSigners(ethers);

    const ERC20Upgrade = await ethers.getContractFactory("ERC20Upgrade");
    const ERC20UpgradeInstance = await ERC20Upgrade.deploy();
    await ERC20UpgradeInstance.deployed();

    console.log("ERC20Upgrade implementation address:", ERC20UpgradeInstance.address);

    const ProxyContract = await ethers.getContractFactory("ProxyContract");

    const ERC20UpgradeData = ERC20UpgradeInstance.interface.encodeFunctionData("initialize");

    const ERC20UpgradeProxy = await ProxyContract.deploy(
      ERC20UpgradeInstance.address,
      proxyAdmin.address,
      ERC20UpgradeData
    );

    await ERC20UpgradeProxy.deployed();

    if (verify_contracts) {
      await hre.run("verify:verify", {
        address: ERC20UpgradeInstance.address,
        constructorArguments: [],
      });
      await hre.run("verify:verify", {
        address: ERC20UpgradeProxy.address,
        constructorArguments: [ERC20UpgradeInstance.address, proxyAdmin.address, ERC20UpgradeData],
      });
    }
    console.log("ERC20Upgrade Address (Proxy):", ERC20UpgradeProxy.address);

    return Promise.resolve(ERC20UpgradeProxy.address);
  } catch (error) {
    return Promise.reject(error);
  }
};

export async function deployHaloImplementation(
  swapRouter: string,
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  try {
    const {GovHodlerOwner, CommunitySpendLimit, distributorSpendLimit} =
      config.HALO_IMPLEMENTATION_DATA;

    const {ethers, run, network} = hre;

    const {proxyAdmin, airdropOwner, apTeam2, apTeam3} = await getSigners(ethers);

    let halo = await deployERC20(verify_contracts, hre);

    let gov = await deployGov(halo, verify_contracts, hre);

    let halo_code = await ethers.getContractAt("ERC20Upgrade", halo);

    if (network.config.chainId !== envConfig.PROD_NETWORK_ID) {
      await halo_code.mint(
        proxyAdmin.address,
        ethers.utils.parseEther("100000000000000000000000000")
      );
    }

    await halo_code.transferOwnership(gov.GovProxy); // TODO: uncomment this before deploying to prod. Keep this commented while testing

    const distributorAddress = await distributor(
      proxyAdmin.address,
      {
        timelockContract: gov.TimeLock,
        haloToken: halo,
        allowlist: [apTeam2.address, apTeam3.address],
        spendLimit: distributorSpendLimit,
      },
      hre
    );
    var response = {
      Halo: halo,
      Gov: gov,
      GovHodler: await GovHodler(
        proxyAdmin.address,
        {
          owner: GovHodlerOwner,
          haloToken: halo,
          timelockContract: gov.TimeLock,
        },
        hre
      ),
      Airdrop: await Airdrop(
        proxyAdmin.address,
        {
          owner: airdropOwner.address,
          haloToken: halo,
        },
        hre
      ),
      Community: await Community(
        proxyAdmin.address,
        {
          timelockContract: gov.TimeLock,
          haloToken: halo,
          spendLimit: CommunitySpendLimit,
        },
        hre
      ),
      distributor: distributorAddress,
      vesting: await Vesting(
        proxyAdmin.address,
        {
          haloToken: halo,
        },
        hre
      ),
      collector: await Collector(
        proxyAdmin.address,
        {
          timelockContract: gov.TimeLock,
          govContract: gov.GovProxy,
          swapFactory: swapRouter,
          haloToken: halo,
          distributorContract: distributorAddress,
          rewardFactor: 90,
        },
        hre
      ),
      staking: await Staking(
        proxyAdmin.address,
        {
          haloToken: halo,
          interestRate: 10,
        },
        hre
      ),
    };

    return Promise.resolve(response);
  } catch (error) {
    return Promise.reject(error);
  }
}
