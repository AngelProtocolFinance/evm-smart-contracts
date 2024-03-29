import {FakeContract, smock} from "@defi-wonderland/smock";
import {expect, use} from "chai";
import {Signer} from "ethers";
import {SnapshotRestorer, takeSnapshot} from "@nomicfoundation/hardhat-network-helpers";
import hre from "hardhat";
import {
  DEFAULT_ACCOUNTS_CONFIG,
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_PERMISSIONS_STRUCT,
  DEFAULT_SETTINGS_STRUCT,
  wait,
} from "test/utils";
import {
  AccountsGasManager,
  AccountsGasManager__factory,
  GasFwd,
  GasFwd__factory,
  IERC20,
  IERC20__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {VaultType} from "types";
import {getProxyAdminOwner, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";

use(smock.matchers);

describe("AccountsGasManager", function () {
  const ACCOUNT_ID = 1;
  const BALANCE = 1000;
  const GAS_COST = 400;

  let owner: Signer;
  let proxyAdmin: Signer;
  let user: Signer;

  let facet: AccountsGasManager;
  let state: TestFacetProxyContract;

  let token: FakeContract<IERC20>;
  let gasFwd: FakeContract<GasFwd>;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.deployer;
    user = signers.apTeam1;

    proxyAdmin = await getProxyAdminOwner(hre);

    const Facet = new AccountsGasManager__factory(owner);
    const facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    facet = AccountsGasManager__factory.connect(state.address, owner);

    token = await smock.fake<IERC20>(IERC20__factory.createInterface());
    gasFwd = await smock.fake<GasFwd>(new GasFwd__factory());

    let config = {
      ...DEFAULT_ACCOUNTS_CONFIG,
      owner: await owner.getAddress(),
    };
    await wait(state.setConfig(config));

    let endowment = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      owner: await user.getAddress(),
      gasFwd: gasFwd.address,
    };
    await wait(state.setEndowmentDetails(ACCOUNT_ID, endowment));
  });

  let snapshot: SnapshotRestorer;

  beforeEach(async () => {
    snapshot = await takeSnapshot();

    token.transfer.returns(true);
    token.transferFrom.returns(true);

    gasFwd.sweep.returns(BALANCE);
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("upon `sweepForClosure`", async function () {
    it("reverts if not called by self", async function () {
      await expect(facet.sweepForClosure(ACCOUNT_ID, token.address)).to.be.revertedWithCustomError(
        facet,
        "OnlyAccountsContract"
      );
    });

    it("calls the sweep method", async function () {
      let calldata = facet.interface.encodeFunctionData("sweepForClosure", [
        ACCOUNT_ID,
        token.address,
      ]);
      await expect(state.callSelf(0, calldata)).to.not.be.reverted;

      expect(gasFwd.sweep).to.have.been.calledWith(token.address);
    });
  });

  describe("upon `sweepForEndowment`", async function () {
    it("reverts if not called by admin", async function () {
      await expect(
        facet.connect(user).sweepForEndowment(ACCOUNT_ID, VaultType.LOCKED, token.address)
      ).to.be.revertedWithCustomError(facet, "OnlyAdmin");
    });

    it("calls the sweep method and updates the appropriate balance", async function () {
      await expect(
        facet.connect(owner).sweepForEndowment(ACCOUNT_ID, VaultType.LIQUID, token.address)
      ).to.not.be.reverted;

      expect(gasFwd.sweep).to.have.been.calledWith(token.address);

      const [locked, liquid] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(liquid).to.equal(BALANCE);
      expect(locked).to.equal(0);
    });
  });

  describe("upon `addGas`", async function () {
    it("reverts if not called by an approved caller", async function () {
      await expect(
        facet.connect(owner).addGas(ACCOUNT_ID, VaultType.LOCKED, token.address, GAS_COST)
      ).to.be.revertedWithCustomError(facet, "Unauthorized");
    });

    it("allows a locked investment manager to call", async function () {
      let lockedPerms = {
        ...DEFAULT_PERMISSIONS_STRUCT,
        delegate: {
          addr: await user.getAddress(),
          expires: 0,
        },
      };

      let endowment = {
        ...DEFAULT_CHARITY_ENDOWMENT,
        gasFwd: gasFwd.address,
        settingsController: {
          ...DEFAULT_SETTINGS_STRUCT,
          lockedInvestmentManagement: lockedPerms,
        },
      };
      await wait(state.setEndowmentDetails(ACCOUNT_ID, endowment));
      await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, token.address, BALANCE, BALANCE));

      await expect(
        facet.connect(user).addGas(ACCOUNT_ID, VaultType.LOCKED, token.address, GAS_COST)
      ).to.not.be.reverted;

      const [locked, liquid] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(locked).to.equal(BALANCE - GAS_COST);
      expect(liquid).to.equal(BALANCE);
    });

    it("allows a liquid investment manager to call", async function () {
      let liquidPerms = {
        ...DEFAULT_PERMISSIONS_STRUCT,
        delegate: {
          addr: await user.getAddress(),
          expires: 0,
        },
      };

      let endowment = {
        ...DEFAULT_CHARITY_ENDOWMENT,
        gasFwd: gasFwd.address,
        settingsController: {
          ...DEFAULT_SETTINGS_STRUCT,
          liquidInvestmentManagement: liquidPerms,
        },
      };
      await wait(state.setEndowmentDetails(ACCOUNT_ID, endowment));
      await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, token.address, BALANCE, BALANCE));

      await expect(
        facet.connect(user).addGas(ACCOUNT_ID, VaultType.LIQUID, token.address, GAS_COST)
      ).to.not.be.reverted;

      const [locked, liquid] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(locked).to.equal(BALANCE);
      expect(liquid).to.equal(BALANCE - GAS_COST);
    });

    it("allows the owner to call", async function () {
      let endowment = {
        ...DEFAULT_CHARITY_ENDOWMENT,
        owner: await user.getAddress(),
        gasFwd: gasFwd.address,
      };
      await wait(state.setEndowmentDetails(ACCOUNT_ID, endowment));
      await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, token.address, BALANCE, BALANCE));

      await expect(
        facet.connect(user).addGas(ACCOUNT_ID, VaultType.LIQUID, token.address, GAS_COST)
      ).to.not.be.reverted;

      const [locked, liquid] = await state.getEndowmentTokenBalance(ACCOUNT_ID, token.address);
      expect(locked).to.equal(BALANCE);
      expect(liquid).to.equal(BALANCE - GAS_COST);
    });
  });
});
