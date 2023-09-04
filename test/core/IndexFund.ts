import {FakeContract, smock} from "@defi-wonderland/smock";
import {
  SnapshotRestorer,
  impersonateAccount,
  setBalance,
  takeSnapshot,
  time,
} from "@nomicfoundation/hardhat-network-helpers";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import {Signer} from "ethers";
import hre from "hardhat";
import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet";
import {DEFAULT_CHARITY_ENDOWMENT, DEFAULT_REGISTRAR_CONFIG, wait} from "test/utils";
import {
  AccountsDepositWithdrawEndowments__factory,
  DummyWMATIC,
  DummyWMATIC__factory,
  IERC20,
  IERC20__factory,
  IndexFund,
  IndexFund__factory,
  ProxyContract,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {getProxyAdminOwner, getSigners} from "utils";

describe("IndexFund", function () {
  const {ethers} = hre;

  const MAX_ENDOWMENT_MEMBERS = 10;

  let owner: Signer;
  let proxyAdmin: Signer;
  let user: Signer;

  let registrar: FakeContract<Registrar>;
  let wmatic: FakeContract<DummyWMATIC>;
  let token: FakeContract<IERC20>;

  let state: TestFacetProxyContract;
  let indexFund: IndexFund;

  async function deployIndexFundAsProxy(
    registrarContract = registrar.address,
    fundRotation: number = 0, // no block-based rotation
    fundingGoal: number = 10000
  ): Promise<ProxyContract> {
    const IndexFundFactory = new IndexFund__factory(owner);
    const IndexFundImpl = await IndexFundFactory.deploy();
    await IndexFundImpl.deployed();

    const ProxyContract = await ethers.getContractFactory("ProxyContract");
    const IndexFundInitData = IndexFundImpl.interface.encodeFunctionData("initialize", [
      registrarContract,
      fundRotation,
      fundingGoal,
    ]);
    const IndexFundProxy = await ProxyContract.deploy(
      IndexFundImpl.address,
      await proxyAdmin.getAddress(),
      IndexFundInitData
    );
    await IndexFundProxy.deployed();

    return IndexFundProxy;
  }

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.deployer;
    user = signers.apTeam1;

    proxyAdmin = await getProxyAdminOwner(hre);

    registrar = await smock.fake<Registrar>(new Registrar__factory());

    token = await smock.fake<IERC20>(IERC20__factory.createInterface());
    wmatic = await smock.fake<DummyWMATIC>(new DummyWMATIC__factory());
    token.transferFrom.returns(true);
    token.transfer.returns(true);
    token.approve.returns(true);

    // setup the Accounts DepositWithdraw Endowments facet once
    let Facet = new AccountsDepositWithdrawEndowments__factory(owner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    let nextAccountId = 1;
    // setup the various Endowments for testing index funds once
    // #1 - A closed endowment for error checks
    await wait(
      state.setClosingEndowmentState(nextAccountId, true, {
        data: {endowId: 0, addr: ethers.constants.AddressZero},
        enumData: 0,
      })
    );

    // #2 - A non-closing endowment
    await wait(
      state.setClosingEndowmentState(++nextAccountId, false, {
        data: {endowId: 0, addr: ethers.constants.AddressZero},
        enumData: 0,
      })
    );
    // accepts token for deposits
    await wait(state.setTokenAccepted(nextAccountId, token.address, true));
    // setup endowment with minimum needed for testing
    let endowment = DEFAULT_CHARITY_ENDOWMENT;
    await wait(state.setEndowmentDetails(nextAccountId, endowment));

    nextAccountId++;

    // #3 - A non-closing endowment
    await wait(
      state.setClosingEndowmentState(nextAccountId, false, {
        data: {endowId: 0, addr: ethers.constants.AddressZero},
        enumData: 0,
      })
    );
    // accepts token & wmatic for deposits
    await wait(state.setTokenAccepted(nextAccountId, token.address, true));
    await wait(state.setTokenAccepted(nextAccountId, wmatic.address, true));
    // setup endowment with minimum needed for testing
    await wait(state.setEndowmentDetails(nextAccountId, endowment));

    await wait(
      state.setConfig({
        owner: await owner.getAddress(),
        version: "1",
        networkName: "Polygon",
        registrarContract: registrar.address,
        nextAccountId: nextAccountId + 1,
        reentrancyGuardLocked: false,
      })
    );

    const proxy = await deployIndexFundAsProxy();
    indexFund = IndexFund__factory.connect(proxy.address, owner);

    // registrar config has the accounts & index fund contract addresses set
    const registrarConfig: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      wMaticAddress: wmatic.address,
      accountsContract: state.address,
      indexFundContract: indexFund.address,
      treasury: await owner.getAddress(),
    };
    registrar.queryConfig.returns(registrarConfig);
    registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);
  });

  describe("Deploying the contract", function () {
    let localSnapshot: SnapshotRestorer;

    beforeEach(async () => {
      localSnapshot = await takeSnapshot();
    });

    afterEach(async () => {
      await localSnapshot.restore();
    });

    it("Deploying the contract as an upgradable proxy", async function () {
      const proxy = await deployIndexFundAsProxy();
      const facet = IndexFund__factory.connect(proxy.address, owner);

      await expect(proxy.deployTransaction).to.emit(facet, "Instantiated");
    });

    it("reverts if an invalid fund rotation setup is passed", async function () {
      let rotation = 250;
      let goal = 5000;

      try {
        await deployIndexFundAsProxy(registrar.address, rotation, goal);
        throw new Error("Should not occur");
      } catch (error: any) {
        expect(error.reason).to.contain(
          "reverted with reason string 'Invalid Fund Rotation configuration"
        );
      }
    });

    it("reverts if registrar address passed is invalid", async function () {
      try {
        await deployIndexFundAsProxy(ethers.constants.AddressZero);
        throw new Error("Should not occur");
      } catch (error: any) {
        expect(error.reason).to.contain("reverted with custom error 'InvalidAddress");
      }
    });

    it("should have correct starting state values", async function () {
      let state = await indexFund.queryState();
      expect(state.roundDonations).to.equal(0);
      expect(state.activeFund).to.equal(0);

      let config = await indexFund.queryConfig();
      expect(config.fundRotation).to.equal(0);
      expect(config.fundingGoal).to.equal(10000);
    });
  });

  describe("Updating the Config", function () {
    let localSnapshot: SnapshotRestorer;

    beforeEach(async () => {
      localSnapshot = await takeSnapshot();
    });

    afterEach(async () => {
      await localSnapshot.restore();
    });

    it("reverts when the message sender is not the owner", async function () {
      await expect(
        indexFund.connect(user).updateConfig(registrar.address, 0, 5000)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("reverts when both rotation-related arguments are non-zero", async function () {
      await expect(indexFund.updateConfig(registrar.address, 200, 5000)).to.be.revertedWith(
        "Invalid Fund Rotation configuration"
      );
    });

    it("reverts if registrar address passed is invalid", async function () {
      await expect(
        indexFund.updateConfig(ethers.constants.AddressZero, 0, 5000)
      ).to.be.revertedWithCustomError(indexFund, "InvalidAddress");
    });

    it("passes with valid sender and all correct inputs", async function () {
      // update config with all the correct bits
      await expect(indexFund.updateConfig(registrar.address, 0, 5000)).to.emit(
        indexFund,
        "ConfigUpdated"
      );

      // query the new config and check that updates applied correctly
      let newConfig = await indexFund.queryConfig();
      expect(newConfig.fundRotation).to.equal(0);
      expect(newConfig.fundingGoal).to.equal(5000);
    });
  });

  describe("Creating a new Fund", function () {
    let localSnapshot: SnapshotRestorer;

    beforeEach(async () => {
      localSnapshot = await takeSnapshot();
    });

    afterEach(async () => {
      await localSnapshot.restore();
    });

    it("reverts when the message sender is not the owner", async function () {
      await expect(
        indexFund.connect(user).createIndexFund("Test Fund #1", "Test fund", [1, 2], false, 0, 0)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("reverts when no endowment members are passed", async function () {
      await expect(
        indexFund.createIndexFund("Test Fund #1", "Test fund", [], false, 0, 0)
      ).to.be.revertedWith("Fund must have one or more endowment members");
    });

    it("reverts when too many endowment members are passed (> fundMemberLimit)", async function () {
      await expect(
        indexFund.createIndexFund(
          "Test Fund #1",
          "Test fund",
          [...Array(MAX_ENDOWMENT_MEMBERS + 1).keys()],
          false,
          0,
          0
        )
      ).to.be.revertedWith("Fund endowment members exceeds upper limit");
    });

    it("reverts when the split is greater than 100", async function () {
      await expect(
        indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], false, 105, 0)
      ).to.be.revertedWith("Invalid split: must be less or equal to 100");
    });

    it("reverts when a non-zero expiryTime is passed, less than or equal to current time", async function () {
      let currTime = await time.latest();
      await expect(
        indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], false, 0, currTime)
      ).to.be.revertedWith("Invalid expiry time");
    });

    it("passes when all inputs are correct", async function () {
      // create a new fund with two Endowment members
      await expect(indexFund.createIndexFund("Test Fund #1", "Test fund", [1, 2], true, 0, 0))
        .to.emit(indexFund, "FundCreated")
        .withArgs(1);
      let activeFund = await indexFund.queryActiveFundDetails();
      expect(activeFund.id).to.equal(1);

      // check that the list of rotating funds has a length of 1
      let rotatingFunds = await indexFund.queryRotatingFunds();
      expect(rotatingFunds.length).to.equal(1);

      // create 1 expired fund
      let currTime = await time.latest();
      await expect(
        indexFund.createIndexFund("Test Fund #2", "Test fund", [3], true, 50, currTime + 42069)
      ).to.not.be.reverted;
      await time.increase(42069); // move time forward so Fund #2 is @ expiry

      // check that the list of rotating funds is now increased by 1 fund
      let newRotatingFunds = await indexFund.queryRotatingFunds();
      expect(newRotatingFunds.length).to.equal(rotatingFunds.length + 1);
    });
  });

  describe("Updating an existing Fund's endowment members", function () {
    let localSnapshot: SnapshotRestorer;
    let rootSnapshot: SnapshotRestorer;

    before(async function () {
      rootSnapshot = await takeSnapshot();

      let currTime = await time.latest();
      // create 1 active, non-rotating fund
      await wait(indexFund.createIndexFund("Test Fund #1", "Test fund", [2, 3], false, 50, 0));
      // create 1 expired, non-rotating fund
      await wait(
        indexFund.createIndexFund("Test Fund #2", "Test fund", [2, 3], false, 50, currTime + 42069)
      );
      await time.increase(42069); // move time forward so Fund #2 is @ expiry
    });

    beforeEach(async () => {
      localSnapshot = await takeSnapshot();
    });

    afterEach(async () => {
      await localSnapshot.restore();
    });

    after(async () => {
      await rootSnapshot.restore();
    });

    it("reverts when the message sender is not the owner", async function () {
      await expect(indexFund.connect(user).updateFundMembers(1, [1, 2], [])).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("reverts when no members are passed", async function () {
      await expect(indexFund.updateFundMembers(1, [], [])).to.be.revertedWith(
        "Must pass at least one endowment member to add to or remove from the Fund"
      );
    });

    it("reverts when too many members are passed", async function () {
      await expect(
        indexFund.updateFundMembers(1, [...Array(MAX_ENDOWMENT_MEMBERS + 1).keys()], [])
      ).to.be.revertedWith("Fund endowment members exceeds upper limit");
    });

    it("reverts when the fund is expired", async function () {
      await expect(indexFund.updateFundMembers(2, [1, 2], [])).to.be.revertedWith("Fund Expired");
    });

    it("passes when the fund is not expired and member inputs are valid", async function () {
      await expect(indexFund.updateFundMembers(1, [], [3]))
        .to.emit(indexFund, "MembersUpdated")
        .withArgs(1, [2]);

      await expect(indexFund.updateFundMembers(1, [1, 2], [3]))
        .to.emit(indexFund, "MembersUpdated")
        .withArgs(1, [2, 1]);
    });
  });

  describe("Removing an existing Fund", function () {
    let localSnapshot: SnapshotRestorer;
    let rootSnapshot: SnapshotRestorer;

    before(async function () {
      rootSnapshot = await takeSnapshot();

      let currTime = await time.latest();
      // create 1 active, non-rotating fund
      await wait(indexFund.createIndexFund("Test Fund #1", "Test fund", [2, 3], false, 50, 0));
      // create 1 expired, non-rotating fund
      await wait(
        indexFund.createIndexFund("Test Fund #2", "Test fund", [2, 3], false, 50, currTime + 42069)
      );
      await time.increase(42069); // move time forward so Fund #2 is @ expiry
    });

    beforeEach(async () => {
      localSnapshot = await takeSnapshot();
    });

    afterEach(async () => {
      await localSnapshot.restore();
    });

    after(async () => {
      await rootSnapshot.restore();
    });

    it("reverts when the message sender is not the owner", async function () {
      await expect(indexFund.connect(user).removeIndexFund(1)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("reverts when the fund is already expired", async function () {
      await expect(indexFund.removeIndexFund(2)).to.be.revertedWith("Fund Expired");
    });

    it("passes when all inputs are correct", async function () {
      await expect(indexFund.removeIndexFund(1)).to.emit(indexFund, "FundRemoved").withArgs(1);
    });
  });

  describe("Removing an endowment from all involved Funds", function () {
    let localSnapshot: SnapshotRestorer;
    let rootSnapshot: SnapshotRestorer;

    before(async function () {
      rootSnapshot = await takeSnapshot();

      let currTime = await time.latest();
      // create 1 active, non-rotating fund
      await wait(indexFund.createIndexFund("Test Fund #1", "Test fund", [2, 3], false, 50, 0));
      // create 1 expired, non-rotating fund
      await wait(
        indexFund.createIndexFund("Test Fund #2", "Test fund", [2, 3], false, 50, currTime + 42069)
      );
      await time.increase(42069); // move time forward so Fund #2 is @ expiry
    });

    beforeEach(async () => {
      localSnapshot = await takeSnapshot();
    });

    afterEach(async () => {
      await localSnapshot.restore();
    });

    after(async () => {
      await rootSnapshot.restore();
    });

    it("reverts when the message sender is not the accounts contract", async function () {
      await expect(indexFund.removeMember(1)).to.be.revertedWith("Unauthorized");
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
      await expect(indexFund.connect(acctSigner).removeMember(3)).to.emit(
        indexFund,
        "MemberRemoved"
      );

      // Endowment #1 should not be invloved with any funds now
      funds = await indexFund.queryInvolvedFunds(3);
      expect(funds.length).to.equal(0);
    });
  });

  describe("When a user deposits tokens to a Fund", function () {
    let localSnapshot: SnapshotRestorer;
    let rootSnapshot: SnapshotRestorer;

    before(async function () {
      rootSnapshot = await takeSnapshot();

      let currTime = await time.latest();
      // create 1 active, non-rotating fund
      await wait(indexFund.createIndexFund("Test Fund #1", "Test fund", [2, 3], false, 50, 0));
      // create 1 expired, non-rotating fund
      await wait(
        indexFund.createIndexFund("Test Fund #2", "Test fund", [2, 3], false, 50, currTime + 42069)
      );
      await time.increase(42069); // move time forward so Fund #2 is @ expiry
    });

    beforeEach(async () => {
      localSnapshot = await takeSnapshot();
    });

    afterEach(async () => {
      await localSnapshot.restore();
    });

    after(async () => {
      await rootSnapshot.restore();
    });

    it("reverts when amount is zero", async function () {
      await expect(indexFund.depositERC20(1, token.address, 0)).to.be.revertedWith(
        "Amount to donate must be greater than zero"
      );
    });

    it("reverts if the token isn't accepted", async function () {
      registrar.isTokenAccepted.whenCalledWith(token.address).returns(false);
      await expect(indexFund.depositERC20(1, token.address, 100)).to.be.revertedWith(
        "Unaccepted Token"
      );
      // reset isTokenAccepted behavior
      registrar.isTokenAccepted.whenCalledWith(token.address).returns(true);
    });

    it("reverts when fund passed is expired", async function () {
      await expect(indexFund.depositERC20(2, token.address, 100)).to.be.revertedWith(
        "Expired Fund"
      );
    });

    it("reverts when invalid token is passed", async function () {
      await expect(
        indexFund.depositERC20(1, ethers.constants.AddressZero, 100)
      ).to.be.revertedWithCustomError(indexFund, "InvalidToken");
    });

    it("reverts when amount donated, on a per endowment-basis for a fund, would be < min units", async function () {
      await expect(indexFund.depositERC20(1, token.address, 100)).to.be.revertedWith(
        "Amount must be enough to cover the minimum units per endowment for all members of a Fund"
      );
    });

    it("reverts when target fund is expired", async function () {
      await expect(indexFund.depositERC20(2, token.address, 100)).to.be.revertedWith(
        "Expired Fund"
      );
    });

    it("reverts when `0` Fund ID is passed with no rotating funds(empty)", async function () {
      // should fail with no rotating funds set
      await expect(indexFund.depositERC20(0, token.address, 100)).to.be.revertedWith(
        "No rotating funds"
      );
    });

    it("reverts when `0` Fund ID is passed with no un-expired rotating funds(0 after cleanup)", async function () {
      // create 1 expired, rotating fund
      let currTime = await time.latest();
      await expect(
        indexFund.createIndexFund("Test Fund #3", "Test fund", [2, 3], true, 50, currTime + 42069)
      )
        .to.emit(indexFund, "FundCreated")
        .withArgs(3);
      await time.increase(42069); // move time forward so Fund #3 is @ expiry

      // check that there is an active fund set
      let activeFund = await indexFund.queryActiveFundDetails();
      expect(activeFund.id).to.equal(3);

      // should fail when prep clean up process removes the expired fund, leaving 0 funds available
      await expect(indexFund.depositERC20(0, token.address, 500)).to.be.revertedWith(
        "No rotating funds"
      );
    });

    it("passes for a specific fund, amount > min & token is valid", async function () {
      // create 1 active, rotating fund
      const fundId = 3;
      await expect(indexFund.createIndexFund("Test Fund #3", "Test fund", [2, 3], true, 50, 0))
        .to.emit(indexFund, "FundCreated")
        .withArgs(fundId);

      await expect(indexFund.depositERC20(fundId, token.address, 500))
        .to.emit(indexFund, "DonationProcessed")
        .withArgs(fundId);
    });

    it("passes for an active fund donation(amount-based rotation), amount > min & token is valid", async function () {
      // create an active, rotating fund for full rotation testing
      const currActiveFund = 3;
      await expect(indexFund.createIndexFund("Test Fund #3", "Test fund", [2], true, 100, 0))
        .to.emit(indexFund, "FundCreated")
        .withArgs(currActiveFund);

      // create 1 more active, rotating fund for full rotation testing
      const nextActiveFund = 4;
      await expect(indexFund.createIndexFund("Test Fund #4", "Test fund", [2], true, 100, 0))
        .to.emit(indexFund, "FundCreated")
        .withArgs(nextActiveFund);

      let ifState = await indexFund.queryState();
      expect(ifState.activeFund).to.equal(currActiveFund);
      expect(ifState.roundDonations).to.equal(0);
      let ifRotating = await indexFund.queryRotatingFunds();
      expect(ifRotating.length).to.equal(2);

      // deposit: should fill whole active fund goal and rotate to next fund for final 1000
      await expect(indexFund.depositERC20(0, token.address, 11000))
        .to.emit(indexFund, "DonationProcessed")
        .withArgs(4);

      // check all donation metrics reflect expected
      ifState = await indexFund.queryState();
      expect(ifState.activeFund).to.equal(nextActiveFund);
      expect(ifState.roundDonations).to.equal(1000);

      // test with a LARGER donation amount for gas-usage and rotation stress-tests
      await expect(
        indexFund.depositERC20(0, token.address, 1000000, {
          // gasPrice: 100000, @Nenad: Just wondering, why is manual gas price needed?
          gasLimit: 10000000,
        })
      )
        .to.emit(indexFund, "DonationProcessed")
        .withArgs(nextActiveFund);
    });
  });
});
