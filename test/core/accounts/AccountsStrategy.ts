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
} from "typechain-types";
import {getSigners} from "utils";
import {
  deployFacetAsProxy,
  deployRegistrarAsProxy,
  deployDummyERC20,
  deployDummyGateway,
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_STRATEGY_SELECTOR,
  DEFAULT_ACCOUNTS_CONFIG,
  DEFAULT_NETWORK_INFO,
} from "test/utils";

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

    before(async function () {
      let Facet = new AccountsStrategy__factory(owner);
      facetImpl = await Facet.deploy();
      registrar = await deployRegistrarAsProxy(owner, admin);

      token = await deployDummyERC20(owner);
      gateway = await deployDummyGateway(owner);
      await gateway.setTestTokenAddress(token.address);

      let network = DEFAULT_NETWORK_INFO;
      network.chainId = (await ethers.provider.getNetwork()).chainId;
      network.axelarGateway = gateway.address;
      await registrar.updateNetworkConnections(network, "post");
    });

    beforeEach(async function () {
      state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
      facet = AccountsStrategy__factory.connect(state.address, owner);
    });

    describe("reverts when", async function () {
      it("the caller is not approved for locked fund mgmt", async function () {
        await state.setEndowmentDetails(1, DEFAULT_CHARITY_ENDOWMENT);
        await expect(
          facet.strategyInvest(1, DEFAULT_STRATEGY_SELECTOR, "TKN", 1, 0)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the caller is not approved for liquid fund mgmt", async function () {
        await state.setEndowmentDetails(1, DEFAULT_CHARITY_ENDOWMENT);
        await expect(
          facet.strategyInvest(1, DEFAULT_STRATEGY_SELECTOR, ethers.constants.AddressZero, 0, 1)
        ).to.be.revertedWith("Unauthorized");
      });

      it("the strategy is not approved", async function () {
        await state.setEndowmentDetails(1, DEFAULT_CHARITY_ENDOWMENT);
        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await state.setConfig(config);
        await expect(
          facet.strategyInvest(1, DEFAULT_STRATEGY_SELECTOR, "TKN", 0, 0)
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
        await state.setEndowmentDetails(1, endowDetails);

        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await state.setConfig(config);

        await registrar.setStrategyApprovalState(DEFAULT_STRATEGY_SELECTOR, 1); // 1 = APPROVED
        await expect(
          facet.strategyInvest(1, DEFAULT_STRATEGY_SELECTOR, "TKN", 1, 0)
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

        await registrar.setStrategyApprovalState(DEFAULT_STRATEGY_SELECTOR, 1); // 1 = APPROVED
        await expect(
          facet.strategyInvest(1, DEFAULT_STRATEGY_SELECTOR, "TKN", 0, 1)
        ).to.be.revertedWith("Insufficient Balance");
      });

      it("the token isn't accepted", async function () {
        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
        await state.setConfig(config);

        await registrar.setStrategyApprovalState(DEFAULT_STRATEGY_SELECTOR, 1); // 1 = APPROVED
        await expect(
          facet.strategyInvest(1, DEFAULT_STRATEGY_SELECTOR, "TKN", 0, 0)
        ).to.be.revertedWith("Token not approved");
      });
    });

    describe("and calls the router", async function () {
      before(async function () {
        await registrar.setStrategyApprovalState(DEFAULT_STRATEGY_SELECTOR, 1);
      });
      beforeEach(async function () {
        let config = DEFAULT_ACCOUNTS_CONFIG;
        config.registrarContract = registrar.address;
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
        await state.setEndowmentDetails(1, endowDetails);
      });
    });
  });

  describe("upon strategyRedeem", async function () {
    let facet: AccountsStrategy;
    let state: TestFacetProxyContract;

    beforeEach(async function () {
      let Facet = new AccountsStrategy__factory(owner);
      let facetImpl = await Facet.deploy();
      state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
      facet = AccountsStrategy__factory.connect(state.address, owner);
    });
  });

  describe("upon strategyRedeemAll", async function () {
    let facet: AccountsStrategy;
    let state: TestFacetProxyContract;

    beforeEach(async function () {
      let Facet = new AccountsStrategy__factory(owner);
      let facetImpl = await Facet.deploy();
      state = await deployFacetAsProxy(hre, owner, admin, facetImpl.address);
      facet = AccountsStrategy__factory.connect(state.address, owner);
    });
  });
});
