import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { IVaultLiquid__factory, Registrar, Registrar__factory } from "../../typechain-types"
import { DummyCRVLP, DummyCRVLP__factory } from "../../typechain-types";
import { DummyStakingRewards, DummyStakingRewards__factory } from "../../typechain-types";
import { DummyERC20, DummyERC20__factory } from "../../typechain-types";
import { GoldfinchVault, GoldfinchVault__factory } from "../../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { config } from "dotenv";
import { BigNumber } from "ethers";


describe("Goldfinch Vault", function () {
  let owner: SignerWithAddress
  let taxCollector: SignerWithAddress
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
  enum VaultType {
    LOCKED, 
    LIQUID
  }
  let strategyId = "0xffffffff" // random 4-byte hash
  let strategyParams = {
    isApproved: true, 
    Locked : {
      Type: VaultType.LOCKED,
      vaultAddr: "0x000000000000000000000000000000000000dEaD"
    },
    Liquid: {
      Type: VaultType.LIQUID,
      vaultAddr: "0x000000000000000000000000000000000000dEaD"
    }
  }



  async function deployAndConfigureRegistrarAsProxy(): Promise<Registrar> {
    [owner, taxCollector, user] = await ethers.getSigners();
    Registrar = await ethers.getContractFactory("Registrar") as Registrar__factory;
    const registrar = await upgrades.deployProxy(Registrar) as Registrar
    await registrar.deployed()
    

    let configuredApParams = defaultApParams
    configuredApParams.protocolTaxCollector = taxCollector.address
    // Set the owner address as the router for ease of test
    configuredApParams.routerAddr = owner.address
    await registrar.setAngelProtocolParams(configuredApParams)

    // Set the strategy params in the registrar for Goldfinch
    await registrar.setStrategyParams(
      strategyId, 
      strategyParams.Locked.vaultAddr, 
      strategyParams.Liquid.vaultAddr, 
      strategyParams.isApproved)

    // Set AP Goldfinch params
    await registrar.setAPGoldfinchParams({
      crvParams : {
        allowedSlippage: 1
      }
    })

    return registrar
  }

  async function deployDummyCRVLP(stableTokenAddress: string, stakeTokenAddress: string): Promise<DummyCRVLP> {
    let DummyCRVLP = await ethers.getContractFactory("DummyCRVLP") as DummyCRVLP__factory;
    let crvLP =  await DummyCRVLP.deploy(stableTokenAddress, stakeTokenAddress) as DummyCRVLP
    await crvLP.deployed()
    return crvLP
  }

  async function deployDummyStakingPool(rewardTokenAddress: string, stakeTokenAddress: string): Promise<DummyStakingRewards> {
    let DummyStakingRewards = await ethers.getContractFactory("DummyStakingRewards") as DummyStakingRewards__factory;
    let stakingPool =  await DummyStakingRewards.deploy(rewardTokenAddress, stakeTokenAddress) as DummyStakingRewards
    await stakingPool.deployed()
    return stakingPool
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
      expect(await liqVault.USDC()).to.equal("0x0000000000000000000000000000000000000004")
      expect(await liqVault.FIDU()).to.equal("0x0000000000000000000000000000000000000005")
      expect(await liqVault.GFI()).to.equal("0x0000000000000000000000000000000000000006")
      expect(lockVault.address)
      expect(await lockVault.USDC()).to.equal("0x0000000000000000000000000000000000000004")
      expect(await lockVault.FIDU()).to.equal("0x0000000000000000000000000000000000000005")
      expect(await lockVault.GFI()).to.equal("0x0000000000000000000000000000000000000006")
    })

    it("Correctly identifies its own vault type", async function () {
      expect(await liqVault.getVaultType()).to.equal(VaultType.LIQUID)
      expect(await lockVault.getVaultType()).to.equal(VaultType.LOCKED)
    })
  })

  describe("upon Deposit", function () {
    let registrar: Registrar
    let crvLP: DummyCRVLP
    let stakingPool: DummyStakingRewards
    let stableToken: DummyERC20
    let stakingToken: DummyERC20
    let rewardToken: DummyERC20
    let liquidVault: GoldfinchVault
    let lockedVault: GoldfinchVault
    let STABLETOKENAMOUNT = BigNumber.from(10).pow(8) // $100 given USDC 6 digit precision
    let STAKINGTOKENAMOUNT = BigNumber.from(10).pow(20) // $100 given Fidu 18 digit precision 
    let ACCOUNTID1 = 1
    let ACCOUNTID2 = 2
    
    before(async function () {
      registrar = await deployAndConfigureRegistrarAsProxy()
      stableToken = await deployStableToken()
      stakingToken = await deployStakingToken()
      rewardToken = await deployRewardToken()
      crvLP = await deployDummyCRVLP(stableToken.address, stakingToken.address)
      stakingPool = await deployDummyStakingPool(rewardToken.address, stakingToken.address)
    })
    beforeEach(async function () {
      // Deploy vaults
      liquidVault = await deployGoldfinchVault(
        VaultType.LIQUID,
        registrar.address, 
        stakingPool.address,
        crvLP.address, 
        stableToken.address,
        stakingToken.address,
        rewardToken.address
      )      
      lockedVault = await deployGoldfinchVault(
        VaultType.LOCKED,
        registrar.address, 
        stakingPool.address,
        crvLP.address, 
        stableToken.address,
        stakingToken.address,
        rewardToken.address
      )

      // Update registrar 
      let updatedStrategyParams = strategyParams
      updatedStrategyParams.Liquid.vaultAddr = liquidVault.address
      updatedStrategyParams.Locked.vaultAddr = lockedVault.address
      await registrar.setStrategyParams(
        strategyId, 
        updatedStrategyParams.Locked.vaultAddr, 
        updatedStrategyParams.Liquid.vaultAddr, 
        updatedStrategyParams.isApproved)
    })

    it("Only allows the approved Router to call", async function () {
      await expect(liquidVault.connect(user).deposit(
        ACCOUNTID1,
        stableToken.address,
        STABLETOKENAMOUNT))
        .to.be.revertedWith("Not approved")
    })

    it("Accepts only the stablecoin", async function () {
      await expect(liquidVault.deposit(
        ACCOUNTID1,
        rewardToken.address,
        STABLETOKENAMOUNT)
      ).to.be.revertedWith("Only USDC accepted")
    })

    it("Can open a new position with the staking pool", async function () {
      // Give vault the stablecoins and give the crvPool the staking tokens
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT)
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT)

      // Tell the crv pool to expect the trade
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT)

      await liquidVault.deposit(
        ACCOUNTID1, 
        stableToken.address,
        STABLETOKENAMOUNT
      )
      let tokenID = await liquidVault.tokenIdByAccountId(ACCOUNTID1)
      let principles = await liquidVault.principleByAccountId(ACCOUNTID1)
      expect(tokenID).to.be.gt(0)
      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(0)
      expect(await stakingPool.balanceByTokenId(tokenID)).to.equal(STAKINGTOKENAMOUNT)
      expect(principles.usdcP).to.equal(STABLETOKENAMOUNT)
      expect(principles.fiduP).to.equal(STAKINGTOKENAMOUNT)
      expect(await stakingPool.balanceOf(liquidVault.address)).to.equal(1)
    })

    it("Can handle opening positions for multiple accounts", async function () {
      // Give vault the stablecoins and give the crvPool the staking tokens
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT)
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT)
      // Tell the crv pool to expect the trade
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT)

      await liquidVault.deposit(
        ACCOUNTID1, 
        stableToken.address,
        STABLETOKENAMOUNT
      )

      // Give vault the stablecoins and give the crvPool the staking tokens again for the second deposit 
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT)
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT)
      await liquidVault.deposit(
        ACCOUNTID2, 
        stableToken.address,
        STABLETOKENAMOUNT
      )

      let tokenID1 = await liquidVault.tokenIdByAccountId(ACCOUNTID1)
      let tokenID2 = await liquidVault.tokenIdByAccountId(ACCOUNTID2)
      let principles1 = await liquidVault.principleByAccountId(ACCOUNTID1)
      let principles2 = await liquidVault.principleByAccountId(ACCOUNTID2)
      expect(tokenID1).to.be.gt(0)
      expect(tokenID1).to.not.equal(tokenID2)
      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(0)
      expect(await stakingPool.balanceByTokenId(tokenID1)).to.equal(STAKINGTOKENAMOUNT)
      expect(await stakingPool.balanceByTokenId(tokenID2)).to.equal(STAKINGTOKENAMOUNT)
      expect(principles1.usdcP).to.equal(STABLETOKENAMOUNT)
      expect(principles2.usdcP).to.equal(STABLETOKENAMOUNT)
      expect(principles1.fiduP).to.equal(STAKINGTOKENAMOUNT)
      expect(principles2.fiduP).to.equal(STAKINGTOKENAMOUNT)
      expect(await stakingPool.balanceOf(liquidVault.address)).to.equal(2)
    })
    
    it("Can add to an existing position within the staking pool", async function () {
      // Give vault the stablecoins and give the crvPool the staking tokens
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT)
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT)
      // Tell the crv pool to expect the trade
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT)

      await liquidVault.deposit(
        ACCOUNTID1, 
        stableToken.address,
        STABLETOKENAMOUNT
      )

      // Give vault the stablecoins and give the crvPool the staking tokens again for the second deposit 
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT)
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT)
      await liquidVault.deposit(
        ACCOUNTID1, 
        stableToken.address,
        STABLETOKENAMOUNT
      )
      let tokenID = await liquidVault.tokenIdByAccountId(ACCOUNTID1)
      let principles = await liquidVault.principleByAccountId(ACCOUNTID1)
      expect(tokenID).to.be.gt(0)
      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(0)
      expect(await stakingPool.balanceByTokenId(tokenID)).to.equal(STAKINGTOKENAMOUNT.mul(2))
      expect(principles.usdcP).to.equal(STABLETOKENAMOUNT.mul(2))
      expect(principles.fiduP).to.equal(STAKINGTOKENAMOUNT.mul(2))
      expect(await stakingPool.balanceOf(liquidVault.address)).to.equal(1)
    })
  })
})