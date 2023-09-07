import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_REGISTRAR_CONFIG,
  DEFAULT_STRATEGY_ID,
  wait,
} from "test/utils";
import {
  AccountsUpdateStatusEndowments,
  AccountsUpdateStatusEndowments__factory,
  IndexFund,
  IndexFund__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {LibAccounts} from "typechain-types/contracts/core/accounts/facets/AccountsUpdateStatusEndowments";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {BeneficiaryEnum, EndowmentType} from "types";
import {genWallet, getProxyAdminOwner, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";

use(smock.matchers);

describe("AccountsUpdateStatusEndowments", function () {
  const {ethers} = hre;

  const accountId = 1;
  const charityId = 2;
  const charityId2 = 3;
  const dafId = 4;

  const beneficiary: LibAccounts.BeneficiaryStruct = {
    enumData: BeneficiaryEnum.Wallet,
    data: {addr: genWallet().address, endowId: 0},
  };
  const strategies = ["strategy1", "strategy2", "strategy3"].map(
    (x) => ethers.utils.id(x).slice(0, 10) // map to bytes4 selectors
  );

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;

  let facet: AccountsUpdateStatusEndowments;
  let state: TestFacetProxyContract;

  let ast_endowment: AccountStorage.EndowmentStruct;
  let charity_endowment: AccountStorage.EndowmentStruct;
  let daf_endowment: AccountStorage.EndowmentStruct;

  let treasuryAddress: string;

  let registrarFake: FakeContract<Registrar>;
  let indexFundFake: FakeContract<IndexFund>;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    endowOwner = signers.deployer;
    treasuryAddress = signers.apTeam2.address;

    proxyAdmin = await getProxyAdminOwner(hre);

    charity_endowment = {...DEFAULT_CHARITY_ENDOWMENT, owner: endowOwner.address};
    ast_endowment = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      endowType: EndowmentType.Ast,
      owner: endowOwner.address,
    };
    daf_endowment = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      endowType: EndowmentType.Daf,
      owner: endowOwner.address,
    };
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
      haloToken: genWallet().address,
    };
    registrarFake.queryConfig.returns(config);
    registrarFake.queryAllStrategies.returns(strategies);

    await wait(state.setEndowmentDetails(accountId, ast_endowment));
    await wait(state.setEndowmentDetails(charityId, charity_endowment));
    await wait(state.setEndowmentDetails(charityId2, charity_endowment));
    await wait(state.setEndowmentDetails(dafId, daf_endowment));

    await wait(
      state.setConfig({
        owner: accOwner.address,
        version: "1",
        networkName: "Polygon",
        registrarContract: registrarFake.address,
        nextAccountId: dafId + 1,
        reentrancyGuardLocked: false,
      })
    );

    facet = AccountsUpdateStatusEndowments__factory.connect(state.address, endowOwner);
  });

  describe("upon closeEndowmment", async function () {
    it("reverts if the caller is not the owner of the endowment", async () => {
      await expect(
        facet.connect(accOwner).closeEndowment(accountId, beneficiary)
      ).to.be.revertedWith("Unauthorized");
    });

    it("reverts if the endowment is already closed", async () => {
      await wait(state.setClosingEndowmentState(accountId, true, beneficiary));
      await expect(facet.closeEndowment(accountId, beneficiary)).to.be.revertedWith(
        "Endowment is closed"
      );
    });

    it("reverts if a DAF or Charity endowment tries to pass Wallet as the beneficiary", async () => {
      await expect(facet.closeEndowment(dafId, beneficiary)).to.be.revertedWith(
        "Cannot pass Wallet beneficiary"
      );

      await expect(facet.closeEndowment(charityId, beneficiary)).to.be.revertedWith(
        "Cannot pass Wallet beneficiary"
      );
    });

    it("reverts if a DAF endowment tries to pass Non-DAF Approved ID as the beneficiary ID", async () => {
      await expect(
        facet.closeEndowment(dafId, {
          enumData: BeneficiaryEnum.EndowmentId,
          data: {addr: ethers.constants.AddressZero, endowId: accountId},
        })
      ).to.be.revertedWith("Not an approved Endowment for DAF withdrawals");
    });

    it("reverts if a charity endowment tries to pass Non-Charity ID as the beneficiary ID", async () => {
      await expect(
        facet.closeEndowment(charityId, {
          enumData: BeneficiaryEnum.EndowmentId,
          data: {addr: ethers.constants.AddressZero, endowId: accountId},
        })
      ).to.be.revertedWith("Beneficiary must be a Charity Endowment type");
    });

    it("reverts if an endowment passes its own ID as the beneficiary ID", async () => {
      await expect(
        facet.closeEndowment(accountId, {
          enumData: BeneficiaryEnum.EndowmentId,
          data: {addr: ethers.constants.AddressZero, endowId: accountId},
        })
      ).to.be.revertedWith("Cannot set own Endowment as final Beneficiary");
    });

    it("reverts if the endowment has active strategies", async () => {
      await wait(state.setActiveStrategyEndowmentState(accountId, strategies[0], true));
      await expect(facet.closeEndowment(accountId, beneficiary)).to.be.revertedWith(
        "Not fully exited"
      );
    });

    it("passes: when the closing an Endowment to a wallet beneficiary", async () => {
      await expect(facet.closeEndowment(accountId, beneficiary)).to.emit(facet, "EndowmentClosed");

      const endowState = await state.getClosingEndowmentState(accountId);
      expect(endowState[0]).to.equal(true);
      expect(endowState[1].enumData).to.equal(beneficiary.enumData);
      expect(endowState[1].data.addr).to.equal(beneficiary.data.addr);
      expect(endowState[1].data.endowId).to.equal(beneficiary.data.endowId);

      // check that endowment in no longer involved in any index funds
      const funds = await indexFundFake.queryInvolvedFunds(accountId);
      expect(funds.length).to.equal(0);
    });

    it("passes: updates the beneficiary to the treasury address if the beneficiary is set to 'None'", async () => {
      indexFundFake.queryInvolvedFunds.returns([]);
      const beneficiaryNone: LibAccounts.BeneficiaryStruct = {
        enumData: BeneficiaryEnum.None,
        data: {addr: ethers.constants.AddressZero, endowId: 0},
      };
      const beneficiaryTreasury: LibAccounts.BeneficiaryStruct = {
        enumData: BeneficiaryEnum.Wallet,
        data: {addr: treasuryAddress, endowId: 0},
      };

      await expect(facet.closeEndowment(accountId, beneficiaryNone)).to.emit(
        facet,
        "EndowmentClosed"
      );

      const endowState = await state.getClosingEndowmentState(accountId);
      expect(endowState[0]).to.equal(true);
      expect(endowState[1].enumData).to.equal(beneficiaryTreasury.enumData);
      expect(endowState[1].data.addr).to.equal(beneficiaryTreasury.data.addr);
      expect(endowState[1].data.endowId).to.equal(beneficiaryTreasury.data.endowId);
    });

    it("passes if a DAF endowment sends an Approved ID as the beneficiary ID", async () => {
      await wait(state.setDafApprovedEndowment(charityId, true));

      await expect(
        facet.closeEndowment(dafId, {
          enumData: BeneficiaryEnum.EndowmentId,
          data: {addr: ethers.constants.AddressZero, endowId: charityId},
        })
      ).to.emit(facet, "EndowmentClosed");

      const endowState = await state.getClosingEndowmentState(dafId);
      expect(endowState[0]).to.equal(true);
      expect(endowState[1].enumData).to.equal(BeneficiaryEnum.EndowmentId);
      expect(endowState[1].data.addr).to.equal(ethers.constants.AddressZero);
      expect(endowState[1].data.endowId).to.equal(charityId);
    });

    it("passes if a Charity endowment sends another Charity's ID as the beneficiary ID", async () => {
      await expect(
        facet.closeEndowment(charityId, {
          enumData: BeneficiaryEnum.EndowmentId,
          data: {addr: ethers.constants.AddressZero, endowId: charityId2},
        })
      ).to.emit(facet, "EndowmentClosed");

      const endowState = await state.getClosingEndowmentState(charityId);
      expect(endowState[0]).to.equal(true);
      expect(endowState[1].enumData).to.equal(BeneficiaryEnum.EndowmentId);
      expect(endowState[1].data.addr).to.equal(ethers.constants.AddressZero);
      expect(endowState[1].data.endowId).to.equal(charityId2);
    });

    it("passes if a Charity endowment (whom is a beneficiary of a closed endowment) sends a None type beneficiary", async () => {
      await expect(
        facet.closeEndowment(charityId, {
          enumData: BeneficiaryEnum.EndowmentId,
          data: {addr: ethers.constants.AddressZero, endowId: charityId2},
        })
      ).to.emit(facet, "EndowmentClosed");

      const [closingEndowment, closingBeneficiary] = await state.getClosingEndowmentState(
        charityId
      );
      expect(closingEndowment).to.equal(true);
      expect(closingBeneficiary.enumData).to.equal(BeneficiaryEnum.EndowmentId);
      expect(closingBeneficiary.data.addr).to.equal(ethers.constants.AddressZero);
      expect(closingBeneficiary.data.endowId).to.equal(charityId2);

      await expect(
        facet.closeEndowment(charityId2, {
          enumData: BeneficiaryEnum.None,
          data: {addr: ethers.constants.AddressZero, endowId: 0},
        })
      ).to.emit(facet, "EndowmentClosed");

      // Both endowments should now be linked to AP Treasury Address
      const [newClosingEndowment, newClosingBeneficiary] = await state.getClosingEndowmentState(
        charityId
      );
      expect(newClosingEndowment).to.equal(true);
      expect(newClosingBeneficiary.enumData).to.equal(BeneficiaryEnum.Wallet);
      expect(newClosingBeneficiary.data.addr).to.equal(treasuryAddress);
      expect(newClosingBeneficiary.data.endowId).to.equal(0);

      const [newClosingEndowment2, newClosingBeneficiary2] = await state.getClosingEndowmentState(
        charityId2
      );
      expect(newClosingEndowment2).to.equal(true);
      expect(newClosingBeneficiary2.enumData).to.equal(BeneficiaryEnum.Wallet);
      expect(newClosingBeneficiary2.data.addr).to.equal(treasuryAddress);
      expect(newClosingBeneficiary2.data.endowId).to.equal(0);
    });
  });

  describe("upon forceSetStrategyInactive", async function () {
    it("reverts if the caller is not the endowment owner", async function () {
      await expect(
        facet.connect(accOwner).forceSetStrategyInactive(accountId, DEFAULT_STRATEGY_ID)
      ).to.be.revertedWith("Unauthorized");
    });

    it("sets the active state to false for the specified strategy", async function () {
      await wait(state.setActiveStrategyEndowmentState(accountId, DEFAULT_STRATEGY_ID, true));
      await facet.connect(endowOwner).forceSetStrategyInactive(accountId, DEFAULT_STRATEGY_ID);
      let activeState = await state.getActiveStrategyEndowmentState(accountId, DEFAULT_STRATEGY_ID);
      expect(activeState).to.be.false;
    });
  });
});
