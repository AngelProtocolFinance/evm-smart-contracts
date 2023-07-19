import {expect} from "chai";
import hre from "hardhat";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
  AccountsDepositWithdrawEndowments,
  AccountsDepositWithdrawEndowments__factory,
  DummyERC20,
  IndexFund,
  IndexFund__factory,
  ITransparentUpgradeableProxy__factory,
  Registrar,
  TestFacetProxyContract,
} from "typechain-types";
import {
  deployDummyERC20,
  deployRegistrarAsProxy,
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_PERMISSIONS_STRUCT,
} from "test/utils";
import {getSigners} from "utils";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {LocalRegistrarLib} from "../../../typechain-types/contracts/core/registrar/LocalRegistrar";

describe("IndexFund", function () {
  const {ethers, upgrades} = hre;
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;
  let registrar: Registrar;
  let token1: DummyERC20;
  let token2: DummyERC20;
  let facet: AccountsDepositWithdrawEndowments;
  let state: TestFacetProxyContract;
  const defaultApParams = {
    routerAddr: ethers.constants.AddressZero,
    refundAddr: ethers.constants.AddressZero,
  } as LocalRegistrarLib.AngelProtocolParamsStruct;

  async function deployIndexFundAsProxy(
    fundRotation: uint256 = 1000,
    fundingGoal: uint256 = 30000
  ): Promise<IndexFund> {
    let apParams = defaultApParams;
    if (!registrar) {
      registrar = await deployRegistrarAsProxy(owner, proxyAdmin);
    }

    const IndexFundFactory = new IndexFund__factory(owner);
    const IndexFundImpl = await IndexFundFactory.deploy();
    await IndexFundImpl.deployed();

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const IndexFundInitData = IndexFundImpl.interface.encodeFunctionData("initialize", [
      registrar.address,
      fundRotation,
      fundingGoal,
    ]);

    const IndexFundProxy = await ProxyContract.deploy(
      IndexFundImpl.address,
      proxyAdmin.address,
      IndexFundInitData
    );
    await IndexFundProxy.deployed();
    return IndexFund__factory.connect(IndexFundProxy.address, owner);
  }

  async function upgradeProxy(signer: SignerWithAddress, proxy: string) {
    const IndexFundFactory = new IndexFund__factory(owner);
    const IndexFundImpl = await IndexFundFactory.deploy();
    await IndexFundImpl.deployed();

    const IndexFundProxy = ITransparentUpgradeableProxy__factory.connect(proxy, signer);
    IndexFundProxy.upgradeTo(IndexFundImpl.address);
  }

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.deployer;
    proxyAdmin = signers.proxyAdmin;
    user = signers.apTeam1;
    registrar = await deployRegistrarAsProxy(owner, proxyAdmin);
    token1 = await deployDummyERC20(owner);
    token2 = await deployDummyERC20(owner);

    // setup the Accounts DepositWithdraw Endowments facet once
    let Facet = new AccountsDepositWithdrawEndowments__factory(owner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);
    facet = AccountsDepositWithdrawEndowments__factory.connect(state.address, owner);

    // setup the various Endowments for testing index funds once
    // #1 - A closed endowment for error checks
    await state.setClosingEndowmentState(1, true, {
      data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero},
      enumData: 0,
    });

    // #2 - A non-closing endowment
    await state.setClosingEndowmentState(2, false, {
      data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero},
      enumData: 0,
    });
    // accepts token1 for deposits
    await state.setTokenAccepted(2, token1.address, true);
    // setup endowment with minimum needed for testing
    let endowment = DEFAULT_CHARITY_ENDOWMENT;
    await state.setEndowmentDetails(2, endowment);

    // #3 - A non-closing endowment
    await state.setClosingEndowmentState(3, false, {
      data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero},
      enumData: 0,
    });
    // accepts token1 & token2 for deposits
    await state.setTokenAccepted(3, token1.address, true);
    await state.setTokenAccepted(3, token2.address, true);
    // setup endowment with minimum needed for testing
    await state.setEndowmentDetails(3, endowment);
  });

  describe("Deploying the contract", function () {
    let indexFund: IndexFund;

    beforeEach(async function () {
      indexFund = await deployIndexFundAsProxy();
    });

    it("Deploying the contract as an upgradable proxy", async function () {
      expect(indexFund.address);
      expect(await upgradeProxy(proxyAdmin, indexFund.address)).to.emit(
        indexFund,
        "IndexFundInstantiated"
      );
    });

    it("should have correct starting state values", async function () {
      let state = await indexFund.queryState();
      // round donations == 0
      expect(state.roundDonations).to.equal(0);
      // active fund ID == 0
      expect(state.activeFund).to.equal(0);
    });

    it("accepts fund member limit, rotation, and goal as part of initialization", async function () {
      let rotation = 250;
      let goal = 5000;
      indexFund = await deployIndexFundAsProxy(rotation, goal);
      let config = await indexFund.queryConfig();
      expect(config.fundRotation).to.equal(rotation);
      expect(config.fundingGoal).to.equal(goal);
    });
  });

  describe("Updating the Config", async function () {
    let indexFund: IndexFund;

    beforeEach(async function () {
      indexFund = await deployIndexFundAsProxy();
    });

    it("reverts when the message sender is not the owner", async function () {
      expect(indexFund.connect(user).updateConfig(registrar.address, 200, 5000)).to.be.revertedWith(
        "Unauthorized"
      );
    });

    it("reverts when the limit of members is zero", async function () {
      expect(indexFund.updateConfig(registrar.address, 200, 5000)).to.be.revertedWith(
        "Fund endowment limit must be greater than zero"
      );
    });

    it("reverts if registrar address passed is invalid", async function () {
      expect(indexFund.updateConfig(ethers.constants.AddressZero, 200, 5000)).to.be.revertedWith(
        "Invalid Registrar address"
      );
    });

    it("passes with valid sender and all correct inputs", async function () {
      // update config with all the correct bits
      expect(await indexFund.updateConfig(registrar.address, 200, 5000)).to.emit(
        indexFund,
        "ConfigUpdated"
      );

      // query the new config and check that updates applied correctly
      let newConfig = await indexFund.queryConfig();
      expect(newConfig.fundRotation).to.equal(200);
      expect(newConfig.fundingGoal).to.equal(5000);
    });
  });

  describe("Creating a new Fund", async function () {
    let indexFund: IndexFund;

    beforeEach(async function () {
      indexFund = await deployIndexFundAsProxy();
    });

    it("reverts when the message sender is not the owner", async function () {
      expect(
        indexFund.connect(user).createIndexFund("Test Fund #1", "Test fund", [1, 2], false, 0, 0)
      ).to.be.revertedWith("Unauthorized");
    });

    it("reverts when no endowment members are passed", async function () {
      expect(
        indexFund.createIndexFund("Test Fund #1", "Test fund", [], false, 0, 0)
      ).to.be.revertedWith("Fund must have one or more endowment members");
    });

    it("reverts when too many endowment members are passed (> fundMemberLimit)", async function () {
      expect(
        indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2, 3], false, 0, 0)
      ).to.be.revertedWith("Fund endowment members exceeds upper limit");
    });

    it("reverts when the split is greater than 100", async function () {
      expect(
        indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], false, 0, 105)
      ).to.be.revertedWith("Invalid split: must be less or equal to 100");
    });

    it("passes when all inputs are correct", async function () {
      // create a new fund with two Endowment members
      expect(await indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], false, 0, 10))
        .to.emit(indexFund, "FundCreated")
        .withArgs(1);
      let activeFund = await indexFund.queryActiveFundDetails();
      expect(activeFund.id).to.equal(1);
    });
  });

  describe("Updating an existing Fund's endowment members", async function () {
    let indexFund: IndexFund;

    before(async function () {
      indexFund = await deployIndexFundAsProxy();
      // create 2 funds (1 active and 1 expired)
      await indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], true, 50, 10);
      await indexFund.createIndexFund(
        "Test Fund #2 (Inactive)",
        "Inactive Test fund",
        [1, 2],
        false,
        50,
        0
      );
    });

    it("reverts when the message sender is not the owner", async function () {
      expect(indexFund.connect(user).updateFundMembers(1, [1, 2])).to.be.revertedWith(
        "Unauthorized"
      );
    });

    it("reverts when no members are passed", async function () {
      expect(indexFund.updateFundMembers(1, [])).to.be.revertedWith(
        "Must pass at least one endowment member to add to the Fund"
      );
    });

    it("reverts when too many members are passed", async function () {
      expect(indexFund.updateFundMembers(1, [1, 2, 3])).to.be.revertedWith(
        "Fund endowment members exceeds upper limit"
      );
    });

    it("reverts when the fund is expired", async function () {
      expect(indexFund.updateFundMembers(2, [1, 2])).to.be.revertedWith("Fund Expired");
    });

    it("passes when the fund is not expired and member inputs are valid", async function () {
      expect(await indexFund.updateFundMembers(1, [1, 2]))
        .to.emit(indexFund, "MembersUpdated")
        .withArgs(1, [1, 2]);
    });
  });

  describe("Removing an existing Fund", async function () {
    let indexFund: IndexFund;

    before(async function () {
      indexFund = await deployIndexFundAsProxy();
      // create 2 funds (1 active and 1 expired)
      await indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], true, 50, 10);
      await indexFund.createIndexFund(
        "Test Fund #2 (Inactive)",
        "Inactive Test fund",
        [1, 2],
        false,
        50,
        0
      );
    });

    it("reverts when the message sender is not the owner", async function () {
      expect(indexFund.connect(user).removeIndexFund(1)).to.be.revertedWith("Unauthorized");
    });

    it("reverts when the fund is already expired", async function () {
      expect(indexFund.removeIndexFund(2)).to.be.revertedWith("Fund Expired");
    });

    it("passes when all inputs are correct", async function () {
      expect(await indexFund.removeIndexFund(1))
        .to.emit(indexFund, "FundRemoved")
        .withArgs(1);
    });
  });

  describe("Removing an endowment from all involved Funds", async function () {
    let indexFund: IndexFund;

    before(async function () {
      indexFund = await deployIndexFundAsProxy();
      // create 2 funds (1 active and 1 expired)
      await indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], true, 50, 10);
      await indexFund.createIndexFund(
        "Test Fund #2 (Inactive)",
        "Inactive Test fund",
        [1, 2],
        false,
        50,
        0
      );
    });

    it("reverts when the message sender is not the accounts contract", async function () {
      let regConfig = await registrar.queryConfig();
      expect(indexFund.connect(regConfig.accountsContract).removeMember(1)).to.be.revertedWith(
        "Unauthorized"
      );
    });

    it("passes with correct sender", async function () {
      let regConfig = await registrar.queryConfig();
      expect(await indexFund.connect(regConfig.accountsContract).removeMember(1)).to.emit(
        indexFund,
        "MemberRemoved"
      );
    });
  });

  describe("When a user deposits tokens to a Fund", async function () {
    let indexFund: IndexFund;

    before(async function () {
      indexFund = await deployIndexFundAsProxy();
      // create 1 fund
      await indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], true, 50, 10);
      await indexFund.createIndexFund(
        "Test Fund #2 (Inactive)",
        "Inactive Test fund",
        [1, 2],
        false,
        50,
        0
      );
    });

    it("reverts when amount is zero", async function () {
      expect(indexFund.connect(user).depositERC20(1, token1.address, 0, 50)).to.be.revertedWith(
        "Amount to donate must be greater than zero"
      );
    });

    it("reverts when fund passed is expired", async function () {
      expect(indexFund.connect(user).depositERC20(2, token1.address, 100, 50)).to.be.revertedWith(
        "Expired Fund"
      );
    });

    it("reverts when invalid token is passed", async function () {
      expect(
        indexFund.connect(user).depositERC20(1, ethers.constants.AddressZero, 100, 50)
      ).to.be.revertedWith("Invalid token");
    });

    it("reverts when liquid split passed greater than 100", async function () {
      expect(indexFund.connect(user).depositERC20(1, token1.address, 100, 105)).to.be.revertedWith(
        "Invalid liquid split"
      );
    });

    it("passes for a specific fund, amount > zero, spilt <= 100 & token is valid", async function () {
      // mint tokens so that the user and contract can transfer them
      await token1.mint(user.address, 100);
      await token1.mint(indexFund.address, 100);

      expect(await indexFund.connect(user).depositERC20(1, token1.address, 100, 50))
        .to.emit("DonationProcessed")
        .withArgs(1);
    });

    it("passes for active fund donation, amount > zero, spilt <= 100 & token is valid", async function () {
      // mint tokens so that the user and contract can transfer them
      await token1.mint(user.address, 100);
      await token1.mint(indexFund.address, 100);

      expect(await indexFund.connect(user).depositERC20(0, token1.address, 100, 50))
        .to.emit("DonationProcessed")
        .withArgs(1);
    });
  });
});
