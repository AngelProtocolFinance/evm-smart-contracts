import {FakeContract, MockContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {deployDummyGasService} from "tasks/helpers";
import {
  DEFAULT_ACCOUNTS_CONFIG,
  DEFAULT_AP_PARAMS,
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_INVEST_REQUEST,
  DEFAULT_METHOD_SELECTOR,
  DEFAULT_NETWORK_INFO,
  DEFAULT_PERMISSIONS_STRUCT,
  DEFAULT_REDEEM_ALL_REQUEST,
  DEFAULT_REDEEM_REQUEST,
  DEFAULT_SETTINGS_STRUCT,
  DEFAULT_STRATEGY_PARAMS,
  DEFAULT_STRATEGY_SELECTOR,
  convertVaultActionStructToArray,
  deployDummyERC20,
  deployDummyGateway,
  packActionData,
  wait,
} from "test/utils";
import {
  AccountsStrategy,
  AccountsStrategy__factory,
  DummyERC20,
  DummyGasService,
  DummyGateway,
  GasFwd,
  GasFwd__factory,
  IAxelarGateway,
  IAxelarGateway__factory,
  IERC20,
  IERC20__factory,
  IVault,
  IVault__factory,
  Registrar,
  Registrar__factory,
  Router,
  Router__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {IAccountsStrategy} from "typechain-types/contracts/core/registrar/Registrar";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {StrategyApprovalState, VaultActionStatus, getChainId, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";

use(smock.matchers);

describe("AccountsStrategy", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;
  let registrar: FakeContract<Registrar>;
  let router: FakeContract<Router>;
  let vault: FakeContract<IVault>;
  let facetImpl: AccountsStrategy;

  before(async function () {
    const {deployer, proxyAdmin, apTeam1} = await getSigners(hre);
    owner = deployer;
    admin = proxyAdmin;
    user = apTeam1;
    vault = await smock.fake<IVault>(IVault__factory.createInterface());
    registrar = await smock.fake<Registrar>(new Registrar__factory());
    router = await smock.fake<Router>(new Router__factory());
    let Facet = new AccountsStrategy__factory(owner);
    facetImpl = await Facet.deploy();
  });

  describe("upon strategyInvest", async function () {
    let facet: AccountsStrategy;
    let state: TestFacetProxyContract;
    let token: FakeContract<IERC20>;
    let gateway: FakeContract<IAxelarGateway>;
    let network: IAccountsStrategy.NetworkInfoStruct;
    const ACCOUNT_ID = 1;

    before(async function () {
      token = await smock.fake<IERC20>(IERC20__factory.createInterface());
      gateway = await smock.fake<IAxelarGateway>(IAxelarGateway__factory.createInterface());

      network = {
        ...DEFAULT_NETWORK_INFO,
        chainId: await getChainId(hre),
        axelarGateway: gateway.address,
      };
      registrar.queryNetworkConnection.returns(network);
      gateway.tokenAddresses.returns(token.address);
    });

    beforeEach(async function () {
      state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
      facet = AccountsStrategy__factory.connect(state.address, owner);
    });

    describe("reverts when", async function () {
      it("the caller is not approved for locked fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        let investRequest = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: 1,
        };
        await expect(
          facet.connect(user).strategyInvest(ACCOUNT_ID, investRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the caller is not approved for liquid fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        let investRequest = {
          ...DEFAULT_INVEST_REQUEST,
          liquidAmt: 1,
        };
        await expect(
          facet.connect(user).strategyInvest(ACCOUNT_ID, investRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the strategy is not approved", async function () {
        await wait(state.setEndowmentDetails(1, DEFAULT_CHARITY_ENDOWMENT));
        let config = {
          ...DEFAULT_ACCOUNTS_CONFIG,
          registrarContract: registrar.address,
        };
        await wait(state.setConfig(config));
        await expect(facet.strategyInvest(ACCOUNT_ID, DEFAULT_INVEST_REQUEST)).to.be.revertedWith(
          "Strategy is not approved"
        );
      });

      it("the account locked balance is insufficient", async function () {
        let endowDetails = DEFAULT_CHARITY_ENDOWMENT;
        endowDetails.settingsController.lockedInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        let config = {
          ...DEFAULT_ACCOUNTS_CONFIG,
          registrarContract: registrar.address,
        };
        await wait(state.setConfig(config));

        let stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);

        let investRequest = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: 1,
        };
        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest)).to.be.revertedWith(
          "Insufficient Balance"
        );
      });

      it("the account liquid balance is insufficient", async function () {
        let endowDetails = DEFAULT_CHARITY_ENDOWMENT;
        endowDetails.settingsController.liquidInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        let config = {
          ...DEFAULT_ACCOUNTS_CONFIG,
          registrarContract: registrar.address,
        };
        await wait(state.setConfig(config));

        let stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);

        let investRequest = {
          ...DEFAULT_INVEST_REQUEST,
          liquidAmt: 1,
        };
        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest)).to.be.revertedWith(
          "Insufficient Balance"
        );
      });

      it("the token isn't accepted", async function () {
        let config = {
          ...DEFAULT_ACCOUNTS_CONFIG,
          registrarContract: registrar.address,
        };
        await wait(state.setConfig(config));

        let stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);

        await expect(facet.strategyInvest(ACCOUNT_ID, DEFAULT_INVEST_REQUEST)).to.be.revertedWith(
          "Token not approved"
        );
      });
    });

    describe("and calls the local router", async function () {
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;

      before(async function () {
        const network = {
          ...DEFAULT_NETWORK_INFO,
          chainId: await getChainId(hre),
          router: router.address,
          axelarGateway: gateway.address,
        };
        registrar.queryNetworkConnection.returns(network);
        registrar.isTokenAccepted.returns(true);
        let stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: "ThisNet",
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      beforeEach(async function () {
        let endowDetails = DEFAULT_CHARITY_ENDOWMENT;
        endowDetails.settingsController.liquidInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        endowDetails.settingsController.lockedInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        token.transfer.whenCalledWith(router.address, LIQ_AMT + LOCK_AMT).returns(true);
        await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, token.address, 500, 500));

        const config = {
          ...DEFAULT_ACCOUNTS_CONFIG,
          networkName: "ThisNet",
          gateway: gateway.address,
          registrarContract: registrar.address,
        };
        await wait(state.setConfig(config));
      });

      it("and the response is SUCCESS", async function () {
        router.executeWithTokenLocal.returns({
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.SUCCESS,
        });

        let investRequest = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: LOCK_AMT,
          liquidAmt: LIQ_AMT,
        };

        expect(await facet.strategyInvest(ACCOUNT_ID, investRequest))
          .to.emit(facet, "EndowmentInvested")
          .withArgs(VaultActionStatus.SUCCESS);

        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(500 - LOCK_AMT);
        expect(liqBal).to.equal(500 - LIQ_AMT);
        let strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(strategyActive).to.be.true;
      });

      it("and the response is anything other than SUCCESS", async function () {
        router.executeWithTokenLocal.returns({
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
        });

        let investRequest = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: LOCK_AMT,
          liquidAmt: LIQ_AMT,
        };
        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest))
          .to.be.revertedWithCustomError(facet, "InvestFailed")
          .withArgs(VaultActionStatus.FAIL_TOKENS_FALLBACK);

        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(500);
        expect(liqBal).to.equal(500);
        let strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(!strategyActive);
      });
    });

    describe("and calls axelar GMP", async function () {
      let gasReceiver: DummyGasService;
      let gasFwd: MockContract<GasFwd>;
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const INITIAL_LOCK_BAL = 500;
      const INITIAL_LIQ_BAL = 500;
      const GAS_FEE = 100;

      before(async function () {
        gasReceiver = await deployDummyGasService(owner);
        const gasFwdFactory = await smock.mock<GasFwd__factory>("GasFwd");
        gasFwd = await gasFwdFactory.deploy();

        const thisNet = {
          ...DEFAULT_NETWORK_INFO,
          chainId: await getChainId(hre),
          axelarGateway: gateway.address,
          gasReceiver: gasReceiver.address,
        };
        const thatNet = {
          ...DEFAULT_NETWORK_INFO,
          chainId: 42,
          router: router.address,
        };
        registrar.queryNetworkConnection.whenCalledWith("ThisNet").returns(thisNet);
        registrar.queryNetworkConnection.whenCalledWith("ThatNet").returns(thatNet);

        registrar.isTokenAccepted.returns(true);
        const stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: "ThatNet",
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      beforeEach(async function () {
        const config = {
          ...DEFAULT_ACCOUNTS_CONFIG,
          registrarContract: registrar.address,
          networkName: "ThisNet",
          gateway: gateway.address,
        };
        await wait(state.setConfig(config));

        let endowDetails = DEFAULT_CHARITY_ENDOWMENT;
        endowDetails.settingsController.liquidInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        endowDetails.settingsController.lockedInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        endowDetails.gasFwd = gasFwd.address;
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        token.approve.returns(true);
        token.transfer.returns(true);
        await wait(
          state.setEndowmentTokenBalance(
            ACCOUNT_ID,
            token.address,
            INITIAL_LOCK_BAL,
            INITIAL_LIQ_BAL
          )
        );
        await gasFwd.setVariable("accounts", facet.address);
      });

      it("makes all the correct external calls", async function () {
        let investRequest = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: LOCK_AMT,
          liquidAmt: LIQ_AMT,
          gasFee: GAS_FEE,
        };

        let payload = packActionData(
          {
            destinationChain: "ThatNet",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("deposit"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.UNPROCESSED,
          },
          hre
        );

        expect(await facet.strategyInvest(ACCOUNT_ID, investRequest))
          .to.emit(gasReceiver, "GasPaidWithToken")
          .withArgs(
            facet.address,
            "ThatNet",
            router.address,
            payload,
            "TKN",
            LOCK_AMT + LIQ_AMT,
            token.address,
            GAS_FEE,
            gasFwd.address
          )
          .to.emit(gateway, "ContractCallWtihToken")
          .withArgs("ThatNet", router.address, payload);

        let gasReceiverApproved = await token.allowance(facet.address, gasReceiver.address);
        expect(gasReceiverApproved).to.equal(GAS_FEE);
        let gatewayApproved = await token.allowance(facet.address, gateway.address);
        expect(gatewayApproved).to.equal(LOCK_AMT + LIQ_AMT);
        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(INITIAL_LOCK_BAL - LOCK_AMT);
        expect(liqBal).to.equal(INITIAL_LIQ_BAL - LIQ_AMT);
        expect(await state.getActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR))
          .to.be.true;
      });
    });
  });

  describe("upon strategyRedeem", async function () {
    let facet: AccountsStrategy;
    let state: TestFacetProxyContract;
    let token: DummyERC20;
    let gateway: DummyGateway;
    let network: IAccountsStrategy.NetworkInfoStruct;
    const ACCOUNT_ID = 1;

    before(async function () {
      token = await deployDummyERC20(owner);
      gateway = await deployDummyGateway(owner);
      await wait(gateway.setTestTokenAddress(token.address));

      network = {
        ...DEFAULT_NETWORK_INFO,
        chainId: await getChainId(hre),
        axelarGateway: gateway.address,
      };
      registrar.queryNetworkConnection.returns(network);
    });

    beforeEach(async function () {
      state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
      facet = AccountsStrategy__factory.connect(state.address, owner);
    });

    describe("reverts when", async function () {
      it("the caller is not approved for locked fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        let redeemRequest = {
          ...DEFAULT_REDEEM_REQUEST,
          lockAmt: 1,
        };
        await expect(
          facet.connect(user).strategyRedeem(ACCOUNT_ID, redeemRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the caller is not approved for liquid fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        let redeemRequest = {
          ...DEFAULT_REDEEM_REQUEST,
          liquidAmt: 1,
        };
        await expect(
          facet.connect(user).strategyRedeem(ACCOUNT_ID, redeemRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the strategy is not approved", async function () {
        let stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: "ThisNet",
          approvalState: StrategyApprovalState.NOT_APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
        let endowDetails = DEFAULT_CHARITY_ENDOWMENT;
        endowDetails.owner = owner.address;
        await wait(state.setEndowmentDetails(1, endowDetails));
        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await wait(state.setConfig(config));
        await expect(facet.strategyRedeem(ACCOUNT_ID, DEFAULT_REDEEM_REQUEST)).to.be.revertedWith(
          "Strategy is not approved"
        );
      });
    });

    describe("and calls the local router", async function () {
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const redeemRequest = {
        ...DEFAULT_REDEEM_REQUEST,
        lockAmt: LOCK_AMT,
        liquidAmt: LIQ_AMT,
      };

      before(async function () {
        const network = {
          ...DEFAULT_NETWORK_INFO,
          chainId: await getChainId(hre),
          router: router.address,
          axelarGateway: gateway.address,
        };
        registrar.queryNetworkConnection.whenCalledWith("ThisNet").returns(network);

        registrar.isTokenAccepted.returns(true);

        let stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: "ThisNet",
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      beforeEach(async function () {
        let endowDetails = DEFAULT_CHARITY_ENDOWMENT;
        endowDetails.settingsController.liquidInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        endowDetails.settingsController.lockedInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        token.mint(facet.address, LOCK_AMT + LIQ_AMT);
        await wait(
          state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true)
        );

        const config = {
          ...DEFAULT_ACCOUNTS_CONFIG,
          networkName: "ThisNet",
          gateway: gateway.address,
          registrarContract: registrar.address,
        };
        await wait(state.setConfig(config));
      });

      it("and the response is SUCCESS", async function () {
        router.executeLocal.returns({
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.SUCCESS,
        });

        expect(await facet.strategyRedeem(ACCOUNT_ID, redeemRequest))
          .to.emit(facet, "EndowmentRedeemed")
          .withArgs(VaultActionStatus.SUCCESS);

        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(LOCK_AMT);
        expect(liqBal).to.equal(LIQ_AMT);
        let strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(strategyActive).to.be.true;
      });

      it("and the response is POSITION_EXITED", async function () {
        router.executeLocal.returns({
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.POSITION_EXITED,
        });

        expect(await facet.strategyRedeem(ACCOUNT_ID, redeemRequest))
          .to.emit(facet, "EndowmentRedeemed")
          .withArgs(VaultActionStatus.POSITION_EXITED);

        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(LOCK_AMT);
        expect(liqBal).to.equal(LIQ_AMT);
        let strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(strategyActive).to.be.false;
      });

      it("and the response is anything else", async function () {
        router.executeLocal.returns({
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
        });
        await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest))
          .to.be.revertedWithCustomError(facet, "RedeemFailed")
          .withArgs(VaultActionStatus.FAIL_TOKENS_FALLBACK);

        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(0);
        expect(liqBal).to.equal(0);
        let strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(strategyActive);
      });
    });

    describe("and calls axelar GMP", async function () {
      let gasReceiver: DummyGasService;
      let gasFwd: MockContract<GasFwd>;
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const INITIAL_LOCK_BAL = 0;
      const INITIAL_LIQ_BAL = 0;
      const GAS_FEE = 100;

      before(async function () {
        gasReceiver = await deployDummyGasService(owner);
        const gasFwdFactory = await smock.mock<GasFwd__factory>("GasFwd");
        gasFwd = await gasFwdFactory.deploy();

        const thisNet = {
          ...DEFAULT_NETWORK_INFO,
          chainId: await getChainId(hre),
          axelarGateway: gateway.address,
          gasReceiver: gasReceiver.address,
        };
        const thatNet = {
          ...DEFAULT_NETWORK_INFO,
          chainId: 42,
          router: router.address,
        };
        registrar.queryNetworkConnection.whenCalledWith("ThisNet").returns(thisNet);
        registrar.queryNetworkConnection.whenCalledWith("ThatNet").returns(thatNet);

        registrar.isTokenAccepted.returns(true);
        const stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: "ThatNet",
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      beforeEach(async function () {
        const config = {
          ...DEFAULT_ACCOUNTS_CONFIG,
          registrarContract: registrar.address,
          networkName: "ThisNet",
        };
        await wait(state.setConfig(config));

        let endowDetails = DEFAULT_CHARITY_ENDOWMENT;
        endowDetails.settingsController.liquidInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        endowDetails.settingsController.lockedInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        endowDetails.gasFwd = gasFwd.address;
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        await token.mint(gasFwd.address, GAS_FEE);
        await gasFwd.setVariable("accounts", facet.address);
      });

      it("makes all the correct external calls", async function () {
        let redeemRequest = {
          ...DEFAULT_REDEEM_REQUEST,
          lockAmt: LOCK_AMT,
          liquidAmt: LIQ_AMT,
          gasFee: GAS_FEE,
        };

        let payload = packActionData(
          {
            destinationChain: "ThatNet",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("redeem"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.UNPROCESSED,
          },
          hre
        );

        expect(await facet.strategyRedeem(ACCOUNT_ID, redeemRequest))
          .to.emit(gasReceiver, "GasPaid")
          .withArgs(
            facet.address,
            "ThatNet",
            router.address,
            payload,
            token.address,
            GAS_FEE,
            gasFwd.address
          )
          .to.emit(gateway, "ContractCall")
          .withArgs("ThatNet", router.address, payload);

        let gasReceiverApproved = await token.allowance(facet.address, gasReceiver.address);
        expect(gasReceiverApproved).to.equal(GAS_FEE);
      });
    });
  });

  describe("upon strategyRedeemAll", async function () {
    let facet: AccountsStrategy;
    let state: TestFacetProxyContract;
    let token: DummyERC20;
    let gateway: DummyGateway;
    const ACCOUNT_ID = 1;

    before(async function () {
      token = await deployDummyERC20(owner);
      gateway = await deployDummyGateway(owner);
      await wait(gateway.setTestTokenAddress(token.address));

      const network = {
        ...DEFAULT_NETWORK_INFO,
        chainId: await getChainId(hre),
        axelarGateway: gateway.address,
      };
      registrar.queryNetworkConnection.returns(network);
      let stratParams = {
        ...DEFAULT_STRATEGY_PARAMS,
        network: "ThisNet",
        approvalState: StrategyApprovalState.NOT_APPROVED,
      };
      registrar.getStrategyParamsById.returns(stratParams);
    });

    beforeEach(async function () {
      state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
      facet = AccountsStrategy__factory.connect(state.address, owner);
    });

    describe("reverts when", async function () {
      it("the caller is not approved for locked nor liquid fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        await expect(
          facet.connect(user).strategyRedeemAll(ACCOUNT_ID, DEFAULT_REDEEM_ALL_REQUEST)
        ).to.be.revertedWith("Must redeem at least one of Locked/Liquid");
      });
      it("the caller is not approved for locked fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        let redeemAllRequest = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLocked: true,
        };
        await expect(
          facet.connect(user).strategyRedeemAll(ACCOUNT_ID, redeemAllRequest)
        ).to.be.revertedWith("Unauthorized");
      });
      it("the caller is not approved for liquid fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        let redeemAllRequest = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLiquid: true,
        };
        await expect(
          facet.connect(user).strategyRedeemAll(ACCOUNT_ID, redeemAllRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the strategy is not approved", async function () {
        let endowDetails: AccountStorage.EndowmentStruct = {
          ...DEFAULT_CHARITY_ENDOWMENT,
          owner: owner.address,
          settingsController: {
            ...DEFAULT_SETTINGS_STRUCT,
            lockedInvestmentManagement: {
              ...DEFAULT_PERMISSIONS_STRUCT,
              delegate: {
                expires: 0,
                addr: user.address,
              },
            },
            liquidInvestmentManagement: {
              ...DEFAULT_PERMISSIONS_STRUCT,
              delegate: {
                expires: 0,
                addr: user.address,
              },
            },
          },
        };
        await wait(state.setEndowmentDetails(1, endowDetails));
        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await wait(state.setConfig(config));
        let redeemAllRequest = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLiquid: true,
        };
        await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest)).to.be.revertedWith(
          "Strategy is not approved"
        );
      });

      describe("and calls the local router", async function () {
        const LOCK_AMT = 300;
        const LIQ_AMT = 200;
        let redeemAllRequest = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLocked: true,
          redeemLiquid: true,
        };

        before(async function () {
          const network = {
            ...DEFAULT_NETWORK_INFO,
            chainId: await getChainId(hre),
            axelarGateway: gateway.address,
            router: router.address,
          };
          registrar.queryNetworkConnection.whenCalledWith("ThisNet").returns(network);
          registrar.isTokenAccepted.returns(true);
          let stratParams = {
            ...DEFAULT_STRATEGY_PARAMS,
            network: "ThisNet",
            approvalState: StrategyApprovalState.APPROVED,
          };
          registrar.getStrategyParamsById.returns(stratParams);
        });

        beforeEach(async function () {
          const config = {
            ...DEFAULT_ACCOUNTS_CONFIG,
            networkName: "ThisNet",
            gateway: gateway.address,
            registrarContract: registrar.address,
          };
          await wait(state.setConfig(config));

          let endowDetails: AccountStorage.EndowmentStruct = {
            ...DEFAULT_CHARITY_ENDOWMENT,
            owner: owner.address,
            settingsController: {
              ...DEFAULT_SETTINGS_STRUCT,
              lockedInvestmentManagement: {
                ...DEFAULT_PERMISSIONS_STRUCT,
                delegate: {
                  expires: 0,
                  addr: user.address,
                },
              },
              liquidInvestmentManagement: {
                ...DEFAULT_PERMISSIONS_STRUCT,
                delegate: {
                  expires: 0,
                  addr: user.address,
                },
              },
            },
          };
          await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

          await token.mint(facet.address, LOCK_AMT + LIQ_AMT);
          await wait(
            state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true)
          );
        });

        it("and the response is POSITION_EXITED", async function () {
          router.executeLocal.returns({
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.POSITION_EXITED,
          });

          expect(await facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest))
            .to.emit(facet, "EndowmentRedeemed")
            .withArgs(VaultActionStatus.POSITION_EXITED);

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(LOCK_AMT);
          expect(liqBal).to.equal(LIQ_AMT);
          let strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive).to.be.false;
        });

        it("and the response is anything else", async function () {
          router.executeLocal.returns({
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
          });
          await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest))
            .to.be.revertedWithCustomError(facet, "RedeemAllFailed")
            .withArgs(VaultActionStatus.FAIL_TOKENS_FALLBACK);

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(0);
          expect(liqBal).to.equal(0);
          let strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive);
        });
      });
    });

    describe("and calls axelar GMP", async function () {
      let gasReceiver: DummyGasService;
      let gasFwd: MockContract<GasFwd>;
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const GAS_FEE = 100;

      before(async function () {
        gasReceiver = await deployDummyGasService(owner);
        const gasFwdFactory = await smock.mock<GasFwd__factory>("GasFwd");
        gasFwd = await gasFwdFactory.deploy();

        const thisNet = {
          ...DEFAULT_NETWORK_INFO,
          chainId: await getChainId(hre),
          axelarGateway: gateway.address,
          gasReceiver: gasReceiver.address,
        };
        const thatNet = {
          ...DEFAULT_NETWORK_INFO,
          chainId: 42,
          router: router.address,
        };
        registrar.queryNetworkConnection.whenCalledWith("ThisNet").returns(thisNet);
        registrar.queryNetworkConnection.whenCalledWith("ThatNet").returns(thatNet);

        registrar.isTokenAccepted.returns(true);
        const stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: "ThatNet",
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      beforeEach(async function () {
        const config = {
          ...DEFAULT_ACCOUNTS_CONFIG,
          registrarContract: registrar.address,
          networkName: "ThisNet",
        };
        await wait(state.setConfig(config));

        let endowDetails = DEFAULT_CHARITY_ENDOWMENT;
        endowDetails.settingsController.liquidInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        endowDetails.settingsController.lockedInvestmentManagement = {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        };
        endowDetails.gasFwd = gasFwd.address;
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        await token.mint(gasFwd.address, GAS_FEE);
        await gasFwd.setVariable("accounts", facet.address);
      });

      it("makes all the correct external calls", async function () {
        let redeemAllRequest = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLocked: true,
          redeemLiquid: true,
          gasFee: GAS_FEE,
        };

        let payload = packActionData(
          {
            destinationChain: "ThatNet",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("redeemAll"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: 1,
            liqAmt: 1,
            status: VaultActionStatus.UNPROCESSED,
          },
          hre
        );

        expect(await facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest))
          .to.emit(gasReceiver, "GasPaid")
          .withArgs(
            facet.address,
            "ThatNet",
            router.address,
            payload,
            token.address,
            GAS_FEE,
            gasFwd.address
          )
          .to.emit(gateway, "ContractCall")
          .withArgs("ThatNet", router.address, payload);

        let gasReceiverApproved = await token.allowance(facet.address, gasReceiver.address);
        expect(gasReceiverApproved).to.equal(GAS_FEE);
      });
    });
  });

  describe("upon axelar callback", async function () {
    let facet: AccountsStrategy;
    let state: TestFacetProxyContract;
    let token: DummyERC20;
    let gateway: DummyGateway;
    const ACCOUNT_ID = 1;

    before(async function () {
      token = await deployDummyERC20(owner);
      gateway = await deployDummyGateway(owner);
      await wait(gateway.setTestTokenAddress(token.address));

      const thisNet = {
        ...DEFAULT_NETWORK_INFO,
        chainId: await getChainId(hre),
        axelarGateway: gateway.address,
      };
      registrar.queryNetworkConnection.whenCalledWith("ThisNet").returns(thisNet);

      let stratParams = {
        ...DEFAULT_STRATEGY_PARAMS,
        network: "ThatNet",
        approvalState: StrategyApprovalState.NOT_APPROVED,
      };
      registrar.getStrategyParamsById.returns(stratParams);
    });

    beforeEach(async function () {
      state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
      facet = AccountsStrategy__factory.connect(state.address, owner);
      const config = {
        ...DEFAULT_ACCOUNTS_CONFIG,
        networkName: "ThisNet",
        registrarContract: registrar.address,
      };
      await wait(state.setConfig(config));
    });

    it("reverts in _execute if the call didn't originate from the expected chain", async function () {
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("deposit"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: 1,
        liqAmt: 1,
        status: VaultActionStatus.UNPROCESSED,
      };
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      await expect(
        facet.execute(ethers.utils.formatBytes32String("true"), "NotNet", owner.address, payload)
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
        .withArgs(returnedAction, "NotNet", owner.address);
    });

    it("reverts in _executeWithToken if the call didn't originate from the expected chain", async function () {
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("deposit"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: 1,
        liqAmt: 1,
        status: VaultActionStatus.UNPROCESSED,
      };
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      await expect(
        facet.executeWithToken(
          ethers.utils.formatBytes32String("true"),
          "NotNet",
          owner.address,
          payload,
          "TKN",
          1
        )
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
        .withArgs(returnedAction, "NotNet", owner.address);
    });

    it("reverts in _execute if the call didn't originate from the chain's router", async function () {
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("deposit"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: 1,
        liqAmt: 1,
        status: VaultActionStatus.UNPROCESSED,
      };
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      await expect(
        facet.execute(ethers.utils.formatBytes32String("true"), "ThatNet", owner.address, payload)
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
        .withArgs(returnedAction, "ThatNet", owner.address);
    });

    it("reverts in _executeWithToken if the call didn't originate from the expected chain", async function () {
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("deposit"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: 1,
        liqAmt: 1,
        status: VaultActionStatus.UNPROCESSED,
      };
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      await expect(
        facet.executeWithToken(
          ethers.utils.formatBytes32String("true"),
          "ThatNet",
          owner.address,
          payload,
          "TKN",
          1
        )
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
        .withArgs(returnedAction, "ThatNet", owner.address);
    });

    it("_execute successfully handles status == FAIL_TOKENS_FALLBACK", async function () {
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("deposit"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: 1,
        liqAmt: 1,
        status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
      };
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      expect(
        await facet.execute(
          ethers.utils.formatBytes32String("true"),
          "ThatNet",
          router.address,
          payload
        )
      )
        .to.emit(facet, "RefundNeeded")
        .withArgs(returnedAction);
    });

    it("_execute reverts for any other status", async function () {
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("deposit"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: 1,
        liqAmt: 1,
        status: VaultActionStatus.UNPROCESSED,
      };
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      await expect(
        facet.execute(ethers.utils.formatBytes32String("true"), "ThatNet", router.address, payload)
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedResponse")
        .withArgs(returnedAction);
    });

    it("_executeWithToken: deposit && FAIL_TOKENS_RETURNED", async function () {
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("deposit"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: LOCK_AMT,
        liqAmt: LIQ_AMT,
        status: VaultActionStatus.FAIL_TOKENS_RETURNED,
      };
      const payload = packActionData(action, hre);
      await facet.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        "ThatNet",
        router.address,
        payload,
        "TKN",
        1
      );
      const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(lockBal).to.equal(LOCK_AMT);
      expect(liqBal).to.equal(LIQ_AMT);
    });

    it("_executeWithToken: redeem && SUCCESS", async function () {
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("redeem"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: LOCK_AMT,
        liqAmt: LIQ_AMT,
        status: VaultActionStatus.SUCCESS,
      };
      const payload = packActionData(action, hre);
      await facet.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        "ThatNet",
        router.address,
        payload,
        "TKN",
        1
      );
      const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(lockBal).to.equal(LOCK_AMT);
      expect(liqBal).to.equal(LIQ_AMT);
    });

    it("_executeWithToken: redeemAll && SUCCESS", async function () {
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("redeemAll"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: LOCK_AMT,
        liqAmt: LIQ_AMT,
        status: VaultActionStatus.SUCCESS,
      };
      const payload = packActionData(action, hre);
      await facet.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        "ThatNet",
        router.address,
        payload,
        "TKN",
        1
      );
      const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(lockBal).to.equal(LOCK_AMT);
      expect(liqBal).to.equal(LIQ_AMT);
    });

    it("_executeWithToken: redeem && POSITION_EXITED", async function () {
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("redeem"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: LOCK_AMT,
        liqAmt: LIQ_AMT,
        status: VaultActionStatus.POSITION_EXITED,
      };
      const payload = packActionData(action, hre);
      await wait(
        state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true)
      );

      await facet.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        "ThatNet",
        router.address,
        payload,
        "TKN",
        1
      );
      const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(lockBal).to.equal(LOCK_AMT);
      expect(liqBal).to.equal(LIQ_AMT);
      let strategyActive = await state.getActiveStrategyEndowmentState(
        ACCOUNT_ID,
        DEFAULT_STRATEGY_SELECTOR
      );
      expect(strategyActive).to.be.false;
    });

    it("_executeWithToken: redeemAll && POSITION_EXITED", async function () {
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("redeemAll"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: LOCK_AMT,
        liqAmt: LIQ_AMT,
        status: VaultActionStatus.POSITION_EXITED,
      };
      const payload = packActionData(action, hre);
      await wait(
        state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true)
      );

      await facet.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        "ThatNet",
        router.address,
        payload,
        "TKN",
        1
      );
      const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(lockBal).to.equal(LOCK_AMT);
      expect(liqBal).to.equal(LIQ_AMT);
      let strategyActive = await state.getActiveStrategyEndowmentState(
        ACCOUNT_ID,
        DEFAULT_STRATEGY_SELECTOR
      );
      expect(!strategyActive);
    });

    it("_refundFallback", async function () {
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const action = {
        destinationChain: "ThatNet",
        strategyId: DEFAULT_STRATEGY_SELECTOR,
        selector: vault.interface.getSighash("deposit"),
        accountIds: [ACCOUNT_ID],
        token: token.address,
        lockAmt: LOCK_AMT,
        liqAmt: LIQ_AMT,
        status: VaultActionStatus.UNPROCESSED,
      };
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);

      const apParams = {
        ...DEFAULT_AP_PARAMS,
        refundAddr: user.address,
      };
      registrar.getAngelProtocolParams.returns(apParams);

      await token.mint(facet.address, LOCK_AMT + LIQ_AMT);
      expect(
        await facet.executeWithToken(
          ethers.utils.formatBytes32String("true"),
          "ThatNet",
          router.address,
          payload,
          "TKN",
          LOCK_AMT + LIQ_AMT
        )
      )
        .to.emit(facet, "RefundNeeded")
        .withArgs(returnedAction);
      const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(lockBal).to.equal(0);
      expect(liqBal).to.equal(0);
      let userBal = await token.balanceOf(user.address);
      expect(userBal).to.equal(LOCK_AMT + LIQ_AMT);
    });
  });
});
