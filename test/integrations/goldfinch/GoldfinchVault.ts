import {expect} from "chai";
import {BigNumber} from "ethers";
import {ethers, upgrades} from "hardhat";
import {
  DummyCRVLP,
  DummyCRVLP__factory,
  DummyERC20,
  DummyERC20__factory,
  DummyStakingRewards,
  DummyStakingRewards__factory,
  GoldfinchVault,
  GoldfinchVault__factory,
  LocalRegistrar,
  LocalRegistrar__factory,
} from "typechain-types";
import {StrategyApprovalState, getSigners} from "utils";

describe("Goldfinch Vault", function () {
  let owner: SignerWithAddress;
  let taxCollector: SignerWithAddress;
  let user: SignerWithAddress;
  let Registrar: LocalRegistrar__factory;
  let Vault: GoldfinchVault__factory;
  let StakingToken: DummyERC20__factory; // FIDU
  let RewardToken: DummyERC20__factory; // GFI
  let StableToken: DummyERC20__factory; // USDC

  let defaultRebalParams = {
    rebalanceLiquidProfits: false,
    lockedRebalanceToLiquid: 75,
    interestDistribution: 20,
    lockedPrincipleToLiquid: false,
    principleDistribution: 0,
    basis: 100,
  };

  let defaultApParams = {
    protocolTaxRate: 2,
    protocolTaxBasis: 100,
    protocolTaxCollector: ethers.constants.AddressZero,
    primaryChain: "Polygon",
    primaryChainRouter: "",
    routerAddr: ethers.constants.AddressZero,
    refundAddr: ethers.constants.AddressZero,
  };
  enum VaultType {
    LOCKED,
    LIQUID,
  }
  let strategyId = "0x1fd10064"; // bytes4(keccak256(abi.encode("Goldfinch")));
  let strategyParams = {
    approvalState: StrategyApprovalState.APPROVED,
    Locked: {
      Type: VaultType.LOCKED,
      vaultAddr: "0x000000000000000000000000000000000000dEaD",
    },
    Liquid: {
      Type: VaultType.LIQUID,
      vaultAddr: "0x000000000000000000000000000000000000dEaD",
    },
  };

  async function deployAndConfigureRegistrarAsProxy(): Promise<LocalRegistrar> {
    const {proxyAdmin, apTeam2, apTeam3} = await getSigners(hre);
    owner = proxyAdmin;
    taxCollector = apTeam2;
    user = apTeam3;
    Registrar = (await ethers.getContractFactory("LocalRegistrar")) as LocalRegistrar__factory;
    const registrar = (await upgrades.deployProxy(Registrar)) as LocalRegistrar;
    await registrar.deployed();

    let configuredApParams = defaultApParams;
    configuredApParams.protocolTaxCollector = taxCollector.address;
    // Set the owner address as the router for ease of test
    configuredApParams.routerAddr = owner.address;
    await registrar.setAngelProtocolParams(configuredApParams);

    // Set the strategy params in the registrar for Goldfinch
    await registrar.setStrategyParams(
      strategyId,
      strategyParams.Locked.vaultAddr,
      strategyParams.Liquid.vaultAddr,
      strategyParams.approvalState
    );

    // Set AP Goldfinch params
    await registrar.setAPGoldfinchParams({
      crvParams: {
        allowedSlippage: 1,
      },
    });

    return registrar;
  }

  async function deployDummyCRVLP(
    stableTokenAddress: string,
    stakeTokenAddress: string
  ): Promise<DummyCRVLP> {
    let DummyCRVLP = (await ethers.getContractFactory("DummyCRVLP")) as DummyCRVLP__factory;
    let crvLP = (await DummyCRVLP.deploy(stableTokenAddress, stakeTokenAddress)) as DummyCRVLP;
    await crvLP.deployed();
    return crvLP;
  }

  async function deployDummyStakingPool(
    rewardTokenAddress: string,
    stakeTokenAddress: string
  ): Promise<DummyStakingRewards> {
    let DummyStakingRewards = (await ethers.getContractFactory(
      "DummyStakingRewards"
    )) as DummyStakingRewards__factory;
    let stakingPool = (await DummyStakingRewards.deploy(
      rewardTokenAddress,
      stakeTokenAddress
    )) as DummyStakingRewards;
    await stakingPool.deployed();
    return stakingPool;
  }

  async function deployStakingToken(): Promise<DummyERC20> {
    StakingToken = (await ethers.getContractFactory("DummyERC20")) as DummyERC20__factory;
    let stakingToken = (await StakingToken.deploy()) as DummyERC20;
    return stakingToken;
  }

  async function deployRewardToken(): Promise<DummyERC20> {
    RewardToken = (await ethers.getContractFactory("DummyERC20")) as DummyERC20__factory;
    let rewardToken = (await RewardToken.deploy()) as DummyERC20;
    return rewardToken;
  }

  async function deployStableToken(): Promise<DummyERC20> {
    StableToken = (await ethers.getContractFactory("DummyERC20")) as DummyERC20__factory;
    let stableToken = (await StableToken.deploy()) as DummyERC20;
    return stableToken;
  }

  async function deployGoldfinchVault(
    vaultType: VaultType,
    registrarAddress: string,
    stakingPoolAddress: string,
    crvPoolAddress: string,
    stableTokenAddress: string,
    stakingTokenAddress: string,
    rewardTokenAddress: string
  ): Promise<GoldfinchVault> {
    Vault = (await ethers.getContractFactory("GoldfinchVault")) as GoldfinchVault__factory;
    let vault = (await Vault.deploy(
      vaultType,
      registrarAddress,
      stakingPoolAddress,
      crvPoolAddress,
      stableTokenAddress,
      stakingTokenAddress,
      rewardTokenAddress
    )) as GoldfinchVault;
    await vault.deployed();
    return vault;
  }

  describe("Deployment", function () {
    let liqVault: GoldfinchVault;
    let lockVault: GoldfinchVault;

    beforeEach(async function () {
      liqVault = await deployGoldfinchVault(
        VaultType.LIQUID,
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000004",
        "0x0000000000000000000000000000000000000005",
        "0x0000000000000000000000000000000000000006"
      );

      lockVault = await deployGoldfinchVault(
        VaultType.LOCKED,
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000004",
        "0x0000000000000000000000000000000000000005",
        "0x0000000000000000000000000000000000000006"
      );
    });

    it("Should successfully deploy the contracts", async function () {
      expect(liqVault.address);
      expect(await liqVault.USDC()).to.equal("0x0000000000000000000000000000000000000004");
      expect(await liqVault.FIDU()).to.equal("0x0000000000000000000000000000000000000005");
      expect(await liqVault.GFI()).to.equal("0x0000000000000000000000000000000000000006");
      expect(lockVault.address);
      expect(await lockVault.USDC()).to.equal("0x0000000000000000000000000000000000000004");
      expect(await lockVault.FIDU()).to.equal("0x0000000000000000000000000000000000000005");
      expect(await lockVault.GFI()).to.equal("0x0000000000000000000000000000000000000006");
    });

    it("Correctly identifies its own vault type", async function () {
      expect(await liqVault.getVaultType()).to.equal(VaultType.LIQUID);
      expect(await lockVault.getVaultType()).to.equal(VaultType.LOCKED);
    });
  });

  describe("upon Deposit", function () {
    let registrar: LocalRegistrar;
    let crvLP: DummyCRVLP;
    let stakingPool: DummyStakingRewards;
    let stableToken: DummyERC20;
    let stakingToken: DummyERC20;
    let rewardToken: DummyERC20;
    let liquidVault: GoldfinchVault;
    let lockedVault: GoldfinchVault;
    let STABLETOKENAMOUNT: BigNumber;
    let STAKINGTOKENAMOUNT: BigNumber;
    let ACCOUNTID1 = 1;
    let ACCOUNTID2 = 2;

    before(async function () {
      registrar = await deployAndConfigureRegistrarAsProxy();
      stableToken = await deployStableToken();
      stakingToken = await deployStakingToken();
      rewardToken = await deployRewardToken();
      crvLP = await deployDummyCRVLP(stableToken.address, stakingToken.address);
      stakingPool = await deployDummyStakingPool(rewardToken.address, stakingToken.address);
    });

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
      );
      lockedVault = await deployGoldfinchVault(
        VaultType.LOCKED,
        registrar.address,
        stakingPool.address,
        crvLP.address,
        stableToken.address,
        stakingToken.address,
        rewardToken.address
      );

      // Update registrar
      let updatedStrategyParams = strategyParams;
      updatedStrategyParams.Liquid.vaultAddr = liquidVault.address;
      updatedStrategyParams.Locked.vaultAddr = lockedVault.address;
      await registrar.setStrategyParams(
        strategyId,
        updatedStrategyParams.Locked.vaultAddr,
        updatedStrategyParams.Liquid.vaultAddr,
        updatedStrategyParams.approvalState
      );

      // Reset token amts to "default" for each test
      STABLETOKENAMOUNT = BigNumber.from(10).pow(8); // $100 given USDC 6 digit precision
      STAKINGTOKENAMOUNT = BigNumber.from(10).pow(20); // $100 given Fidu 18 digit precision and 1:1 ex. rate
      // And reset the CRV pool to "default" trade
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT);
    });

    it("Only allows the approved Router to call", async function () {
      await expect(
        liquidVault.connect(user).deposit(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT)
      ).to.be.revertedWith("Not approved");
    });

    it("Accepts only the stablecoin", async function () {
      await expect(
        liquidVault.deposit(ACCOUNTID1, rewardToken.address, STABLETOKENAMOUNT)
      ).to.be.revertedWith("Only USDC accepted");
    });

    it("Can open a new position with the staking pool", async function () {
      // Give vault the stablecoins and give the crvPool the staking tokens
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);

      await liquidVault.deposit(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);
      let tokenID = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let principles = await liquidVault.principleByAccountId(ACCOUNTID1);
      expect(tokenID).to.be.gt(0);
      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(0);
      expect(await stakingPool.balanceByTokenId(tokenID)).to.equal(STAKINGTOKENAMOUNT);
      expect(principles.usdcP).to.equal(STABLETOKENAMOUNT);
      expect(principles.fiduP).to.equal(STAKINGTOKENAMOUNT);
      expect(await stakingPool.balanceOf(liquidVault.address)).to.equal(1);
    });

    it("Can handle opening positions for multiple accounts", async function () {
      // Give vault the stablecoins and give the crvPool the staking tokens
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);

      await liquidVault.deposit(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);

      // Give vault the stablecoins and give the crvPool the staking tokens again for the second deposit
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);
      await liquidVault.deposit(ACCOUNTID2, stableToken.address, STABLETOKENAMOUNT);

      let tokenID1 = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let tokenID2 = await liquidVault.tokenIdByAccountId(ACCOUNTID2);
      let principles1 = await liquidVault.principleByAccountId(ACCOUNTID1);
      let principles2 = await liquidVault.principleByAccountId(ACCOUNTID2);
      expect(tokenID1).to.be.gt(0);
      expect(tokenID1).to.not.equal(tokenID2);
      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(0);
      expect(await stakingPool.balanceByTokenId(tokenID1)).to.equal(STAKINGTOKENAMOUNT);
      expect(await stakingPool.balanceByTokenId(tokenID2)).to.equal(STAKINGTOKENAMOUNT);
      expect(principles1.usdcP).to.equal(STABLETOKENAMOUNT);
      expect(principles2.usdcP).to.equal(STABLETOKENAMOUNT);
      expect(principles1.fiduP).to.equal(STAKINGTOKENAMOUNT);
      expect(principles2.fiduP).to.equal(STAKINGTOKENAMOUNT);
      expect(await stakingPool.balanceOf(liquidVault.address)).to.equal(2);
    });

    it("Can add to an existing position within the staking pool", async function () {
      // Give vault the stablecoins and give the crvPool the staking tokens
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);

      await liquidVault.deposit(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);

      // Give vault the stablecoins and give the crvPool the staking tokens again for the second deposit
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);
      await liquidVault.deposit(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);
      let tokenID = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let principles = await liquidVault.principleByAccountId(ACCOUNTID1);
      expect(tokenID).to.be.gt(0);
      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(0);
      expect(await stakingPool.balanceByTokenId(tokenID)).to.equal(STAKINGTOKENAMOUNT.mul(2));
      expect(principles.usdcP).to.equal(STABLETOKENAMOUNT.mul(2));
      expect(principles.fiduP).to.equal(STAKINGTOKENAMOUNT.mul(2));
      expect(await stakingPool.balanceOf(liquidVault.address)).to.equal(1);
    });

    // it("Reverts if the trade into FIDUs slippage exceeds the threshold", async function () {
    //   STAKINGTOKENAMOUNT = BigNumber.from(10).pow(19) // 1 order of magnitude less than anticipated
    //   // Give vault the stablecoins and give the crvPool the staking tokens
    //   await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT)
    //   await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT)
    //   await crvLP.setDys(STABLETOKENAMOUNT, STAKINGTOKENAMOUNT)
    //   await expect()
    // })
  });

  describe("upon Redemption", function () {
    let registrar: LocalRegistrar;
    let crvLP: DummyCRVLP;
    let stakingPool: DummyStakingRewards;
    let stableToken: DummyERC20;
    let stakingToken: DummyERC20;
    let rewardToken: DummyERC20;
    let liquidVault: GoldfinchVault;
    let lockedVault: GoldfinchVault;
    let STABLETOKENAMOUNT: BigNumber;
    let STAKINGTOKENAMOUNT: BigNumber;
    let ACCOUNTID1 = 1;
    let ACCOUNTID2 = 2;

    before(async function () {
      registrar = await deployAndConfigureRegistrarAsProxy();
      stableToken = await deployStableToken();
      stakingToken = await deployStakingToken();
      rewardToken = await deployRewardToken();
      crvLP = await deployDummyCRVLP(stableToken.address, stakingToken.address);
      stakingPool = await deployDummyStakingPool(rewardToken.address, stakingToken.address);
    });

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
      );
      lockedVault = await deployGoldfinchVault(
        VaultType.LOCKED,
        registrar.address,
        stakingPool.address,
        crvLP.address,
        stableToken.address,
        stakingToken.address,
        rewardToken.address
      );

      // Update registrar
      let updatedStrategyParams = strategyParams;
      updatedStrategyParams.Liquid.vaultAddr = liquidVault.address;
      updatedStrategyParams.Locked.vaultAddr = lockedVault.address;
      await registrar.setStrategyParams(
        strategyId,
        updatedStrategyParams.Locked.vaultAddr,
        updatedStrategyParams.Liquid.vaultAddr,
        updatedStrategyParams.approvalState
      );

      // Reset token amts to "default" for each test
      STABLETOKENAMOUNT = BigNumber.from(10).pow(8); // $100 given USDC 6 digit precision
      STAKINGTOKENAMOUNT = BigNumber.from(10).pow(20); // $100 given Fidu 18 digit precision and 1:1 ex. rate
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT); // for deposit

      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);
      await liquidVault.deposit(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);
      // Reset tax collector balance
      let taxBal = await stableToken.balanceOf(taxCollector.address);
      if (taxBal.gt(0)) {
        await stableToken
          .connect(taxCollector)
          .transfer("0x000000000000000000000000000000000000dEaD", taxBal);
      }
    });

    it("Only allows the approved Router to call", async function () {
      await expect(
        liquidVault.connect(user).redeem(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT)
      ).to.be.revertedWith("Not approved Router");
    });

    it("Accepts only the stablecoin", async function () {
      await expect(
        liquidVault.redeem(ACCOUNTID1, rewardToken.address, STABLETOKENAMOUNT)
      ).to.be.revertedWith("Only USDC accepted");
    });

    it("Reverts if there is nothing to redeem", async function () {
      await expect(
        liquidVault.redeem(ACCOUNTID2, stableToken.address, STABLETOKENAMOUNT)
      ).to.be.revertedWith("No position");
    });

    it("Scrapes reward tokens to the tax collector", async function () {
      let REWARDAMOUNT = BigNumber.from(10).pow(20);
      let tokenId = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      await stakingPool.setRewardByToken(tokenId, REWARDAMOUNT);
      await rewardToken.mint(stakingPool.address, REWARDAMOUNT);
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT);
      await liquidVault.redeem(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);
      expect(await rewardToken.balanceOf(taxCollector.address)).to.equal(REWARDAMOUNT);
    });

    it("Redeems tokens when the yield is negative, no tax should be applied", async function () {
      STABLETOKENAMOUNT = BigNumber.from(10).pow(7); // drop an order of mag for negative yield
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT);
      await liquidVault.redeem(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);
      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(STABLETOKENAMOUNT);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(0);
      expect(await stableToken.allowance(liquidVault.address, owner.address)).to.equal(
        STABLETOKENAMOUNT
      );
    });

    it("Allows redemptions for one account without affecting another", async function () {
      // Establish a position for Account 2
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT);
      await liquidVault.deposit(ACCOUNTID2, stableToken.address, STABLETOKENAMOUNT);

      // Make a redemption for Account 1
      let REDUCEDSTABLETOKENAMOUNT = BigNumber.from(10).pow(7); // drop an order of mag for negative yield
      await crvLP.setDys(REDUCEDSTABLETOKENAMOUNT, REDUCEDSTABLETOKENAMOUNT); // ex rate
      await liquidVault.redeem(ACCOUNTID1, stableToken.address, REDUCEDSTABLETOKENAMOUNT);

      let acct2Token = await liquidVault.tokenIdByAccountId(ACCOUNTID2);
      expect(await stakingPool.balanceByTokenId(acct2Token)).to.equal(STAKINGTOKENAMOUNT);
      let principles = await liquidVault.principleByAccountId(ACCOUNTID2);
      expect(principles.usdcP).to.equal(STABLETOKENAMOUNT);
      expect(principles.fiduP).to.equal(STAKINGTOKENAMOUNT);

      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(REDUCEDSTABLETOKENAMOUNT);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(0);
      expect(await stableToken.allowance(liquidVault.address, owner.address)).to.equal(
        REDUCEDSTABLETOKENAMOUNT
      );
    });

    it("Reverts if the account attempts to redeem more stablecoin than possible", async function () {
      let EXCESSSTABLETOKEN = BigNumber.from(10).pow(9); // add an order of mag for impossible yield
      await crvLP.setDys(STABLETOKENAMOUNT, EXCESSSTABLETOKEN); // exchange rate doesn't change but trading for more

      await expect(
        liquidVault.redeem(ACCOUNTID1, stableToken.address, EXCESSSTABLETOKEN)
      ).to.be.revertedWith("Cannot redeem more than available");
    });

    it("Taxes the yield and sends the tax to the tax collector", async function () {
      let STABLETOKENWITHYIELD = STABLETOKENAMOUNT.mul(2); // 100% yield
      await crvLP.setDys(STABLETOKENWITHYIELD, STABLETOKENAMOUNT); // Ex rate reflects yield
      await liquidVault.redeem(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);
      let expectedTax = STABLETOKENAMOUNT.mul(defaultApParams.protocolTaxRate).div(
        defaultApParams.protocolTaxBasis
      );
      let redemptionAmt = STABLETOKENAMOUNT.sub(expectedTax);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(expectedTax);
      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(redemptionAmt);
      expect(await stableToken.allowance(liquidVault.address, owner.address)).to.equal(
        redemptionAmt
      );
    });

    it("Adjusts principles according to redemption", async function () {
      let STABLETOKENWITHYIELD = STABLETOKENAMOUNT.mul(2); // 100% yield
      await crvLP.setDys(STABLETOKENWITHYIELD, STABLETOKENAMOUNT); // Ex rate reflects yield
      await liquidVault.redeem(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);
      let tokenId = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let positionAfterRedemption = await stakingPool.balanceByTokenId(tokenId);
      let expectedFiduP = STAKINGTOKENAMOUNT.sub(positionAfterRedemption);
      expect(positionAfterRedemption).to.equal(STAKINGTOKENAMOUNT.div(2));
      let expectedUsdcP = STABLETOKENAMOUNT.mul(expectedFiduP).div(STAKINGTOKENAMOUNT);
      let principles = await liquidVault.principleByAccountId(ACCOUNTID1);
      expect(principles.usdcP).to.equal(expectedUsdcP);
      expect(principles.fiduP).to.equal(expectedFiduP);
    });
  });

  describe("upon RedeemAll", function () {
    let registrar: LocalRegistrar;
    let crvLP: DummyCRVLP;
    let stakingPool: DummyStakingRewards;
    let stableToken: DummyERC20;
    let stakingToken: DummyERC20;
    let rewardToken: DummyERC20;
    let liquidVault: GoldfinchVault;
    let lockedVault: GoldfinchVault;
    let STABLETOKENAMOUNT: BigNumber;
    let STAKINGTOKENAMOUNT: BigNumber;
    let ACCOUNTID1 = 1;
    let ACCOUNTID2 = 2;

    before(async function () {
      registrar = await deployAndConfigureRegistrarAsProxy();
      stableToken = await deployStableToken();
      stakingToken = await deployStakingToken();
      rewardToken = await deployRewardToken();
      crvLP = await deployDummyCRVLP(stableToken.address, stakingToken.address);
      stakingPool = await deployDummyStakingPool(rewardToken.address, stakingToken.address);
    });

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
      );
      lockedVault = await deployGoldfinchVault(
        VaultType.LOCKED,
        registrar.address,
        stakingPool.address,
        crvLP.address,
        stableToken.address,
        stakingToken.address,
        rewardToken.address
      );

      // Update registrar
      let updatedStrategyParams = strategyParams;
      updatedStrategyParams.Liquid.vaultAddr = liquidVault.address;
      updatedStrategyParams.Locked.vaultAddr = lockedVault.address;
      await registrar.setStrategyParams(
        strategyId,
        updatedStrategyParams.Locked.vaultAddr,
        updatedStrategyParams.Liquid.vaultAddr,
        updatedStrategyParams.approvalState
      );

      // Reset token amts to "default" for each test
      STABLETOKENAMOUNT = BigNumber.from(10).pow(8); // $100 given USDC 6 digit precision
      STAKINGTOKENAMOUNT = BigNumber.from(10).pow(20); // $100 given Fidu 18 digit precision and 1:1 ex. rate
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT); // for deposit

      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);
      await liquidVault.deposit(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);
      // Reset tax collector balance
      let taxBal = await stableToken.balanceOf(taxCollector.address);
      if (taxBal.gt(0)) {
        await stableToken
          .connect(taxCollector)
          .transfer("0x000000000000000000000000000000000000dEaD", taxBal);
      }
    });

    it("Only allows the approved Router to call", async function () {
      await expect(liquidVault.connect(user).redeemAll(ACCOUNTID1)).to.be.revertedWith(
        "Not approved Router"
      );
    });

    it("Scrapes reward tokens to the tax collector", async function () {
      let REWARDAMOUNT = BigNumber.from(10).pow(20);
      let tokenId = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      await stakingPool.setRewardByToken(tokenId, REWARDAMOUNT);
      await rewardToken.mint(stakingPool.address, REWARDAMOUNT);
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT);
      await liquidVault.redeemAll(ACCOUNTID1);
      expect(await rewardToken.balanceOf(taxCollector.address)).to.equal(REWARDAMOUNT);
    });

    it("Redeems all tokens when the yield is negative, no tax should be applied", async function () {
      STABLETOKENAMOUNT = BigNumber.from(10).pow(7); // drop an order of mag for negative yield
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT);
      await liquidVault.redeemAll(ACCOUNTID1);
      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(STABLETOKENAMOUNT);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(0);
      expect(await stableToken.allowance(liquidVault.address, owner.address)).to.equal(
        STABLETOKENAMOUNT
      );
    });

    it("Zeroes out the principles for the account", async function () {
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT); // 0% yield
      await liquidVault.redeemAll(ACCOUNTID1);
      let principles = await liquidVault.principleByAccountId(ACCOUNTID1);
      expect(principles.usdcP).to.equal(0);
      expect(principles.fiduP).to.equal(0);
    });

    it("Taxes the yield and sends the tax to the tax collector", async function () {
      let STABLETOKENWITHYIELD = STABLETOKENAMOUNT.mul(2); // 100% yield
      await stakingToken.mint(crvLP.address, STABLETOKENAMOUNT); // mint again to simulate yield
      await crvLP.setDys(STABLETOKENWITHYIELD, STABLETOKENWITHYIELD); // Ex rate reflects yield
      await liquidVault.redeemAll(ACCOUNTID1);
      let expectedTax = STABLETOKENWITHYIELD.mul(defaultApParams.protocolTaxRate).div(
        defaultApParams.protocolTaxBasis
      );
      let redemptionAmt = STABLETOKENWITHYIELD.sub(expectedTax);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(expectedTax);
      expect(await stableToken.balanceOf(liquidVault.address)).to.equal(redemptionAmt);
      expect(await stableToken.allowance(liquidVault.address, owner.address)).to.equal(
        redemptionAmt
      );
    });
  });

  describe("upon Harvest", function () {
    let registrar: LocalRegistrar;
    let crvLP: DummyCRVLP;
    let stakingPool: DummyStakingRewards;
    let stableToken: DummyERC20;
    let stakingToken: DummyERC20;
    let rewardToken: DummyERC20;
    let liquidVault: GoldfinchVault;
    let lockedVault: GoldfinchVault;
    let STABLETOKENAMOUNT: BigNumber;
    let STAKINGTOKENAMOUNT: BigNumber;
    let ACCOUNTID1 = 1;
    let ACCOUNTID2 = 2;

    before(async function () {
      registrar = await deployAndConfigureRegistrarAsProxy();
      stableToken = await deployStableToken();
      stakingToken = await deployStakingToken();
      rewardToken = await deployRewardToken();
      crvLP = await deployDummyCRVLP(stableToken.address, stakingToken.address);
      stakingPool = await deployDummyStakingPool(rewardToken.address, stakingToken.address);
    });

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
      );
      lockedVault = await deployGoldfinchVault(
        VaultType.LOCKED,
        registrar.address,
        stakingPool.address,
        crvLP.address,
        stableToken.address,
        stakingToken.address,
        rewardToken.address
      );

      // Update registrar
      let updatedStrategyParams = strategyParams;
      updatedStrategyParams.Liquid.vaultAddr = liquidVault.address;
      updatedStrategyParams.Locked.vaultAddr = lockedVault.address;
      await registrar.setStrategyParams(
        strategyId,
        updatedStrategyParams.Locked.vaultAddr,
        updatedStrategyParams.Liquid.vaultAddr,
        updatedStrategyParams.approvalState
      );

      // Reset token amts to "default" for each test
      STABLETOKENAMOUNT = BigNumber.from(10).pow(8); // $100 given USDC 6 digit precision
      STAKINGTOKENAMOUNT = BigNumber.from(10).pow(20); // $100 given Fidu 18 digit precision and 1:1 ex. rate
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT); // for deposit
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);
      await liquidVault.deposit(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);

      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(lockedVault.address, STABLETOKENAMOUNT);
      await lockedVault.deposit(ACCOUNTID1, stableToken.address, STABLETOKENAMOUNT);
      // Reset tax collector balance
      let taxBal = await stableToken.balanceOf(taxCollector.address);
      if (taxBal.gt(0)) {
        await stableToken
          .connect(taxCollector)
          .transfer("0x000000000000000000000000000000000000dEaD", taxBal);
      }
      let taxRewardBal = await rewardToken.balanceOf(taxCollector.address);
      if (taxRewardBal.gt(0)) {
        await rewardToken
          .connect(taxCollector)
          .transfer("0x000000000000000000000000000000000000dEaD", taxRewardBal);
      }
    });

    it("Only allows the approved Router to call", async function () {
      await expect(liquidVault.connect(user).harvest([ACCOUNTID1])).to.be.revertedWith(
        "Not approved Router"
      );
    });

    it("Scrapes reward tokens to the tax collector when only one account is called", async function () {
      let REWARDAMOUNT = BigNumber.from(10).pow(20);
      let tokenId = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      await stakingPool.setRewardByToken(tokenId, REWARDAMOUNT);
      await rewardToken.mint(stakingPool.address, REWARDAMOUNT);
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT);
      await liquidVault.harvest([ACCOUNTID1]);
      expect(await rewardToken.balanceOf(taxCollector.address)).to.equal(REWARDAMOUNT);
    });

    it("Handles the case where only one account is called, no yield, liquid", async function () {
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT);
      await liquidVault.harvest([ACCOUNTID1]);
      let id = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let position = await stakingPool.getPosition(id);
      expect(position.amount).to.equal(STAKINGTOKENAMOUNT);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(0);
    });

    it("Handles the case where only one account is called, with yield, liquid", async function () {
      let STABLETOKENWITHYIELD = STABLETOKENAMOUNT.mul(2);
      let expectedYield = STABLETOKENWITHYIELD.sub(STABLETOKENAMOUNT);
      let expectedTax = expectedYield
        .mul(defaultApParams.protocolTaxRate)
        .div(defaultApParams.protocolTaxBasis);
      let exchangeRate = STAKINGTOKENAMOUNT.div(STABLETOKENWITHYIELD);
      let updatedPosition = STAKINGTOKENAMOUNT.sub(expectedTax.mul(exchangeRate));
      await crvLP.setDys(STABLETOKENWITHYIELD, expectedTax); // we only exchange whats necessary to cover the tax
      await liquidVault.harvest([ACCOUNTID1]);
      let id = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let position = await stakingPool.getPosition(id);
      expect(position.amount).to.equal(updatedPosition);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(expectedTax);
    });

    it("Handles the case where only one account is called, no yield, locked", async function () {
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT);
      await lockedVault.harvest([ACCOUNTID1]);
      let id = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let position = await stakingPool.getPosition(id);
      expect(position.amount).to.equal(STAKINGTOKENAMOUNT);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(0);
    });

    it("Handles the case where only one account is called, with yield, locked", async function () {
      let STABLETOKENWITHYIELD = STABLETOKENAMOUNT.mul(2);

      let exchangeRate = STAKINGTOKENAMOUNT.div(STABLETOKENWITHYIELD);
      let expectedYield = STABLETOKENWITHYIELD.sub(STABLETOKENAMOUNT);
      let expectedTax = expectedYield
        .mul(defaultApParams.protocolTaxRate)
        .div(defaultApParams.protocolTaxBasis);
      let rebalanceAmt = expectedYield
        .sub(expectedTax)
        .mul(defaultRebalParams.lockedRebalanceToLiquid)
        .div(defaultRebalParams.basis);
      let updatedPosition = STAKINGTOKENAMOUNT.sub(expectedTax.mul(exchangeRate)).sub(
        rebalanceAmt.mul(exchangeRate)
      );
      let redemptionAmt = expectedTax.add(rebalanceAmt);
      await crvLP.setDys(STABLETOKENWITHYIELD, redemptionAmt); // we only exchange whats necessary to cover the tax
      await lockedVault.harvest([ACCOUNTID1]);
      let id = await lockedVault.tokenIdByAccountId(ACCOUNTID1);
      let position = await stakingPool.getPosition(id);
      expect(position.amount).to.equal(updatedPosition);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(expectedTax);
    });

    it("Scrapes reward tokens to the tax collector for multiple accounts", async function () {
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);
      await liquidVault.deposit(ACCOUNTID2, stableToken.address, STABLETOKENAMOUNT);
      let REWARDAMOUNT1 = BigNumber.from(10).pow(20);
      let REWARDAMOUNT2 = BigNumber.from(10).pow(19);
      let tokenId1 = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let tokenId2 = await liquidVault.tokenIdByAccountId(ACCOUNTID2);
      await stakingPool.setRewardByToken(tokenId1, REWARDAMOUNT1);
      await stakingPool.setRewardByToken(tokenId2, REWARDAMOUNT2);
      await rewardToken.mint(stakingPool.address, REWARDAMOUNT1.add(REWARDAMOUNT2));
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT);
      await liquidVault.harvest([ACCOUNTID1, ACCOUNTID2]);
      expect(await rewardToken.balanceOf(taxCollector.address)).to.equal(
        REWARDAMOUNT1.add(REWARDAMOUNT2)
      );
    });

    it("Handles the case where multiple accounts are called, no yield, liquid", async function () {
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);
      await liquidVault.deposit(ACCOUNTID2, stableToken.address, STABLETOKENAMOUNT);
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT);
      await liquidVault.harvest([ACCOUNTID1, ACCOUNTID2]);
      let id1 = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let id2 = await liquidVault.tokenIdByAccountId(ACCOUNTID2);
      let position1 = await stakingPool.getPosition(id1);
      expect(position1.amount).to.equal(STAKINGTOKENAMOUNT);
      let position2 = await stakingPool.getPosition(id2);
      expect(position2.amount).to.equal(STAKINGTOKENAMOUNT);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(0);
    });

    it("Handles the case where multiple accounts are called, with yield, liquid", async function () {
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT); // for deposit
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENAMOUNT);
      await liquidVault.deposit(ACCOUNTID2, stableToken.address, STABLETOKENAMOUNT);
      let STABLETOKENWITHYIELD = STABLETOKENAMOUNT.mul(2);
      let expectedYield = STABLETOKENWITHYIELD.sub(STABLETOKENAMOUNT);
      let expectedTax = expectedYield
        .mul(defaultApParams.protocolTaxRate)
        .div(defaultApParams.protocolTaxBasis);
      let exchangeRate = STAKINGTOKENAMOUNT.div(STABLETOKENWITHYIELD);
      let updatedPosition = STAKINGTOKENAMOUNT.sub(expectedTax.mul(exchangeRate));
      await crvLP.setDys(STABLETOKENWITHYIELD, expectedTax); // we only exchange whats necessary to cover the tax
      await liquidVault.harvest([ACCOUNTID1, ACCOUNTID2]);
      let id1 = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let id2 = await liquidVault.tokenIdByAccountId(ACCOUNTID2);
      let position1 = await stakingPool.getPosition(id1);
      expect(position1.amount).to.equal(updatedPosition);
      let position2 = await stakingPool.getPosition(id2);
      expect(position2.amount).to.equal(updatedPosition);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(expectedTax.mul(2)); // double since 2 accts
    });

    it("Handles the case where multiple accounts are called, no yield, locked", async function () {
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT); // for deposit
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(lockedVault.address, STABLETOKENAMOUNT);
      await lockedVault.deposit(ACCOUNTID2, stableToken.address, STABLETOKENAMOUNT);
      let principles = await lockedVault.principleByAccountId(ACCOUNTID2);
      await crvLP.setDys(STABLETOKENAMOUNT, STABLETOKENAMOUNT);
      await lockedVault.harvest([ACCOUNTID1, ACCOUNTID2]);
      let id1 = await lockedVault.tokenIdByAccountId(ACCOUNTID1);
      let id2 = await lockedVault.tokenIdByAccountId(ACCOUNTID2);
      let position1 = await stakingPool.getPosition(id1);
      expect(position1.amount).to.equal(STAKINGTOKENAMOUNT);
      let position2 = await stakingPool.getPosition(id2);
      expect(position2.amount).to.equal(STAKINGTOKENAMOUNT);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(0);
    });

    it("Handles the case where multiple accounts are called, with yield, locked", async function () {
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT); // for deposit
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(lockedVault.address, STABLETOKENAMOUNT);
      await lockedVault.deposit(ACCOUNTID2, stableToken.address, STABLETOKENAMOUNT);
      let STABLETOKENWITHYIELD = STABLETOKENAMOUNT.mul(2);
      let exchangeRate = STAKINGTOKENAMOUNT.div(STABLETOKENWITHYIELD);
      let expectedYield = STABLETOKENWITHYIELD.sub(STABLETOKENAMOUNT);
      let expectedTax = expectedYield
        .mul(defaultApParams.protocolTaxRate)
        .div(defaultApParams.protocolTaxBasis);
      let rebalanceAmt = expectedYield
        .sub(expectedTax)
        .mul(defaultRebalParams.lockedRebalanceToLiquid)
        .div(defaultRebalParams.basis);
      let updatedPosition = STAKINGTOKENAMOUNT.sub(expectedTax.mul(exchangeRate)).sub(
        rebalanceAmt.mul(exchangeRate)
      );
      let redemptionAmt = expectedTax.add(rebalanceAmt);
      await crvLP.setDys(STABLETOKENWITHYIELD, redemptionAmt);
      await lockedVault.harvest([ACCOUNTID1, ACCOUNTID2]);
      let id1 = await lockedVault.tokenIdByAccountId(ACCOUNTID1);
      let id2 = await lockedVault.tokenIdByAccountId(ACCOUNTID2);
      let position1 = await stakingPool.getPosition(id1);
      expect(position1.amount).to.equal(updatedPosition);
      let position2 = await stakingPool.getPosition(id2);
      expect(position2.amount).to.equal(updatedPosition);
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(expectedTax.mul(2)); // 2 accts
    });

    it("Handles the case where multiple accounts are called, one with yield, liquid", async function () {
      let STABLETOKENWITHYIELD = STABLETOKENAMOUNT.mul(2);
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT); // for deposit
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(liquidVault.address, STABLETOKENWITHYIELD);
      await liquidVault.deposit(ACCOUNTID2, stableToken.address, STABLETOKENWITHYIELD);
      let exchangeRate = STAKINGTOKENAMOUNT.div(STABLETOKENWITHYIELD);
      let expectedYield = STABLETOKENWITHYIELD.sub(STABLETOKENAMOUNT);
      let expectedTax = expectedYield
        .mul(defaultApParams.protocolTaxRate)
        .div(defaultApParams.protocolTaxBasis);
      let updatedPosition = STAKINGTOKENAMOUNT.sub(expectedTax.mul(exchangeRate));
      await crvLP.setDys(STABLETOKENWITHYIELD, expectedTax); // we only exchange whats necessary to cover the tax
      await liquidVault.harvest([ACCOUNTID1, ACCOUNTID2]);
      let id1 = await liquidVault.tokenIdByAccountId(ACCOUNTID1);
      let id2 = await liquidVault.tokenIdByAccountId(ACCOUNTID2);
      let position1 = await stakingPool.getPosition(id1);
      expect(position1.amount).to.equal(updatedPosition);
      let position2 = await stakingPool.getPosition(id2);
      expect(position2.amount).to.equal(STAKINGTOKENAMOUNT); // no change expected
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(expectedTax);
    });

    it("Handles the case where multiple accounts are called, one with yield, locked", async function () {
      let STABLETOKENWITHYIELD = STABLETOKENAMOUNT.mul(2);
      await crvLP.setDys(STAKINGTOKENAMOUNT, STAKINGTOKENAMOUNT);
      await stakingToken.mint(crvLP.address, STAKINGTOKENAMOUNT);
      await stableToken.mint(lockedVault.address, STABLETOKENWITHYIELD);
      await lockedVault.deposit(
        // Deposit yielded ammt => no yield for acct 2
        ACCOUNTID2,
        stableToken.address,
        STABLETOKENWITHYIELD
      );
      let exchangeRate = STAKINGTOKENAMOUNT.div(STABLETOKENWITHYIELD);
      let expectedYield = STABLETOKENWITHYIELD.sub(STABLETOKENAMOUNT);
      let expectedTax = expectedYield
        .mul(defaultApParams.protocolTaxRate)
        .div(defaultApParams.protocolTaxBasis);
      let rebalanceAmt = expectedYield
        .sub(expectedTax)
        .mul(defaultRebalParams.lockedRebalanceToLiquid)
        .div(defaultRebalParams.basis);
      let updatedPosition = STAKINGTOKENAMOUNT.sub(expectedTax.mul(exchangeRate)).sub(
        rebalanceAmt.mul(exchangeRate)
      );
      let redemptionAmt = expectedTax.add(rebalanceAmt);
      await crvLP.setDys(STABLETOKENWITHYIELD, redemptionAmt); // we only exchange whats necessary to cover the tax
      await lockedVault.harvest([ACCOUNTID1]);
      let id1 = await lockedVault.tokenIdByAccountId(ACCOUNTID1);
      let id2 = await lockedVault.tokenIdByAccountId(ACCOUNTID2);
      let position1 = await stakingPool.getPosition(id1);
      expect(position1.amount).to.equal(updatedPosition);
      let position2 = await stakingPool.getPosition(id2);
      expect(position2.amount).to.equal(STAKINGTOKENAMOUNT); // no change expected
      expect(await stableToken.balanceOf(taxCollector.address)).to.equal(expectedTax);
    });
  });
});
