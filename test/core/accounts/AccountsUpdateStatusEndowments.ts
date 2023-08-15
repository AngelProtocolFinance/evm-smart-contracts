import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_REGISTRAR_CONFIG,
  DEFAULT_STRATEGY_SELECTOR,
} from "test/utils";
import {
  AccountsUpdateStatusEndowments,
  AccountsUpdateStatusEndowments__factory,
  IIndexFund,
  IndexFund,
  IndexFund__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {LibAccounts} from "typechain-types/contracts/core/accounts/facets/AccountsUpdateStatusEndowments";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";

use(smock.matchers);

describe("AccountsUpdateStatusEndowments", function () {
  const {ethers} = hre;

  const accountId = 1;
  const beneficiary: LibAccounts.BeneficiaryStruct = {
    enumData: 0,
    data: {addr: genWallet().address, endowId: accountId},
  };
  const strategies = ["strategy1", "strategy2", "strategy3"].map(
    (x) => ethers.utils.id(x).slice(0, 10) // map to bytes4 selectors
  );

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;

  let facet: AccountsUpdateStatusEndowments;
  let state: TestFacetProxyContract;

  let endowment: AccountStorage.EndowmentStruct;
  let treasuryAddress: string;

  let registrarFake: FakeContract<Registrar>;
  let indexFundFake: FakeContract<IndexFund>;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;
    treasuryAddress = signers.apTeam2.address;

    endowment = {...DEFAULT_CHARITY_ENDOWMENT, owner: endowOwner.address};
  });

  beforeEach(async function () {
    let Facet = new AccountsUpdateStatusEndowments__factory(accOwner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);

    indexFundFake = await smock.fake<IndexFund>(new IndexFund__factory(), {
      address: genWallet().address,
    });
    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
    });

    const config: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      indexFundContract: indexFundFake.address,
      treasury: treasuryAddress,
    };
    registrarFake.queryConfig.returns(config);

    registrarFake.queryAllStrategies.returns(strategies);

    await state.setEndowmentDetails(accountId, endowment);
    await state.setConfig({
      owner: accOwner.address,
      version: "1",
      networkName: "Polygon",
      registrarContract: registrarFake.address,
      nextAccountId: accountId + 1,
      reentrancyGuardLocked: false,
    });

    facet = AccountsUpdateStatusEndowments__factory.connect(state.address, endowOwner);
  });

  describe("upon closeEndowmment", async function () {
    it("reverts if the caller is not the owner of the endowment", async () => {
      await expect(
        facet.connect(accOwner).closeEndowment(accountId, beneficiary)
      ).to.be.revertedWith("Unauthorized");
    });

    it("reverts if the endowment is already closed", async () => {
      await state.setClosingEndowmentState(accountId, true, beneficiary);
      await expect(facet.closeEndowment(accountId, beneficiary)).to.be.revertedWith(
        "Endowment is closed"
      );
    });

    it("reverts if the endowment has active strategies", async () => {
      await state.setActiveStrategyEndowmentState(accountId, strategies[0], true);
      await expect(facet.closeEndowment(accountId, beneficiary)).to.be.revertedWith(
        "Not fully exited"
      );
    });

    it("removes the closing endowment from all index funds it is involved in", async () => {
      await expect(
        facet.closeEndowment(accountId, beneficiary, {
          gasPrice: 100000000,
          gasLimit: 30000000,
        })
      )
        .to.emit(facet, "EndowmentClosed")
        .withArgs(accountId);

      const endowState = await state.getClosingEndowmentState(accountId);
      expect(endowState[0]).to.equal(true);
      expect(endowState[1].enumData).to.equal(beneficiary.enumData);
      expect(endowState[1].data.addr).to.equal(beneficiary.data.addr);
      expect(endowState[1].data.endowId).to.equal(beneficiary.data.endowId);
    });

    it("updates the beneficiary to the treasury address if the beneficiary is set to 'None'", async () => {
      indexFundFake.queryInvolvedFunds.returns([]);
      const beneficiaryNone: LibAccounts.BeneficiaryStruct = {...beneficiary, enumData: 3};

      await expect(
        facet.closeEndowment(accountId, beneficiaryNone, {
          gasPrice: 100000000,
          gasLimit: 30000000,
        })
      )
        .to.emit(facet, "EndowmentClosed")
        .withArgs(accountId);

      const endowState = await state.getClosingEndowmentState(accountId);
      expect(endowState[0]).to.equal(true);
      expect(endowState[1].enumData).to.equal(2);
      expect(endowState[1].data.addr).to.equal(treasuryAddress);
      expect(endowState[1].data.endowId).to.equal(0);
    });
  });

  describe("upon forceSetStrategyInactive", async function () {
    it("reverts if the caller is not the endowment owner", async function () {
      await expect(
        facet.connect(accOwner).forceSetStrategyInactive(accountId, DEFAULT_STRATEGY_SELECTOR)
      ).to.be.revertedWith("Unauthorized");
    });

    it("sets the active state to false for the specified strategy", async function () {
      await state.setActiveStrategyEndowmentState(accountId, DEFAULT_STRATEGY_SELECTOR, true);
      await facet
        .connect(endowOwner)
        .forceSetStrategyInactive(accountId, DEFAULT_STRATEGY_SELECTOR);
      let activeState = await state.getActiveStrategyEndowmentState(
        accountId,
        DEFAULT_STRATEGY_SELECTOR
      );
      expect(activeState).to.be.false;
    });
  });
});
