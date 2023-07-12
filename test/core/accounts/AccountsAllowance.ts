import {expect} from "chai";
import hre from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {deployDummyERC20, DEFAULT_CHARITY_ENDOWMENT, DEFAULT_PERMISSIONS_STRUCT} from "test/utils";
import {
  TestFacetProxyContract,
  AccountsAllowance__factory,
  AccountsAllowance,
  DummyERC20,
} from "typechain-types";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {getSigners} from "utils";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";

describe("AccountsAllowance", function () {
  const {ethers} = hre;
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;
  let token: DummyERC20;
  let token2: DummyERC20;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.deployer;
    proxyAdmin = signers.proxyAdmin;
    user = signers.apTeam1;
    token = await deployDummyERC20(owner);
    token2 = await deployDummyERC20(owner);
  });

  describe("Test cases for `manageAllowances`", async function () {
    let facet: AccountsAllowance;
    let proxy: TestFacetProxyContract;

    beforeEach(async function () {
      let Facet = new AccountsAllowance__factory(owner);
      let facetImpl = await Facet.deploy();
      proxy = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);
      facet = AccountsAllowance__factory.connect(proxy.address, owner);
      // set a non-closing endowment up for testing with (#42)
      await proxy.setClosingEndowmentState(42, false, {
        data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero},
        enumData: 0,
      });
      // add an accepted token to endowment #42
      await proxy.setTokenAccepted(42, token.address, true);
      // set a starting balance for Endowment: 100 qty of tokens in liquid
      await proxy.setEndowmentTokenBalance(42, token.address, 0, 100);
      // setup endowment 42 with minimum needed for testing
      // Allowlists Beneficiaries set for a user
      let endowment = DEFAULT_CHARITY_ENDOWMENT;
      endowment.owner = owner.address;
      endowment.allowlistedBeneficiaries = [user.address];
      endowment.maturityAllowlist = [user.address];
      await proxy.setEndowmentDetails(42, endowment);
    });

    it("reverts when the endowment is closed", async function () {
      await proxy.setClosingEndowmentState(42, true, {
        data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero},
        enumData: 0,
      });
      await expect(facet.manageAllowances(42, user.address, token.address, 10)).to.be.revertedWith(
        "Endowment is closed"
      );
    });

    it("reverts when the sender is not the endowment owner or a valid delegate who can control allowlists", async function () {
      // not the endowment owner sending the message and user is not a delegate
      await expect(
        facet.connect(user).manageAllowances(42, user.address, token.address, 10)
      ).to.be.revertedWith("Unauthorized");
    });

    it("reverts when the token is invalid", async function () {
      await expect(
        facet.manageAllowances(42, user.address, ethers.constants.AddressZero, 10)
      ).to.be.revertedWith("Invalid Token");

      await expect(facet.manageAllowances(42, user.address, token2.address, 10)).to.be.revertedWith(
        "Invalid Token"
      );
    });

    it("reverts when the spender is not in allowlist", async function () {
      await expect(
        facet.manageAllowances(42, proxyAdmin.address, token.address, 10)
      ).to.be.revertedWith("Spender is not in allowlists");
    });

    it("reverts when there are no adjustments needed (ie. proposed amount == spender balance amount)", async function () {
      // set allowance for user to 10 tokens of total 10 tokens outstanding
      await proxy.setTokenAllowance(42, user.address, token.address, 10, 10);

      await expect(facet.manageAllowances(42, user.address, token.address, 10)).to.be.revertedWith(
        "Spender balance equal to amount. No changes needed"
      );
    });

    it("reverts when try to increase a valid token's allowance beyond liquid balance available", async function () {
      await expect(
        facet.manageAllowances(42, user.address, token.address, 100000)
      ).to.be.revertedWith("Insufficient liquid balance to allocate");
    });

    it("passes when try to increase a valid token's allowance within range of liquid balance available", async function () {
      await expect(facet.manageAllowances(42, user.address, token.address, 10));

      // endowment liquid balance should be 90 now (100 - 10)
      //const endowBal = await proxy.getEndowmentTokenBalance(42, token.address);
      //expect(endowBal[1]).to.equal(90);
      // user allowance should be 10 now
      const allowance = await proxy.getTokenAllowance(42, user.address, token.address);
      expect(allowance).to.equal(10);
    });
  });

  describe("Test cases for `spendAllowance`", async function () {
    let facet: AccountsAllowance;
    let proxy: TestFacetProxyContract;

    beforeEach(async function () {
      let Facet = new AccountsAllowance__factory(owner);
      let facetImpl = await Facet.deploy();
      proxy = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);
      facet = AccountsAllowance__factory.connect(proxy.address, owner);
      // set a non-closing endowment up for testing with (#42)
      await proxy.setClosingEndowmentState(42, false, {
        data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero},
        enumData: 0,
      });
      // add an accepted token to endowment #42
      await proxy.setTokenAccepted(42, token.address, true);
      // set a starting balance for Endowment: 100 qty of tokens in liquid
      await proxy.setEndowmentTokenBalance(42, token.address, 0, 100);
    });

    it("reverts when try to spend token that is invalid(zero address) or dne in allowances", async function () {
      // try to spend an allowance that is invalid (Zero Address)
      await expect(
        facet.spendAllowance(42, ethers.constants.AddressZero, 10, user.address)
      ).to.be.revertedWith("Invalid Token");

      // try to spend an allowance for a token that dne
      await expect(facet.spendAllowance(42, token2.address, 10, user.address)).to.be.revertedWith(
        "Invalid Token"
      );
    });

    it("reverts when try to spend allowance to an invalid recipient address", async function () {
      // now we allocate some token allowance to the user address to spend from
      await proxy.setTokenAllowance(42, user.address, token.address, 10, 10);

      // try to spend allocated funds to an invalid zero address
      await expect(
        facet.spendAllowance(42, token.address, 10, ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid recipient address");
    });

    it("reverts when try to spend zero amount of allowance", async function () {
      // now we allocate some token allowance to the user address to spend from
      await proxy.setTokenAllowance(42, user.address, token.address, 10, 10);

      // try to spend zero allowance
      await expect(facet.spendAllowance(42, token.address, 0, user.address)).to.be.revertedWith(
        "Zero Amount"
      );
    });

    it("reverts when try to spend more allowance than is available for token", async function () {
      // now we allocate some token allowance to the user address to spend from
      await proxy.setTokenAllowance(42, user.address, token.address, 10, 10);

      // try to spend more allowance than user was allocated
      await expect(facet.spendAllowance(42, token.address, 1000, user.address)).to.be.revertedWith(
        "Amount requested exceeds Allowance balance"
      );
    });

    it("passes when spend less than or equal to the allowance available for token", async function () {
      // check starting assumptions (should be 100 in liquid bal)
      //let endowBal = await proxy.getEndowmentTokenBalance(42, token.address);
      //expect(endowBal[1]).to.equal(100);

      // now we allocate some token allowance to the user address to spend from
      await facet.manageAllowances(42, user.address, token.address, 10);
      // user allowance should be set to 10 now
      let allowance = await proxy.getTokenAllowance(42, user.address, token.address);
      expect(allowance).to.equal(10);
      // new liquid balance should be 90 (100 - 10)
      //endowBal = await proxy.getEndowmentTokenBalance(42, token.address);
      //expect(endowBal[1]).to.equal(90);

      // mint tokens so that the contract can transfer them to recipient
      await token.mint(facet.address, 10);

      // user spends less than what was allocated to them (ie. 5 out of 10 available)
      await expect(facet.spendAllowance(42, token.address, 5, user.address));
      // user allowance should be 5 now (10 - 5)
      allowance = await proxy.getTokenAllowance(42, user.address, token.address);
      expect(allowance).to.equal(5);
    });
  });
});
