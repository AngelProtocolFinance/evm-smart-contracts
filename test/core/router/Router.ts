import {FakeContract, smock} from "@defi-wonderland/smock";
import {SnapshotRestorer, takeSnapshot} from "@nomicfoundation/hardhat-network-helpers";
import {expect, use} from "chai";
import {Signer} from "ethers";
import hre from "hardhat";
import {
  DEFAULT_ACTION_DATA,
  DEFAULT_HARVEST_REQUEST,
  DEFAULT_NETWORK_INFO,
  DEFAULT_STRATEGY_ID,
  packActionData,
} from "test/utils";
import {
  DummyERC20,
  DummyERC20__factory,
  DummyGasService,
  DummyGasService__factory,
  DummyGateway,
  DummyGateway__factory,
  DummyVault,
  DummyVault__factory,
  ITransparentUpgradeableProxy__factory,
  Registrar,
  Registrar__factory,
  Router,
  Router__factory,
} from "typechain-types";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {StrategyApprovalState, VaultActionStatus} from "types";
import {getProxyAdminOwner, getSigners} from "utils";

use(smock.matchers);

describe("Router", function () {
  const {ethers} = hre;
  let owner: Signer;
  let admin: Signer;
  let user: Signer;
  let collector: Signer;
  let deadAddr = "0x000000000000000000000000000000000000dead";
  const originatingChain = "Polygon";
  const localChain = "Ethereum";
  const accountsContract = deadAddr;

  before(async function () {
    const {deployer, apTeam1, apTeam2} = await getSigners(hre);
    owner = deployer;
    user = apTeam1;
    collector = apTeam2;

    admin = await getProxyAdminOwner(hre);
  });

  async function deployRouterAsProxy(registrar: string): Promise<Router> {
    const RouterFactory = new Router__factory(owner);
    const RouterImpl = await RouterFactory.deploy();
    await RouterImpl.deployed();

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const RouterInitData = RouterImpl.interface.encodeFunctionData("initialize", [registrar]);

    const RouterProxy = await ProxyContract.deploy(
      RouterImpl.address,
      await admin.getAddress(),
      RouterInitData
    );
    await RouterProxy.deployed();
    return Router__factory.connect(RouterProxy.address, owner);
  }

  async function upgradeProxy(signer: Signer, routerProxy: string) {
    const RouterFactory = new Router__factory(owner);
    const RouterImpl = await RouterFactory.deploy();
    await RouterImpl.deployed();

    const RouterProxy = ITransparentUpgradeableProxy__factory.connect(routerProxy, signer);
    RouterProxy.upgradeTo(RouterImpl.address);
  }

  let router: Router;

  let liquidVault: FakeContract<DummyVault>;
  let lockedVault: FakeContract<DummyVault>;
  let gasService: FakeContract<DummyGasService>;
  let gateway: FakeContract<DummyGateway>;
  let registrar: FakeContract<Registrar>;
  let token: FakeContract<DummyERC20>;

  before(async () => {
    liquidVault = await smock.fake<DummyVault>(new DummyVault__factory());
    lockedVault = await smock.fake<DummyVault>(new DummyVault__factory());
    gasService = await smock.fake<DummyGasService>(new DummyGasService__factory());
    gateway = await smock.fake<DummyGateway>(new DummyGateway__factory());
    registrar = await smock.fake<Registrar>(new Registrar__factory());
    token = await smock.fake<DummyERC20>(new DummyERC20__factory());

    router = await deployRouterAsProxy(registrar.address);
  });

  let snapshot: SnapshotRestorer;

  beforeEach(async () => {
    snapshot = await takeSnapshot();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("Deployment", function () {
    it("Should successfully deploy the contract as an upgradable proxy", async function () {
      await expect(upgradeProxy(admin, router.address)).to.not.be.reverted;
    });
  });

  describe("Protected methods", function () {
    beforeEach(async function () {
      const networkParams = {
        ...DEFAULT_NETWORK_INFO,
        axelarGateway: gateway.address,
        gasReceiver: gasService.address,
        refundAddr: await collector.getAddress(),
      };

      gateway.validateContractCall.returns(true);
      gateway.validateContractCallAndMint.returns(true);
      registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);
      registrar.queryNetworkConnection.returns(networkParams);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(originatingChain)
        .returns(accountsContract);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(localChain)
        .returns(await owner.getAddress());
      registrar.thisChain.returns(localChain);
    });

    it("Does not allow a non-accounts contract address on another chain to call executeWithToken via GMP", async function () {
      await expect(
        router.executeWithToken(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          await owner.getAddress(),
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
            await user.getAddress(),
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
          await owner.getAddress(),
          ethers.utils.formatBytes32String("payload")
        )
      ).to.be.revertedWith("Unauthorized Call");
    });

    it("Does not allow a non-accounts contract address locally to call executeLocal", async function () {
      await expect(
        router
          .connect(user)
          .executeLocal(
            localChain,
            await user.getAddress(),
            ethers.utils.formatBytes32String("payload")
          )
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
    const LOCK_AMT = 111;
    const LIQ_AMT = 222;
    const GAS_COST = 5;
    const TOTAL_AMT = LOCK_AMT + LIQ_AMT;

    const getDefaultActionData = () => ({
      ...DEFAULT_ACTION_DATA,
      accountId: 1,
      lockAmt: LOCK_AMT,
      liqAmt: LIQ_AMT,
    });

    beforeEach(async function () {
      const networkParams = {
        ...DEFAULT_NETWORK_INFO,
        axelarGateway: gateway.address,
        gasReceiver: gasService.address,
        refundAddr: await collector.getAddress(),
      };

      gateway.validateContractCall.returns(true);
      gateway.validateContractCallAndMint.returns(true);
      gateway.tokenAddresses.returns(token.address);
      registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);
      registrar.queryNetworkConnection.returns(networkParams);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(originatingChain)
        .returns(accountsContract);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(localChain)
        .returns(await owner.getAddress());
      registrar.getGasByToken.whenCalledWith(token.address).returns(GAS_COST);
      registrar.thisChain.returns(localChain);
      token.transfer.returns(true);
      token.transferFrom.returns(true);
      token.approve.returns(true);
      token.approveFor.returns(true);
      token.symbol.returns("TKN");
    });

    describe("and the refund call is successful back through axelar", function () {
      it("when an action other than deposit is called", async function () {
        let actionData = getDefaultActionData();
        actionData.token = token.address;
        actionData.selector = liquidVault.interface.getSighash("redeem");
        let packedData = await packActionData(actionData, hre);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            "TKN",
            333
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Only deposit accepts tokens");
        expect(token.approve).to.have.been.calledWith(gateway.address, TOTAL_AMT - GAS_COST);
        expect(token.approve).to.have.been.calledWith(gasService.address, GAS_COST);
      });

      it("when the payload amt doesn't match the GMP amt", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        let packedData = await packActionData(actionData, hre);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            "TKN",
            TOTAL_AMT - 1
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Amount mismatch");
        TOTAL_AMT;
      });

      it("when the vault values are both zero", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        actionData.liqAmt = 0;
        actionData.lockAmt = 0;
        let packedData = await packActionData(actionData, hre);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            "TKN",
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
        registrar.isTokenAccepted.whenCalledWith(token.address).returns(false);
        let packedData = await packActionData(actionData, hre);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            "TKN",
            TOTAL_AMT
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Token not accepted");
        expect(token.approve).to.have.been.calledWith(gateway.address, TOTAL_AMT - GAS_COST);
        expect(token.approve).to.have.been.calledWith(gasService.address, GAS_COST);
      });

      it("when the strategy is not approved", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        let packedData = await packActionData(actionData, hre);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            "TKN",
            TOTAL_AMT
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Strategy not approved");
        expect(token.approve).to.have.been.calledWith(gateway.address, TOTAL_AMT - GAS_COST);
        expect(token.approve).to.have.been.calledWith(gasService.address, GAS_COST);
      });

      it("when the strategy is not approved for execute", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        actionData.selector = liquidVault.interface.getSighash("redeem");
        let packedData = await packActionData(actionData, hre);
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
      const LOCK_AMT = 111;
      const LIQ_AMT = 222;
      const GAS_COST = 5;
      const TOTAL_AMT = LOCK_AMT + LIQ_AMT;

      const getDefaultActionData = () => ({
        ...DEFAULT_ACTION_DATA,
        accountId: 1,
        lockAmt: LOCK_AMT,
        liqAmt: LIQ_AMT,
      });

      beforeEach(async function () {
        const networkParams = {
          ...DEFAULT_NETWORK_INFO,
          axelarGateway: gateway.address,
          gasReceiver: gasService.address,
          refundAddr: await collector.getAddress(),
        };

        gateway.validateContractCall.returns(true);
        gateway.validateContractCallAndMint.returns(true);
        gateway.tokenAddresses.returns(token.address);
        registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);
        registrar.queryNetworkConnection.returns(networkParams);
        registrar.getAccountsContractAddressByChain
          .whenCalledWith(originatingChain)
          .returns(accountsContract);
        registrar.getAccountsContractAddressByChain
          .whenCalledWith(localChain)
          .returns(await owner.getAddress());
        registrar.getGasByToken.whenCalledWith(token.address).returns(GAS_COST);
        registrar.thisChain.returns(localChain);
        token.transfer.returns(true);
        token.transferFrom.returns(true);
        token.approve.returns(false);
        token.approveFor.returns(false);
        token.symbol.returns("TKN");
      });

      it("when an action other than deposit is called", async function () {
        let actionData = getDefaultActionData();
        actionData.token = token.address;
        actionData.selector = liquidVault.interface.getSighash("redeem");
        let packedData = await packActionData(actionData, hre);
        await expect(
          await router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            await token.symbol(),
            TOTAL_AMT
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Only deposit accepts tokens");
        expect(token.transfer).to.have.been.calledWith(await collector.getAddress(), TOTAL_AMT);
      });

      it("when the payload amt doesn't match the GMP amt", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        let packedData = await packActionData(actionData, hre);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            await token.symbol(),
            TOTAL_AMT - 1
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Amount mismatch");
        expect(token.transfer).to.have.been.calledWith(await collector.getAddress(), TOTAL_AMT - 1);
      });

      it("when the vault values are both zero", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        actionData.liqAmt = 0;
        actionData.lockAmt = 0;
        let packedData = await packActionData(actionData, hre);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            await await token.symbol(),
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
        registrar.isTokenAccepted.whenCalledWith(token.address).returns(false);
        let packedData = await packActionData(actionData, hre);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            await token.symbol(),
            TOTAL_AMT
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Token not accepted");
        expect(token.transfer).to.have.been.calledWith(await collector.getAddress(), TOTAL_AMT);
      });

      it("when the strategy is not approved", async function () {
        let actionData = getDefaultActionData();
        actionData.selector = liquidVault.interface.getSighash("deposit");
        actionData.token = token.address;
        let packedData = await packActionData(actionData, hre);
        await expect(
          router.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            originatingChain,
            accountsContract,
            packedData,
            await token.symbol(),
            TOTAL_AMT
          )
        )
          .to.emit(router, "ErrorLogged")
          .withArgs(Array<any>, "Strategy not approved");
        expect(token.transfer).to.have.been.calledWith(await collector.getAddress(), TOTAL_AMT);
      });

      it("when the strategy is not approved for execute", async function () {
        let actionData = getDefaultActionData();
        actionData.token = token.address;
        actionData.selector = liquidVault.interface.getSighash("redeem");
        let packedData = await packActionData(actionData, hre);
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
    const LOCK_AMT = 111;
    const LIQ_AMT = 222;
    const GAS_COST = 5;
    const TOTAL_AMT = LOCK_AMT + LIQ_AMT;

    const getDefaultActionData = () => ({
      ...DEFAULT_ACTION_DATA,
      accountId: 1,
      lockAmt: LOCK_AMT,
      liqAmt: LIQ_AMT,
    });

    beforeEach(async function () {
      const networkParams = {
        ...DEFAULT_NETWORK_INFO,
        axelarGateway: gateway.address,
        gasReceiver: gasService.address,
        refundAddr: await collector.getAddress(),
      };

      const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
        approvalState: StrategyApprovalState.APPROVED,
        network: localChain,
        lockedVaultAddr: lockedVault.address,
        liquidVaultAddr: liquidVault.address,
      };

      gateway.validateContractCall.returns(true);
      gateway.validateContractCallAndMint.returns(true);
      gateway.tokenAddresses.returns(token.address);
      registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);
      registrar.queryNetworkConnection.returns(networkParams);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(originatingChain)
        .returns(accountsContract);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(localChain)
        .returns(await owner.getAddress());
      registrar.getGasByToken.whenCalledWith(token.address).returns(GAS_COST);
      registrar.getStrategyApprovalState.returns(StrategyApprovalState.APPROVED);
      registrar.getStrategyParamsById.returns(stratParams);
      registrar.thisChain.returns(localChain);
      token.transfer.returns(true);
      token.transferFrom.returns(true);
      token.approve.returns(true);
      token.approveFor.returns(true);
      token.symbol.returns("TKN");
    });

    it("correctly calls depost", async function () {
      let actionData = getDefaultActionData();
      actionData.selector = liquidVault.interface.getSighash("deposit");
      actionData.token = token.address;
      let packedData = packActionData(actionData, hre);
      expect(
        await router.executeWithToken(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData,
          "TKN",
          TOTAL_AMT
        )
      ).to.emit(router, "Deposit");
      expect(lockedVault.deposit).to.have.been.calledWith(1, token.address, LOCK_AMT);
      expect(liquidVault.deposit).to.have.been.calledWith(1, token.address, LIQ_AMT);
    });

    it("correctly calls redeem via execute", async function () {
      let actionData = getDefaultActionData();
      actionData.selector = liquidVault.interface.getSighash("redeem");
      actionData.token = token.address;
      let packedData = await packActionData(actionData, hre);
      lockedVault.redeem.returns({
        token: token.address,
        amount: LOCK_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      liquidVault.redeem.returns({
        token: token.address,
        amount: LIQ_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      expect(
        await router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      );
      expect(lockedVault.redeem).to.have.been.calledWith(1, LOCK_AMT);
      expect(liquidVault.redeem).to.have.been.calledWith(1, LIQ_AMT);
    });

    it("correctly calls redeemAll via execute", async function () {
      let actionData = getDefaultActionData();
      actionData.selector = liquidVault.interface.getSighash("redeemAll");
      actionData.token = token.address;
      let packedData = await packActionData(actionData, hre);
      lockedVault.redeemAll.returns({
        token: token.address,
        amount: LOCK_AMT,
        status: VaultActionStatus.POSITION_EXITED,
      });
      liquidVault.redeemAll.returns({
        token: token.address,
        amount: LIQ_AMT,
        status: VaultActionStatus.POSITION_EXITED,
      });
      expect(
        await router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      );
      expect(lockedVault.redeemAll).to.have.been.called;
      expect(liquidVault.redeemAll).to.have.been.called;
    });
  });

  describe("Deposit", function () {
    const LOCK_AMT = 111;
    const LIQ_AMT = 222;
    const GAS_COST = 5;
    const TOTAL_AMT = LOCK_AMT + LIQ_AMT;

    const getDefaultActionData = () => ({
      ...DEFAULT_ACTION_DATA,
      accountId: 1,
      lockAmt: LOCK_AMT,
      liqAmt: LIQ_AMT,
    });

    beforeEach(async function () {
      const networkParams = {
        ...DEFAULT_NETWORK_INFO,
        axelarGateway: gateway.address,
        gasReceiver: gasService.address,
        refundAddr: await collector.getAddress(),
      };

      const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
        approvalState: StrategyApprovalState.APPROVED,
        network: localChain,
        lockedVaultAddr: lockedVault.address,
        liquidVaultAddr: liquidVault.address,
      };

      gateway.validateContractCall.returns(true);
      gateway.validateContractCallAndMint.returns(true);
      gateway.tokenAddresses.returns(token.address);
      registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);
      registrar.queryNetworkConnection.returns(networkParams);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(originatingChain)
        .returns(accountsContract);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(localChain)
        .returns(await owner.getAddress());
      registrar.getStrategyApprovalState.returns(StrategyApprovalState.APPROVED);
      registrar.getStrategyParamsById.returns(stratParams);
      token.transfer.returns(true);
      token.transferFrom.returns(true);
      token.approve.returns(true);
      token.approveFor.returns(true);
      token.symbol.returns("TKN");
    });

    it("deposits the specified amounts to the specified vaults", async function () {
      let actionData = getDefaultActionData();
      actionData.token = token.address;
      actionData.selector = liquidVault.interface.getSighash("deposit");
      let packedData = packActionData(actionData, hre);
      await router.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        originatingChain,
        accountsContract,
        packedData,
        await token.symbol(),
        TOTAL_AMT
      );
      expect(lockedVault.deposit).to.have.been.calledWith(1, token.address, LOCK_AMT);
      expect(token.transfer).to.have.been.calledWith(lockedVault.address, LOCK_AMT);
    });
  });

  describe("Redeem", function () {
    const LOCK_AMT = 111;
    const LIQ_AMT = 222;
    const GAS_COST = 5;
    const TOTAL_AMT = LOCK_AMT + LIQ_AMT;
    const getDefaultActionData = () => ({
      ...DEFAULT_ACTION_DATA,
      accountId: 1,
      lockAmt: LOCK_AMT,
      liqAmt: LIQ_AMT,
    });

    beforeEach(async function () {
      const networkParams = {
        ...DEFAULT_NETWORK_INFO,
        axelarGateway: gateway.address,
        gasReceiver: gasService.address,
        refundAddr: await collector.getAddress(),
      };

      const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
        approvalState: StrategyApprovalState.APPROVED,
        network: localChain,
        lockedVaultAddr: lockedVault.address,
        liquidVaultAddr: liquidVault.address,
      };

      gateway.validateContractCall.returns(true);
      gateway.validateContractCallAndMint.returns(true);
      gateway.tokenAddresses.returns(token.address);
      registrar.queryNetworkConnection.returns(networkParams);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(originatingChain)
        .returns(accountsContract);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(localChain)
        .returns(await owner.getAddress());
      registrar.getGasByToken.whenCalledWith(token.address).returns(GAS_COST);
      registrar.getStrategyApprovalState.returns(StrategyApprovalState.APPROVED);
      registrar.getStrategyParamsById.returns(stratParams);
      registrar.getFeeSettingsByFeeType.returns({
        payoutAddress: await collector.getAddress(),
        bps: 1,
      });
      registrar.thisChain.returns(localChain);
      token.transfer.returns(true);
      token.transferFrom.returns(true);
      token.approve.returns(true);
      token.approveFor.returns(true);
      token.symbol.returns("TKN");
    });

    it("Redeems the amounts specified back to the router", async function () {
      let actionData = getDefaultActionData();
      actionData.selector = liquidVault.interface.getSighash("redeem");
      actionData.token = token.address;
      let packedData = packActionData(actionData, hre);
      lockedVault.redeem.returns({
        token: token.address,
        amount: LOCK_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      liquidVault.redeem.returns({
        token: token.address,
        amount: LIQ_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      expect(
        await router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      ).to.emit(router, "Redeem");
      expect(lockedVault.redeem).to.have.been.calledWith(1, LOCK_AMT);
      expect(liquidVault.redeem).to.have.been.calledWith(1, LIQ_AMT);
      expect(token.approve).to.have.been.calledWith(gateway.address, TOTAL_AMT - GAS_COST);
      expect(token.approve).to.have.been.calledWith(gasService.address, GAS_COST);
      let expectedPayload = packActionData(
        {
          destinationChain: originatingChain,
          strategyId: DEFAULT_STRATEGY_ID,
          selector: liquidVault.interface.getSighash("redeem"),
          accountId: 1,
          token: token.address,
          lockAmt: LOCK_AMT - 2, // less weighted gas
          liqAmt: LIQ_AMT - 3, // less weighted gas
          status: VaultActionStatus.SUCCESS,
        },
        hre
      );
      expect(gasService.payGasForContractCallWithToken).to.have.been.calledWith(
        router.address,
        originatingChain,
        deadAddr,
        expectedPayload,
        "TKN",
        TOTAL_AMT - GAS_COST,
        token.address,
        GAS_COST,
        await collector.getAddress()
      );
      expect(gateway.callContractWithToken).to.have.been.calledWith(
        originatingChain,
        deadAddr,
        expectedPayload,
        "TKN",
        TOTAL_AMT - GAS_COST
      );
    });

    it("Reverts if the redemption amount is less than the gas fee", async function () {
      let actionData = getDefaultActionData();
      actionData.selector = liquidVault.interface.getSighash("redeem");
      actionData.token = token.address;
      let packedData = packActionData(actionData, hre);
      lockedVault.redeem.returns({
        token: token.address,
        amount: LOCK_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      liquidVault.redeem.returns({
        token: token.address,
        amount: LIQ_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      registrar.getGasByToken.whenCalledWith(token.address).returns(TOTAL_AMT + 1);
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

  describe("RedeemAll", function () {
    const LOCK_AMT = 111;
    const LIQ_AMT = 222;
    const GAS_COST = 5;
    const TOTAL_AMT = LOCK_AMT + LIQ_AMT;

    const getDefaultActionData = () => ({
      ...DEFAULT_ACTION_DATA,
      accountId: 1,
      lockAmt: LOCK_AMT,
      liqAmt: LIQ_AMT,
    });

    beforeEach(async function () {
      const networkParams = {
        ...DEFAULT_NETWORK_INFO,
        axelarGateway: gateway.address,
        gasReceiver: gasService.address,
        refundAddr: await collector.getAddress(),
      };

      const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
        approvalState: StrategyApprovalState.APPROVED,
        network: localChain,
        lockedVaultAddr: lockedVault.address,
        liquidVaultAddr: liquidVault.address,
      };

      gateway.validateContractCall.returns(true);
      gateway.validateContractCallAndMint.returns(true);
      gateway.tokenAddresses.returns(token.address);
      registrar.queryNetworkConnection.returns(networkParams);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(originatingChain)
        .returns(accountsContract);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(localChain)
        .returns(await owner.getAddress());
      registrar.getGasByToken.whenCalledWith(token.address).returns(GAS_COST);
      registrar.getStrategyApprovalState.returns(StrategyApprovalState.APPROVED);
      registrar.getStrategyParamsById.returns(stratParams);
      registrar.getFeeSettingsByFeeType.returns({
        payoutAddress: await collector.getAddress(),
        bps: 1,
      });
      registrar.thisChain.returns(localChain);
      token.transfer.returns(true);
      token.transferFrom.returns(true);
      token.approve.returns(true);
      token.approveFor.returns(true);
      token.symbol.returns("TKN");
    });

    it("Redeems the amounts specified back to the router", async function () {
      let actionData = getDefaultActionData();
      actionData.token = token.address;
      actionData.selector = liquidVault.interface.getSighash("redeemAll");
      let packedData = packActionData(actionData, hre);
      lockedVault.redeemAll.returns({
        token: token.address,
        amount: LOCK_AMT,
        status: VaultActionStatus.POSITION_EXITED,
      });
      liquidVault.redeemAll.returns({
        token: token.address,
        amount: LIQ_AMT,
        status: VaultActionStatus.POSITION_EXITED,
      });
      await expect(
        await router.execute(
          ethers.utils.formatBytes32String("true"),
          originatingChain,
          accountsContract,
          packedData
        )
      ).to.emit(router, "Redeem");
      expect(lockedVault.redeemAll).to.have.been.calledWith(1);
      expect(liquidVault.redeemAll).to.have.been.calledWith(1);
      expect(token.approve).to.have.been.calledWith(gateway.address, TOTAL_AMT - GAS_COST);
      expect(token.approve).to.have.been.calledWith(gasService.address, GAS_COST);
      let expectedPayload = packActionData(
        {
          destinationChain: originatingChain,
          strategyId: DEFAULT_STRATEGY_ID,
          selector: liquidVault.interface.getSighash("redeemAll"),
          accountId: 1,
          token: token.address,
          lockAmt: LOCK_AMT - 2, // less weighted gas
          liqAmt: LIQ_AMT - 3, // less weighted gas
          status: VaultActionStatus.POSITION_EXITED,
        },
        hre
      );
      expect(gasService.payGasForContractCallWithToken).to.have.been.calledWith(
        router.address,
        originatingChain,
        deadAddr,
        expectedPayload,
        "TKN",
        TOTAL_AMT - GAS_COST,
        token.address,
        GAS_COST,
        await collector.getAddress()
      );
      expect(gateway.callContractWithToken).to.have.been.calledWith(
        originatingChain,
        deadAddr,
        expectedPayload,
        "TKN",
        TOTAL_AMT - GAS_COST
      );
    });

    it("Reverts if the redemption amount is less than the gas fee", async function () {
      registrar.getGasByToken.whenCalledWith(token.address).returns(TOTAL_AMT + 1);
      let actionData = getDefaultActionData();
      actionData.token = token.address;
      actionData.selector = liquidVault.interface.getSighash("redeemAll");
      let packedData = packActionData(actionData, hre);
      lockedVault.redeemAll.returns({
        token: token.address,
        amount: LOCK_AMT,
        status: VaultActionStatus.POSITION_EXITED,
      });
      liquidVault.redeemAll.returns({
        token: token.address,
        amount: LIQ_AMT,
        status: VaultActionStatus.POSITION_EXITED,
      });
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

  describe("Harvest cross-chain", function () {
    const LOCK_AMT = 111;
    const LIQ_AMT = 222;
    const TOTAL_AMT = LOCK_AMT + LIQ_AMT;

    const getDefaultHarvestRequest = () => ({
      ...DEFAULT_HARVEST_REQUEST,
      accountIds: [1],
    });

    beforeEach(async function () {
      const networkParams = {
        ...DEFAULT_NETWORK_INFO,
        axelarGateway: gateway.address,
        refundAddr: await collector.getAddress(),
      };

      const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
        approvalState: StrategyApprovalState.APPROVED,
        network: localChain,
        lockedVaultAddr: lockedVault.address,
        liquidVaultAddr: liquidVault.address,
      };

      gateway.validateContractCall.returns(true);
      gateway.validateContractCallAndMint.returns(true);
      gateway.tokenAddresses.returns(token.address);
      registrar.queryNetworkConnection.returns(networkParams);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(originatingChain)
        .returns(accountsContract);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(localChain)
        .returns(await owner.getAddress());
      registrar.getStrategyApprovalState.returns(StrategyApprovalState.APPROVED);
      registrar.getStrategyParamsById.returns(stratParams);
      registrar.getVaultOperatorApproved.whenCalledWith(await owner.getAddress()).returns(true);
      registrar.getFeeSettingsByFeeType.returns({
        payoutAddress: await collector.getAddress(),
        bps: 1,
      });
      registrar.thisChain.returns(localChain);
      token.transfer.returns(true);
      token.transferFrom.returns(true);
      token.approve.returns(true);
      token.approveFor.returns(true);
      token.symbol.returns("TKN");
    });

    it("Harvests the targeted accounts and forwards tokens cross-chain", async function () {
      let requestData = getDefaultHarvestRequest();
      lockedVault.harvest.returns({
        token: token.address,
        amount: LOCK_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      liquidVault.harvest.returns({
        token: token.address,
        amount: LIQ_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      expect(await router.harvest(requestData)).to.not.be.reverted;
      expect(lockedVault.harvest).to.have.been.calledWith(requestData.accountIds);
      expect(liquidVault.harvest).to.have.been.calledWith(requestData.accountIds);
      expect(token.transfer).to.have.been.calledWith(router.address, LOCK_AMT);
      expect(token.transfer).to.have.been.calledWith(router.address, LIQ_AMT);
      expect(token.approve).to.have.been.calledWith(gateway.address, TOTAL_AMT);
    });
  });

  describe("Harvest locally", function () {
    const LOCK_AMT = 111;
    const LIQ_AMT = 222;
    const TOTAL_AMT = LOCK_AMT + LIQ_AMT;

    const getDefaultHarvestRequest = () => ({
      ...DEFAULT_HARVEST_REQUEST,
      accountIds: [1],
    });

    beforeEach(async function () {
      const networkParams = {
        ...DEFAULT_NETWORK_INFO,
      };

      const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
        approvalState: StrategyApprovalState.APPROVED,
        network: originatingChain,
        lockedVaultAddr: lockedVault.address,
        liquidVaultAddr: liquidVault.address,
      };

      registrar.queryNetworkConnection.returns(networkParams);
      registrar.getAccountsContractAddressByChain
        .whenCalledWith(originatingChain)
        .returns(await owner.getAddress());
      registrar.getStrategyApprovalState.returns(StrategyApprovalState.APPROVED);
      registrar.getStrategyParamsById.returns(stratParams);
      registrar.getVaultOperatorApproved.whenCalledWith(await owner.getAddress()).returns(true);
      registrar.getFeeSettingsByFeeType.returns({
        payoutAddress: await collector.getAddress(),
        bps: 1,
      });
      registrar.thisChain.returns(originatingChain);
      token.transfer.returns(true);
      token.transferFrom.returns(true);
      token.approve.returns(true);
      token.approveFor.returns(true);
      token.symbol.returns("TKN");
    });

    it("Reverts if the caller is not a valid operator", async function () {
      let requestData = getDefaultHarvestRequest();
      lockedVault.harvest.returns({
        token: token.address,
        amount: LOCK_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      liquidVault.harvest.returns({
        token: token.address,
        amount: LIQ_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      await expect(router.connect(user).harvest(requestData)).to.be.revertedWith("Operator only");
    });

    it("Harvests the targeted account and forwards tokens to the local collector", async function () {
      let requestData = getDefaultHarvestRequest();
      lockedVault.harvest.returns({
        token: token.address,
        amount: LOCK_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      liquidVault.harvest.returns({
        token: token.address,
        amount: LIQ_AMT,
        status: VaultActionStatus.SUCCESS,
      });
      expect(await router.harvest(requestData)).to.not.be.reverted;
      expect(lockedVault.harvest).to.have.been.calledWith(requestData.accountIds);
      expect(liquidVault.harvest).to.have.been.calledWith(requestData.accountIds);
      expect(token.transfer).to.have.been.calledWith(router.address, LOCK_AMT);
      expect(token.transfer).to.have.been.calledWith(router.address, LIQ_AMT);
      expect(token.transfer).to.have.been.calledWith(await collector.getAddress(), TOTAL_AMT);
    });
  });
});
