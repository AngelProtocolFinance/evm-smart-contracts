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
import {
  AccountMessages,
  IVault as IVaultStrategy,
} from "typechain-types/contracts/core/accounts/facets/AccountsStrategy";
import {LocalRegistrarLib} from "typechain-types/contracts/core/registrar/LocalRegistrar";

use(smock.matchers);

describe("AccountsStrategy", function () {
  const {ethers} = hre;

  const ACCOUNT_ID = 1;

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
    registrar.queryNetworkConnection.whenCalledWith(NET_NAME_THIS).returns(netInfoThis);
    registrar.queryNetworkConnection.whenCalledWith(NET_NAME_THAT).returns(netInfoThat);
  });

  beforeEach(async function () {
    state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
    facet = AccountsStrategy__factory.connect(state.address, owner);

    const config: AccountStorage.ConfigStruct = {
      ...DEFAULT_ACCOUNTS_CONFIG,
      networkName: NET_NAME_THIS,
      registrarContract: registrar.address,
    };
    await state.setConfig(config);

    registrar.isTokenAccepted.returns(true);
  });

  describe("upon strategyInvest", async function () {
    beforeEach(() => {
      const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
        ...DEFAULT_STRATEGY_PARAMS,
        network: NET_NAME_THIS,
        approvalState: StrategyApprovalState.APPROVED,
      };
      registrar.getStrategyParamsById.returns(stratParams);
    });

    describe("reverts when", async function () {
      it("the caller is not approved for locked fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: 1,
        };
        await expect(
          facet.connect(user).strategyInvest(ACCOUNT_ID, investRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the caller is not approved for liquid fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
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
          approvalState: StrategyApprovalState.NOT_APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);

        await wait(state.setEndowmentDetails(1, DEFAULT_CHARITY_ENDOWMENT));
        await expect(facet.strategyInvest(ACCOUNT_ID, DEFAULT_INVEST_REQUEST)).to.be.revertedWith(
          "Strategy is not approved"
        );
      });

      it("the account locked balance is insufficient", async function () {
        const endowDetails: AccountStorage.EndowmentStruct = {
          ...DEFAULT_CHARITY_ENDOWMENT,
          settingsController: {
            ...DEFAULT_CHARITY_ENDOWMENT.settingsController,
            lockedInvestmentManagement: {
              locked: false,
              delegate: {
                addr: owner.address,
                expires: 0,
              },
            },
          },
        };
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: 1,
        };
        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest)).to.be.revertedWith(
          "Insufficient Balance"
        );
      });

      it("the account liquid balance is insufficient", async function () {
        const endowDetails: AccountStorage.EndowmentStruct = {
          ...DEFAULT_CHARITY_ENDOWMENT,
          settingsController: {
            ...DEFAULT_CHARITY_ENDOWMENT.settingsController,
            liquidInvestmentManagement: {
              locked: false,
              delegate: {
                addr: owner.address,
                expires: 0,
              },
            },
          },
        };
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          liquidAmt: 1,
        };
        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest)).to.be.revertedWith(
          "Insufficient Balance"
        );
      });

      it("the token isn't accepted", async function () {
        registrar.isTokenAccepted.returns(false);

        await expect(facet.strategyInvest(ACCOUNT_ID, DEFAULT_INVEST_REQUEST)).to.be.revertedWith(
          "Token not approved"
        );
      });
    });

    describe("and calls the local router", async function () {
      beforeEach(async function () {
        const endowDetails: AccountStorage.EndowmentStruct = {
          ...DEFAULT_CHARITY_ENDOWMENT,
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
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        token.transfer.whenCalledWith(router.address, LIQ_AMT + LOCK_AMT).returns(true);
        await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, token.address, 500, 500));

        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THIS,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      it("and the response is SUCCESS", async function () {
        const vaultActionData: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.SUCCESS,
        };
        router.executeWithTokenLocal.returns(vaultActionData);

        const investRequest: AccountMessages.InvestRequestStruct = {
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
        const strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(strategyActive).to.be.true;
      });

      it("and the response is anything other than SUCCESS", async function () {
        const vaultActionData: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
        };
        router.executeWithTokenLocal.returns(vaultActionData);

        const investRequest: AccountMessages.InvestRequestStruct = {
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
        const strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(!strategyActive);
      });
    });

    describe("and calls axelar GMP", async function () {
      const INITIAL_LOCK_BAL = 500;
      const INITIAL_LIQ_BAL = 500;

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

        await wait(
          state.setEndowmentTokenBalance(
            ACCOUNT_ID,
            token.address,
            INITIAL_LOCK_BAL,
            INITIAL_LIQ_BAL
          )
        );

        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THAT,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      it("makes all the correct external calls", async function () {
        const investRequest: AccountMessages.InvestRequestStruct = {
          ...DEFAULT_INVEST_REQUEST,
          lockAmt: LOCK_AMT,
          liquidAmt: LIQ_AMT,
          gasFee: GAS_FEE,
        };

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

        await expect(facet.strategyInvest(ACCOUNT_ID, investRequest)).to.not.be.reverted;

        expect(gasFwd.payForGas).to.have.been.calledWith(token.address, investRequest.gasFee);
        expect(token.approve).to.have.been.calledWith(gasService.address, investRequest.gasFee);
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
  });

  describe("upon strategyRedeem", async function () {
    describe("reverts when", async function () {
      it("the caller is not approved for locked fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        const redeemRequest = {
          ...DEFAULT_REDEEM_REQUEST,
          lockAmt: 1,
        };
        await expect(
          facet.connect(user).strategyRedeem(ACCOUNT_ID, redeemRequest)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the caller is not approved for liquid fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        const redeemRequest = {
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
          approvalState: StrategyApprovalState.NOT_APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
        const endowDetails = {
          ...DEFAULT_CHARITY_ENDOWMENT,
          owner: owner.address,
        };
        await wait(state.setEndowmentDetails(1, endowDetails));
        await expect(facet.strategyRedeem(ACCOUNT_ID, DEFAULT_REDEEM_REQUEST)).to.be.revertedWith(
          "Strategy is not approved"
        );
      });
    });

    describe("and calls the local router", async function () {
      const redeemRequest: AccountMessages.RedeemRequestStruct = {
        ...DEFAULT_REDEEM_REQUEST,
        lockAmt: LOCK_AMT,
        liquidAmt: LIQ_AMT,
      };

      beforeEach(async function () {
        const endowDetails: AccountStorage.EndowmentStruct = {
          ...DEFAULT_CHARITY_ENDOWMENT,
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
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        await wait(
          state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true)
        );

        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THIS,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

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

          await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest))
            .to.emit(facet, "EndowmentRedeemed")
            .withArgs(vaultStatus);

          expect(router.executeLocal).to.have.been.calledWith(
            NET_NAME_THIS,
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
          expect(strategyActive).to.equal(vaultStatus === VaultActionStatus.SUCCESS);
        });
      });

      it("and the response is anything else", async function () {
        const vaultActionData: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
        };
        router.executeLocal.returns(vaultActionData);

        await expect(facet.strategyRedeem(ACCOUNT_ID, redeemRequest))
          .to.be.revertedWithCustomError(facet, "RedeemFailed")
          .withArgs(VaultActionStatus.FAIL_TOKENS_FALLBACK);

        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(0);
        expect(liqBal).to.equal(0);
        const strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(strategyActive);
      });
    });

    describe("and calls axelar GMP", async function () {
      let endowDetails: AccountStorage.EndowmentStruct;

      beforeEach(async function () {
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
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THAT,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      it("makes all the correct external calls", async function () {
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

        token.approve.returns(true);

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
      });
    });
  });

  describe("upon strategyRedeemAll", async function () {
    describe("reverts when", async function () {
      it("the caller is not approved for locked nor liquid fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        await expect(
          facet.connect(user).strategyRedeemAll(ACCOUNT_ID, DEFAULT_REDEEM_ALL_REQUEST)
        ).to.be.revertedWith("Must redeem at least one of Locked/Liquid");
      });
      it("the caller is not approved for locked fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
        const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLocked: true,
        };
        await expect(
          facet.connect(user).strategyRedeemAll(ACCOUNT_ID, redeemAllRequest)
        ).to.be.revertedWith("Unauthorized");
      });
      it("the caller is not approved for liquid fund mgmt", async function () {
        await wait(state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT));
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
          approvalState: StrategyApprovalState.NOT_APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);

        const endowDetails: AccountStorage.EndowmentStruct = {
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
        const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLiquid: true,
        };
        await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest)).to.be.revertedWith(
          "Strategy is not approved"
        );
      });
    });

    describe("and calls the local router", async function () {
      const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
        ...DEFAULT_REDEEM_ALL_REQUEST,
        redeemLocked: true,
        redeemLiquid: true,
      };

      beforeEach(async function () {
        const endowDetails: AccountStorage.EndowmentStruct = {
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

        await wait(
          state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true)
        );

        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THIS,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      it("and the response is POSITION_EXITED", async function () {
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
          .withArgs(VaultActionStatus.POSITION_EXITED);

        expect(router.executeLocal).to.have.been.calledWith(
          NET_NAME_THIS,
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
        expect(strategyActive).to.be.false;
      });

      it("and the response is anything else", async function () {
        const vaultActionData: IVaultStrategy.VaultActionDataStruct = {
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
        };
        router.executeLocal.returns(vaultActionData);

        await expect(facet.strategyRedeemAll(ACCOUNT_ID, redeemAllRequest))
          .to.be.revertedWithCustomError(facet, "RedeemAllFailed")
          .withArgs(VaultActionStatus.FAIL_TOKENS_FALLBACK);

        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(0);
        expect(liqBal).to.equal(0);
        const strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(strategyActive);
      });
    });

    describe("and calls axelar GMP", async function () {
      let endowDetails: AccountStorage.EndowmentStruct;

      beforeEach(async function () {
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
        await wait(state.setEndowmentDetails(ACCOUNT_ID, endowDetails));

        const stratParams: LocalRegistrarLib.StrategyParamsStruct = {
          ...DEFAULT_STRATEGY_PARAMS,
          network: NET_NAME_THAT,
          approvalState: StrategyApprovalState.APPROVED,
        };
        registrar.getStrategyParamsById.returns(stratParams);
      });

      it("makes all the correct external calls", async function () {
        const redeemAllRequest: AccountMessages.RedeemAllRequestStruct = {
          ...DEFAULT_REDEEM_ALL_REQUEST,
          redeemLocked: true,
          redeemLiquid: true,
          gasFee: GAS_FEE,
        };

        gasFwd.payForGas.returns(GAS_FEE);
        token.approve.returns(true);

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
      });
    });
  });

  describe("upon axelar callback", async function () {
    it("reverts in _execute if the call didn't originate from the expected chain", async function () {
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
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      await expect(
        facet.execute(ethers.utils.formatBytes32String("true"), "NotNet", owner.address, payload)
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
        .withArgs(returnedAction, "NotNet", owner.address);
    });

    it("reverts in _executeWithToken if the call didn't originate from the expected chain", async function () {
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
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      await expect(
        facet.execute(
          ethers.utils.formatBytes32String("true"),
          NET_NAME_THAT,
          owner.address,
          payload
        )
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
        .withArgs(returnedAction, NET_NAME_THAT, owner.address);
    });

    it("reverts in _executeWithToken if the call didn't originate from the expected chain", async function () {
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
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      await expect(
        facet.executeWithToken(
          ethers.utils.formatBytes32String("true"),
          NET_NAME_THAT,
          owner.address,
          payload,
          "TKN",
          1
        )
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedCaller")
        .withArgs(returnedAction, NET_NAME_THAT, owner.address);
    });

    it("_execute successfully handles status == FAIL_TOKENS_FALLBACK", async function () {
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
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      expect(
        await facet.execute(
          ethers.utils.formatBytes32String("true"),
          NET_NAME_THAT,
          router.address,
          payload
        )
      )
        .to.emit(facet, "RefundNeeded")
        .withArgs(returnedAction);
    });

    it("_execute reverts for any other status", async function () {
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
      const payload = packActionData(action, hre);
      const returnedAction = convertVaultActionStructToArray(action);
      await expect(
        facet.execute(
          ethers.utils.formatBytes32String("true"),
          NET_NAME_THAT,
          router.address,
          payload
        )
      )
        .to.be.revertedWithCustomError(facet, "UnexpectedResponse")
        .withArgs(returnedAction);
    });

    it("_executeWithToken: deposit && FAIL_TOKENS_RETURNED", async function () {
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
      const payload = packActionData(action, hre);
      await facet.executeWithToken(
        ethers.utils.formatBytes32String("true"),
        NET_NAME_THAT,
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
      const action: IVaultStrategy.VaultActionDataStruct = {
        destinationChain: NET_NAME_THAT,
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
        NET_NAME_THAT,
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
      const action: IVaultStrategy.VaultActionDataStruct = {
        destinationChain: NET_NAME_THAT,
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
        NET_NAME_THAT,
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
      const action: IVaultStrategy.VaultActionDataStruct = {
        destinationChain: NET_NAME_THAT,
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
        NET_NAME_THAT,
        router.address,
        payload,
        "TKN",
        1
      );
      const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(lockBal).to.equal(LOCK_AMT);
      expect(liqBal).to.equal(LIQ_AMT);
      const strategyActive = await state.getActiveStrategyEndowmentState(
        ACCOUNT_ID,
        DEFAULT_STRATEGY_SELECTOR
      );
      expect(strategyActive).to.be.false;
    });

    it("_executeWithToken: redeemAll && POSITION_EXITED", async function () {
      const action: IVaultStrategy.VaultActionDataStruct = {
        destinationChain: NET_NAME_THAT,
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
        NET_NAME_THAT,
        router.address,
        payload,
        "TKN",
        1
      );
      const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(lockBal).to.equal(LOCK_AMT);
      expect(liqBal).to.equal(LIQ_AMT);
      const strategyActive = await state.getActiveStrategyEndowmentState(
        ACCOUNT_ID,
        DEFAULT_STRATEGY_SELECTOR
      );
      expect(!strategyActive);
    });

    it("_refundFallback", async function () {
      const action: IVaultStrategy.VaultActionDataStruct = {
        destinationChain: NET_NAME_THAT,
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

      const apParams: LocalRegistrarLib.AngelProtocolParamsStruct = {
        ...DEFAULT_AP_PARAMS,
        refundAddr: user.address,
      };
      registrar.getAngelProtocolParams.returns(apParams);

      expect(
        await facet.executeWithToken(
          ethers.utils.formatBytes32String("true"),
          NET_NAME_THAT,
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
      const userBal = await token.balanceOf(user.address);
      expect(userBal).to.equal(LOCK_AMT + LIQ_AMT);
    });
  });
});
