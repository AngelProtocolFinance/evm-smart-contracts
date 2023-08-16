import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import hre from "hardhat";
import {DEFAULT_CHARITY_ENDOWMENT, wait} from "test/utils";
import {
  AccountsAllowance,
  AccountsAllowance__factory,
  IERC20,
  IERC20__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {genWallet, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";

describe("AccountsAllowance", function () {
  const {ethers} = hre;

  const ACCOUNT_ID = 42;

  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;

  let facet: AccountsAllowance;
  let state: TestFacetProxyContract;

  let tokenFake: FakeContract<IERC20>;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.deployer;
    proxyAdmin = signers.proxyAdmin;
    user = signers.apTeam1;
  });

  beforeEach(async function () {
    tokenFake = await smock.fake<IERC20>(IERC20__factory.createInterface());

    const Facet = new AccountsAllowance__factory(owner);
    const facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);
    facet = AccountsAllowance__factory.connect(state.address, owner);

    // set a non-closing endowment up for testing with ACCOUNT_ID
    await wait(
      state.setClosingEndowmentState(ACCOUNT_ID, false, {
        data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero},
        enumData: 0,
      })
    );
    // add an accepted token to endowment ACCOUNT_ID
    await wait(state.setTokenAccepted(ACCOUNT_ID, tokenFake.address, true));
    // set a starting balance for Endowment: 100 qty of tokens in liquid
    await wait(state.setEndowmentTokenBalance(ACCOUNT_ID, tokenFake.address, 0, 100));

    // setup endowment ACCOUNT_ID with minimum needed for testing
    // Allowlists Beneficiaries set for a user
    await wait(
      state.setEndowmentDetails(ACCOUNT_ID, {
        ...DEFAULT_CHARITY_ENDOWMENT,
        owner: owner.address,
        allowlistedBeneficiaries: [user.address],
        maturityAllowlist: [user.address],
      })
    );
  });

  describe("Test cases for `manageAllowances`", function () {
    it("reverts when the endowment is closed", async function () {
      await wait(
        state.setClosingEndowmentState(ACCOUNT_ID, true, {
          data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero},
          enumData: 0,
        })
      );
      await expect(
        facet.manageAllowances(ACCOUNT_ID, user.address, tokenFake.address, 10)
      ).to.be.revertedWith("Endowment is closed");
    });

    it("reverts when the sender is not the endowment owner or a valid delegate who can control allowlists", async function () {
      // not the endowment owner sending the message and user is not a delegate
      await expect(
        facet.connect(user).manageAllowances(ACCOUNT_ID, user.address, tokenFake.address, 10)
      ).to.be.revertedWith("Unauthorized");
    });

    it("reverts when the token is invalid", async function () {
      await expect(
        facet.manageAllowances(ACCOUNT_ID, user.address, ethers.constants.AddressZero, 10)
      ).to.be.revertedWith("Invalid Token");

      await expect(
        facet.manageAllowances(ACCOUNT_ID, user.address, genWallet().address, 10)
      ).to.be.revertedWith("Invalid Token");
    });

    it("reverts when the spender is not in allowlist", async function () {
      await expect(
        facet.manageAllowances(ACCOUNT_ID, proxyAdmin.address, tokenFake.address, 10)
      ).to.be.revertedWith("Spender is not in allowlists");
    });

    it("reverts when there are no adjustments needed (ie. proposed amount == spender balance amount)", async function () {
      // set allowance for user to 10 tokens of total 10 tokens outstanding
      await wait(state.setTokenAllowance(ACCOUNT_ID, user.address, tokenFake.address, 10, 10));

      await expect(
        facet.manageAllowances(ACCOUNT_ID, user.address, tokenFake.address, 10)
      ).to.be.revertedWith("Spender balance equal to amount. No changes needed");
    });

    it("reverts when try to increase a valid token's allowance beyond liquid balance available", async function () {
      await expect(
        facet.manageAllowances(ACCOUNT_ID, user.address, tokenFake.address, 100000)
      ).to.be.revertedWith("Insufficient liquid balance to allocate");
    });

    it("passes when try to increase a valid token's allowance within range of liquid balance available", async function () {
      await expect(facet.manageAllowances(ACCOUNT_ID, user.address, tokenFake.address, 10))
        .to.emit(facet, "AllowanceUpdated")
        .withArgs(ACCOUNT_ID, user.address, tokenFake.address, 10, 10, 0);

      // endowment liquid balance should be 90 now (100 - 10)
      const endowBal = await state.getEndowmentTokenBalance(ACCOUNT_ID, tokenFake.address);
      expect(endowBal[1]).to.equal(90);
      // user allowance should be 10 now
      const allowance = await state.getTokenAllowance(ACCOUNT_ID, user.address, tokenFake.address);
      expect(allowance).to.equal(10);
    });

    it("passes when try to decrease an existing spender's allowance", async function () {
      // now we allocate some token allowance to the user address to spend from
      await wait(state.setTokenAllowance(ACCOUNT_ID, user.address, tokenFake.address, 10, 10));

      // set a lower total token allowance for the user, returning the delta to liquid balance
      await expect(facet.manageAllowances(ACCOUNT_ID, user.address, tokenFake.address, 3))
        .to.emit(facet, "AllowanceUpdated")
        .withArgs(ACCOUNT_ID, user.address, tokenFake.address, 3, 0, 7);

      // endowment liquid balance should be 107 now (100 + 7)
      const endowBal = await state.getEndowmentTokenBalance(ACCOUNT_ID, tokenFake.address);
      expect(endowBal[1]).to.equal(107);
      // user allowance should be 3 now
      const allowance = await state.getTokenAllowance(ACCOUNT_ID, user.address, tokenFake.address);
      expect(allowance).to.equal(3);
    });
  });

  describe("Test cases for `spendAllowance`", function () {
    it("reverts when try to spend token that is invalid(zero address) or dne in allowances", async function () {
      // try to spend an allowance that is invalid (Zero Address)
      await expect(
        facet.spendAllowance(ACCOUNT_ID, ethers.constants.AddressZero, 10, user.address)
      ).to.be.revertedWith("Invalid Token");

      // try to spend an allowance for a token that dne
      await expect(
        facet.spendAllowance(ACCOUNT_ID, genWallet().address, 10, user.address)
      ).to.be.revertedWith("Invalid Token");
    });

    it("reverts when try to spend zero amount of allowance", async function () {
      // now we allocate some token allowance to the user address to spend from
      await wait(state.setTokenAllowance(ACCOUNT_ID, user.address, tokenFake.address, 10, 10));

      // try to spend zero allowance
      await expect(
        facet.spendAllowance(ACCOUNT_ID, tokenFake.address, 0, user.address)
      ).to.be.revertedWith("Zero Amount");
    });

    it("reverts when try to spend more allowance than is available for token", async function () {
      // now we allocate some token allowance to the user address to spend from
      await wait(state.setTokenAllowance(ACCOUNT_ID, user.address, tokenFake.address, 10, 10));

      // try to spend more allowance than user was allocated
      await expect(
        facet.spendAllowance(ACCOUNT_ID, tokenFake.address, 1000, user.address)
      ).to.be.revertedWith("Amount requested exceeds Allowance balance");

      // try to spend more allowance than user was allocated
      await expect(
        facet.spendAllowance(ACCOUNT_ID, tokenFake.address, 1, proxyAdmin.address)
      ).to.be.revertedWith("Amount requested exceeds Allowance balance");
    });

    it("passes when spend less than or equal to the allowance available for token", async function () {
      // now we allocate some token allowance to the user address to spend from
      await wait(state.setTokenAllowance(ACCOUNT_ID, user.address, tokenFake.address, 10, 10));

      // mint tokens so that the contract can transfer them to recipient
      tokenFake.transfer.returns(true);

      // user spends less than what was allocated to them (ie. 5 out of 10 available)
      await expect(
        facet.connect(user).spendAllowance(ACCOUNT_ID, tokenFake.address, 5, user.address)
      )
        .to.emit(facet, "AllowanceSpent")
        .withArgs(ACCOUNT_ID, user.address, tokenFake.address, 5);

      // user allowance should be 5 now (10 - 5)
      let allowance = await state.getTokenAllowance(ACCOUNT_ID, user.address, tokenFake.address);
      expect(allowance).to.equal(5);
    });
  });
});
