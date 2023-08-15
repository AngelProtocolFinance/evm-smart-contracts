import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {DEFAULT_ACCOUNTS_CONFIG, DEFAULT_CHARITY_ENDOWMENT, wait} from "test/utils";
import {
  AccountsQueryEndowments,
  AccountsQueryEndowments__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsQueryEndowments";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";

describe("AccountsQueryEndowments", function () {
  const {ethers} = hre;

  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;

  let facet: AccountsQueryEndowments;
  let state: TestFacetProxyContract;

  let tokenAddress: string;
  const accountId = 0;
  const lockedBal = 20;
  const liquidBal = 50;

  let config: AccountStorage.ConfigStruct;

  const endowState: AccountMessages.StateResponseStruct = {
    closingEndowment: false,
    closingBeneficiary: {
      enumData: 2, // BeneficiaryEnum.None
      data: {
        addr: ethers.constants.AddressZero,
        endowId: 0,
      },
    },
  };

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    tokenAddress = signers.deployer.address;

    const Facet = new AccountsQueryEndowments__factory(owner);
    const facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);
    facet = AccountsQueryEndowments__factory.connect(state.address, owner);

    await wait(state.setEndowmentDetails(accountId, DEFAULT_CHARITY_ENDOWMENT));
    await wait(state.setEndowmentTokenBalance(accountId, tokenAddress, lockedBal, liquidBal));
    await wait(
      state.setClosingEndowmentState(
        accountId,
        endowState.closingEndowment,
        endowState.closingBeneficiary
      )
    );

    config = {
      ...DEFAULT_ACCOUNTS_CONFIG,
      owner: owner.address,
      nextAccountId: accountId + 1, // endowment was created in previous step
    };
    await wait(state.setConfig(config));
  });

  describe("queryTokenAmount", () => {
    it("should return the balance of a token for a locked endowment", async () => {
      const accountType = 0; // VaultType.LOCKED

      const lockTokenAmount = await facet.queryTokenAmount(accountId, accountType, tokenAddress);

      expect(lockTokenAmount).to.equal(lockedBal);
    });

    it("should return the balance of a token for a liquid endowment", async () => {
      const accountType = 1; // VaultType.LIQUID

      const liqTokenAmount = await facet.queryTokenAmount(accountId, accountType, tokenAddress);

      expect(liqTokenAmount).to.equal(liquidBal);
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

      expect(endowmentDetails.balanceFee).to.equalFee(DEFAULT_CHARITY_ENDOWMENT.balanceFee);
      expect(endowmentDetails.dao).to.equal(DEFAULT_CHARITY_ENDOWMENT.dao);
      expect(endowmentDetails.daoToken).to.equal(DEFAULT_CHARITY_ENDOWMENT.daoToken);
      expect(endowmentDetails.depositFee).to.equalFee(DEFAULT_CHARITY_ENDOWMENT.depositFee);
      expect(endowmentDetails.donationMatchActive).to.equal(
        DEFAULT_CHARITY_ENDOWMENT.donationMatchActive
      );
      expect(endowmentDetails.donationMatchContract).to.equal(ethers.constants.AddressZero);
      expect(endowmentDetails.earlyLockedWithdrawFee).to.equalFee(
        DEFAULT_CHARITY_ENDOWMENT.earlyLockedWithdrawFee
      );
      expect(endowmentDetails.endowType).to.equal(DEFAULT_CHARITY_ENDOWMENT.endowType);
      expect(endowmentDetails.ignoreUserSplits).to.equal(
        DEFAULT_CHARITY_ENDOWMENT.ignoreUserSplits
      );
      expect(endowmentDetails.image).to.equal(DEFAULT_CHARITY_ENDOWMENT.image);
      expect(endowmentDetails.logo).to.equal(DEFAULT_CHARITY_ENDOWMENT.logo);
      expect(endowmentDetails.maturityTime).to.equal(DEFAULT_CHARITY_ENDOWMENT.maturityTime);
      expect(endowmentDetails.multisig).to.equal(DEFAULT_CHARITY_ENDOWMENT.multisig);
      expect(endowmentDetails.name).to.equal(DEFAULT_CHARITY_ENDOWMENT.name);
      expect(endowmentDetails.parent).to.equal(DEFAULT_CHARITY_ENDOWMENT.parent);
      expect(endowmentDetails.proposalLink).to.equal(DEFAULT_CHARITY_ENDOWMENT.proposalLink);
      expect(endowmentDetails.rebalance).to.equalRebalance(DEFAULT_CHARITY_ENDOWMENT.rebalance);
      expect(endowmentDetails.referralId).to.equal(DEFAULT_CHARITY_ENDOWMENT.referralId);
      expect(endowmentDetails.sdgs).to.have.same.deep.members(
        DEFAULT_CHARITY_ENDOWMENT.sdgs.map((x) => BigNumber.from(x))
      );
      expect(endowmentDetails.settingsController.acceptedTokens).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.acceptedTokens
      );
      expect(
        endowmentDetails.settingsController.lockedInvestmentManagement
      ).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.lockedInvestmentManagement
      );
      expect(
        endowmentDetails.settingsController.liquidInvestmentManagement
      ).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.liquidInvestmentManagement
      );
      expect(
        endowmentDetails.settingsController.allowlistedBeneficiaries
      ).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.allowlistedBeneficiaries
      );
      expect(
        endowmentDetails.settingsController.allowlistedContributors
      ).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.allowlistedContributors
      );
      expect(endowmentDetails.settingsController.maturityAllowlist).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.maturityAllowlist
      );
      expect(endowmentDetails.settingsController.maturityTime).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.maturityTime
      );
      expect(endowmentDetails.settingsController.earlyLockedWithdrawFee).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.earlyLockedWithdrawFee
      );
      expect(endowmentDetails.settingsController.withdrawFee).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.withdrawFee
      );
      expect(endowmentDetails.settingsController.depositFee).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.depositFee
      );
      expect(endowmentDetails.settingsController.balanceFee).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.balanceFee
      );
      expect(endowmentDetails.settingsController.name).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.name
      );
      expect(endowmentDetails.settingsController.image).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.image
      );
      expect(endowmentDetails.settingsController.logo).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.logo
      );
      expect(endowmentDetails.settingsController.sdgs).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.sdgs
      );
      expect(endowmentDetails.settingsController.splitToLiquid).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.splitToLiquid
      );
      expect(endowmentDetails.settingsController.ignoreUserSplits).to.equalSettingsPermission(
        DEFAULT_CHARITY_ENDOWMENT.settingsController.ignoreUserSplits
      );
      expect(endowmentDetails.splitToLiquid.defaultSplit).to.equal(
        DEFAULT_CHARITY_ENDOWMENT.splitToLiquid.defaultSplit
      );
      expect(endowmentDetails.splitToLiquid.max).to.equal(
        DEFAULT_CHARITY_ENDOWMENT.splitToLiquid.max
      );
      expect(endowmentDetails.splitToLiquid.min).to.equal(
        DEFAULT_CHARITY_ENDOWMENT.splitToLiquid.min
      );
      expect(endowmentDetails.tier).to.equal(DEFAULT_CHARITY_ENDOWMENT.tier);
      expect(endowmentDetails.withdrawFee).to.equalFee(DEFAULT_CHARITY_ENDOWMENT.withdrawFee);
    });
  });

  describe("queryConfig", () => {
    it("should return the accounts contract config", async () => {
      const configResponse = await facet.queryConfig();

      // Assert the expected config
      expect(configResponse.nextAccountId).to.equal(config.nextAccountId);
      expect(configResponse.owner).to.equal(config.owner);
      expect(configResponse.registrarContract).to.equal(config.registrarContract);
      expect(configResponse.version).to.equal(config.version);
    });
  });

  describe("queryState", () => {
    it("should return the endowment state", async () => {
      const stateResponse = await facet.queryState(accountId);

      // Assert the expected endowment state
      expect(stateResponse.closingEndowment).to.equal(endowState.closingEndowment);
      expect(stateResponse.closingBeneficiary.enumData).to.equal(
        endowState.closingBeneficiary.enumData
      );
      expect(stateResponse.closingBeneficiary.data.addr).to.equal(
        endowState.closingBeneficiary.data.addr
      );
      expect(stateResponse.closingBeneficiary.data.endowId).to.equal(
        endowState.closingBeneficiary.data.endowId
      );
    });
  });
});
