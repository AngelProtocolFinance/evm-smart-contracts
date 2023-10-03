import {SnapshotRestorer, takeSnapshot} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {BigNumber, Signer} from "ethers";
import hre from "hardhat";
import {DEFAULT_STRATEGY_ID, deployDummyERC20, deployDummyFUSDC, wait} from "test/utils";
import {
  DummyERC20,
  DummyFUSDC,
  FluxStrategy,
  FluxStrategy__factory,
  IStrategy,
} from "typechain-types";

describe("FluxStrategy", function () {
  const {ethers} = hre;

  let owner: Signer;
  let user: Signer;

  let flux: FluxStrategy;
  let baseToken: DummyERC20;
  let yieldToken: DummyFUSDC;

  async function deployFluxStrategy({
    baseToken,
    yieldToken,
    admin,
    strategyId = DEFAULT_STRATEGY_ID,
  }: {
    baseToken: string;
    yieldToken: string;
    admin: string;
    strategyId?: string;
  }): Promise<FluxStrategy> {
    let Flux = new FluxStrategy__factory(owner);
    let stratInitConfig: IStrategy.StrategyConfigStruct = {
      strategyId: strategyId,
      baseToken: baseToken,
      yieldToken: yieldToken,
      admin: admin,
    };
    const flux = await Flux.deploy(stratInitConfig);
    await flux.deployed();
    return flux;
  }

  before(async function () {
    [owner, user] = await ethers.getSigners();

    baseToken = await deployDummyERC20(owner, 6);
    yieldToken = await deployDummyFUSDC(owner, baseToken.address);

    flux = await deployFluxStrategy({
      baseToken: baseToken.address,
      yieldToken: yieldToken.address,
      admin: await owner.getAddress(),
    });
  });

  let snapshot: SnapshotRestorer;

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("during deployment", async function () {
    it("sets the config according to the input params", async function () {
      let config = await flux.getStrategyConfig();
      expect(config.baseToken).to.equal(baseToken.address);
      expect(config.yieldToken).to.equal(yieldToken.address);
      expect(config.strategyId).to.equal(DEFAULT_STRATEGY_ID);
      expect(config.admin).to.equal(await owner.getAddress());
    });
  });

  describe("pause extension", async function () {
    it("reverts if a non-admin calls the `pause` method", async function () {
      await expect(flux.connect(user).pause()).to.be.revertedWithCustomError(flux, "AdminOnly");
    });
    it("reverts if a non-admin calls the `unpause` method", async function () {
      await expect(flux.pause()).to.not.be.reverted;
      await expect(flux.connect(user).unpause()).to.be.revertedWithCustomError(flux, "AdminOnly");
    });
    it("pauses and unpauses when called by the admin", async function () {
      await expect(flux.pause()).to.not.be.reverted;
      let status = await flux.paused();
      expect(status).to.be.true;
      await expect(flux.unpause()).to.not.be.reverted;
      status = await flux.paused();
      expect(status).to.be.false;
    });
  });
  describe("upon get and set config", async function () {
    it("reverts if set is called by a non-admin", async function () {
      await expect(
        flux.connect(user).setStrategyConfig({
          baseToken: ethers.constants.AddressZero,
          yieldToken: ethers.constants.AddressZero,
          strategyId: "0xffffffff",
          admin: await user.getAddress(),
        })
      ).to.be.revertedWithCustomError(flux, "AdminOnly");
    });
    it("sets the config and emits the config changed event", async function () {
      await expect(
        flux.setStrategyConfig({
          baseToken: ethers.constants.AddressZero,
          yieldToken: ethers.constants.AddressZero,
          strategyId: "0xffffffff",
          admin: await user.getAddress(),
        })
      ).to.emit(flux, "ConfigChanged");
      let config = await flux.getStrategyConfig();
      expect(config.baseToken).to.equal(ethers.constants.AddressZero);
      expect(config.yieldToken).to.equal(ethers.constants.AddressZero);
      expect(config.strategyId).to.equal("0xffffffff");
      expect(config.admin).to.equal(await user.getAddress());
    });
  });
  describe("upon Deposit", async function () {
    it("reverts when paused", async function () {
      await expect(flux.pause()).to.not.be.reverted;
      await expect(flux.deposit(1,[])).to.revertedWith("Pausable: paused");
    });
    it("reverts if the amount is zero", async function () {
      await expect(flux.deposit(0,[])).to.be.revertedWithCustomError(flux, "ZeroAmount");
    });
    it("reverts if the baseToken transfer fails", async function () {
      await wait(baseToken.mint(await owner.getAddress(), 1));
      await wait(baseToken.setTransferAllowed(false));
      await expect(flux.deposit(1,[])).to.be.revertedWith(
        "SafeERC20: ERC20 operation did not succeed"
      );
      await wait(baseToken.setTransferAllowed(true));
    });
    it("reverts if the baseToken approve fails", async function () {
      await wait(baseToken.mint(await owner.getAddress(), 1));
      await wait(baseToken.approve(flux.address, 1));
      await wait(baseToken.setApproveAllowed(false));
      await wait(yieldToken.setResponseAmt(1));
      await expect(flux.deposit(1,[])).to.be.revertedWith(
        "SafeERC20: ERC20 operation did not succeed"
      );
      await wait(baseToken.setApproveAllowed(true));
    });
    it("reverts if the deposit fails", async function () {
      await wait(baseToken.mint(await owner.getAddress(), 1));
      await wait(baseToken.approve(flux.address, 1));
      await wait(yieldToken.setResponseAmt(1));
      await wait(yieldToken.setMintAllowed(false));
      await expect(flux.deposit(1,[])).to.be.revertedWithCustomError(flux, "DepositFailed");
      await wait(yieldToken.setMintAllowed(true));
    });
    it("reverts if the yieldToken approve fails", async function () {
      await wait(baseToken.mint(await owner.getAddress(), 1));
      await wait(baseToken.approve(flux.address, 1));
      await wait(yieldToken.setResponseAmt(1));
      await wait(yieldToken.setApproveAllowed(false));
      await expect(flux.deposit(1,[])).to.be.revertedWithCustomError(flux, "ApproveFailed");
      await wait(yieldToken.setApproveAllowed(true));
    });
    it("correctly executes the deposit", async function () {
      await wait(baseToken.mint(await owner.getAddress(), 10));
      await wait(baseToken.approve(flux.address, 10));
      await wait(yieldToken.setResponseAmt(10));
      expect(await flux.deposit(10,[]));
      let baseTokenBal = await baseToken.balanceOf(yieldToken.address);
      let yieldBal = await yieldToken.balanceOf(flux.address);
      await wait(yieldToken.transferFrom(flux.address, await owner.getAddress(), yieldBal));
      expect(baseTokenBal).to.equal(10);
      expect(yieldBal).to.equal(10);
    });
  });
  describe("upon Withdrawal", async function () {
    const DEPOSIT_AMT = 10;
    let rootSnapshot: SnapshotRestorer;
    before(async () => {
      rootSnapshot = await takeSnapshot();
      await wait(baseToken.mint(await owner.getAddress(), DEPOSIT_AMT));
      await wait(baseToken.approve(flux.address, DEPOSIT_AMT));
      await wait(yieldToken.setResponseAmt(DEPOSIT_AMT));
      await wait(flux.deposit(DEPOSIT_AMT,[]));
      await wait(yieldToken.transferFrom(flux.address, await owner.getAddress(), DEPOSIT_AMT));
    });
    after(async () => {
      await rootSnapshot.restore();
    });
    it("reverts when paused", async function () {
      await expect(flux.pause()).to.not.be.reverted;
      await expect(flux.withdraw(1,[])).to.revertedWith("Pausable: paused");
    });
    it("reverts if the amount is zero", async function () {
      await expect(flux.withdraw(0,[])).to.be.revertedWithCustomError(flux, "ZeroAmount");
    });
    it("reverts if the yieldToken transfer fails", async function () {
      await wait(yieldToken.approve(flux.address, 1));
      await wait(yieldToken.setTransferAllowed(false));
      await expect(flux.withdraw(1,[])).to.be.revertedWithCustomError(flux, "TransferFailed");
      await wait(yieldToken.setTransferAllowed(true));
    });
    it("reverts if the yieldToken approve fails", async function () {
      await wait(yieldToken.approve(flux.address, 1));
      await wait(yieldToken.setApproveAllowed(false));
      await wait(yieldToken.setResponseAmt(1));
      await expect(flux.withdraw(1,[])).to.be.revertedWithCustomError(flux, "ApproveFailed");
      await wait(yieldToken.setApproveAllowed(true));
    });
    it("reverts if the withdraw fails", async function () {
      await wait(yieldToken.approve(flux.address, 1));
      await wait(yieldToken.setResponseAmt(1));
      await wait(yieldToken.setRedeemAllowed(false));
      await expect(flux.withdraw(1,[])).to.be.revertedWithCustomError(flux, "WithdrawFailed");
      await wait(yieldToken.setRedeemAllowed(true));
    });
    it("reverts if the baseToken approve fails", async function () {
      await wait(yieldToken.approve(flux.address, 1));
      await wait(yieldToken.setResponseAmt(1));
      await wait(baseToken.setApproveAllowed(false));
      await expect(flux.withdraw(1,[])).to.be.revertedWith(
        "SafeERC20: ERC20 operation did not succeed"
      );
      await wait(baseToken.setApproveAllowed(true));
    });
    it("correctly executes the redemption", async function () {
      await wait(yieldToken.approve(flux.address, 10));
      await wait(yieldToken.setResponseAmt(10));
      expect(await flux.withdraw(10,[]));
      let baseTokenBal = await baseToken.balanceOf(flux.address);
      expect(baseTokenBal).to.equal(10);
      await wait(baseToken.transferFrom(flux.address, await owner.getAddress(), 10));
    });
  });
  describe("upon previewDeposit and previewWithdraw", async function () {
    const DECIMAL_MAG = 100; // fUSDC: 8, USDC: 6
    const EXP_SCALE = BigNumber.from(10).pow(18); // 10**18 = expScale in fUSDC contract
    const ONE_THOUSAND = BigNumber.from("1000000000"); // 1,000,000,000 = $1000
    it("correctly applies the exchange rate for previewDeposit", async function () {
      await expect(yieldToken.setExRate(EXP_SCALE.div(DECIMAL_MAG))).to.not.be.reverted; // test 1:1
      let previewedDeposit = await flux.previewDeposit(ONE_THOUSAND);
      expect(previewedDeposit).to.equal(ONE_THOUSAND.mul(DECIMAL_MAG));
      await expect(yieldToken.setExRate(EXP_SCALE.div(2).div(DECIMAL_MAG))).to.not.be.reverted; // test 2 : 1
      previewedDeposit = await flux.previewDeposit(ONE_THOUSAND);
      expect(previewedDeposit).to.equal(ONE_THOUSAND.mul(DECIMAL_MAG).mul(2));
    });
    it("correctly applies the exchange rate for previewWithdraw", async function () {
      await expect(yieldToken.setExRate(EXP_SCALE.div(DECIMAL_MAG))).to.not.be.reverted; // test 1:1
      let previewedWithdraw = await flux.previewWithdraw(ONE_THOUSAND.mul(DECIMAL_MAG));
      expect(previewedWithdraw).to.equal(ONE_THOUSAND);
      await expect(yieldToken.setExRate(EXP_SCALE.mul(2).div(DECIMAL_MAG))).to.not.be.reverted; // test 2 : 1
      previewedWithdraw = await flux.previewWithdraw(ONE_THOUSAND.mul(DECIMAL_MAG));
      expect(previewedWithdraw).to.equal(ONE_THOUSAND.mul(2));
    });
  });
});
