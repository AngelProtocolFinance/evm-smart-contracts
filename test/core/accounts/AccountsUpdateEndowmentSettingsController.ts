import {smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {
  AccountsUpdateEndowmentSettingsController,
  AccountsUpdateEndowmentSettingsController__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsUpdateEndowmentSettingsController";
import "../../utils/setup";

use(smock.matchers);

describe("AccountsUpdateEndowmentSettingsController", function () {
  const {ethers} = hre;

  const endowId = 1;
  const updateEndowmentSettingsRequest: AccountMessages.UpdateEndowmentSettingsRequestStruct = {
    id: endowId,
    allowlistedBeneficiaries: [],
    allowlistedContributors: [],
    donationMatchActive: false,
    ignoreUserSplits: false,
    maturity_allowlist_add: [],
    maturity_allowlist_remove: [],
    maturityTime: 0,
    splitToLiquid: {defaultSplit: 50, max: 100, min: 0},
  };

  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let facet: AccountsUpdateEndowmentSettingsController;
  let state: TestFacetProxyContract;

  before(async function () {
    let signers: SignerWithAddress[];
    [owner, proxyAdmin, ...signers] = await ethers.getSigners();
  });

  beforeEach(async function () {
    let Facet = new AccountsUpdateEndowmentSettingsController__factory(owner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    await state.setConfig({
      owner: owner.address,
      version: "1",
      registrarContract: ethers.constants.AddressZero,
      nextAccountId: 1,
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      gateway: ethers.constants.AddressZero,
      gasReceiver: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });

    facet = AccountsUpdateEndowmentSettingsController__factory.connect(state.address, owner);
  });

  describe("updateEndowmentSettings", () => {
    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(endowId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(
        facet.updateEndowmentSettings(updateEndowmentSettingsRequest)
      ).to.be.revertedWith("UpdatesAfterClosed");
    });
  });
});
