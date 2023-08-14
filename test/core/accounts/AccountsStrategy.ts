import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {
  DEFAULT_ACCOUNTS_CONFIG,
  DEFAULT_AP_PARAMS,
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_INVEST_REQUEST,
  DEFAULT_METHOD_SELECTOR,
  DEFAULT_NETWORK_INFO,
  DEFAULT_REDEEM_ALL_REQUEST,
  DEFAULT_REDEEM_REQUEST,
  DEFAULT_STRATEGY_PARAMS,
  DEFAULT_STRATEGY_SELECTOR,
  convertVaultActionStructToArray,
  packActionData,
} from "test/utils";
import {
  AccountsStrategy,
  AccountsStrategy__factory,
  ERC20,
  ERC20__factory,
  GasFwd,
  GasFwd__factory,
  IAxelarGasService,
  IAxelarGasService__factory,
  IAxelarGateway,
  IAxelarGateway__factory,
  IVault,
  IVault__factory,
  Registrar,
  Registrar__factory,
  Router,
  Router__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {
  AccountMessages,
  IVault as IVaultStrategy,
} from "typechain-types/contracts/core/accounts/facets/AccountsStrategy";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";
import {IAccountsStrategy} from "typechain-types/contracts/core/registrar/Registrar";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {StrategyApprovalState, VaultActionStatus, genWallet, getChainId, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";

use(smock.matchers);

describe("AccountsStrategy", function () {
  const {ethers} = hre;

  const ACCOUNT_ID = 1;

  const INITIAL_LOCK_BAL = 500;
  const INITIAL_LIQ_BAL = 500;
  const LOCK_AMT = 300;
  const LIQ_AMT = 200;
  const GAS_FEE = 100;

  const NET_NAME_THIS = "ThisNet";
  const NET_NAME_THAT = "ThatNet";

  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;

  let gasFwd: FakeContract<GasFwd>;
  let gasService: FakeContract<IAxelarGasService>;
  let gateway: FakeContract<IAxelarGateway>;
  let registrar: FakeContract<Registrar>;
  let router: FakeContract<Router>;
  let token: FakeContract<ERC20>;
  let vault: FakeContract<IVault>;

  let facetImpl: AccountsStrategy;
  let state: TestFacetProxyContract;
  let facet: AccountsStrategy;

  let netInfoThis: IAccountsStrategy.NetworkInfoStruct;
  let netInfoThat: IAccountsStrategy.NetworkInfoStruct;

  let endowDetails: AccountStorage.EndowmentStruct;

  before(async function () {
    const {deployer, proxyAdmin, apTeam1} = await getSigners(hre);
    owner = deployer;
    admin = proxyAdmin;
    user = apTeam1;

    gasService = await smock.fake<IAxelarGasService>(IAxelarGasService__factory.createInterface());
    gateway = await smock.fake<IAxelarGateway>(IAxelarGateway__factory.createInterface());
    vault = await smock.fake<IVault>(IVault__factory.createInterface());

    const Facet = new AccountsStrategy__factory(owner);
    facetImpl = await Facet.deploy();
  });

  beforeEach(async function () {
    gasFwd = await smock.fake<GasFwd>(new GasFwd__factory());
    registrar = await smock.fake<Registrar>(new Registrar__factory());
    router = await smock.fake<Router>(new Router__factory());
    token = await smock.fake<ERC20>(ERC20__factory.createInterface());

    state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
    facet = AccountsStrategy__factory.connect(state.address, owner);

    token.approve.returns(true);
    token.symbol.returns("TKN");
    token.transfer.returns(true);

    const config: AccountStorage.ConfigStruct = {
      ...DEFAULT_ACCOUNTS_CONFIG,
      networkName: NET_NAME_THIS,
      registrarContract: registrar.address,
    };
    await state.setConfig(config);

    endowDetails = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      gasFwd: gasFwd.address,
      owner: genWallet().address,
      settingsController: {
        ...DEFAULT_CHARITY_ENDOWMENT.settingsController,
        liquidInvestmentManagement: {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        },
        lockedInvestmentManagement: {
          locked: false,
          delegate: {
            addr: owner.address,
            expires: 0,
          },
        },
      },
    };
    await state.setEndowmentDetails(ACCOUNT_ID, endowDetails);
    await state.setEndowmentTokenBalance(
      ACCOUNT_ID,
      token.address,
      INITIAL_LOCK_BAL,
      INITIAL_LIQ_BAL
    );

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
    registrar.queryNetworkConnection.whenCalledWith(NET_NAME_THIS).returns(netInfoThis);
    registrar.queryNetworkConnection.whenCalledWith(NET_NAME_THAT).returns(netInfoThat);

    const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
      ...DEFAULT_STRATEGY_PARAMS,
      network: NET_NAME_THIS,
      approvalState: StrategyApprovalState.APPROVED,
    };
    registrar.getStrategyParamsById.returns(stratParams);

    registrar.isTokenAccepted.returns(true);

    gateway.tokenAddresses.returns(token.address);
  });

  describe("upon strategyInvest", function () {
    beforeEach(async () => {
      await state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, false);
    });

    describe("reverts when", function () {
      it("neither locked nor liquid funds are set to be invested", async function () {
        await expect(
          facet.strategyInvest(ACCOUNT_ID, DEFAULT_INVEST_REQUEST)
        ).to.be.revertedWithCustomError(facet, "ZeroAmount");
      });

      it("the caller is not approved for locked fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: 1,
        };
        await expect(
          facet.connect(user).strategyInvest(ACCOUNT_ID, investRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the caller is not approved for liquid fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          liquidAmt: 1,
        };
        await expect(
          facet.connect(user).strategyInvest(ACCOUNT_ID, investRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the strategy is not approved", async function () {
        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THIS,
          approvalState: StrategyApprovalState.NOT_APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);

        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          liquidAmt: 1,
          lockAmt: 1,
        };
        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest)).to.be.revertedWith(
          "Strategy is not approved"
        );
      });

      it("the account locked balance is insufficient", async function () {
        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: INITIAL_LOCK_BAL + 1,
        };
        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest)).to.be.revertedWith(
          "Insufficient Balance"
        );
      });

      it("the account liquid balance is insufficient", async function () {
        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          liquidAmt: INITIAL_LIQ_BAL + 1,
        };
        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest)).to.be.revertedWith(
          "Insufficient Balance"
        );
      });

      it("the token isn't accepted", async function () {
        registrar.isTokenAccepted.returns(false);

        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          liquidAmt: 1,
        };
        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest)).to.be.revertedWith(
          "Token not approved"
        );
      });
    });

    describe("and calls the local router", function () {
      it("and the response is SUCCESS", async function () {
        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: LOCK_AMT,
          liquidAmt: LIQ_AMT,
          token: token.address,
        };

        const vaultActionData: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: investRequest.token,
          lockAmt: investRequest.lockAmt,
          liqAmt: investRequest.liquidAmt,
          status: VaultActionStatus.SUCCESS,
        };
        router.executeWithTokenLocal.returns(vaultActionData);

        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest))
          .to.emit(facet, "EndowmentInvested")
          .withArgs(ACCOUNT_ID);

        expect(token.transfer).to.have.been.calledWith(
          netInfoThis.router,
          BigNumber.from(investRequest.liquidAmt).add(BigNumber.from(investRequest.lockAmt))
        );

        const payload = packActionData({
          destinationChain: NET_NAME_THIS,
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: vault.interface.getSighash("deposit"),
          accountIds: [ACCOUNT_ID],
          token: investRequest.token,
          lockAmt: investRequest.lockAmt,
          liqAmt: investRequest.liquidAmt,
          status: VaultActionStatus.UNPROCESSED,
        });
        expect(router.executeWithTokenLocal).to.have.been.calledWith(
          NET_NAME_THIS,
          facet.address.toLowerCase(),
          payload,
          investRequest.token,
          BigNumber.from(investRequest.liquidAmt).add(BigNumber.from(investRequest.lockAmt))
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

      [
        VaultActionStatus.FAIL_TOKENS_FALLBACK,
        VaultActionStatus.FAIL_TOKENS_RETURNED,
        VaultActionStatus.POSITION_EXITED,
        VaultActionStatus.UNPROCESSED,
      ].forEach((vaultStatus) => {
        it(`reverts when the response is ${VaultActionStatus[vaultStatus]}`, async function () {
          const vaultActionData: IVaultStrategy.VaultActionDataStruct = {
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: vaultStatus,
          };
          router.executeWithTokenLocal.returns(vaultActionData);

          const investRequest: AccountMessages.InvestRequestStruct = {
            ...DEFAULT_INVEST_REQUEST,
            lockAmt: LOCK_AMT,
            liquidAmt: LIQ_AMT,
          };

          await expect(facet.strategyInvest(ACCOUNT_ID, investRequest))
            .to.be.revertedWithCustomError(facet, "InvestFailed")
            .withArgs(vaultStatus);
        });
      });
    });

    describe("and calls axelar GMP", function () {
      beforeEach(async function () {
        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THAT,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      [
        {payForGasResult: GAS_FEE, text: "just enough balance"},
        {payForGasResult: GAS_FEE + 1, text: "more than enough balance"},
      ].forEach(({payForGasResult, text}) => {
        it(`makes all the correct external calls when GasFwd has ${text} to pay for gas`, async function () {
          const investRequest: AccountMessages.InvestRequestStruct = {
            ...DEFAULT_INVEST_REQUEST,
            lockAmt: LOCK_AMT,
            liquidAmt: LIQ_AMT,
            gasFee: GAS_FEE,
          };

          gasFwd.payForGas.returns(payForGasResult);

          await expect(facet.strategyInvest(ACCOUNT_ID, investRequest))
            .to.emit(facet, "EndowmentInvested")
            .withArgs(ACCOUNT_ID);

          expect(gasFwd.payForGas).to.have.been.calledWith(token.address, investRequest.gasFee);
          expect(token.approve).to.have.been.calledWith(gasService.address, investRequest.gasFee);

          const payload = packActionData({
            destinationChain: NET_NAME_THAT,
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("deposit"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.UNPROCESSED,
          });
          expect(gasService.payGasForContractCallWithToken).to.have.been.calledWith(
            facet.address,
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(), // AddressToString.toString produces only lowercase constters
            payload,
            investRequest.token,
            BigNumber.from(investRequest.liquidAmt).add(BigNumber.from(investRequest.lockAmt)),
            token.address,
            investRequest.gasFee,
            gasFwd.address
          );
          expect(token.approve).to.have.been.calledWith(
            gateway.address,
            BigNumber.from(investRequest.liquidAmt).add(BigNumber.from(investRequest.lockAmt))
          );
          expect(gateway.callContractWithToken).to.have.been.calledWith(
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(),
            payload,
            investRequest.token,
            BigNumber.from(investRequest.liquidAmt).add(BigNumber.from(investRequest.lockAmt))
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

      [
        {
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          gasFee: GAS_FEE,
          gasFwdGas: GAS_FEE - 1,
          expectedLockBal: INITIAL_LOCK_BAL - LOCK_AMT - 1,
          expectedLiqBal: INITIAL_LIQ_BAL - LIQ_AMT,
          description:
            "paying out of locked balance takes precedence when gas fee is too small to split",
        },
        {
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          gasFee: 200,
          gasFwdGas: 0,
          expectedLockBal: INITIAL_LOCK_BAL - LOCK_AMT - 120,
          expectedLiqBal: INITIAL_LIQ_BAL - LIQ_AMT - 80,
          description: "both liquid and locked balances cover their respective gas fee portions",
        },
        {
          lockAmt: 43,
          liqAmt: 55,
          gasFee: 400,
          gasFwdGas: 79,
          expectedLockBal: INITIAL_LOCK_BAL - 184,
          expectedLiqBal: INITIAL_LIQ_BAL - 235,
          description: "fractional percentages case",
        },
        {
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          gasFee: 1000,
          gasFwdGas: 600,
          expectedLockBal: 0,
          expectedLiqBal: 100,
          description: "liquid covers part of locked portion of the gas fee",
        },
      ].forEach((caseData) => {
        it(`makes all the correct external calls and pays for part of the gas fee: ${caseData.description}`, async function () {
          const investRequest: AccountMessages.InvestRequestStruct = {
            ...DEFAULT_INVEST_REQUEST,
            lockAmt: caseData.lockAmt,
            liquidAmt: caseData.liqAmt,
            gasFee: caseData.gasFee,
          };

          gasFwd.payForGas.returns(caseData.gasFwdGas);

          await expect(facet.strategyInvest(ACCOUNT_ID, investRequest))
            .to.emit(facet, "EndowmentInvested")
            .withArgs(ACCOUNT_ID);

          expect(gasFwd.payForGas).to.have.been.calledWith(token.address, investRequest.gasFee);
          expect(token.approve).to.have.been.calledWith(gasService.address, investRequest.gasFee);

          const payload = packActionData({
            destinationChain: NET_NAME_THAT,
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("deposit"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: caseData.lockAmt,
            liqAmt: caseData.liqAmt,
            status: VaultActionStatus.UNPROCESSED,
          });
          expect(gasService.payGasForContractCallWithToken).to.have.been.calledWith(
            facet.address,
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(), // AddressToString.toString produces only lowercase constters
            payload,
            investRequest.token,
            BigNumber.from(investRequest.liquidAmt).add(BigNumber.from(investRequest.lockAmt)),
            token.address,
            investRequest.gasFee,
            gasFwd.address
          );
          expect(token.approve).to.have.been.calledWith(
            gateway.address,
            BigNumber.from(investRequest.liquidAmt).add(BigNumber.from(investRequest.lockAmt))
          );
          expect(gateway.callContractWithToken).to.have.been.calledWith(
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(),
            payload,
            investRequest.token,
            BigNumber.from(investRequest.liquidAmt).add(BigNumber.from(investRequest.lockAmt))
          );

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(caseData.expectedLockBal);
          expect(liqBal).to.equal(caseData.expectedLiqBal);
          const strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive).to.be.true;
        });
      });

      describe("but reverts because", () => {
        it("neither locked nor liquid balances can cover their respective gas fees", async () => {
          const hugeGasFee = INITIAL_LOCK_BAL + INITIAL_LIQ_BAL;

          const investRequest: AccountMessages.InvestRequestStruct = {
            ...DEFAULT_INVEST_REQUEST,
            lockAmt: LOCK_AMT,
            liquidAmt: LIQ_AMT,
            gasFee: hugeGasFee,
          };

          await expect(facet.strategyInvest(ACCOUNT_ID, investRequest))
            .to.be.revertedWithCustomError(facet, "InsufficientFundsForGas")
            .withArgs(ACCOUNT_ID);
        });

        it("liquid balances can't cover locked gas deficit", async () => {
          const hugeGasFee = INITIAL_LOCK_BAL + 100;

          const investRequest: AccountMessages.InvestRequestStruct = {
            ...DEFAULT_INVEST_REQUEST,
            lockAmt: LOCK_AMT,
            liquidAmt: LIQ_AMT,
            gasFee: hugeGasFee,
          };

          await expect(facet.strategyInvest(ACCOUNT_ID, investRequest))
            .to.be.revertedWithCustomError(facet, "InsufficientFundsForGas")
            .withArgs(ACCOUNT_ID);
        });
      });
    });
  });

  describe("upon strategyRedeem", function () {
    beforeEach(async () => {
      await state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true);
    });

    describe("reverts when", function () {
      it("neither locked nor liquid funds are set to be redeemed", async function () {
        await expect(
          facet.strategyRedeem(ACCOUNT_ID, DEFAULT_REDEEM_REQUEST)
        ).to.be.revertedWithCustomError(facet, "ZeroAmount");
      });

      it("the caller is not approved for locked fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        const redeemRequest: AccountMessages.RedeemRequestStruct = {
          ...DEFAULT_REDEEM_REQUEST,
          lockAmt: 1,
        };
        await expect(
          facet.connect(user).strategyRedeem(ACCOUNT_ID, redeemRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the caller is not approved for liquid fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        const redeemRequest: AccountMessages.RedeemRequestStruct = {
          ...DEFAULT_REDEEM_REQUEST,
          liquidAmt: 1,
        };
        await expect(
          facet.connect(user).strategyRedeem(ACCOUNT_ID, redeemRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the strategy is not approved", async function () {
        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THIS,
          approvalState: StrategyApprovalState.NOT_APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);

        const redeemRequest: AccountMessages.RedeemRequestStruct = {
          ...DEFAULT_REDEEM_REQUEST,
          lockAmt: 1,
        };
        await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest)).to.be.revertedWith(
          "Strategy is not approved"
        );
      });
    });

    describe("and calls the local router", function () {
      const redeemRequest: AccountMessages.RedeemRequestStruct = {
        ...DEFAULT_REDEEM_REQUEST,
        lockAmt: LOCK_AMT,
        liquidAmt: LIQ_AMT,
      };

      [
        {
          vaultStatus: VaultActionStatus.POSITION_EXITED,
          approvalState: StrategyApprovalState.APPROVED,
        },
        {
          vaultStatus: VaultActionStatus.POSITION_EXITED,
          approvalState: StrategyApprovalState.WITHDRAW_ONLY,
        },
        {
          vaultStatus: VaultActionStatus.SUCCESS,
          approvalState: StrategyApprovalState.APPROVED,
        },
        {
          vaultStatus: VaultActionStatus.SUCCESS,
          approvalState: StrategyApprovalState.WITHDRAW_ONLY,
        },
      ].forEach(({approvalState, vaultStatus}) => {
        it(`and the response is ${VaultActionStatus[vaultStatus]} with approval state: ${StrategyApprovalState[approvalState]}`, async function () {
          const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
            ...DEFAULT_STRATEGY_PARAMS,
            network: NET_NAME_THIS,
            approvalState,
          };
          registrar.getStrategyParamsById.returns(stratParams);

          const vaultActionData: IVaultStrategy.VaultActionDataStruct = {
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: vaultStatus,
          };
          router.executeLocal.returns(vaultActionData);

          await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest))
            .to.emit(facet, "EndowmentRedeemed")
            .withArgs(ACCOUNT_ID, vaultStatus);

          const payload = packActionData({
            destinationChain: NET_NAME_THIS,
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("redeem"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.UNPROCESSED,
          });
          expect(router.executeLocal).to.have.been.calledWith(
            NET_NAME_THIS,
            facet.address.toLowerCase(),
            payload
          );

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(INITIAL_LOCK_BAL + LOCK_AMT);
          expect(liqBal).to.equal(INITIAL_LIQ_BAL + LIQ_AMT);
          const strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive).to.equal(vaultStatus === VaultActionStatus.SUCCESS);
        });
      });

      [
        VaultActionStatus.FAIL_TOKENS_FALLBACK,
        VaultActionStatus.FAIL_TOKENS_RETURNED,
        VaultActionStatus.UNPROCESSED,
      ].forEach((vaultStatus) => {
        it(`reverts when the response is: ${VaultActionStatus[vaultStatus]}`, async function () {
          const vaultActionData: IVaultStrategy.VaultActionDataStruct = {
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: vaultStatus,
          };
          router.executeLocal.returns(vaultActionData);

          await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest))
            .to.be.revertedWithCustomError(facet, "RedeemFailed")
            .withArgs(vaultStatus);
        });
      });
    });

    describe("and calls axelar GMP", function () {
      beforeEach(async function () {
        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THAT,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      [
        {payForGasResult: GAS_FEE, text: "just enough balance"},
        {payForGasResult: GAS_FEE + 1, text: "more than enough balance"},
      ].forEach(({payForGasResult, text}) => {
        it(`makes all the correct external calls when GasFwd has ${text} to pay for gas`, async function () {
          const redeemRequest: AccountMessages.RedeemRequestStruct = {
            ...DEFAULT_REDEEM_REQUEST,
            lockAmt: LOCK_AMT,
            liquidAmt: LIQ_AMT,
            gasFee: GAS_FEE,
          };

          const payload = packActionData({
            destinationChain: NET_NAME_THAT,
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("redeem"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.UNPROCESSED,
          });

          gasFwd.payForGas.returns(payForGasResult);

          await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest)).to.not.be.reverted;

          expect(gasFwd.payForGas).to.have.been.calledWith(token.address, redeemRequest.gasFee);
          expect(token.approve).to.have.been.calledWith(gasService.address, redeemRequest.gasFee);
          expect(gasService.payGasForContractCall).to.have.been.calledWith(
            facet.address,
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(),
            payload,
            token.address,
            redeemRequest.gasFee,
            endowDetails.owner
          );
          expect(gateway.callContract).to.have.been.calledWith(
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(),
            payload
          );

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(INITIAL_LOCK_BAL);
          expect(liqBal).to.equal(INITIAL_LIQ_BAL);
          const strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive).to.be.true;
        });
      });

      [
        {
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          gasFee: GAS_FEE,
          gasFwdGas: GAS_FEE - 1,
          expectedLockBal: INITIAL_LOCK_BAL - 1,
          expectedLiqBal: INITIAL_LIQ_BAL,
          description:
            "paying out of locked balance takes precedence when gas fee is too small to split",
        },
        {
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          gasFee: 400,
          gasFwdGas: 0,
          expectedLockBal: INITIAL_LOCK_BAL - 240,
          expectedLiqBal: INITIAL_LIQ_BAL - 160,
          description: "both liquid and locked balances cover their respective gas fee portions",
        },
        {
          lockAmt: 43,
          liqAmt: 55,
          gasFee: 400,
          gasFwdGas: 79,
          expectedLockBal: INITIAL_LOCK_BAL - 141,
          expectedLiqBal: INITIAL_LIQ_BAL - 180,
          description: "fractional percentages case",
        },
        {
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          gasFee: 1000,
          gasFwdGas: 100,
          expectedLockBal: 0,
          expectedLiqBal: 100,
          description: "liquid covers part of locked portion of the gas fee",
        },
      ].forEach((caseData) => {
        it(`makes all the correct external calls and pays for part of ${
          caseData.gasFee
        } gas fee (total ${caseData.gasFee - caseData.gasFwdGas}): ${
          caseData.description
        }`, async function () {
          const redeemRequest: AccountMessages.RedeemRequestStruct = {
            ...DEFAULT_REDEEM_REQUEST,
            lockAmt: caseData.lockAmt,
            liquidAmt: caseData.liqAmt,
            gasFee: caseData.gasFee,
          };

          gasFwd.payForGas.returns(caseData.gasFwdGas);

          await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest)).to.not.be.reverted;

          expect(gasFwd.payForGas).to.have.been.calledWith(token.address, redeemRequest.gasFee);
          expect(token.approve).to.have.been.calledWith(gasService.address, redeemRequest.gasFee);

          const payload = packActionData({
            destinationChain: NET_NAME_THAT,
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("redeem"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: caseData.lockAmt,
            liqAmt: caseData.liqAmt,
            status: VaultActionStatus.UNPROCESSED,
          });
          expect(gasService.payGasForContractCall).to.have.been.calledWith(
            facet.address,
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(),
            payload,
            token.address,
            redeemRequest.gasFee,
            endowDetails.owner
          );
          expect(gateway.callContract).to.have.been.calledWith(
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(),
            payload
          );

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(caseData.expectedLockBal);
          expect(liqBal).to.equal(caseData.expectedLiqBal);
          const strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive).to.be.true;
        });
      });

      describe("but reverts because", () => {
        it("neither locked nor liquid balances can cover their respective gas fees", async () => {
          const hugeGasFee = (INITIAL_LOCK_BAL + INITIAL_LIQ_BAL) * 2;

          const investRequest: AccountMessages.InvestRequestStruct = {
            ...DEFAULT_INVEST_REQUEST,
            lockAmt: LOCK_AMT,
            liquidAmt: LIQ_AMT,
            gasFee: hugeGasFee,
          };

          await expect(facet.strategyRedeem(ACCOUNT_ID, investRequest))
            .to.be.revertedWithCustomError(facet, "InsufficientFundsForGas")
            .withArgs(ACCOUNT_ID);
        });

        it("liquid balances can't cover locked gas deficit", async () => {
          const hugeGasFee = INITIAL_LOCK_BAL + INITIAL_LIQ_BAL + 100;

          const investRequest: AccountMessages.InvestRequestStruct = {
            ...DEFAULT_INVEST_REQUEST,
            lockAmt: LOCK_AMT,
            liquidAmt: LIQ_AMT,
            gasFee: hugeGasFee,
          };

          await expect(facet.strategyRedeem(ACCOUNT_ID, investRequest))
            .to.be.revertedWithCustomError(facet, "InsufficientFundsForGas")
            .withArgs(ACCOUNT_ID);
        });
      });
    });
  });

  describe("upon strategyRedeemAll", function () {
    beforeEach(async () => {
      await state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true);
    });

    describe("reverts when", function () {
      it("neither locked nor liquid funds are set to be redeemed", async function () {
        await expect(
          facet.strategyRedeemAll(ACCOUNT_ID, DEFAULT_REDEEM_ALL_REQUEST)
        ).to.be.revertedWithCustomError(facet, "ZeroAmount");
      });
      it("the caller is not approved for locked fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLocked: true,
        };
        await expect(
          facet.connect(user).strategyRedeemAll(ACCOUNT_ID, redeemAllRequest)
        ).to.be.revertedWith("Unauthorized");
      });
      it("the caller is not approved for liquid fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLiquid: true,
        };
        await expect(
          facet.connect(user).strategyRedeemAll(ACCOUNT_ID, redeemAllRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the strategy is not approved", async function () {
        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THIS,
          approvalState: StrategyApprovalState.NOT_APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);

        const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLiquid: true,
        };
        await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest)).to.be.revertedWith(
          "Strategy is not approved"
        );
      });
    });

    describe("and calls the local router", function () {
      const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
        ...DEFAULT_REDEEM_ALL_REQUEST,
        redeemLocked: true,
        redeemLiquid: true,
      };

      [StrategyApprovalState.APPROVED, StrategyApprovalState.WITHDRAW_ONLY].forEach(
        (approvalState) => {
          it(`redeems when the response is POSITION_EXITED and approval state is: ${StrategyApprovalState[approvalState]}`, async function () {
            const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
              ...DEFAULT_STRATEGY_PARAMS,
              network: NET_NAME_THIS,
              approvalState,
            };
            registrar.getStrategyParamsById.returns(stratParams);

            const vaultActionData: IVaultStrategy.VaultActionDataStruct = {
              destinationChain: "",
              strategyId: DEFAULT_STRATEGY_SELECTOR,
              selector: DEFAULT_METHOD_SELECTOR,
              accountIds: [ACCOUNT_ID],
              token: token.address,
              lockAmt: LOCK_AMT,
              liqAmt: LIQ_AMT,
              status: VaultActionStatus.POSITION_EXITED,
            };
            router.executeLocal.returns(vaultActionData);

            const payload = packActionData({
              destinationChain: NET_NAME_THIS,
              strategyId: DEFAULT_STRATEGY_SELECTOR,
              selector: vault.interface.getSighash("redeemAll"),
              accountIds: [ACCOUNT_ID],
              token: token.address,
              lockAmt: 1,
              liqAmt: 1,
              status: VaultActionStatus.UNPROCESSED,
            });

            await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest))
              .to.emit(facet, "EndowmentRedeemed")
              .withArgs(ACCOUNT_ID, VaultActionStatus.POSITION_EXITED);

            expect(router.executeLocal).to.have.been.calledWith(
              NET_NAME_THIS,
              facet.address.toLowerCase(),
              payload
            );

            const [lockBal, liqBal] = await state.getEndowmentTokenBalance(
              ACCOUNT_ID,
              token.address
            );
            expect(lockBal).to.equal(INITIAL_LOCK_BAL + LOCK_AMT);
            expect(liqBal).to.equal(INITIAL_LIQ_BAL + LIQ_AMT);
            const strategyActive = await state.getActiveStrategyEndowmentState(
              ACCOUNT_ID,
              DEFAULT_STRATEGY_SELECTOR
            );
            expect(strategyActive).to.be.false;
          });
        }
      );

      [
        VaultActionStatus.FAIL_TOKENS_FALLBACK,
        VaultActionStatus.FAIL_TOKENS_RETURNED,
        VaultActionStatus.SUCCESS,
      ].forEach((vaultActionStatus) => {
        it(`reverts when response is ${VaultActionStatus[vaultActionStatus]}`, async function () {
          const vaultActionData: IVaultStrategy.VaultActionDataStruct = {
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: vaultActionStatus,
          };
          router.executeLocal.returns(vaultActionData);

          await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest))
            .to.be.revertedWithCustomError(facet, "RedeemAllFailed")
            .withArgs(vaultActionStatus);

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(INITIAL_LOCK_BAL);
          expect(liqBal).to.equal(INITIAL_LIQ_BAL);
          const strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive).to.be.true;
        });
      });
    });

    describe("and calls axelar GMP", function () {
      beforeEach(async function () {
        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THAT,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      [
        {payForGasResult: GAS_FEE, text: "just enough balance"},
        {payForGasResult: GAS_FEE + 1, text: "more than enough balance"},
      ].forEach(({payForGasResult, text}) => {
        it(`makes all the correct external calls when GasFwd has ${text} to pay for gas`, async function () {
          const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
            ...DEFAULT_REDEEM_ALL_REQUEST,
            redeemLocked: true,
            redeemLiquid: true,
            gasFee: GAS_FEE,
          };

          gasFwd.payForGas.returns(payForGasResult);

          const payload = packActionData({
            destinationChain: NET_NAME_THAT,
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("redeemAll"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: 1,
            liqAmt: 1,
            status: VaultActionStatus.UNPROCESSED,
          });

          await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest)).to.not.be.reverted;

          expect(gasFwd.payForGas).to.have.been.calledWith(token.address, redeemAllRequest.gasFee);
          expect(token.approve).to.have.been.calledWith(netInfoThis.gasReceiver, GAS_FEE);
          expect(gasService.payGasForContractCall).to.have.been.calledWith(
            facet.address,
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(),
            payload,
            token.address,
            GAS_FEE,
            endowDetails.owner
          );
          expect(gateway.callContract).to.have.been.calledWith(
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(),
            payload
          );

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(INITIAL_LOCK_BAL);
          expect(liqBal).to.equal(INITIAL_LIQ_BAL);
          const strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive).to.be.true;
        });
      });

      [
        {
          redeemLocked: true,
          redeemLiquid: true,
          gasFee: GAS_FEE,
          gasFwdGas: GAS_FEE - 1,
          expectedLockBal: INITIAL_LOCK_BAL - 1,
          expectedLiqBal: INITIAL_LIQ_BAL,
          description:
            "paying out of locked balance takes precedence when gas fee is too small to split",
        },
        {
          redeemLocked: true,
          redeemLiquid: true,
          gasFee: 400,
          gasFwdGas: 0,
          expectedLockBal: INITIAL_LOCK_BAL - 200,
          expectedLiqBal: INITIAL_LIQ_BAL - 200,
          description: "both liquid and locked balances cover their respective gas fee portions",
        },
        {
          redeemLocked: true,
          redeemLiquid: true,
          gasFee: 400,
          gasFwdGas: 79,
          expectedLockBal: INITIAL_LOCK_BAL - 161,
          expectedLiqBal: INITIAL_LIQ_BAL - 160,
          description: "fractional percentages case",
        },
        {
          redeemLocked: true,
          redeemLiquid: true,
          gasFee: 1000,
          gasFwdGas: 100,
          prevLockBal: 400,
          prevLiqBal: 600,
          expectedLockBal: 0,
          expectedLiqBal: 100,
          description: "liquid covers part of locked portion of the gas fee",
        },
        {
          redeemLocked: true,
          redeemLiquid: false,
          gasFee: GAS_FEE,
          gasFwdGas: GAS_FEE - 1,
          expectedLockBal: INITIAL_LOCK_BAL - 1,
          expectedLiqBal: INITIAL_LIQ_BAL,
          description:
            "paying out of locked balance takes precedence when gas fee is too small to split",
        },
        {
          redeemLocked: true,
          redeemLiquid: false,
          gasFee: 400,
          gasFwdGas: 0,
          expectedLockBal: INITIAL_LOCK_BAL - 200,
          expectedLiqBal: INITIAL_LIQ_BAL - 200,
          description: "both liquid and locked balances cover their respective gas fee portions",
        },
        {
          redeemLocked: true,
          redeemLiquid: false,
          gasFee: 400,
          gasFwdGas: 79,
          expectedLockBal: INITIAL_LOCK_BAL - 161,
          expectedLiqBal: INITIAL_LIQ_BAL - 160,
          description: "fractional percentages case",
        },
        {
          redeemLocked: true,
          redeemLiquid: false,
          gasFee: 1000,
          gasFwdGas: 100,
          prevLockBal: 400,
          prevLiqBal: 600,
          expectedLockBal: 0,
          expectedLiqBal: 100,
          description: "liquid covers part of locked portion of the gas fee",
        },
        {
          redeemLocked: false,
          redeemLiquid: true,
          gasFee: GAS_FEE,
          gasFwdGas: GAS_FEE - 1,
          expectedLockBal: INITIAL_LOCK_BAL - 1,
          expectedLiqBal: INITIAL_LIQ_BAL,
          description:
            "paying out of locked balance takes precedence when gas fee is too small to split",
        },
        {
          redeemLocked: false,
          redeemLiquid: true,
          gasFee: 400,
          gasFwdGas: 0,
          expectedLockBal: INITIAL_LOCK_BAL - 200,
          expectedLiqBal: INITIAL_LIQ_BAL - 200,
          description: "both liquid and locked balances cover their respective gas fee portions",
        },
        {
          redeemLocked: false,
          redeemLiquid: true,
          gasFee: 400,
          gasFwdGas: 79,
          expectedLockBal: INITIAL_LOCK_BAL - 161,
          expectedLiqBal: INITIAL_LIQ_BAL - 160,
          description: "fractional percentages case",
        },
        {
          redeemLocked: false,
          redeemLiquid: true,
          gasFee: 1000,
          gasFwdGas: 100,
          prevLockBal: 400,
          prevLiqBal: 600,
          expectedLockBal: 0,
          expectedLiqBal: 100,
          description: "liquid covers part of locked portion of the gas fee",
        },
      ].forEach((caseData) => {
        it(`redeeming ${
          caseData.redeemLiquid && caseData.redeemLocked
            ? "locked & liquid"
            : caseData.redeemLiquid
            ? "liquid"
            : "locked"
        } - makes all the correct external calls and pays for part of the gas fee: ${
          caseData.description
        }`, async function () {
          if (caseData.prevLockBal) {
            await state.setEndowmentTokenBalance(
              ACCOUNT_ID,
              token.address,
              caseData.prevLockBal,
              caseData.prevLiqBal
            );
          }

          const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
            ...DEFAULT_REDEEM_ALL_REQUEST,
            redeemLocked: caseData.redeemLocked,
            redeemLiquid: caseData.redeemLiquid,
            gasFee: caseData.gasFee,
          };

          gasFwd.payForGas.returns(caseData.gasFwdGas);

          await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest)).to.not.be.reverted;

          expect(gasFwd.payForGas).to.have.been.calledWith(token.address, redeemAllRequest.gasFee);
          expect(token.approve).to.have.been.calledWith(
            netInfoThis.gasReceiver,
            redeemAllRequest.gasFee
          );

          const payload = packActionData({
            destinationChain: NET_NAME_THAT,
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("redeemAll"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: redeemAllRequest.redeemLocked ? 1 : 0,
            liqAmt: redeemAllRequest.redeemLiquid ? 1 : 0,
            status: VaultActionStatus.UNPROCESSED,
          });
          expect(gasService.payGasForContractCall).to.have.been.calledWith(
            facet.address,
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(),
            payload,
            token.address,
            redeemAllRequest.gasFee,
            endowDetails.owner
          );
          expect(gateway.callContract).to.have.been.calledWith(
            NET_NAME_THAT,
            netInfoThat.router.toLowerCase(),
            payload
          );

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(caseData.expectedLockBal);
          expect(liqBal).to.equal(caseData.expectedLiqBal);
          const strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive).to.be.true;
        });
      });

      describe("but reverts because", () => {
        it("neither locked nor liquid balances can cover their respective gas fees", async () => {
          const hugeGasFee = (INITIAL_LOCK_BAL + INITIAL_LIQ_BAL) * 2;

          const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
            ...DEFAULT_REDEEM_ALL_REQUEST,
            redeemLocked: true,
            redeemLiquid: true,
            gasFee: hugeGasFee,
          };

          await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest))
            .to.be.revertedWithCustomError(facet, "InsufficientFundsForGas")
            .withArgs(ACCOUNT_ID);
        });

        it("liquid balances can't cover locked gas deficit", async () => {
          const hugeGasFee = INITIAL_LOCK_BAL + INITIAL_LIQ_BAL + 100;

          const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
            ...DEFAULT_REDEEM_ALL_REQUEST,
            redeemLocked: true,
            redeemLiquid: true,
            gasFee: hugeGasFee,
          };

          await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest))
            .to.be.revertedWithCustomError(facet, "InsufficientFundsForGas")
            .withArgs(ACCOUNT_ID);
        });
      });
    });
  });

  describe("upon axelar callback", function () {
    beforeEach(async () => {
      gateway.validateContractCall.returns(true);
      gateway.validateContractCallAndMint.returns(true);

      await state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true);
    });

    describe("into _execute", () => {
      it("reverts if the call was not approved by Axelar gateway", async function () {
        gateway.validateContractCall.returns(false);

        const payload = packActionData({
          destinationChain: NET_NAME_THAT,
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: vault.interface.getSighash("deposit"),
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: 1,
          liqAmt: 1,
          status: VaultActionStatus.UNPROCESSED,
        });

        await expect(
          facet.execute(
            ethers.utils.formatBytes32String("true"),
            NET_NAME_THIS,
            router.address,
            payload
          )
        ).to.be.revertedWithCustomError(facet, "NotApprovedByGateway");
      });

      it("reverts if the call didn't originate from the expected chain", async function () {
        const action: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: NET_NAME_THAT,
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: vault.interface.getSighash("deposit"),
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: 1,
          liqAmt: 1,
          status: VaultActionStatus.UNPROCESSED,
        };
        const payload = packActionData(action);
        const returnedAction = convertVaultActionStructToArray(action);
        const unexpectedChain = "NotThis";

        await expect(
          facet.execute(
            ethers.utils.formatBytes32String("true"),
            unexpectedChain,
            router.address,
            payload
          )
        )
          .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
          .withArgs(returnedAction, unexpectedChain, router.address);
      });

      it("reverts if the call didn't originate from the chain's router", async function () {
        const action: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: NET_NAME_THAT,
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: vault.interface.getSighash("deposit"),
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: 1,
          liqAmt: 1,
          status: VaultActionStatus.UNPROCESSED,
        };
        const payload = packActionData(action);
        const returnedAction = convertVaultActionStructToArray(action);
        const notRouter = genWallet().address;

        await expect(
          facet.execute(ethers.utils.formatBytes32String("true"), NET_NAME_THIS, notRouter, payload)
        )
          .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
          .withArgs(returnedAction, NET_NAME_THIS, notRouter);
      });

      it("successfully handles status == FAIL_TOKENS_FALLBACK", async function () {
        const action: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: NET_NAME_THAT,
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: vault.interface.getSighash("deposit"),
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: 1,
          liqAmt: 1,
          status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
        };
        const payload = packActionData(action);
        // const returnedAction = convertVaultActionStructToArray(action);

        await expect(
          facet.execute(
            ethers.utils.formatBytes32String("true"),
            NET_NAME_THIS,
            router.address,
            payload
          )
        ).to.emit(facet, "RefundNeeded");
        // .withArgs(returnedAction);
        // `chai` currently can't deep compare nested arrays in `.withArgs(...)`
        // when checking emitted events
        // see open issue https://github.com/NomicFoundation/hardhat/issues/3833
      });

      [
        VaultActionStatus.FAIL_TOKENS_RETURNED,
        VaultActionStatus.POSITION_EXITED,
        VaultActionStatus.SUCCESS,
        VaultActionStatus.UNPROCESSED,
      ].forEach((vaultActionStatus) => {
        it(`reverts for response status: ${VaultActionStatus[vaultActionStatus]}`, async function () {
          const action: IVaultStrategy.VaultActionDataStruct = {
            destinationChain: NET_NAME_THAT,
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash("deposit"),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: 1,
            liqAmt: 1,
            status: vaultActionStatus,
          };
          const payload = packActionData(action);
          const returnedAction = convertVaultActionStructToArray(action);
          await expect(
            facet.execute(
              ethers.utils.formatBytes32String("true"),
              NET_NAME_THIS,
              router.address,
              payload
            )
          )
            .to.be.revertedWithCustomError(facet, "UnexpectedResponse")
            .withArgs(returnedAction);
        });
      });
    });

    describe("into _executeWithToken", () => {
      it("reverts if the call was not approved by Axelar gateway", async function () {
        gateway.validateContractCallAndMint.returns(false);

        const payload = packActionData({
          destinationChain: NET_NAME_THAT,
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: vault.interface.getSighash("deposit"),
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: 1,
          liqAmt: 1,
          status: VaultActionStatus.UNPROCESSED,
        });
        await expect(
          facet.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            NET_NAME_THIS,
            owner.address,
            payload,
            await token.symbol(),
            1
          )
        ).to.be.revertedWithCustomError(facet, "NotApprovedByGateway");
      });

      it("reverts if the call didn't originate from the expected chain", async function () {
        const action: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: NET_NAME_THAT,
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: vault.interface.getSighash("deposit"),
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: 1,
          liqAmt: 1,
          status: VaultActionStatus.UNPROCESSED,
        };
        const payload = packActionData(action);
        const returnedAction = convertVaultActionStructToArray(action);
        const unexpectedChain = "NotThis";

        await expect(
          facet.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            unexpectedChain,
            router.address,
            payload,
            await token.symbol(),
            1
          )
        )
          .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
          .withArgs(returnedAction, unexpectedChain, router.address);
      });

      it("reverts if the call didn't originate from the expected chain", async function () {
        const action: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: NET_NAME_THAT,
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: vault.interface.getSighash("deposit"),
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: 1,
          liqAmt: 1,
          status: VaultActionStatus.UNPROCESSED,
        };
        const payload = packActionData(action);
        const returnedAction = convertVaultActionStructToArray(action);
        await expect(
          facet.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            NET_NAME_THAT,
            owner.address,
            payload,
            await token.symbol(),
            1
          )
        )
          .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
          .withArgs(returnedAction, NET_NAME_THAT, owner.address);
      });

      it("reverts if the call didn't originate from the chain's router", async function () {
        const action: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: NET_NAME_THAT,
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: vault.interface.getSighash("deposit"),
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: 1,
          liqAmt: 1,
          status: VaultActionStatus.UNPROCESSED,
        };
        const payload = packActionData(action);
        const returnedAction = convertVaultActionStructToArray(action);
        const notRouter = genWallet().address;

        await expect(
          facet.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            NET_NAME_THIS,
            notRouter,
            payload,
            await token.symbol(),
            1
          )
        )
          .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
          .withArgs(returnedAction, NET_NAME_THIS, notRouter);
      });

      it("succeeds: deposit && FAIL_TOKENS_RETURNED", async function () {
        const action: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: NET_NAME_THAT,
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: vault.interface.getSighash("deposit"),
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.FAIL_TOKENS_RETURNED,
        };
        const payload = packActionData(action);
        await expect(
          facet.executeWithToken(
            ethers.utils.formatBytes32String("true"),
            NET_NAME_THIS,
            router.address,
            payload,
            await token.symbol(),
            1
          )
        ).to.not.be.reverted;
        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(INITIAL_LOCK_BAL + LOCK_AMT);
        expect(liqBal).to.equal(INITIAL_LIQ_BAL + LIQ_AMT);
        const strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(strategyActive).to.be.true;
      });

      const cases: {vaultFunction: keyof IVault["functions"]; vaultStatus: VaultActionStatus}[] = [
        {vaultFunction: "redeem", vaultStatus: VaultActionStatus.SUCCESS},
        {vaultFunction: "redeem", vaultStatus: VaultActionStatus.POSITION_EXITED},
        {vaultFunction: "redeemAll", vaultStatus: VaultActionStatus.SUCCESS},
        {vaultFunction: "redeemAll", vaultStatus: VaultActionStatus.POSITION_EXITED},
      ];
      cases.forEach(({vaultFunction, vaultStatus}) => {
        it(`succeeds: ${vaultFunction} && ${VaultActionStatus[vaultStatus]}`, async function () {
          const action: IVaultStrategy.VaultActionDataStruct = {
            destinationChain: NET_NAME_THAT,
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash(vaultFunction),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: vaultStatus,
          };
          const payload = packActionData(action);

          await expect(
            facet.executeWithToken(
              ethers.utils.formatBytes32String("true"),
              NET_NAME_THIS,
              router.address,
              payload,
              await token.symbol(),
              1
            )
          )
            .to.emit(facet, "EndowmentRedeemed")
            .withArgs(ACCOUNT_ID, vaultStatus);

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(INITIAL_LOCK_BAL + LOCK_AMT);
          expect(liqBal).to.equal(INITIAL_LIQ_BAL + LIQ_AMT);
          const strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive).to.equal(vaultStatus !== VaultActionStatus.POSITION_EXITED);
        });
      });
    });

    // keys of the map are IVault functions, while their respective values are all
    // the VaultActionStatus values for which `_refundFallback` gets triggered
    const caseData: {[key in keyof IVault["functions"]]: VaultActionStatus[]} = {
      deposit: [
        VaultActionStatus.FAIL_TOKENS_FALLBACK,
        VaultActionStatus.POSITION_EXITED,
        VaultActionStatus.SUCCESS,
        VaultActionStatus.UNPROCESSED,
      ],
      getVaultConfig: [
        VaultActionStatus.FAIL_TOKENS_FALLBACK,
        VaultActionStatus.FAIL_TOKENS_RETURNED,
        VaultActionStatus.POSITION_EXITED,
        VaultActionStatus.SUCCESS,
        VaultActionStatus.UNPROCESSED,
      ],
      harvest: [
        VaultActionStatus.FAIL_TOKENS_FALLBACK,
        VaultActionStatus.FAIL_TOKENS_RETURNED,
        VaultActionStatus.POSITION_EXITED,
        VaultActionStatus.SUCCESS,
        VaultActionStatus.UNPROCESSED,
      ],
      redeem: [
        VaultActionStatus.FAIL_TOKENS_FALLBACK,
        VaultActionStatus.FAIL_TOKENS_RETURNED,
        VaultActionStatus.UNPROCESSED,
      ],
      redeemAll: [
        VaultActionStatus.FAIL_TOKENS_FALLBACK,
        VaultActionStatus.FAIL_TOKENS_RETURNED,
        VaultActionStatus.UNPROCESSED,
      ],
      setVaultConfig: [
        VaultActionStatus.FAIL_TOKENS_FALLBACK,
        VaultActionStatus.FAIL_TOKENS_RETURNED,
        VaultActionStatus.POSITION_EXITED,
        VaultActionStatus.SUCCESS,
        VaultActionStatus.UNPROCESSED,
      ],
    };
    Object.entries(caseData).forEach(([vaultFunction, unmatchedStatuses]) => {
      unmatchedStatuses.forEach((vaultStatus) => {
        it(`into _refundFallback succeeds: ${vaultFunction} && ${VaultActionStatus[vaultStatus]}`, async function () {
          const action: IVaultStrategy.VaultActionDataStruct = {
            destinationChain: NET_NAME_THAT,
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: vault.interface.getSighash(vaultFunction),
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: vaultStatus,
          };
          const payload = packActionData(action);
          // const returnedAction = convertVaultActionStructToArray(action);

          const apParams: LocalRegistrarLib.AngelProtocolParamsStruct = {
            ...DEFAULT_AP_PARAMS,
            refundAddr: user.address,
          };
          registrar.getAngelProtocolParams.returns(apParams);

          await expect(
            facet.executeWithToken(
              ethers.utils.formatBytes32String("true"),
              NET_NAME_THIS,
              router.address,
              payload,
              await token.symbol(),
              LOCK_AMT + LIQ_AMT
            )
          ).to.emit(facet, "RefundNeeded");
          // .withArgs(returnedAction);
          // `chai` currently can't deep compare nested arrays in `.withArgs(...)`
          // when checking emitted events
          // see open issue https://github.com/NomicFoundation/hardhat/issues/3833

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(INITIAL_LOCK_BAL);
          expect(liqBal).to.equal(INITIAL_LIQ_BAL);

          const strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive).to.be.true;

          expect(token.transfer).to.have.been.calledWith(apParams.refundAddr, LOCK_AMT + LIQ_AMT);
        });
      });
    });
  });
});
