import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import { ADDRESS_ZERO } from "utils";
import {
  DummyStrategy,
  DummyStrategy__factory,
  IStrategy
} from "typechain-types"
import {DEFAULT_STRATEGY_SELECTOR} from "./constants"

export async function deployDummyStrategy(
  deployer: SignerWithAddress,
  {
    baseToken, 
    yieldToken,
    admin,
    strategySelector = DEFAULT_STRATEGY_SELECTOR,
    lockedVault = ADDRESS_ZERO,
    liquidVault = ADDRESS_ZERO,
  } : {
    baseToken : string, 
    yieldToken : string,
    admin : string,
    strategySelector? : string,
    lockedVault? : string,
    liquidVault? : string,
  }
  ): Promise<DummyStrategy> {
  let Strategy = new DummyStrategy__factory(deployer);
  let stratInitConfig: IStrategy.StrategyConfigStruct = {
    baseToken: baseToken, 
    yieldToken: yieldToken,
    admin: admin,
    strategySelector: strategySelector,
    lockedVault: lockedVault,
    liquidVault: liquidVault,
  }
  const strategy = await Strategy.deploy(stratInitConfig);
  await strategy.deployed();
  return strategy;
}