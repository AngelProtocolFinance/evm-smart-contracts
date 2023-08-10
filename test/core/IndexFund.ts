import {FakeContract, smock} from "@defi-wonderland/smock";
import {expect} from "chai";
import hre from "hardhat";
import {BigNumber} from "ethers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {impersonateAccount, setBalance, time} from "@nomicfoundation/hardhat-network-helpers";
import {
  AccountsDepositWithdrawEndowments,
  AccountsDepositWithdrawEndowments__factory,
  DummyERC20,
  DummyERC20__factory,
  DummyWMATIC,
  DummyWMATIC__factory,
  IndexFund,
  IndexFund__factory,
  ITransparentUpgradeableProxy__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {DEFAULT_CHARITY_ENDOWMENT, DEFAULT_REGISTRAR_CONFIG} from "test/utils";
import {getSigners} from "utils";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";

describe("IndexFund", function () {
  const {ethers, upgrades} = hre;

  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;

  let registrar: FakeContract<Registrar>;
  let wmatic: FakeContract<DummyWMATIC>;
  let token: FakeContract<DummyERC20>;

  let facet: AccountsDepositWithdrawEndowments;
  let state: TestFacetProxyContract;

  async function deployIndexFundAsProxy(
    fundRotation: number = 0, // no block-based rotation
    fundingGoal: number = 10000
  ): Promise<IndexFund> {
    if (!registrar) {
      registrar = await smock.fake<Registrar>(new Registrar__factory());
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

    // registrar config has the accounts & index fund contract addresses set
    const registrarConfig: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      wMaticAddress: wmatic.address,
      accountsContract: facet.address,
      indexFundContract: IndexFundProxy.address,
      treasury: owner.address,
      splitToLiquid: {defaultSplit: 50, max: 100, min: 0},
    };
    registrar.queryConfig.returns(registrarConfig);
    registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);

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
    registrar = await smock.fake<Registrar>(new Registrar__factory());

    token = await smock.fake<DummyERC20>(new DummyERC20__factory());
    wmatic = await smock.fake<DummyWMATIC>(new DummyWMATIC__factory());
    token.transferFrom.returns(true);
    token.transfer.returns(true);
    token.approve.returns(true);

    const registrarConfig: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      wMaticAddress: wmatic.address,
      splitToLiquid: {defaultSplit: 50, max: 90, min: 10},
      treasury: owner.address,
    };
    registrar.queryConfig.returns(registrarConfig);
    registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);

    // setup the Accounts DepositWithdraw Endowments facet once
    let Facet = new AccountsDepositWithdrawEndowments__factory(owner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);
    await state.setConfig({
      owner: owner.address,
      version: "1",
      networkName: "Polygon",
      registrarContract: registrar.address,
      nextAccountId: 1,
      reentrancyGuardLocked: false,
    });
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
    // accepts token for deposits
    await state.setTokenAccepted(2, token.address, true);
    // setup endowment with minimum needed for testing
    let endowment = DEFAULT_CHARITY_ENDOWMENT;
    await state.setEndowmentDetails(2, endowment);

    // #3 - A non-closing endowment
    await state.setClosingEndowmentState(3, false, {
      data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero},
      enumData: 0,
    });
    // accepts token & wmatic for deposits
    await state.setTokenAccepted(3, token.address, true);
    await state.setTokenAccepted(3, wmatic.address, true);
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

    it("reverts if an invalid fund rotation setup is passed", async function () {
      let rotation = 250;
      let goal = 5000;
      expect(deployIndexFundAsProxy(rotation, goal)).to.be.revertedWith(
        "Invalid Registrar address"
      );
    });

    it("accepts rotation and goal as part of initialization", async function () {
      let rotation = 0;
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

    it("reverts when both rotation-related arguments are non-zero", async function () {
      expect(indexFund.updateConfig(registrar.address, 200, 5000)).to.be.revertedWith(
        "Invalid Fund Rotation configuration"
      );
    });

    it("reverts if registrar address passed is invalid", async function () {
      expect(indexFund.updateConfig(ethers.constants.AddressZero, 200, 5000)).to.be.revertedWith(
        "Invalid Registrar address"
      );
    });

    it("passes with valid sender and all correct inputs", async function () {
      // update config with all the correct bits
      expect(await indexFund.updateConfig(registrar.address, 0, 5000)).to.emit(
        indexFund,
        "ConfigUpdated"
      );

      // query the new config and check that updates applied correctly
      let newConfig = await indexFund.queryConfig();
      expect(newConfig.fundRotation).to.equal(0);
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

    it("reverts when a non-zero expiryTime is passed, less than or equal to current time", async function () {
      let currTime = await time.latest();
      expect(
        indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], false, 0, currTime)
      ).to.be.revertedWith("Invalid expiry time");
    });

    it("passes when all inputs are correct", async function () {
      // create a new fund with two Endowment members
      expect(await indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], true, 0, 0))
        .to.emit(indexFund, "FundCreated")
        .withArgs(1);
      let activeFund = await indexFund.queryActiveFundDetails();
      expect(activeFund.id).to.equal(1);

      // check that the list of rotating funds has a length of 1
      let rotatingFunds = await indexFund.queryRotatingFunds();
      expect(rotatingFunds.length).to.equal(1);

      // create 1 expired fund
      let currTime = await time.latest();
      await indexFund.createIndexFund("Test Fund #2", "Test fund", [3], true, 50, currTime + 42069);
      time.increase(42069); // move time forward so Fund #2 is @ expiry

      // check that the list of rotating funds is now increased by 1 fund
      let newRotatingFunds = await indexFund.queryRotatingFunds();
      expect(newRotatingFunds.length).to.equal(rotatingFunds.length + 1);
    });
  });

  describe("Updating an existing Fund's endowment members", async function () {
    let indexFund: IndexFund;

    before(async function () {
      indexFund = await deployIndexFundAsProxy();
      // create 2 funds (1 active and 1 expired)
      let currTime = await time.latest();
      await indexFund.createIndexFund("Test Fund #1", "Test fund", [2, 3], true, 50, 0);
      await indexFund.createIndexFund(
        "Test Fund #2",
        "Test fund",
        [3],
        false,
        50,
        currTime + 42069
      );
      time.increase(42069); // move time forward so Fund #2 is @ expiry
    });

    it("reverts when the message sender is not the owner", async function () {
      expect(indexFund.connect(user).updateFundMembers(1, [1, 2], [])).to.be.revertedWith(
        "Unauthorized"
      );
    });

    it("reverts when no members are passed", async function () {
      expect(indexFund.updateFundMembers(1, [], [])).to.be.revertedWith(
        "Must pass at least one endowment member to add to the Fund"
      );
    });

    it("reverts when too many members are passed", async function () {
      expect(indexFund.updateFundMembers(1, [1, 2, 3], [])).to.be.revertedWith(
        "Fund endowment members exceeds upper limit"
      );
    });

    it("reverts when the fund is expired", async function () {
      expect(indexFund.updateFundMembers(2, [1, 2], [])).to.be.revertedWith("Fund Expired");
    });

    it("passes when the fund is not expired and member inputs are valid", async function () {
      expect(await indexFund.updateFundMembers(1, [], [3]))
        .to.emit(indexFund, "MembersUpdated")
        .withArgs(1, [2]);

      expect(await indexFund.updateFundMembers(1, [1, 2], [3]))
        .to.emit(indexFund, "MembersUpdated")
        .withArgs(1, [1, 2]);
    });
  });

  describe("Removing an existing Fund", async function () {
    let indexFund: IndexFund;

    before(async function () {
      indexFund = await deployIndexFundAsProxy();
      // create 2 funds (1 active and 1 expired)
      let currTime = await time.latest();
      await indexFund.createIndexFund("Test Fund #1", "Test fund", [2, 3], true, 50, 0);
      await indexFund.createIndexFund(
        "Test Fund #2",
        "Test fund",
        [3],
        false,
        50,
        currTime + 42069
      );
      time.increase(42069); // move time forward so Fund #2 is @ expiry
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
      let currTime = await time.latest();
      await indexFund.createIndexFund("Test Fund #1", "Test fund", [2, 3], true, 50, 0);
      await indexFund.createIndexFund(
        "Test Fund #2",
        "Test fund",
        [3],
        false,
        50,
        currTime + 42069
      );
      time.increase(42069); // move time forward so Fund #2 is @ expiry
    });

    it("reverts when the message sender is not the accounts contract", async function () {
      expect(indexFund.removeMember(1)).to.be.revertedWith("Unauthorized");
    });

    it("passes with correct sender", async function () {
      // create a signer for the Accounts contract to send msgs from
      let regConfig = await registrar.queryConfig();
      await impersonateAccount(regConfig.accountsContract);
      await setBalance(regConfig.accountsContract, 1000000000000000000); // give it some gas money, as impersonateAccount does not
      const acctSigner = await ethers.getSigner(regConfig.accountsContract);

      // Endowment #1 should be invloved with two funds
      let funds = await indexFund.queryInvolvedFunds(3);
      expect(funds.length).to.equal(2);

      // remove Endowment #1 from all funds
      expect(await indexFund.connect(acctSigner).removeMember(3)).to.emit(
        indexFund,
        "MemberRemoved"
      );

      // Endowment #1 should not be invloved with any funds now
      funds = await indexFund.queryInvolvedFunds(3);
      expect(funds.length).to.equal(0);
    });
  });

  describe("When a user deposits tokens to a Fund", async function () {
    let indexFund: IndexFund;

    before(async function () {
      indexFund = await deployIndexFundAsProxy();
      // create 1 active, non-rotating fund
      await indexFund.createIndexFund("Test Fund #1", "Test fund", [2, 3], false, 50, 0);
      // create 1 expired, non-rotating fund
      let currTime = await time.latest();
      await indexFund.createIndexFund(
        "Test Fund #2",
        "Test fund",
        [2, 3],
        false,
        50,
        currTime + 42069
      );
      time.increase(42069); // move time forward so Fund #2 is @ expiry
      registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);
    });

    it("reverts when amount is zero", async function () {
      expect(indexFund.depositERC20(1, token.address, 0)).to.be.revertedWith(
        "Amount to donate must be greater than zero"
      );
    });

    it("reverts if the token isn't accepted", async function () {
      registrar.isTokenAccepted.returns(false);
      await expect(indexFund.depositERC20(1, token.address, 100)).to.be.revertedWith(
        "Unaccepted Token"
      );
      registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);
    });

    it("reverts when fund passed is expired", async function () {
      expect(indexFund.depositERC20(2, token.address, 100)).to.be.revertedWith("Expired Fund");
    });

    it("reverts when invalid token is passed", async function () {
      expect(indexFund.depositERC20(1, ethers.constants.AddressZero, 100)).to.be.revertedWith(
        "Invalid token"
      );
    });

    it("reverts when amount donated, on a per endowment-basis for a fund, would be < min units", async function () {
      expect(indexFund.depositERC20(1, token.address, 100)).to.be.revertedWith(
        "Amount must be enough to cover the minimum units per endowment for all members of a Fund"
      );
    });

    it("reverts when target fund is expired", async function () {
      expect(indexFund.depositERC20(2, token.address, 100)).to.be.revertedWith("Fund expired");
    });

    it("reverts when `0` Fund ID is passed with no rotating funds(empty)", async function () {
      // should fail with no rotating funds set
      expect(indexFund.depositERC20(0, token.address, 100)).to.be.revertedWith(
        "Must have rotating funds active to pass a Fund ID of 0"
      );
    });

    it("reverts when `0` Fund ID is passed with no un-expired rotating funds(0 after cleanup)", async function () {
      // create 1 expired, rotating fund
      let currTime = await time.latest();
      expect(
        await indexFund.createIndexFund(
          "Test Fund #3",
          "Test fund",
          [2, 3],
          true,
          50,
          currTime + 42069
        )
      )
        .to.emit(indexFund, "FundCreated")
        .withArgs(3);
      time.increase(42069); // move time forward so Fund #3 is @ expiry

      // check that there is an active fund set
      let activeFund = await indexFund.queryActiveFundDetails();
      expect(activeFund.id).to.equal(3);

      // should fail when prep clean up process removes the expired fund, leaving 0 funds available
      expect(indexFund.depositERC20(0, token.address, 500)).to.be.revertedWith(
        "Must have rotating funds active to pass a Fund ID of 0"
      );
    });

    it("passes for a specific fund, amount > min & token is valid", async function () {
      // create 1 active, rotating fund
      expect(await indexFund.createIndexFund("Test Fund #4", "Test fund", [2, 3], true, 50, 0))
        .to.emit(indexFund, "FundCreated")
        .withArgs(4);

      expect(
        await indexFund.depositERC20(4, token.address, 500, {
          gasPrice: 100000,
          gasLimit: 10000000,
        })
      )
        .to.emit(indexFund, "DonationProcessed")
        .withArgs(4);
    });

    it("passes for an active fund donation(amount-based rotation), amount > min & token is valid", async function () {
      // create 1 more active, rotating fund for full rotation testing
      expect(await indexFund.createIndexFund("Test Fund #5", "Test fund", [2], true, 100, 0))
        .to.emit(indexFund, "FundCreated")
        .withArgs(5);

      let ifState = await indexFund.queryState();
      expect(ifState.activeFund).to.equal(4);
      expect(ifState.roundDonations).to.equal(0);
      let ifRotating = await indexFund.queryRotatingFunds();
      expect(ifRotating.length).to.equal(2);

      // deposit: should fill whole active fund goal and rotate to next fund for final 1000
      expect(
        await indexFund.depositERC20(0, token.address, 11000, {
          gasPrice: 100000,
          gasLimit: 10000000,
        })
      )
        .to.emit(indexFund, "DonationProcessed")
        .withArgs(4);

      // check all donation metrics reflect expected
      ifState = await indexFund.queryState();
      expect(ifState.activeFund).to.equal(5);
      expect(ifState.roundDonations).to.equal(1000);

      // test with a LARGER donation amount for gas-usage and rotation stress-tests
      expect(
        await indexFund.depositERC20(0, token.address, 1000000, {
          gasPrice: 100000,
          gasLimit: 10000000,
        })
      )
        .to.emit(indexFund, "DonationProcessed")
        .withArgs(4);
    });
  });
});
