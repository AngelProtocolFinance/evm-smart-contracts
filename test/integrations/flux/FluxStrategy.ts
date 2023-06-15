import {expect} from "chai";
import {ethers, upgrades} from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  DummyERC20,
  DummyVault,
  IStrategy,
  FluxStrategy,
  FluxStrategy__factory
} from "typechain-types";
import {
  deployDummyFUSDC,
  deployDummyVault,
  deployDummyERC20,
  DEFAULT_STRATEGY_SELECTOR
} from "test/utils"

describe("FluxStrategy", function () {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let collector: SignerWithAddress;

  async function deployFluxStrategy(
    {
      baseToken, 
      yieldToken,
      admin,
      strategySelector = DEFAULT_STRATEGY_SELECTOR,
    } : {
      baseToken: string, 
      yieldToken: string,
      admin: string,
      strategySelector?: string,
    }
    ): Promise<FluxStrategy> {
    let Flux = new FluxStrategy__factory(owner);
    let stratInitConfig: IStrategy.StrategyConfigStruct = {
      strategySelector: strategySelector,
      baseToken: baseToken, 
      yieldToken: yieldToken,
      admin: admin
    }
    const flux = await Flux.deploy(stratInitConfig);
    await flux.deployed();
    return flux;
  }
})