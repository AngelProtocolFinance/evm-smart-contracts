import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import hre from "hardhat";
import {
  IVaultHelpers,
  StrategyApprovalState,
  deployDummyERC20,
  deployDummyGasService,
  deployDummyGateway,
  deployDummyVault,
  deployRegistrarAsProxy,
  packActionData,
} from "test/utils";
import {
  DummyERC20,
  DummyGasService,
  DummyGateway,
  DummyVault,
  ITransparentUpgradeableProxy__factory,
  Registrar,
  Router,
  Router__factory,
} from "typechain-types";
import {getSigners} from "utils";
import {LocalRegistrarLib} from "../../../typechain-types/contracts/core/registrar/LocalRegistrar";

describe("Router", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;
  let collector: SignerWithAddress;
  let defaultApParams = {
    routerAddr: ethers.constants.AddressZero,
    refundAddr: ethers.constants.AddressZero,
  } as LocalRegistrarLib.AngelProtocolParamsStruct;
  let deadAddr = "0x000000000000000000000000000000000000dead";
  const originatingChain = "polygon";
  const localChain = "ethereum";
  const accountsContract = deadAddr;

  before(async function () {
    const {deployer, proxyAdmin, apTeam1, apTeam2} = await getSigners(hre);
    owner = deployer;
    admin = proxyAdmin;
    user = apTeam1;
    collector = apTeam2;
  });

  async function deployRouterAsProxy(
    gatewayAddress: string = "0xe432150cce91c13a887f7D836923d5597adD8E31",
    gasRecvAddress: string = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    registrar?: Registrar
  ): Promise<Router> {
    if (!registrar) {
      registrar = await deployRegistrarAsProxy(owner, admin);
    }
    let apParams = defaultApParams;
    apParams.refundAddr = collector.address;
    await registrar.setAngelProtocolParams(apParams);

    const RouterFactory = new Router__factory(owner);
    const RouterImpl = await RouterFactory.deploy();
    await RouterImpl.deployed();

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const RouterInitData = RouterImpl.interface.encodeFunctionData("initialize", [
      localChain,
      gatewayAddress,
      gasRecvAddress,
      registrar.address,
    ]);

    const RouterProxy = await ProxyContract.deploy(
      RouterImpl.address,
      admin.address,
      RouterInitData
    );
    await RouterProxy.deployed();
    return Router__factory.connect(RouterProxy.address, owner);
  }

  async function upgradeProxy(signer: SignerWithAddress, routerProxy: string) {
    const RouterFactory = new Router__factory(owner);
    const RouterImpl = await RouterFactory.deploy();
    await RouterImpl.deployed();

    const RouterProxy = ITransparentUpgradeableProxy__factory.connect(routerProxy, signer);
    RouterProxy.upgradeTo(RouterImpl.address);
  }

  describe("Deployment", function () {
    let router: Router;
    beforeEach(async function () {
      router = await deployRouterAsProxy();
    });

    it("Should successfully deploy the contract as an upgradable proxy", async function () {
      expect(router.address);
      expect(await upgradeProxy(admin, router.address));
    });

    it("Accepts and initializes the gateway and gas receiver as part of init", async function () {
      const gateway = "0x4F4495243837681061C4743b74B3eEdf548D56A5";
      const gasRecv = "0x2d5d7d31F671F86C782533cc367F14109a082712";
      router = await deployRouterAsProxy(gateway, gasRecv);
      expect(await router.gateway()).to.equal(gateway);
      expect(await router.gasReceiver()).to.equal(gasRecv);
    });
  });

  describe("Protected methods", function () {
    let lockedVault: DummyVault;
    let liquidVault: DummyVault;
    let registrar: Registrar;
    let gateway: DummyGateway;
    let token: DummyERC20;
    let router: Router;
    let gasService: DummyGasService;
    before(async function () {
      token = await deployDummyERC20(owner);
      gateway = await deployDummyGateway(owner);
      lockedVault = await deployDummyVault(owner, {
        baseToken: token.address,
        yieldToken: token.address,
        vaultType: 0,
      });
      liquidVault = await deployDummyVault(owner, {
        baseToken: token.address,
        yieldToken: token.address,
        vaultType: 1,
      });
      gasService = await deployDummyGasService(owner);
      token = await deployDummyERC20(owner);
      registrar = await deployRegistrarAsProxy(owner, admin);
      await gateway.setTestTokenAddress(token.address);
      await registrar.setTokenAccepted(token.address, true);
      await registrar.setAccountsContractAddressByChain(originatingChain, accountsContract);
      await registrar.setAccountsContractAddressByChain(localChain, owner.address);
    });
    beforeEach(async function () {
      router = await deployRouterAsProxy(gateway.address, gasService.address, registrar);
    });

    it("Does not allow a non-accounts contract address on another chain to call executeWithToken via GMP", async function () {
      await expect(
        router.executeWithToken(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          owner.address,
          ethers.utils.formatBytes32String("payload"),
          "USDC",
          1
        )
      ).to.be.revertedWith("Unauthorized Call");
    });

    it("Does not allow a non-accounts contract address locally to call executeWithTokenLocal", async function () {
      await expect(
        router
          .connect(user)
          .executeWithTokenLocal(
            localChain,
            user.address,
            ethers.utils.formatBytes32String("payload"),
            "USDC",
            1
          )
      ).to.be.revertedWith("Unauthorized local call");
    });

    it("Does not allow a non-accounts contract address on another chain to call execute via GMP", async function () {
      await expect(
        router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          owner.address,
          ethers.utils.formatBytes32String("payload")
        )
      ).to.be.revertedWith("Unauthorized Call");
    });

    it("Does not allow a non-accounts contract address locally to call executeLocal", async function () {
      await expect(
        router
          .connect(user)
          .executeLocal(localChain, user.address, ethers.utils.formatBytes32String("payload"))
      ).to.be.revertedWith("Unauthorized local call");
    });

    it("Does not allow a non-primary chain to call executeWithToken", async function () {
      await expect(
        router.executeWithToken(
          ethers.utils.formatBytes32String("true"),
          "Avalanche",
          gateway.address,
          ethers.utils.formatBytes32String("payload"),
          "USDC",
          1
        )
      ).to.be.revertedWith("Unauthorized Call");
    });

    it("Does not allow a non-primary chain to call execute", async function () {
      await expect(
        router.execute(
          ethers.utils.formatBytes32String("true"),
          "Avalanche",
          gateway.address,
          ethers.utils.formatBytes32String("payload")
        )
      ).to.be.revertedWith("Unauthorized Call");
    });
  });

  describe("Correctly triggers the refund process on failed Deposit", function () {
    let lockedVault: DummyVault;
    let liquidVault: DummyVault;
    let registrar: Registrar;
    let gateway: DummyGateway;
    let token: DummyERC20;
    let router: Router;
    let gasService: DummyGasService;
    const getDefaultActionData = () =>
      ({
        destinationChain: originatingChain,
        strategyId: "0xffffffff",
        selector: "",
        accountIds: [1],
        token: "",
        lockAmt: 111,
        liqAmt: 222,
        status: 0, // unprocessed
      } as IVaultHelpers.VaultActionDataStruct);

    describe("and the refund call is successful back through axelar", function () {
      before(async function () {
        token = await deployDummyERC20(owner);
        lockedVault = await deployDummyVault(owner, {
          baseToken: token.address,
          yieldToken: token.address,
          vaultType: 0,
        });
        liquidVault = await deployDummyVault(owner, {
          baseToken: token.address,
          yieldToken: token.address,
          vaultType: 1,
        });
        gateway = await deployDummyGateway(owner);
        gasService = await deployDummyGasService(owner);
        registrar = await deployRegistrarAsProxy(owner, admin);
        await gateway.setTestTokenAddress(token.address);
        await registrar.setTokenAccepted(token.address, true);
        await registrar.setAccountsContractAddressByChain(originatingChain, accountsContract);
      });

      beforeEach(async function () {
        router = await deployRouterAsProxy(gateway.address, gasService.address, registrar);
        await token.mint(gateway.address, 333);
        await token.approveFor(gateway.address, router.address, 333)
        let collectorBal = await token.balanceOf(collector.address);
        if (collectorBal.gt(0)) {
          await token.connect(collector).transfer(deadAddr, collectorBal);
        }
      });

      it("when more than one account is specified", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        actionData.accountIds = [1, 2, 3];
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            333
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Only one account allowed");
        let gatewayAllowance = await token.allowance(router.address, gateway.address);
        expect(gatewayAllowance).to.equal(333);
      });

      it("when an action other than deposit is called", async function () {
        let actionData = getDefaultActionData();
        actionData.token = token.address;
        actionData.selector = liquidVault.interface.getSighash("redeem");
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            333
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Only deposit accepts tokens");
        let gatewayAllowance = await token.allowance(router.address, gateway.address);
        expect(gatewayAllowance).to.equal(333);
      });

      it("when the payload amt doesn't match the GMP amt", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            332
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Amount mismatch");
        let gatewayAllowance = await token.allowance(router.address, gateway.address);
        expect(gatewayAllowance).to.equal(332);
      });

      it("when the vault values are both zero", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        actionData.liqAmt = 0;
        actionData.lockAmt = 0;
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            0
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "No vault deposit specified").to.be.reverted;
      });

      it("when the token isn't accepted", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        await registrar.setTokenAccepted(token.address, false);
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            333
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Token not accepted");
        let gatewayAllowance = await token.allowance(router.address, gateway.address);
        expect(gatewayAllowance).to.equal(333);
        await registrar.setTokenAccepted(token.address, true);
      });

      it("when the strategy is not approved", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            333
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Strategy not approved");
        let gatewayAllowance = await token.allowance(router.address, gateway.address);
        expect(gatewayAllowance).to.equal(333);
      });

      it("when the strategy is not approved for execute", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        await gateway.setTestTokenAddress(token.address);
        await registrar.setTokenAccepted(token.address, true);
        actionData.selector = liquidVault.interface.getSighash("redeem");
        let packedData = await packActionData(actionData);
        await expect(
          router.execute(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData
          )
        ).to.be.revertedWith("Strategy not approved");
      });
    });

    describe("and the refund call fails through axelar and falls back to the refund collector", async function () {
      before(async function () {
        token = await deployDummyERC20(owner);
        lockedVault = await deployDummyVault(owner, {
          baseToken: token.address,
          yieldToken: token.address,
          vaultType: 0,
        });
        liquidVault = await deployDummyVault(owner, {
          baseToken: token.address,
          yieldToken: token.address,
          vaultType: 1,
        });
        gateway = await deployDummyGateway(owner);
        gasService = await deployDummyGasService(owner);
        registrar = await deployRegistrarAsProxy(owner, admin);
        await gateway.setTestTokenAddress(token.address);
        await registrar.setTokenAccepted(token.address, true);
        await registrar.setAccountsContractAddressByChain(originatingChain, accountsContract);
      });

      beforeEach(async function () {
        router = await deployRouterAsProxy(gateway.address, undefined, registrar); // set gas service to undef so that the sendTokens call fails
        await token.mint(gateway.address, 333);
        await token.approveFor(gateway.address, router.address, 333)
        let collectorBal = await token.balanceOf(collector.address);
        if (collectorBal.gt(0)) {
          await token.connect(collector).transfer(deadAddr, collectorBal);
        }
      });

      it("when more than one account is specified", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        actionData.accountIds = [1, 2, 3];
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            333
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Only one account allowed");
        let collectorBal = await token.balanceOf(collector.address);
        expect(collectorBal).to.equal(333);
      });

      it("when an action other than deposit is called", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        actionData.selector = liquidVault.interface.getSighash("redeem");
        let packedData = await packActionData(actionData);
        await expect(
          await router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            333
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Only deposit accepts tokens");
        let collectorBal = await token.balanceOf(collector.address);
        expect(collectorBal).to.equal(333);
      });

      it("when the payload amt doesn't match the GMP amt", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            332
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Amount mismatch");
        let collectorBal = await token.balanceOf(collector.address);
        expect(collectorBal).to.equal(332);
      });

      it("when the vault values are both zero", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        actionData.liqAmt = 0;
        actionData.lockAmt = 0;
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            0
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "No vault deposit specified").to.be.reverted;
      });

      it("when the token isn't accepted", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        await registrar.setTokenAccepted(token.address, false);
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            333
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Token not accepted");
        let collectorBal = await token.balanceOf(collector.address);
        expect(collectorBal).to.equal(333);
        await registrar.setTokenAccepted(token.address, true);
      });

      it("when the strategy is not approved", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        let packedData = await packActionData(actionData);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            token.symbol(),
            333
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Strategy not approved");
        let collectorBal = await token.balanceOf(collector.address);
        expect(collectorBal).to.equal(333);
      });

      it("when the strategy is not approved for execute", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        await gateway.setTestTokenAddress(token.address);
        await registrar.setTokenAccepted(token.address, true);
        actionData.selector = liquidVault.interface.getSighash("redeem");
        let packedData = await packActionData(actionData);
        await expect(
          router.execute(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData
          )
        ).to.be.revertedWith("Strategy not approved");
      });
    });
  });

  describe("Routes messages according to payload instructions", function () {
    let lockedVault: DummyVault;
    let liquidVault: DummyVault;
    let registrar: Registrar;
    let gateway: DummyGateway;
    let gasService: DummyGasService;
    let token: DummyERC20;
    let router: Router;
    const LOCKAMT = 111;
    const LIQAMT = 222;
    let actionData = {
      destinationChain: originatingChain,
      strategyId: "0xffffffff",
      selector: "",
      accountIds: [1],
      token: "",
      lockAmt: LOCKAMT,
      liqAmt: LIQAMT,
      status: 0,
    } as IVaultHelpers.VaultActionDataStruct;

    before(async function () {
      gateway = await deployDummyGateway(owner);
      gasService = await deployDummyGasService(owner);
      token = await deployDummyERC20(owner);
      registrar = await deployRegistrarAsProxy(owner, admin);
      await registrar.setTokenAccepted(token.address, true);
      await gateway.setTestTokenAddress(token.address);
      await registrar.setAccountsContractAddressByChain(originatingChain, accountsContract);
      actionData.token = token.address;
      lockedVault = await deployDummyVault(owner, {
        baseToken: token.address,
        yieldToken: token.address,
        vaultType: 0,
      });
      liquidVault = await deployDummyVault(owner, {
        baseToken: token.address,
        yieldToken: token.address,
        vaultType: 1,
      });
      await registrar.setStrategyParams(
        actionData.strategyId,
        originatingChain,
        lockedVault.address,
        liquidVault.address,
        StrategyApprovalState.APPROVED
      );
    });

    beforeEach(async function () {
      router = await deployRouterAsProxy(gateway.address, gasService.address, registrar);
      await registrar.setAngelProtocolParams({
        routerAddr: router.address,
        refundAddr: owner.address,
      });
    });

    it("correctly calls depost", async function () {
      await token.mint(gateway.address, LOCKAMT + LIQAMT);
      await token.approveFor(gateway.address, router.address, LOCKAMT + LIQAMT)
      actionData.selector = liquidVault.interface.getSighash("deposit");
      let packedData = await packActionData(actionData);
      await expect(
        router.executeWithToken(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData,
          token.symbol(),
          333
        )
      ).to.emit(liquidVault, "Deposit");
    });

    it("correctly calls redeem via execute", async function () {
      // Do a deposit first to update the symbol mapping
      await token.mint(gateway.address, LOCKAMT + LIQAMT);
      await token.approveFor(gateway.address, router.address, LOCKAMT + LIQAMT)
      actionData.selector = liquidVault.interface.getSighash("deposit");
      let packedData = await packActionData(actionData);
      await router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        originatingChain,
        accountsContract,
        packedData,
        token.symbol(),
        333
      );
      actionData.selector = liquidVault.interface.getSighash("redeem");
      actionData.token = token.address;
      packedData = await packActionData(actionData);
      await expect(
        router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      )
        .to.emit(liquidVault, "Redeem")
        .to.emit(lockedVault, "Redeem");
    });

    it("correctly calls redeemAll via execute", async function () {
      // Do a deposit first to update the symbol mapping
      await token.mint(gateway.address, LOCKAMT + LIQAMT);
      await token.approveFor(gateway.address, router.address, LOCKAMT + LIQAMT)
      actionData.selector = liquidVault.interface.getSighash("deposit");
      let packedData = await packActionData(actionData);
      await router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        originatingChain,
        accountsContract,
        packedData,
        token.symbol(),
        333
      );
      await liquidVault.setDummyAmt(actionData.liqAmt);
      await lockedVault.setDummyAmt(actionData.lockAmt);
      actionData.selector = liquidVault.interface.getSighash("redeemAll");
      actionData.token = token.address;
      packedData = await packActionData(actionData);
      await token.mint(gateway.address, LOCKAMT + LIQAMT);
      await token.approveFor(gateway.address, router.address, LOCKAMT + LIQAMT)
      await expect(
        router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      ).to.emit(liquidVault, "Redeem");
    });

    it("correctly calls harvest via execute", async function () {
      actionData.selector = liquidVault.interface.getSighash("harvest");
      let packedData = await packActionData(actionData);
      await expect(
        router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      ).to.emit(liquidVault, "RewardsHarvested");
    });
  });

  describe("Deposit", function () {
    let lockedVault: DummyVault;
    let liquidVault: DummyVault;
    let registrar: Registrar;
    let gateway: DummyGateway;
    let gasService: DummyGasService;
    let token: DummyERC20;
    let router: Router;
    const LOCKAMT = 111;
    const LIQAMT = 222;
    let actionData = {
      destinationChain: originatingChain,
      strategyId: "0xffffffff",
      selector: "",
      accountIds: [1],
      token: "",
      lockAmt: LOCKAMT,
      liqAmt: LIQAMT,
      status: 0,
    } as IVaultHelpers.VaultActionDataStruct;

    before(async function () {
      gateway = await deployDummyGateway(owner);
      gasService = await deployDummyGasService(owner);
      token = await deployDummyERC20(owner);
      registrar = await deployRegistrarAsProxy(owner, admin);
      await registrar.setAccountsContractAddressByChain(originatingChain, accountsContract);
      await gateway.setTestTokenAddress(token.address);
      await registrar.setTokenAccepted(token.address, true);
      lockedVault = await deployDummyVault(owner, {
        baseToken: token.address,
        yieldToken: token.address,
        vaultType: 0,
      });
      liquidVault = await deployDummyVault(owner, {
        baseToken: token.address,
        yieldToken: token.address,
        vaultType: 1,
      });
      await registrar.setStrategyParams(
        actionData.strategyId,
        originatingChain,
        lockedVault.address,
        liquidVault.address,
        StrategyApprovalState.APPROVED
      );
      actionData.selector = liquidVault.interface.getSighash("deposit");
      actionData.token = token.address;
    });

    beforeEach(async function () {
      router = await deployRouterAsProxy(gateway.address, gasService.address, registrar);
    });

    it("deposits the specified amounts to the specified vaults", async function () {
      await token.mint(gateway.address, LOCKAMT + LIQAMT);
      await token.approveFor(gateway.address, router.address, LOCKAMT + LIQAMT)
      let packedData = packActionData(actionData);
      await router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        originatingChain,
        accountsContract,
        packedData,
        token.symbol(),
        333
      );
      expect(await token.balanceOf(liquidVault.address)).to.equal(actionData.liqAmt);
      expect(await token.balanceOf(lockedVault.address)).to.equal(actionData.lockAmt);
    });
  });

  describe("Redeem", function () {
    let lockedVault: DummyVault;
    let liquidVault: DummyVault;
    let registrar: Registrar;
    let gateway: DummyGateway;
    let gasService: DummyGasService;
    let token: DummyERC20;
    let router: Router;
    const LOCKAMT = 111;
    const LIQAMT = 222;
    let actionData = {
      destinationChain: originatingChain,
      strategyId: "0xffffffff",
      selector: "",
      accountIds: [1],
      token: "",
      lockAmt: LOCKAMT,
      liqAmt: LIQAMT,
      status: 0,
    } as IVaultHelpers.VaultActionDataStruct;

    before(async function () {
      gateway = await deployDummyGateway(owner);
      gasService = await deployDummyGasService(owner);
      token = await deployDummyERC20(owner);
      registrar = await deployRegistrarAsProxy(owner, admin);
      await registrar.setAccountsContractAddressByChain(originatingChain, accountsContract);
      await gateway.setTestTokenAddress(token.address);
      lockedVault = await deployDummyVault(owner, {
        baseToken: token.address,
        yieldToken: token.address,
        vaultType: 0,
      });
      liquidVault = await deployDummyVault(owner, {
        baseToken: token.address,
        yieldToken: token.address,
        vaultType: 1,
      });
      await registrar.setTokenAccepted(token.address, true);
      await registrar.setStrategyParams(
        actionData.strategyId,
        originatingChain,
        lockedVault.address,
        liquidVault.address,
        StrategyApprovalState.APPROVED
      );
      actionData.token = token.address;
    });

    beforeEach(async function () {
      router = await deployRouterAsProxy(gateway.address, gasService.address, registrar);
      await token.mint(gateway.address, LOCKAMT + LIQAMT);
      await token.approveFor(gateway.address, router.address, LOCKAMT + LIQAMT)
      actionData.selector = liquidVault.interface.getSighash("deposit");
      let packedData = packActionData(actionData);
      await router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        originatingChain,
        accountsContract,
        packedData,
        token.symbol(),
        333
      );
      actionData.selector = liquidVault.interface.getSighash("redeem");
    });

    it("Redeems the amounts specified back to the router", async function () {
      let routerBalBefore = await token.balanceOf(router.address);
      let packedData = packActionData(actionData);
      expect(
        await router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      );
      let routerBalAfter = await token.balanceOf(router.address);
      expect(routerBalAfter).to.equal(routerBalBefore.add(333));
    });

    it("Sets the gateway as an approved spender for the redeemed tokens", async function () {
      let packedData = packActionData(actionData);
      expect(
        await router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      );
      let allowance = await token.allowance(router.address, gateway.address);
      expect(allowance).to.equal(333);
    });

    it("Sets the gas receiver as an approved spender for the gas fee", async function () {
      let packedData = packActionData(actionData);
      expect(
        await router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      );
      let allowance = await token.allowance(router.address, gasService.address);
      let gasFee = await registrar.getGasByToken(token.address);
      expect(allowance).to.equal(gasFee);
    });

    it("Reverts if the redemption amount is less than the gas fee", async function () {
      let packedData = packActionData(actionData);
      await registrar.setGasByToken(token.address, 334);
      await expect(
        router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      ).to.be.revertedWith("Send amount does not cover gas");
    });

    // This test runs into an open bug with the chai hardhat listeners. We will have to check this
    // manually until the issue is resolved
    // the issue can be found here: https://github.com/NomicFoundation/hardhat/issues/3080
    // it("Correctly splits the gas fees between locked and liquid amounts", async function () {
    //   let packedData = packActionData(actionData)
    //   await registrar.setGasByToken(token.address, 9)
    //   let expectedLiquidRedemption = BigNumber.from(111).sub(3)
    //   let expectedLockedRedemption = BigNumber.from(222).sub(6)
    //   await expect(router.execute(
    //     ethers.utils.formatBytes32String("true"),
    //     originatingChain,
    //     accountsContract,
    //     packedData
    //   ))
    //   .to.emit(router, "TokensSent")
    //   .withArgs(
    //     [
    //       actionData.strategyId,
    //       actionData.selector,
    //       undefined,
    //       actionData.token,
    //       expectedLockedRedemption,
    //       expectedLiquidRedemption
    //     ], 324)
    // })
  });

  describe("RedeemAll", function () {
    let lockedVault: DummyVault;
    let liquidVault: DummyVault;
    let registrar: Registrar;
    let gateway: DummyGateway;
    let gasService: DummyGasService;
    let token: DummyERC20;
    let router: Router;
    const LOCKAMT = 111;
    const LIQAMT = 222;
    let actionData = {
      destinationChain: originatingChain,
      strategyId: "0xffffffff",
      selector: "",
      accountIds: [1],
      token: "",
      lockAmt: LOCKAMT,
      liqAmt: LIQAMT,
      status: 0,
    } as IVaultHelpers.VaultActionDataStruct;

    before(async function () {
      gateway = await deployDummyGateway(owner);
      gasService = await deployDummyGasService(owner);
      token = await deployDummyERC20(owner);
      registrar = await deployRegistrarAsProxy(owner, admin);
      await registrar.setAccountsContractAddressByChain(originatingChain, accountsContract);
      await gateway.setTestTokenAddress(token.address);
      await registrar.setTokenAccepted(token.address, true);
      lockedVault = await deployDummyVault(owner, {
        baseToken: token.address,
        yieldToken: token.address,
        vaultType: 0,
      });
      liquidVault = await deployDummyVault(owner, {
        baseToken: token.address,
        yieldToken: token.address,
        vaultType: 1,
      });
      await registrar.setStrategyParams(
        actionData.strategyId,
        originatingChain,
        lockedVault.address,
        liquidVault.address,
        StrategyApprovalState.APPROVED
      );
      actionData.selector = liquidVault.interface.getSighash("redeemAll");
      actionData.token = token.address;
    });

    beforeEach(async function () {
      router = await deployRouterAsProxy(gateway.address, gasService.address, registrar);
      await token.mint(gateway.address, LOCKAMT + LIQAMT);
      await token.approveFor(gateway.address, router.address, LOCKAMT + LIQAMT)
      actionData.selector = liquidVault.interface.getSighash("deposit");
      let packedData = packActionData(actionData);
      await router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        originatingChain,
        accountsContract,
        packedData,
        token.symbol(),
        333
      );
      actionData.selector = liquidVault.interface.getSighash("redeemAll");
    });

    it("Redeems the amounts specified back to the router", async function () {
      let routerBalBefore = await token.balanceOf(router.address);
      let packedData = packActionData(actionData);
      await liquidVault.setDummyAmt(actionData.liqAmt);
      await lockedVault.setDummyAmt(actionData.lockAmt);
      expect(
        await router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      );
      let routerBalAfter = await token.balanceOf(router.address);
      expect(routerBalAfter).to.equal(routerBalBefore.add(333));
    });

    it("Sets the gateway as an approved spender for the redeemed tokens", async function () {
      let packedData = packActionData(actionData);
      await liquidVault.setDummyAmt(actionData.liqAmt);
      await lockedVault.setDummyAmt(actionData.lockAmt);
      expect(
        await router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      );
      let allowance = await token.allowance(router.address, gateway.address);
      expect(allowance).to.equal(333);
    });

    it("Sets the gas receiver as an approved spender for the gas fee", async function () {
      let packedData = packActionData(actionData);
      await liquidVault.setDummyAmt(actionData.liqAmt);
      await lockedVault.setDummyAmt(actionData.lockAmt);
      expect(
        await router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      );
      let allowance = await token.allowance(router.address, gasService.address);
      let gasFee = await registrar.getGasByToken(token.address);
      expect(allowance).to.equal(gasFee);
    });

    it("Reverts if the redemption amount is less than the gas fee", async function () {
      actionData.liqAmt = 1;
      actionData.lockAmt = 1;
      await liquidVault.setDummyAmt(actionData.liqAmt);
      await lockedVault.setDummyAmt(actionData.lockAmt);
      let packedData = packActionData(actionData);
      await registrar.setGasByToken(token.address, 3);
      await expect(
        router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      ).to.be.revertedWith("Send amount does not cover gas");
    });
  });
});
