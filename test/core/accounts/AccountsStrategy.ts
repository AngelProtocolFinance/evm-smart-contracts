import {expect} from "chai";
import hre from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

import {
  TestFacetProxyContract,
  AccountsStrategy,
  AccountsStrategy__factory,
  Registrar,
  DummyERC20,
  DummyGateway,
  DummyRouter,
} from "typechain-types";
import {getSigners} from "utils";
import {
  deployFacetAsProxy,
  deployRegistrarAsProxy,
  deployDummyERC20,
  deployDummyGateway,
  deployDummyRouter,
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_STRATEGY_SELECTOR,
  DEFAULT_ACCOUNTS_CONFIG,
  DEFAULT_NETWORK_INFO,
  DEFAULT_METHOD_SELECTOR,
  DEFAULT_PERMISSIONS_STRUCT,
  DEFAULT_SETTINGS_STRUCT,
  NetworkInfoStruct,
  StrategyApprovalState,
  VaultActionStatus,
} from "test/utils";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";

describe("AccountsStrategy", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;

  before(async function () {
    const {deployer, proxyAdmin, apTeam1} = await getSigners(hre);
    owner = deployer;
    admin = proxyAdmin;
    user = apTeam1;
  });

  describe("upon strategyInvest", async function () {
    let facet: AccountsStrategy;
    let facetImpl: AccountsStrategy;
    let state: TestFacetProxyContract;
    let registrar: Registrar;
    let token: DummyERC20;
    let gateway: DummyGateway;
    let network: NetworkInfoStruct;
    const ACCOUNT_ID = 1;

    before(async function () {
      let Facet = new AccountsStrategy__factory(owner);
      facetImpl = await Facet.deploy();
      registrar = await deployRegistrarAsProxy(owner, admin);

      token = await deployDummyERC20(owner);
      gateway = await deployDummyGateway(owner);
      await gateway.setTestTokenAddress(token.address);

      network = DEFAULT_NETWORK_INFO;
      network.chainId = (await ethers.provider.getNetwork()).chainId;
      network.axelarGateway = gateway.address;
      await registrar.updateNetworkConnections("", network, "post");
    });

    beforeEach(async function () {
      state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
      facet = AccountsStrategy__factory.connect(state.address, owner);
    });

    describe("reverts when", async function () {
      it("the caller is not approved for locked fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        await expect(
          facet.strategyInvest(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", 1, 0, 0)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the caller is not approved for liquid fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        await expect(
          facet.strategyInvest(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR,
            ethers.constants.AddressZero,
            0,
            1,
            0
          )
        ).to.be.revertedWith("Unauthorized");
      });

      it("the strategy is not approved", async function () {
        await state.setEndowmentDetails(1, DEFAULT_CHARITY_ENDOWMENT);
        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await state.setConfig(config);
        await expect(
          facet.strategyInvest(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", 0, 0, 0)
        ).to.be.revertedWith("Strategy is not approved");
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
        await state.setEndowmentDetails(ACCOUNT_ID, endowDetails);

        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await state.setConfig(config);

        await registrar.setStrategyApprovalState(
          DEFAULT_STRATEGY_SELECTOR,
          StrategyApprovalState.APPROVED
        );
        await expect(
          facet.strategyInvest(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", 1, 0, 0)
        ).to.be.revertedWith("Insufficient Balance");
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
        await state.setEndowmentDetails(1, endowDetails);

        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await state.setConfig(config);

        await registrar.setStrategyApprovalState(
          DEFAULT_STRATEGY_SELECTOR,
          StrategyApprovalState.APPROVED
        );
        await expect(
          facet.strategyInvest(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", 0, 1, 0)
        ).to.be.revertedWith("Insufficient Balance");
      });

      it("the token isn't accepted", async function () {
        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await state.setConfig(config);

        await registrar.setStrategyApprovalState(
          DEFAULT_STRATEGY_SELECTOR,
          StrategyApprovalState.APPROVED
        );
        await expect(
          facet.strategyInvest(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", 0, 0, 0)
        ).to.be.revertedWith("Token not approved");
      });
    });

    describe("and calls the local router", async function () {
      let router: DummyRouter;
      let config: AccountStorage.ConfigStruct;
      const LOCK_AMT = 300;
      const LIQ_AMT = 200;

      before(async function () {
        router = await deployDummyRouter(owner);
        network.router = router.address;
        await registrar.updateNetworkConnections("", network, "post");
        await registrar.setStrategyApprovalState(
          DEFAULT_STRATEGY_SELECTOR,
          StrategyApprovalState.APPROVED
        );
        await registrar.setTokenAccepted(token.address, true);
        config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
      });

      beforeEach(async function () {
        await state.setConfig(config);
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
        await state.setEndowmentDetails(ACCOUNT_ID, endowDetails);

        token.mint(facet.address, 1000);
        await state.setEndowmentTokenBalance(ACCOUNT_ID, token.address, 500, 500);
      });

      it("and the response is SUCCESS", async function () {
        await router.setResponseStruct({
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.SUCCESS,
        });

        expect(
          await facet.strategyInvest(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR,
            "TKN",
            LOCK_AMT,
            LIQ_AMT,
            0
          )
        )
          .to.emit(facet, "EndowmentInvested")
          .withArgs(VaultActionStatus.SUCCESS);

        let routerBal = await token.balanceOf(router.address);
        expect(routerBal).to.equal(LOCK_AMT + LIQ_AMT);
        const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
        expect(lockBal).to.equal(500 - LOCK_AMT);
        expect(liqBal).to.equal(500 - LIQ_AMT);
        let strategyActive = await state.getActiveStrategyEndowmentState(
          ACCOUNT_ID,
          DEFAULT_STRATEGY_SELECTOR
        );
        expect(strategyActive);
      });

      it("and the response is anything other than SUCCESS", async function () {
        await router.setResponseStruct({
          destinationChain: "",
          strategyId: DEFAULT_STRATEGY_SELECTOR,
          selector: DEFAULT_METHOD_SELECTOR,
          accountIds: [ACCOUNT_ID],
          token: token.address,
          lockAmt: LOCK_AMT,
          liqAmt: LIQ_AMT,
          status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
        });
        await expect(
          facet.strategyInvest(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", LOCK_AMT, LIQ_AMT, 0)
        )
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
  });

  describe("upon strategyRedeem", async function () {
    let facet: AccountsStrategy;
    let facetImpl: AccountsStrategy;
    let state: TestFacetProxyContract;
    let registrar: Registrar;
    let token: DummyERC20;
    let gateway: DummyGateway;
    let network: NetworkInfoStruct;
    const ACCOUNT_ID = 1;

    before(async function () {
      let Facet = new AccountsStrategy__factory(owner);
      facetImpl = await Facet.deploy();
      registrar = await deployRegistrarAsProxy(owner, admin);

      token = await deployDummyERC20(owner);
      gateway = await deployDummyGateway(owner);
      await gateway.setTestTokenAddress(token.address);

      network = DEFAULT_NETWORK_INFO;
      network.chainId = (await ethers.provider.getNetwork()).chainId;
      network.axelarGateway = gateway.address;
      await registrar.updateNetworkConnections("", network, "post");
    });

    beforeEach(async function () {
      state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
      facet = AccountsStrategy__factory.connect(state.address, owner);
    });

    describe("reverts when", async function () {
      it("the caller is not approved for locked fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        await expect(
          facet.connect(user).strategyRedeem(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", 1, 0, 0)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the caller is not approved for liquid fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        await expect(
          facet.connect(user).strategyRedeem(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR,
            ethers.constants.AddressZero,
            0,
            1,
            0
          )
        ).to.be.revertedWith("Unauthorized");
      });

      it("the strategy is not approved", async function () {
        let endowDetails = DEFAULT_CHARITY_ENDOWMENT;
        endowDetails.owner = owner.address;
        await state.setEndowmentDetails(1, endowDetails);
        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await state.setConfig(config);
        await expect(
          facet.strategyRedeem(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", 0, 0, 0)
        ).to.be.revertedWith("Strategy is not approved");
      });

      describe("and calls the local router", async function () {
        let router: DummyRouter;
        let config: AccountStorage.ConfigStruct;
        const LOCK_AMT = 300;
        const LIQ_AMT = 200;

        before(async function () {
          router = await deployDummyRouter(owner);
          network.router = router.address;
          await registrar.updateNetworkConnections("", network, "post");
          await registrar.setStrategyApprovalState(
            DEFAULT_STRATEGY_SELECTOR,
            StrategyApprovalState.APPROVED
          );
          config = DEFAULT_ACCOUNTS_CONFIG;
          config.registrarContract = registrar.address;
        });

        beforeEach(async function () {
          await state.setConfig(config);
          let endowDetails : AccountStorage.EndowmentStruct = {
            ...DEFAULT_CHARITY_ENDOWMENT, 
            owner: owner.address,
            settingsController: {
              ...DEFAULT_SETTINGS_STRUCT,
              lockedInvestmentManagement: {
                ...DEFAULT_PERMISSIONS_STRUCT,
                delegate: {
                  expires: 0,
                  addr: user.address
                },
              },
              liquidInvestmentManagement: {
                ...DEFAULT_PERMISSIONS_STRUCT,
                delegate: {
                  expires: 0,
                  addr: user.address
                },
              },
            },
          };
          await state.setEndowmentDetails(ACCOUNT_ID, endowDetails);

          token.mint(facet.address, LOCK_AMT + LIQ_AMT);
          await state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true);
        });

        it("and the response is SUCCESS", async function () {
          await router.setResponseStruct({
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.SUCCESS,
          });

          expect(
            await facet.strategyRedeem(
              ACCOUNT_ID,
              DEFAULT_STRATEGY_SELECTOR,
              "TKN",
              LOCK_AMT,
              LIQ_AMT,
              0
            )
          )
            .to.emit(facet, "EndowmentRedeemed")
            .withArgs(VaultActionStatus.SUCCESS);

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(LOCK_AMT);
          expect(liqBal).to.equal(LIQ_AMT);
          let strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(strategyActive);
        });

        it("and the response is POSITION_EXITED", async function () {
          await router.setResponseStruct({
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.POSITION_EXITED,
          });

          expect(
            await facet.strategyRedeem(
              ACCOUNT_ID,
              DEFAULT_STRATEGY_SELECTOR,
              "TKN",
              LOCK_AMT,
              LIQ_AMT,
              0
            )
          )
            .to.emit(facet, "EndowmentRedeemed")
            .withArgs(VaultActionStatus.POSITION_EXITED);

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(LOCK_AMT);
          expect(liqBal).to.equal(LIQ_AMT);
          let strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(!strategyActive);
        });

        it("and the response is anything else", async function () {
          await router.setResponseStruct({
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
          });
          await expect(
            facet.strategyRedeem(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", LOCK_AMT, LIQ_AMT, 0)
          )
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
    });
  });

  describe("upon strategyRedeemAll", async function () {
    let facet: AccountsStrategy;
    let facetImpl: AccountsStrategy;
    let state: TestFacetProxyContract;
    let registrar: Registrar;
    let token: DummyERC20;
    let gateway: DummyGateway;
    let network: NetworkInfoStruct;
    const ACCOUNT_ID = 1;

    before(async function () {
      let Facet = new AccountsStrategy__factory(owner);
      facetImpl = await Facet.deploy();
      registrar = await deployRegistrarAsProxy(owner, admin);

      token = await deployDummyERC20(owner);
      gateway = await deployDummyGateway(owner);
      await gateway.setTestTokenAddress(token.address);

      network = DEFAULT_NETWORK_INFO;
      network.chainId = (await ethers.provider.getNetwork()).chainId;
      network.axelarGateway = gateway.address;
      await registrar.updateNetworkConnections("", network, "post");
    });

    beforeEach(async function () {
      state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
      facet = AccountsStrategy__factory.connect(state.address, owner);
    });

    describe("reverts when", async function () {
      it("the caller is not approved for locked nor liquid fund mgmt", async function () {
        await state.setEndowmentDetails(ACCOUNT_ID, DEFAULT_CHARITY_ENDOWMENT);
        await expect(
          facet.connect(user).strategyRedeemAll(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", 0)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the strategy is not approved", async function () {
        let endowDetails : AccountStorage.EndowmentStruct = {
          ...DEFAULT_CHARITY_ENDOWMENT, 
          owner: owner.address,
          settingsController: {
            ...DEFAULT_SETTINGS_STRUCT,
            lockedInvestmentManagement: {
              ...DEFAULT_PERMISSIONS_STRUCT,
              delegate: {
                expires: 0,
                addr: user.address
              },
            },
            liquidInvestmentManagement: {
              ...DEFAULT_PERMISSIONS_STRUCT,
              delegate: {
                expires: 0,
                addr: user.address
              },
            },
          },
        };
        await state.setEndowmentDetails(1, endowDetails);
        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await state.setConfig(config);
        await expect(
          facet.strategyRedeemAll(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", 0)
        ).to.be.revertedWith("Strategy is not approved");
      });

      describe("and calls the local router", async function () {
        let router: DummyRouter;
        let config: AccountStorage.ConfigStruct;
        const LOCK_AMT = 300;
        const LIQ_AMT = 200;

        before(async function () {
          router = await deployDummyRouter(owner);
          network.router = router.address;
          await registrar.updateNetworkConnections("", network, "post");
          await registrar.setStrategyApprovalState(
            DEFAULT_STRATEGY_SELECTOR,
            StrategyApprovalState.APPROVED
          );
          config = DEFAULT_ACCOUNTS_CONFIG;
          config.registrarContract = registrar.address;
        });

        beforeEach(async function () {
          await state.setConfig(config);
          let endowDetails : AccountStorage.EndowmentStruct = {
            ...DEFAULT_CHARITY_ENDOWMENT, 
            owner: owner.address,
            settingsController: {
              ...DEFAULT_SETTINGS_STRUCT,
              lockedInvestmentManagement: {
                ...DEFAULT_PERMISSIONS_STRUCT,
                delegate: {
                  expires: 0,
                  addr: user.address
                },
              },
              liquidInvestmentManagement: {
                ...DEFAULT_PERMISSIONS_STRUCT,
                delegate: {
                  expires: 0,
                  addr: user.address
                },
              },
            },
          };
          await state.setEndowmentDetails(ACCOUNT_ID, endowDetails);

          token.mint(facet.address, LOCK_AMT + LIQ_AMT);
          await state.setActiveStrategyEndowmentState(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, true);
        });

        it("and the response is POSITION_EXITED", async function () {
          await router.setResponseStruct({
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.POSITION_EXITED,
          });

          expect(
            await facet.strategyRedeemAll(
              ACCOUNT_ID,
              DEFAULT_STRATEGY_SELECTOR,
              "TKN",
              0
            )
          )
            .to.emit(facet, "EndowmentRedeemed")
            .withArgs(VaultActionStatus.POSITION_EXITED);

          const [lockBal, liqBal] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
          expect(lockBal).to.equal(LOCK_AMT);
          expect(liqBal).to.equal(LIQ_AMT);
          let strategyActive = await state.getActiveStrategyEndowmentState(
            ACCOUNT_ID,
            DEFAULT_STRATEGY_SELECTOR
          );
          expect(!strategyActive);
        });

        it("and the response is anything else", async function () {
          await router.setResponseStruct({
            destinationChain: "",
            strategyId: DEFAULT_STRATEGY_SELECTOR,
            selector: DEFAULT_METHOD_SELECTOR,
            accountIds: [ACCOUNT_ID],
            token: token.address,
            lockAmt: LOCK_AMT,
            liqAmt: LIQ_AMT,
            status: VaultActionStatus.FAIL_TOKENS_FALLBACK,
          });
          await expect(
            facet.strategyRedeem(ACCOUNT_ID, DEFAULT_STRATEGY_SELECTOR, "TKN", LOCK_AMT, LIQ_AMT, 0)
          )
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
    });
  });
});
