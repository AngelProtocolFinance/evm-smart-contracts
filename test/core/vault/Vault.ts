import {FakeContract, smock} from "@defi-wonderland/smock";
import {expect, use} from "chai";
import {BigNumber, Signer} from "ethers";
import hre from "hardhat";
import {
  DEFAULT_NETWORK,
  DEFAULT_NETWORK_INFO,
  DEFAULT_STRATEGY_ID,
  DEFAULT_STRATEGY_PARAMS,
  DEFAULT_VAULT_NAME,
  DEFAULT_VAULT_SYMBOL,
  wait,
} from "test/utils";
import {
  APVault_V1,
  APVault_V1__factory,
  DummyERC20,
  DummyERC20__factory,
  DummyRouter,
  DummyRouter__factory,
  DummyStrategy,
  DummyStrategy__factory,
  IVault,
  IVaultEmitter,
  IVaultEmitter__factory,
  LocalRegistrar,
  LocalRegistrar__factory,
} from "typechain-types";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {StrategyApprovalState} from "types";
import {getProxyAdminOwner, getSigners} from "utils";

use(smock.matchers);

describe("Vault", function () {
  const {ethers} = hre;
  let registrarFake: FakeContract<LocalRegistrar>;
  let vaultEmitterFake: FakeContract<IVaultEmitter>;

  let owner: Signer;
  let user: Signer;
  let admin: Signer;
  let collector: Signer;

  async function deployVault(
    {
      baseToken,
      yieldToken,
      admin,
      vaultType = 0,
      strategyId = DEFAULT_STRATEGY_ID,
      strategy = ethers.constants.AddressZero,
      registrar = ethers.constants.AddressZero,
      apTokenName = "TestVault",
      apTokenSymbol = "TV",
    }: {
      baseToken: string;
      yieldToken: string;
      admin: string;
      vaultType?: number;
      strategyId?: string;
      strategy?: string;
      registrar?: string;
      apTokenName?: string;
      apTokenSymbol?: string;
    },
    vaultEmitter: string
  ): Promise<APVault_V1> {
    let Vault = new APVault_V1__factory(owner);
    let vaultInitConfig: IVault.VaultConfigStruct = {
      vaultType: vaultType,
      strategyId: strategyId,
      strategy: strategy,
      registrar: registrar,
      baseToken: baseToken,
      yieldToken: yieldToken,
      apTokenName: apTokenName,
      apTokenSymbol: apTokenSymbol,
    };
    const vault = await Vault.deploy(vaultInitConfig, vaultEmitter, admin);
    await vault.deployed();
    return vault;
  }

  before(async function () {
    const {deployer, apTeam1, apTeam2} = await getSigners(hre);
    owner = deployer;
    user = apTeam1;
    collector = apTeam2;

    admin = await getProxyAdminOwner(hre);

    vaultEmitterFake = await smock.fake<IVaultEmitter>(IVaultEmitter__factory.createInterface());
  });

  describe("Upon deployment", function () {
    let vault: APVault_V1;
    let token: FakeContract<DummyERC20>;
    const DECIMALS = 18;

    beforeEach(async function () {
      token = await smock.fake<DummyERC20>(new DummyERC20__factory());
      token.decimals.returns(DECIMALS);
      vault = await deployVault(
        {
          admin: await owner.getAddress(),
          baseToken: token.address,
          yieldToken: token.address,
        },
        vaultEmitterFake.address
      );
    });
    it("Should successfully deploy the vault", async function () {
      expect(await vault.address);
    });
    it("Should initialize the ERC4626 vault", async function () {
      expect(await vault.symbol()).to.equal("TV");
      expect(await vault.name()).to.equal("TestVault");
      expect(await vault.decimals()).to.equal(DECIMALS);
    });
    it("Should revert if the provided tokens are invalid", async function () {
      await expect(
        deployVault(
          {
            admin: await owner.getAddress(),
            baseToken: ethers.constants.AddressZero,
            yieldToken: ethers.constants.AddressZero,
          },
          vaultEmitterFake.address
        )
      ).to.be.reverted;
    });
  });

  describe("Upon get and set config", async function () {
    let vault: APVault_V1;
    let token: FakeContract<DummyERC20>;

    beforeEach(async function () {
      token = await smock.fake<DummyERC20>(new DummyERC20__factory());
      vault = await deployVault(
        {
          admin: await owner.getAddress(),
          baseToken: token.address,
          yieldToken: token.address,
        },
        vaultEmitterFake.address
      );
    });
    it("should set the config as specified on deployment", async function () {
      let config = await vault.getVaultConfig();
      let admin = await vault.owner();
      expect(config.vaultType).to.equal(0);
      expect(config.strategyId).to.equal(DEFAULT_STRATEGY_ID);
      expect(config.strategy).to.equal(ethers.constants.AddressZero);
      expect(config.registrar).to.equal(ethers.constants.AddressZero);
      expect(config.baseToken).to.equal(token.address);
      expect(config.yieldToken).to.equal(token.address);
      expect(config.apTokenName).to.equal(DEFAULT_VAULT_NAME);
      expect(config.apTokenSymbol).to.equal(DEFAULT_VAULT_SYMBOL);
      expect(admin).to.equal(await owner.getAddress());
    });
    it("should accept new config values", async function () {
      let newConfig = {
        strategy: await user.getAddress(),
        registrar: await user.getAddress(),
      } as IVault.VaultConfigStruct;
      await vault.setVaultConfig(newConfig);
      let queriedConfig = await vault.getVaultConfig();
      expect(queriedConfig.strategy).to.equal(newConfig.strategy);
      expect(queriedConfig.registrar).to.equal(newConfig.registrar);
    });
    it("should revert when a non-admin calls the set method", async function () {
      let newConfig = {
        strategy: await user.getAddress(),
        registrar: await user.getAddress(),
      } as IVault.VaultConfigStruct;
      await expect(vault.connect(user).setVaultConfig(newConfig)).to.be.reverted;
    });
  });

  describe("upon Deposit", async function () {
    let vault: APVault_V1;
    let baseToken: FakeContract<DummyERC20>;
    let yieldToken: FakeContract<DummyERC20>;
    let strategy: FakeContract<DummyStrategy>;

    beforeEach(async function () {
      baseToken = await smock.fake<DummyERC20>(new DummyERC20__factory());
      yieldToken = await smock.fake<DummyERC20>(new DummyERC20__factory());
      baseToken.transfer.returns(true);
      baseToken.transferFrom.returns(true);
      baseToken.approve.returns(true);
      baseToken.approveFor.returns(true);
      yieldToken.transfer.returns(true);
      yieldToken.transferFrom.returns(true);
      yieldToken.approve.returns(true);
      yieldToken.approveFor.returns(true);
      strategy = await smock.fake<DummyStrategy>(new DummyStrategy__factory());
      strategy.getStrategyConfig.returns({
        strategyId: DEFAULT_STRATEGY_ID,
        baseToken: baseToken.address,
        yieldToken: yieldToken.address,
        admin: await owner.getAddress(),
      });
      registrarFake = await smock.fake<LocalRegistrar>(new LocalRegistrar__factory());
      registrarFake.getVaultOperatorApproved.whenCalledWith(await owner.getAddress()).returns(true);
      vault = await deployVault(
        {
          vaultType: 1, // Liquid
          admin: await owner.getAddress(),
          baseToken: baseToken.address,
          yieldToken: yieldToken.address,
          strategy: strategy.address,
          registrar: registrarFake.address,
        },
        vaultEmitterFake.address
      );
      registrarFake.getStrategyApprovalState.whenCalledWith(DEFAULT_STRATEGY_ID).returns(true);
      registrarFake.thisChain.returns(DEFAULT_NETWORK);
      registrarFake.queryNetworkConnection.whenCalledWith(DEFAULT_NETWORK).returns({
        ...DEFAULT_NETWORK_INFO,
        router: await owner.getAddress(),
      });
    });

    it("reverts if the operator isn't approved as an operator, sibling vault, or approved router", async function () {
      registrarFake.getVaultOperatorApproved
        .whenCalledWith(await owner.getAddress())
        .returns(false);
      registrarFake.queryNetworkConnection.whenCalledWith(DEFAULT_NETWORK).returns({
        ...DEFAULT_NETWORK_INFO,
        router: await user.getAddress(),
      });
      await expect(vault.deposit(0, baseToken.address, 1)).to.be.revertedWithCustomError(
        vault,
        "OnlyApproved"
      );
    });

    it("reverts if the strategy is paused", async function () {
      strategy.paused.returns(true);
      await expect(vault.deposit(0, baseToken.address, 1)).to.be.revertedWithCustomError(
        vault,
        "OnlyNotPaused"
      );
    });

    it("reverts if the token provided isn't the base token", async function () {
      await expect(vault.deposit(0, yieldToken.address, 1)).to.be.revertedWithCustomError(
        vault,
        "OnlyBaseToken"
      );
    });

    it("reverts if the baseToken approval fails", async function () {
      baseToken.approve.returns(false);
      await expect(vault.deposit(0, baseToken.address, 1)).to.be.reverted;
    });

    it("successfully completes the deposit", async function () {
      strategy.deposit.returns(1);
      await expect(vault.deposit(0, baseToken.address, 1)).to.emit(vault, "DepositERC4626");
      expect(baseToken.approve).to.have.been.calledWith(strategy.address, 1);
      expect(yieldToken.transferFrom).to.have.been.calledWith(strategy.address, vault.address, 1);
      let principles = await vault.principleByAccountId(0);
      expect(principles.baseToken).to.equal(1);
    });

    it("successfully adds to the position after subsequent deposits", async function () {
      strategy.deposit.returns(5);
      await expect(vault.deposit(0, baseToken.address, 5)).to.not.be.reverted;
      expect(baseToken.approve).to.have.been.calledWith(strategy.address, 5);
      expect(yieldToken.transferFrom).to.have.been.calledWith(strategy.address, vault.address, 5);
      yieldToken.balanceOf.whenCalledWith(vault.address).returns(5);
      await expect(vault.deposit(0, baseToken.address, 5)).to.not.be.reverted;
      let principles = await vault.principleByAccountId(0);
      expect(principles.baseToken).to.equal(10);
    });

    it("allows multiple accounts to deposit and tracks them separately", async function () {
      strategy.deposit.returns(500); // Acct. 0 gets 1:1
      await vault.deposit(0, baseToken.address, 500);
      expect(baseToken.approve).to.have.been.calledWith(strategy.address, 500);
      expect(yieldToken.transferFrom).to.have.been.calledWith(strategy.address, vault.address, 500);

      strategy.deposit.returns(250); // Acct. 1 gets 1:2
      yieldToken.balanceOf.whenCalledWith(vault.address).returns(500);
      await vault.deposit(1, baseToken.address, 500);
      expect(baseToken.approve).to.have.been.calledWith(strategy.address, 500);
      expect(yieldToken.transferFrom).to.have.been.calledWith(strategy.address, vault.address, 250);

      let shares_0 = await vault.balanceOf(0);
      let shares_1 = await vault.balanceOf(1);
      expect(shares_0).to.equal(500);
      expect(shares_1).to.equal(250);
    });
  });

  describe("upon Redemption", async function () {
    let vault: APVault_V1;
    let baseToken: FakeContract<DummyERC20>;
    let yieldToken: FakeContract<DummyERC20>;
    let strategy: FakeContract<DummyStrategy>;
    let router: FakeContract<DummyRouter>;
    const DEPOSIT = 1_000_000_000; // $1000
    const EX_RATE = 2;
    const TAX_RATE = 100; // bps
    const PRECISION = BigNumber.from(10).pow(24);

    beforeEach(async function () {
      baseToken = await smock.fake<DummyERC20>(new DummyERC20__factory());
      yieldToken = await smock.fake<DummyERC20>(new DummyERC20__factory());
      baseToken.transfer.returns(true);
      baseToken.transferFrom.returns(true);
      baseToken.approve.returns(true);
      baseToken.approveFor.returns(true);
      yieldToken.transfer.returns(true);
      yieldToken.transferFrom.returns(true);
      yieldToken.approve.returns(true);
      yieldToken.approveFor.returns(true);
      router = await smock.fake<DummyRouter>(new DummyRouter__factory());
      strategy = await smock.fake<DummyStrategy>(new DummyStrategy__factory());
      strategy.getStrategyConfig.returns({
        strategyId: DEFAULT_STRATEGY_ID,
        baseToken: baseToken.address,
        yieldToken: yieldToken.address,
        admin: await owner.getAddress(),
      });
      const networkParams = {
        ...DEFAULT_NETWORK_INFO,
        router: router.address,
      };
      registrarFake = await smock.fake<LocalRegistrar>(new LocalRegistrar__factory());
      registrarFake.thisChain.returns(DEFAULT_NETWORK);
      registrarFake.queryNetworkConnection.returns(networkParams);
      registrarFake.getVaultOperatorApproved.whenCalledWith(await owner.getAddress()).returns(true);
      registrarFake.getFeeSettingsByFeeType.returns({
        payoutAddress: await collector.getAddress(),
        bps: TAX_RATE,
      });

      vault = await deployVault(
        {
          vaultType: 0, // Locked
          admin: await owner.getAddress(),
          baseToken: baseToken.address,
          yieldToken: yieldToken.address,
          strategy: strategy.address,
          registrar: registrarFake.address,
        },
        vaultEmitterFake.address
      );

      strategy.deposit.returns(DEPOSIT);
      yieldToken.balanceOf.returns(DEPOSIT);
      await wait(vault.deposit(0, baseToken.address, DEPOSIT));
    });

    it("reverts if the strategy is paused", async function () {
      strategy.paused.returns(true);
      await expect(vault.redeem(0, DEPOSIT / 2)).to.be.revertedWithCustomError(
        vault,
        "OnlyNotPaused"
      );
    });

    it("reverts if the caller isn't approved", async function () {
      registrarFake.getVaultOperatorApproved
        .whenCalledWith(await owner.getAddress())
        .returns(false);
      await expect(vault.redeem(0, DEPOSIT / 2)).to.be.revertedWithCustomError(
        vault,
        "OnlyApproved"
      );
    });

    it("reverts if the baseToken transfer fails", async function () {
      baseToken.transfer.returns(false);
      baseToken.transferFrom.returns(false);
      await expect(vault.redeem(0, DEPOSIT / 2)).to.be.reverted;
    });

    it("reverts if the baseToken approve fails", async function () {
      baseToken.approve.returns(false);
      strategy.withdraw.returns(DEPOSIT / 2);
      await expect(vault.redeem(0, DEPOSIT / 2)).to.be.reverted;
    });

    it("does not tax if the position hasn't earned yield", async function () {
      let shares = await vault.balanceOf(0);
      strategy.withdraw.returns(DEPOSIT / 2); // no yield
      await expect(vault.redeem(0, shares.div(2))).to.not.be.reverted; // Redeem half the position
      expect(yieldToken.approve).to.have.been.calledWith(strategy.address, shares.div(2));
      expect(baseToken.transferFrom).to.have.been.calledWith(
        strategy.address,
        vault.address,
        DEPOSIT / 2
      );
    });

    it("taxes if the position is in the black", async function () {
      let shares = await vault.balanceOf(0);
      strategy.withdraw.returns(DEPOSIT); // 100% yield
      expect(await vault.redeem(0, shares.div(2))); // Redeem half the position
      let YIELD = DEPOSIT / 2; // half the tokens are yield when position is 100% yield
      let expectedTax = (YIELD * TAX_RATE) / 10000;
      expect(yieldToken.approve).to.have.been.calledWith(strategy.address, shares.div(2));
      expect(baseToken.transferFrom).to.have.been.calledWith(
        strategy.address,
        vault.address,
        DEPOSIT
      );
      expect(baseToken.approve).to.have.been.calledWith(router.address, expectedTax);
    });

    it("updates the principles accordingly", async function () {
      let shares = await vault.balanceOf(0);
      strategy.withdraw.returns(DEPOSIT); // 100% yield
      await expect(vault.redeem(0, shares.div(2))).to.not.be.reverted; // Redeem half the position
      let expectedPrinciple = DEPOSIT / 2;
      let principle = await vault.principleByAccountId(0);
      expect(principle.baseToken).to.equal(expectedPrinciple);
      expect(principle.costBasis_withPrecision).to.equal(PRECISION);
    });

    it("calls redeemAll if the redemption value is gt or equal to the position", async function () {
      let shares = await vault.balanceOf(0);
      strategy.withdraw.returns(DEPOSIT); // 100% yield
      await expect(vault.redeem(0, shares)).to.not.be.reverted; // Redeem the whole position
      let principle = await vault.principleByAccountId(0);
      expect(principle.baseToken).to.equal(0); // we zero out princ. on full redemption
      expect(principle.costBasis_withPrecision).to.equal(0);
    });
  });

  describe("upon Redeem All", async function () {
    let vault: APVault_V1;
    let baseToken: FakeContract<DummyERC20>;
    let yieldToken: FakeContract<DummyERC20>;
    let strategy: FakeContract<DummyStrategy>;
    let router: FakeContract<DummyRouter>;
    const DEPOSIT = 1_000_000_000; // $1000
    const EX_RATE = 2;
    const TAX_RATE = 100; // bps
    const PRECISION = BigNumber.from(10).pow(24);

    beforeEach(async function () {
      baseToken = await smock.fake<DummyERC20>(new DummyERC20__factory());
      yieldToken = await smock.fake<DummyERC20>(new DummyERC20__factory());
      baseToken.transfer.returns(true);
      baseToken.transferFrom.returns(true);
      baseToken.approve.returns(true);
      baseToken.approveFor.returns(true);
      yieldToken.transfer.returns(true);
      yieldToken.transferFrom.returns(true);
      yieldToken.approve.returns(true);
      yieldToken.approveFor.returns(true);
      router = await smock.fake<DummyRouter>(new DummyRouter__factory());
      strategy = await smock.fake<DummyStrategy>(new DummyStrategy__factory());
      strategy.getStrategyConfig.returns({
        strategyId: DEFAULT_STRATEGY_ID,
        baseToken: baseToken.address,
        yieldToken: yieldToken.address,
        admin: await owner.getAddress(),
      });
      const networkParams = {
        ...DEFAULT_NETWORK_INFO,
        router: router.address,
      };
      registrarFake = await smock.fake<LocalRegistrar>(new LocalRegistrar__factory());
      registrarFake.thisChain.returns(DEFAULT_NETWORK);
      registrarFake.queryNetworkConnection.returns(networkParams);
      registrarFake.getVaultOperatorApproved.whenCalledWith(await owner.getAddress()).returns(true);
      registrarFake.getFeeSettingsByFeeType.returns({
        payoutAddress: await collector.getAddress(),
        bps: TAX_RATE,
      });

      vault = await deployVault(
        {
          vaultType: 0, // Locked
          admin: await owner.getAddress(),
          baseToken: baseToken.address,
          yieldToken: yieldToken.address,
          strategy: strategy.address,
          registrar: registrarFake.address,
        },
        vaultEmitterFake.address
      );

      strategy.deposit.returns(DEPOSIT);
      yieldToken.balanceOf.returns(DEPOSIT);
      await wait(vault.deposit(0, baseToken.address, DEPOSIT));
    });

    it("reverts if the strategy is paused", async function () {
      strategy.paused.returns(true);
      await expect(vault.redeemAll(0)).to.be.revertedWithCustomError(vault, "OnlyNotPaused");
    });

    it("reverts if the caller isn't approved", async function () {
      registrarFake.getVaultOperatorApproved
        .whenCalledWith(await owner.getAddress())
        .returns(false);
      await expect(vault.redeemAll(0)).to.be.revertedWithCustomError(vault, "OnlyApproved");
    });

    it("does not tax if the position hasn't earned yield", async function () {
      let shares = await vault.balanceOf(0);
      strategy.withdraw.returns(DEPOSIT); // no yield
      await expect(vault.redeemAll(0)).to.not.be.reverted; // Redeem the whole position
      expect(yieldToken.approve).to.have.been.calledWith(strategy.address, DEPOSIT);
      expect(baseToken.transferFrom).to.have.been.calledWith(
        strategy.address,
        vault.address,
        DEPOSIT
      );
    });

    it("taxes if the position is in the black", async function () {
      strategy.withdraw.returns(DEPOSIT * 2); // 100% yield
      yieldToken.balanceOf.returns(DEPOSIT);
      await expect(vault.redeemAll(0)).to.not.be.reverted;
      let YIELD = DEPOSIT; // the entire original positoin is yield when 100% yield
      let expectedTax = (YIELD * TAX_RATE) / 10000;
      expect(yieldToken.approve).to.have.been.calledWith(strategy.address, DEPOSIT);
      expect(baseToken.transferFrom).to.have.been.calledWith(
        strategy.address,
        vault.address,
        DEPOSIT * 2
      );
      expect(baseToken.approve).to.have.been.calledWith(
        await owner.getAddress(),
        DEPOSIT * 2 - expectedTax
      );
      expect(baseToken.approve).to.have.been.calledWith(router.address, expectedTax);
    });

    it("updates the principles accordingly", async function () {
      strategy.withdraw.returns(DEPOSIT * 2); // 100% yield
      yieldToken.balanceOf.returns(DEPOSIT * 2);
      await expect(vault.redeemAll(0)).to.not.be.reverted;
      let principle = await vault.principleByAccountId(0);
      expect(principle.baseToken).to.equal(0); // we zero out princ. on full redemption
      expect(principle.costBasis_withPrecision).to.equal(0);
    });
  });

  describe("upon Harvest", async function () {
    let baseToken: FakeContract<DummyERC20>;
    let yieldToken: FakeContract<DummyERC20>;
    let strategy: FakeContract<DummyStrategy>;
    let router: FakeContract<DummyRouter>;
    const DEPOSIT = 1_000_000_000; // $1000
    const EX_RATE = 2;
    const TAX_RATE = 100; // bps
    const PRECISION = BigNumber.from(10).pow(24);

    beforeEach(async function () {
      baseToken = await smock.fake<DummyERC20>(new DummyERC20__factory());
      yieldToken = await smock.fake<DummyERC20>(new DummyERC20__factory());
      baseToken.transfer.returns(true);
      baseToken.transferFrom.returns(true);
      baseToken.approve.returns(true);
      baseToken.approveFor.returns(true);
      yieldToken.transfer.returns(true);
      yieldToken.transferFrom.returns(true);
      yieldToken.approve.returns(true);
      yieldToken.approveFor.returns(true);
      router = await smock.fake<DummyRouter>(new DummyRouter__factory());
      strategy = await smock.fake<DummyStrategy>(new DummyStrategy__factory());
      strategy.getStrategyConfig.returns({
        strategyId: DEFAULT_STRATEGY_ID,
        baseToken: baseToken.address,
        yieldToken: yieldToken.address,
        admin: await owner.getAddress(),
      });
      registrarFake = await smock.fake<LocalRegistrar>(new LocalRegistrar__factory());
      registrarFake.getVaultOperatorApproved.whenCalledWith(await owner.getAddress()).returns(true);
      registrarFake.getFeeSettingsByFeeType
        .whenCalledWith(1)
        .returns({payoutAddress: await collector.getAddress(), bps: TAX_RATE});
      registrarFake.thisChain.returns(DEFAULT_NETWORK);
      registrarFake.queryNetworkConnection.whenCalledWith(DEFAULT_NETWORK).returns({
        ...DEFAULT_NETWORK_INFO,
        router: router.address,
      });
    });

    describe("For liquid vaults", async function () {
      let vault: APVault_V1;
      beforeEach(async function () {
        vault = await deployVault(
          {
            vaultType: 1, // Locked
            admin: await owner.getAddress(),
            baseToken: baseToken.address,
            yieldToken: yieldToken.address,
            strategy: strategy.address,
            registrar: registrarFake.address,
          },
          vaultEmitterFake.address
        );
        strategy.deposit.returns(DEPOSIT);
        yieldToken.balanceOf.returns(DEPOSIT);
        await wait(vault.deposit(0, baseToken.address, DEPOSIT));
      });

      it("reverts if the strategy is paused", async function () {
        strategy.paused.returns(true);
        await expect(vault.harvest([0])).to.be.revertedWithCustomError(vault, "OnlyNotPaused");
      });

      it("reverts if the caller isn't approved", async function () {
        registrarFake.getVaultOperatorApproved
          .whenCalledWith(await owner.getAddress())
          .returns(false);
        registrarFake.thisChain.returns(DEFAULT_NETWORK);
        registrarFake.queryNetworkConnection.whenCalledWith(DEFAULT_NETWORK).returns({
          ...DEFAULT_NETWORK_INFO,
          router: await user.getAddress(),
        });
        await expect(vault.harvest([0])).to.be.revertedWithCustomError(vault, "OnlyApproved");
      });

      it("does not harvest if the position hasn't earned yield", async function () {
        strategy.previewWithdraw.returns(DEPOSIT);
        await expect(vault.harvest([0])).to.not.be.reverted;
      });

      it("reverts if the yieldToken approve to strategy fails", async function () {
        strategy.previewWithdraw.returns(DEPOSIT * 2);
        yieldToken.approve.returns(false);
        await expect(vault.harvest([0])).to.be.reverted;
      });

      it("reverts if the baseToken transfer fails", async function () {
        strategy.previewWithdraw.returns(DEPOSIT * 2);
        baseToken.transfer.returns(false);
        baseToken.transferFrom.returns(false);
        await expect(vault.harvest([0])).to.be.reverted;
      });

      it("appropriately harevests yield", async function () {
        strategy.previewWithdraw.returns(DEPOSIT * 2);
        let expectedHarvestAmt = (DEPOSIT * TAX_RATE) / 10000; // DEPOSIT = position in yield, apply tax
        strategy.withdraw.returns(expectedHarvestAmt);
        await expect(vault.harvest([0])).to.not.be.reverted;
        expect(baseToken.approve).to.have.been.calledWith(router.address, expectedHarvestAmt);
      });
    });

    describe("For locked vaults", async function () {
      let liquidVault: APVault_V1;
      let lockedVault: APVault_V1;
      let liquidStrategy: FakeContract<DummyStrategy>;
      const REBAL_RATE = 5000; // 5%
      const BASIS = 10000;
      beforeEach(async function () {
        // establish second strategy for liquid vault responses
        liquidStrategy = await smock.fake<DummyStrategy>(new DummyStrategy__factory());
        liquidStrategy.getStrategyConfig.returns({
          strategyId: DEFAULT_STRATEGY_ID,
          baseToken: baseToken.address,
          yieldToken: yieldToken.address,
          admin: await owner.getAddress(),
        });
        liquidVault = await deployVault(
          {
            vaultType: 1, // Liquid
            admin: await owner.getAddress(),
            baseToken: baseToken.address,
            yieldToken: yieldToken.address,
            strategy: liquidStrategy.address,
            registrar: registrarFake.address,
          },
          vaultEmitterFake.address
        );
        lockedVault = await deployVault(
          {
            vaultType: 0, // Locked
            admin: await owner.getAddress(),
            baseToken: baseToken.address,
            yieldToken: yieldToken.address,
            strategy: strategy.address,
            registrar: registrarFake.address,
          },
          vaultEmitterFake.address
        );
        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: DEFAULT_NETWORK,
          approvalState: StrategyApprovalState.APPROVED,
          lockedVaultAddr: lockedVault.address,
          liquidVaultAddr: liquidVault.address,
        };
        registrarFake.getStrategyParamsById.returns(stratParams);
        registrarFake.thisChain.returns(DEFAULT_NETWORK);
        registrarFake.queryNetworkConnection.whenCalledWith(DEFAULT_NETWORK).returns({
          ...DEFAULT_NETWORK_INFO,
          router: await owner.getAddress(),
        });
        registrarFake.getRebalanceParams.returns({
          rebalanceLiquidProfits: false,
          lockedRebalanceToLiquid: REBAL_RATE,
          interestDistribution: 0,
          lockedPrincipleToLiquid: false,
          principleDistribution: 0,
          basis: BASIS,
        });
        registrarFake.getVaultOperatorApproved.whenCalledWith(lockedVault.address).returns(true);
        strategy.deposit.returns(DEPOSIT);
        yieldToken.balanceOf.returns(DEPOSIT);
        await wait(lockedVault.deposit(0, baseToken.address, DEPOSIT));
      });

      it("reverts if the baseToken transfer fails", async function () {
        strategy.previewWithdraw.returns(DEPOSIT * 2);
        let expectedTaxAmt = (DEPOSIT * TAX_RATE) / BASIS; // DEPOSIT = position in yield, apply tax
        let expectedRebalAmt = (DEPOSIT * REBAL_RATE) / BASIS;
        strategy.withdraw.returns(expectedTaxAmt + expectedRebalAmt);
        baseToken.transferFrom.returns(false);
        await expect(lockedVault.harvest([0])).to.be.reverted;
      });

      it("appropriately harvests yield and rebalances to the liquid sibling vault", async function () {
        strategy.previewWithdraw.returns(DEPOSIT * 2);
        let expectedTaxAmt = (DEPOSIT * TAX_RATE) / BASIS; // DEPOSIT = position in yield, apply tax
        let expectedRebalAmt = (DEPOSIT * REBAL_RATE) / BASIS;
        strategy.withdraw.returns(expectedTaxAmt + expectedRebalAmt);
        liquidStrategy.deposit.returns(expectedRebalAmt);
        liquidStrategy.paused.returns(false);
        await expect(lockedVault.harvest([0])).to.not.be.reverted;
        expect(baseToken.approve).to.have.been.calledWith(await owner.getAddress(), expectedTaxAmt);
        expect(baseToken.transfer).to.have.been.calledWith(liquidVault.address, expectedRebalAmt);
        expect(baseToken.approve).to.have.been.calledWith(liquidStrategy.address, expectedRebalAmt);
      });
    });
  });
});
