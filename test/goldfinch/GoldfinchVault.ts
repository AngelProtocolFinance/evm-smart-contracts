import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Registrar, Registrar__factory, IRegistrar, DummyStakingRewards } from "../../typechain-types"
import { DummyCRVLP, DummyCRVLP__factory } from "../../typechain-types";
import { DummyERC20, DummyERC20__factory } from "../../typechain-types";
import { GoldfinchVault, GoldfinchVault__factory } from "../../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { config } from "dotenv";


describe("Goldfinch Vault", function () {
  let owner: SignerWithAddress
  let user: SignerWithAddress
  let Registrar: Registrar__factory
  let Vault: GoldfinchVault__factory
  let StakingToken: DummyERC20__factory    // FIDU 
  let RewardToken: DummyERC20__factory     // GFI 
  let StableToken: DummyERC20__factory     // USDC

  let defaultRebalParams = {    
    "rebalanceLiquidProfits": false,
    "lockedRebalanceToLiquid":  75, 
    "interestDistribution" : 20,
    "lockedPrincipleToLiquid":  false,
    "principleDistribution" : 0}

  let defaultApParams = {
    "protocolTaxRate" :2,
    "protocolTaxBasis" : 100,
    "protocolTaxCollector" : ethers.constants.AddressZero,
    "primaryChain" : "Polygon",
    "primaryChainRouter" : "",
    "routerAddr" : ethers.constants.AddressZero
  }

  let strategyId = "0xffffffff" // random 4-byte hash
  let strategyParams = {
    isApproved: true, 
    Locked : {
      Type: 0,
      vaultAddr: "0x000000000000000000000000000000000000dEaD"
    },
    Liquid: {
      Type: 1,
      vaultAddr: "0x000000000000000000000000000000000000dEaD"
    }
  }

  enum VaultType {
    LOCKED, 
    LIQUID
  }

  async function deployAndConfigureRegistrarAsProxy(): Promise<Registrar> {
    [owner, user] = await ethers.getSigners();
    Registrar = await ethers.getContractFactory("Registrar") as Registrar__factory;
    const registrar = await upgrades.deployProxy(Registrar) as Registrar
    await registrar.deployed()
    
    // Set the owner address as the tax collector and the router for ease of test
    let configuredApParams = defaultApParams
    configuredApParams.protocolTaxCollector = owner.address
    configuredApParams.routerAddr = owner.address
    await registrar.setAngelProtocolParams(configuredApParams)

    // Set the strategy params in the registrar for Goldfinch
    await registrar.setStrategyParams(
      strategyId, 
      strategyParams.Locked.vaultAddr, 
      strategyParams.Liquid.vaultAddr, 
      strategyParams.isApproved)

    return registrar
  }

  async function deployDummyCRVLP(): Promise<DummyCRVLP> {
    let DummyCRVLP = await ethers.getContractFactory("DummyCRVLP") as DummyCRVLP__factory;
    let crvLP =  await DummyCRVLP.deploy() as DummyCRVLP
    await crvLP.deployed()
    return crvLP
  }

  async function deployStakingToken(): Promise<DummyERC20> {
    StakingToken = await ethers.getContractFactory("DummyERC20") as DummyERC20__factory;
    let stakingToken =  await StakingToken.deploy() as DummyERC20
    return stakingToken
  }

  async function deployRewardToken(): Promise<DummyERC20> {
    RewardToken = await ethers.getContractFactory("DummyERC20") as DummyERC20__factory;
    let rewardToken =  await RewardToken.deploy() as DummyERC20
    return rewardToken
  }

  async function deployStableToken(): Promise<DummyERC20> {
    StableToken = await ethers.getContractFactory("DummyERC20") as DummyERC20__factory;
    let stableToken =  await StableToken.deploy() as DummyERC20
    return stableToken
  }

  async function deployGoldfinchVault(
    vaultType: VaultType, 
    registrarAddress:string,
    stakingPoolAddress: string,
    crvPoolAddress: string, 
    stableTokenAddress: string, 
    stakingTokenAddress: string,
    rewardTokenAddress: string): Promise<GoldfinchVault> {
    Vault = await ethers.getContractFactory("GoldfinchVault") as GoldfinchVault__factory
    let vault = await Vault.deploy(
      vaultType, 
      registrarAddress,
      stakingPoolAddress, 
      crvPoolAddress, 
      stableTokenAddress,  
      stakingTokenAddress,
      rewardTokenAddress
    ) as GoldfinchVault
    await vault.deployed()
    return vault
  }

  describe("Deployment", function () {
    let liqVault: GoldfinchVault
    let lockVault: GoldfinchVault

    beforeEach(async function () {
      liqVault = await deployGoldfinchVault(
        VaultType.LIQUID,
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000004",
        "0x0000000000000000000000000000000000000005",
        "0x0000000000000000000000000000000000000006"
      )

      lockVault = await deployGoldfinchVault(
        VaultType.LOCKED,
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000004",
        "0x0000000000000000000000000000000000000005",
        "0x0000000000000000000000000000000000000006"
      )

    })

    it("Should successfully deploy the contracts", async function () {  
      expect(liqVault.address)
      expect(lockVault.address)
    })
  })
})