import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {DummyStrategy, DummyStrategy__factory, IStrategy} from "typechain-types";
import {DEFAULT_STRATEGY_ID} from "./constants";

export async function deployDummyStrategy(
  deployer: SignerWithAddress,
  {
    baseToken,
    yieldToken,
    admin,
    strategyId = DEFAULT_STRATEGY_ID,
  }: {
    baseToken: string;
    yieldToken: string;
    admin: string;
    strategyId?: string;
  }
): Promise<DummyStrategy> {
  let Strategy = new DummyStrategy__factory(deployer);
  let stratInitConfig: IStrategy.StrategyConfigStruct = {
    baseToken: baseToken,
    yieldToken: yieldToken,
    admin: admin,
    strategyId: strategyId,
  };
  const strategy = await Strategy.deploy(stratInitConfig);
  await strategy.deployed();
  return strategy;
}
