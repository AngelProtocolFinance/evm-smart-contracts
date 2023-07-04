import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {DEFAULT_ACCOUNTS_CONFIG, DEFAULT_CHARITY_ENDOWMENT} from "test/utils";
import {
  AccountsQueryEndowments,
  AccountsQueryEndowments__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsQueryEndowments";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";

describe("AccountsQueryEndowments", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let facet: AccountsQueryEndowments;
  let proxy: TestFacetProxyContract;
  let tokenAddress: string;
  const accountId = 1;
  const lockBal = 20;
  const liqBal = 50;
  let config: AccountStorage.ConfigStruct;
  const state: AccountMessages.StateResponseStruct = {
    closingEndowment: false,
    closingBeneficiary: {
      enumData: 3, // BeneficiaryEnum.None
      data: {
        addr: ethers.constants.AddressZero,
        endowId: accountId,
        fundId: 0,
      },
    },
  };

  before(async function () {
    [owner, proxyAdmin, {address: tokenAddress}] = await ethers.getSigners();

    const Facet = new AccountsQueryEndowments__factory(owner);
    const facetImpl = await Facet.deploy();
    proxy = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);
    facet = AccountsQueryEndowments__factory.connect(proxy.address, owner);

    await proxy.setEndowmentDetails(accountId, DEFAULT_CHARITY_ENDOWMENT);
    await proxy.setEndowmentTokenBalance(accountId, tokenAddress, lockBal, liqBal);

    config = {
      ...DEFAULT_ACCOUNTS_CONFIG,
      owner: owner.address,
      nextAccountId: 1, // endowment was created in previous step
    };

    await proxy.setConfig(config);

    await proxy.setClosingEndowmentState(
      accountId,
      state.closingEndowment,
      state.closingBeneficiary
    );
  });

  describe("queryTokenAmount", () => {
    it("should return the balance of a token for a locked endowment", async () => {
      const accountType = 0; // VaultType.LOCKED

      const lockTokenAmount = await facet.queryTokenAmount(accountId, accountType, tokenAddress);

      expect(lockTokenAmount).to.equal(lockBal);
    });

    it("should return the balance of a token for a liquid endowment", async () => {
      const accountType = 1; // VaultType.LIQUID

      const liqTokenAmount = await facet.queryTokenAmount(accountId, accountType, tokenAddress);

      expect(liqTokenAmount).to.equal(liqBal);
    });

    it("should revert if the token address is invalid", async () => {
      const accountType = 0; // VaultType.LOCKED
      const invalidTokenAddress = ethers.constants.AddressZero;

      await expect(
        facet.queryTokenAmount(accountId, accountType, invalidTokenAddress)
      ).to.be.revertedWith("Invalid token address");
    });
  });

  describe("queryEndowmentDetails", () => {
    it("should return the endowment details", async () => {
      const endowmentDetails = await facet.queryEndowmentDetails(accountId);

      // Assert the expected endowment details
      expect(endowmentDetails.owner).to.equal(DEFAULT_CHARITY_ENDOWMENT.owner);
      expect(endowmentDetails.name).to.equal(DEFAULT_CHARITY_ENDOWMENT.name);
      // ...
    });
  });

  describe("queryConfig", () => {
    it("should return the accounts contract config", async () => {
      const configResponse = await facet.queryConfig();

      // Assert the expected config
      expect(configResponse.earlyLockedWithdrawFee.bps).to.equal(config.earlyLockedWithdrawFee.bps);
      expect(configResponse.earlyLockedWithdrawFee.payoutAddress).to.equal(
        config.earlyLockedWithdrawFee.payoutAddress
      );
      expect(configResponse.gasReceiver).to.equal(config.gasReceiver);
      expect(configResponse.gateway).to.equal(config.gateway);
      expect(configResponse.maxGeneralCategoryId).to.equal(config.maxGeneralCategoryId);
      expect(configResponse.nextAccountId).to.equal(config.nextAccountId);
      expect(configResponse.owner).to.equal(config.owner);
      expect(configResponse.registrarContract).to.equal(config.registrarContract);
      expect(configResponse.subDao).to.equal(config.subDao);
      expect(configResponse.version).to.equal(config.version);
    });
  });

  describe("queryState", () => {
    it("should return the endowment state", async () => {
      const stateResponse = await facet.queryState(accountId);

      // Assert the expected endowment state
      expect(stateResponse.closingEndowment).to.equal(state.closingEndowment);
      expect(stateResponse.closingBeneficiary.enumData).to.equal(state.closingBeneficiary.enumData);
      expect(stateResponse.closingBeneficiary.data.addr).to.equal(
        state.closingBeneficiary.data.addr
      );
      expect(stateResponse.closingBeneficiary.data.endowId).to.equal(
        state.closingBeneficiary.data.endowId
      );
      expect(stateResponse.closingBeneficiary.data.fundId).to.equal(
        state.closingBeneficiary.data.fundId
      );
    });
  });
});
