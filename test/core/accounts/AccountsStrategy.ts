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
  IAxelarGasService,
  IAxelarGasService__factory,
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
import {StrategyApprovalState, VaultActionStatus, genWallet, getChainId, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";
import {BigNumber} from "ethers";

use(smock.matchers);

describe("AccountsStrategy", function () {
  const {ethers} = hre;

  const ACCOUNT_ID = 1;

  const networkNameThis = "ThisNet";
  const networkNameThat = "ThatNet";

  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;

  let gasFwd: FakeContract<GasFwd>;
  let gasService: FakeContract<IAxelarGasService>;
  let gateway: FakeContract<IAxelarGateway>;
  let registrar: FakeContract<Registrar>;
  let router: FakeContract<Router>;
  let token: FakeContract<IERC20>;
  let vault: FakeContract<IVault>;

  let facetImpl: AccountsStrategy;
  let state: TestFacetProxyContract;
  let facet: AccountsStrategy;

  let netInfoThis: IAccountsStrategy.NetworkInfoStruct;
  let netInfoThat: IAccountsStrategy.NetworkInfoStruct;

  before(async function () {
    const {deployer, proxyAdmin, apTeam1} = await getSigners(hre);
    owner = deployer;
    admin = proxyAdmin;
    user = apTeam1;

    gasFwd = await smock.fake<GasFwd>(new GasFwd__factory());
    gasService = await smock.fake<IAxelarGasService>(IAxelarGasService__factory.createInterface());
    gateway = await smock.fake<IAxelarGateway>(IAxelarGateway__factory.createInterface());
    registrar = await smock.fake<Registrar>(new Registrar__factory());
    router = await smock.fake<Router>(new Router__factory());
    token = await smock.fake<IERC20>(IERC20__factory.createInterface());
    vault = await smock.fake<IVault>(IVault__factory.createInterface());

    const Facet = new AccountsStrategy__factory(owner);
    facetImpl = await Facet.deploy();

    gateway.tokenAddresses.returns(token.address);

    netInfoThis = {
      ...DEFAULT_NETWORK_INFO,
      chainId: await getChainId(hre),
      axelarGateway: gateway.address,
      gasReceiver: gasService.address,
      router: router.address,
    };
    netInfoThat = {
      ...DEFAULT_NETWORK_INFO,
      chainId: 42,
      router: genWallet().address,
    };
    registrar.queryNetworkConnection.whenCalledWith(networkNameThis).returns(netInfoThis);
    registrar.queryNetworkConnection.whenCalledWith(networkNameThat).returns(netInfoThat);
  });

  beforeEach(async function () {
    state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
    facet = AccountsStrategy__factory.connect(state.address, owner);

    const config: AccountStorage.ConfigStruct = {
      ...DEFAULT_ACCOUNTS_CONFIG,
      networkName: networkNameThis,
      registrarContract: registrar.address,
    };
    await state.setConfig(config);
  });

  describe("upon strategyInvest", async function () {
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
        registrar.isTokenAccepted.returns(true);
        let stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: networkNameThis,
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
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const INITIAL_LOCK_BAL = 500;
      const INITIAL_LIQ_BAL = 500;
      const GAS_FEE = 100;
      const stratParams = {
        ...DEFAULT_STRATEGY_PARAMS,
        network: networkNameThat,
        approvalState: StrategyApprovalState.APPROVED,
      };

      before(async function () {
        registrar.isTokenAccepted.returns(true);

        registrar.getStrategyParamsById.returns(stratParams);
      });

      beforeEach(async function () {
        const endowDetails: AccountStorage.EndowmentStruct = {
          ...DEFAULT_CHARITY_ENDOWMENT,
          gasFwd: gasFwd.address,
        };
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

        await wait(
          state.setEndowmentTokenBalance(
            ACCOUNT_ID,
            token.address,
            INITIAL_LOCK_BAL,
            INITIAL_LIQ_BAL
          )
        );

        token.approve.returns(true);
        token.transfer.returns(true);
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
            destinationChain: networkNameThat,
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

        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest)).to.not.be.reverted;

        expect(gasFwd.payForGas).to.have.been.calledWith(token.address, investRequest.gasFee);
        expect(token.approve).to.have.been.calledWith(gasService.address, investRequest.gasFee);
        expect(gasService.payGasForContractCallWithToken).to.have.been.calledWith(
          facet.address,
          stratParams.network,
          netInfoThat.router.toLowerCase(), // AddressToString.toString produces only lowercase letters
          payload,
          investRequest.token,
          BigNumber.from(investRequest.liquidAmt + investRequest.lockAmt),
          token.address,
          BigNumber.from(investRequest.gasFee),
          gasFwd.address
        );
        expect(token.approve).to.have.been.calledWith(
          gateway.address,
          investRequest.liquidAmt + investRequest.lockAmt
        );
        expect(gateway.callContractWithToken).to.have.been.calledWith(
          stratParams.network,
          netInfoThat.router.toLowerCase(),
          payload,
          investRequest.token,
          investRequest.liquidAmt + investRequest.lockAmt
        );

        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(INITIAL_LOCK_BAL - LOCK_AMT);
        expect(liqBal).to.equal(INITIAL_LIQ_BAL - LIQ_AMT);
        const strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(strategyActive).to.be.true;
      });
    });
  });

  describe("upon strategyRedeem", async function () {
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
          network: networkNameThis,
          approvalState: StrategyApprovalState.NOT_APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
        let endowDetails = DEFAULT_CHARITY_ENDOWMENT;
        endowDetails.owner = owner.address;
        await wait(state.setEndowmentDetails(1, endowDetails));
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
        registrar.isTokenAccepted.returns(true);

        let stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: networkNameThis,
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

        await wait(
          state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true)
        );
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

        const payload = packActionData(
          {
            destinationChain: networkNameThis,
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

        await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest))
          .to.emit(facet, "EndowmentRedeemed")
          .withArgs(VaultActionStatus.SUCCESS);

        expect(router.executeLocal).to.have.been.calledWith(
          networkNameThis,
          facet.address.toLowerCase(),
          payload
        );

        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(LOCK_AMT);
        expect(liqBal).to.equal(LIQ_AMT);
        const strategyActive = await state.getActiveStrategyEndowmentState(
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

        const payload = packActionData(
          {
            destinationChain: networkNameThis,
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

        await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest))
          .to.emit(facet, "EndowmentRedeemed")
          .withArgs(VaultActionStatus.POSITION_EXITED);

        expect(router.executeLocal).to.have.been.calledWith(
          networkNameThis,
          facet.address.toLowerCase(),
          payload
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
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const GAS_FEE = 100;
      const stratParams = {
        ...DEFAULT_STRATEGY_PARAMS,
        network: networkNameThat,
        approvalState: StrategyApprovalState.APPROVED,
      };
      let endowDetails: AccountStorage.EndowmentStruct;

      before(async function () {
        registrar.isTokenAccepted.returns(true);

        registrar.getStrategyParamsById.returns(stratParams);
      });

      beforeEach(async function () {
        endowDetails = {
          ...DEFAULT_CHARITY_ENDOWMENT,
          gasFwd: gasFwd.address,
          owner: genWallet().address,
        };
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
            destinationChain: networkNameThat,
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

        token.approve.returns(true);

        await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest)).to.not.be.reverted;

        expect(gasFwd.payForGas).to.have.been.calledWith(token.address, redeemRequest.gasFee);
        expect(token.approve).to.have.been.calledWith(gasService.address, redeemRequest.gasFee);
        expect(gasService.payGasForContractCall).to.have.been.calledWith(
          facet.address,
          stratParams.network,
          netInfoThat.router.toLowerCase(),
          payload,
          token.address,
          redeemRequest.gasFee,
          endowDetails.owner
        );
        expect(gateway.callContract).to.have.been.calledWith(
          stratParams.network,
          netInfoThat.router.toLowerCase(),
          payload
        );
      });
    });
  });

  describe("upon strategyRedeemAll", async function () {
    let token: DummyERC20;
    let gateway: DummyGateway;

    before(async function () {
      token = await deployDummyERC20(owner);
      gateway = await deployDummyGateway(owner);
      await wait(gateway.setTestTokenAddress(token.address));

      let stratParams = {
        ...DEFAULT_STRATEGY_PARAMS,
        network: networkNameThis,
        approvalState: StrategyApprovalState.NOT_APPROVED,
      };
      registrar.getStrategyParamsById.returns(stratParams);
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
          registrar.isTokenAccepted.returns(true);
          let stratParams = {
            ...DEFAULT_STRATEGY_PARAMS,
            network: networkNameThis,
            approvalState: StrategyApprovalState.APPROVED,
          };
          registrar.getStrategyParamsById.returns(stratParams);
        });

        beforeEach(async function () {
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

        registrar.isTokenAccepted.returns(true);
        const stratParams = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: networkNameThat,
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
            destinationChain: networkNameThat,
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
            networkNameThat,
            router.address,
            payload,
            token.address,
            GAS_FEE,
            gasFwd.address
          )
          .to.emit(gateway, "ContractCall")
          .withArgs(networkNameThat, router.address, payload);

        let gasReceiverApproved = await token.allowance(facet.address, gasReceiver.address);
        expect(gasReceiverApproved).to.equal(GAS_FEE);
      });
    });
  });

  describe("upon axelar callback", async function () {
    let token: DummyERC20;
    let gateway: DummyGateway;

    before(async function () {
      token = await deployDummyERC20(owner);
      gateway = await deployDummyGateway(owner);
      await wait(gateway.setTestTokenAddress(token.address));

      let stratParams = {
        ...DEFAULT_STRATEGY_PARAMS,
        network: networkNameThat,
        approvalState: StrategyApprovalState.NOT_APPROVED,
      };
      registrar.getStrategyParamsById.returns(stratParams);
    });

    it("reverts in _execute if the call didn't originate from the expected chain", async function () {
      const action = {
        destinationChain: networkNameThat,
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
        destinationChain: networkNameThat,
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
        destinationChain: networkNameThat,
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
        facet.execute(
          ethers.utils.formatBytes32String("true"),
          networkNameThat,
          owner.address,
          payload
        )
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
        .withArgs(returnedAction, networkNameThat, owner.address);
    });

    it("reverts in _executeWithToken if the call didn't originate from the expected chain", async function () {
      const action = {
        destinationChain: networkNameThat,
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
          networkNameThat,
          owner.address,
          payload,
          "TKN",
          1
        )
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
        .withArgs(returnedAction, networkNameThat, owner.address);
    });

    it("_execute successfully handles status == FAIL_TOKENS_FALLBACK", async function () {
      const action = {
        destinationChain: networkNameThat,
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
          networkNameThat,
          router.address,
          payload
        )
      )
        .to.emit(facet, "RefundNeeded")
        .withArgs(returnedAction);
    });

    it("_execute reverts for any other status", async function () {
      const action = {
        destinationChain: networkNameThat,
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
        facet.execute(
          ethers.utils.formatBytes32String("true"),
          networkNameThat,
          router.address,
          payload
        )
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedResponse")
        .withArgs(returnedAction);
    });

    it("_executeWithToken: deposit && FAIL_TOKENS_RETURNED", async function () {
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;
      const action = {
        destinationChain: networkNameThat,
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
        networkNameThat,
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
        destinationChain: networkNameThat,
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
        networkNameThat,
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
        destinationChain: networkNameThat,
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
        networkNameThat,
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
        destinationChain: networkNameThat,
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
        networkNameThat,
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
        destinationChain: networkNameThat,
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
        networkNameThat,
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
        destinationChain: networkNameThat,
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
          networkNameThat,
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
