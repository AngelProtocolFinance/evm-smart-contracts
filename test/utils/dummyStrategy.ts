import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {DummyStrategy, DummyStrategy__factory, IStrategy} from "typechain-types";
import {DEFAULT_STRATEGY_SELECTOR} from "./constants";

export async function deployDummyStrategy(
  deployer: SignerWithAddress,
  {
    baseToken,
    yieldToken,
    admin,
    strategySelector = DEFAULT_STRATEGY_SELECTOR,
  }: {
    baseToken: string;
    yieldToken: string;
    admin: string;
    strategySelector?: string;
  }
): Promise<DummyStrategy> {
  let Strategy = new DummyStrategy__factory(deployer);
  let stratInitConfig: IStrategy.StrategyConfigStruct = {
    baseToken: baseToken,
    yieldToken: yieldToken,
    admin: admin,
    strategySelector: strategySelector,
  };
  const strategy = await Strategy.deploy(stratInitConfig);
  await strategy.deployed();
  return strategy;
}
