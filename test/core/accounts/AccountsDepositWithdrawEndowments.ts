import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {DEFAULT_CHARITY_ENDOWMENT, DEFAULT_REGISTRAR_CONFIG} from "test/utils";
import {
  AccountsDepositWithdrawEndowments,
  AccountsDepositWithdrawEndowments__factory,
  DonationMatch,
  DonationMatchCharity,
  DonationMatch__factory,
  DonationMatchCharity__factory,
  DummyWMATIC,
  DummyWMATIC__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
  DummyERC20,
  DummyERC20__factory,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsDepositWithdrawEndowments";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import "../../utils/setup";
import {deployFacetAsProxy} from "./utils/deployTestFacet";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";

use(smock.matchers);

describe("AccountsDepositWithdrawEndowments", function () {
  const {ethers} = hre;

  const value = BigNumber.from(10000);
  const charityId = 1;
  const normalEndowId = 2;
  const depositToCharity: AccountMessages.DepositRequestStruct = {
    id: charityId,
    liquidPercentage: 40,
    lockedPercentage: 60,
  };
  const depositToNormalEndow: AccountMessages.DepositRequestStruct = {
    id: normalEndowId,
    liquidPercentage: 40,
    lockedPercentage: 60,
  };

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let indexFund: SignerWithAddress;

  let facet: AccountsDepositWithdrawEndowments;
  let state: TestFacetProxyContract;

  let charity: AccountStorage.EndowmentStruct;
  let normalEndow: AccountStorage.EndowmentStruct;

  let registrarFake: FakeContract<Registrar>;
  let wmaticFake: FakeContract<DummyWMATIC>;
  let tokenFake: FakeContract<DummyERC20>;

  let registrarConfig: RegistrarStorage.ConfigStruct;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;
    indexFund = signers.apTeam2;

    charity = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      owner: endowOwner.address,
      daoToken: genWallet().address,
    };
    normalEndow = {...charity, endowType: 1, splitToLiquid: {defaultSplit: 40, max: 80, min: 20}};

    registrarFake = await smock.fake<Registrar>(new Registrar__factory());
  });

  beforeEach(async () => {
    let Facet = new AccountsDepositWithdrawEndowments__factory(accOwner);
    let facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);

    await state.setEndowmentDetails(charityId, charity);
    await state.setEndowmentDetails(normalEndowId, normalEndow);

    await state.setConfig({
      owner: accOwner.address,
      version: "1",
      networkName: "Polygon",
      registrarContract: registrarFake.address,
      nextAccountId: 3, // 2 endows already added
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      gateway: ethers.constants.AddressZero,
      gasReceiver: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });

    facet = AccountsDepositWithdrawEndowments__factory.connect(state.address, endowOwner);

    wmaticFake = await smock.fake<DummyWMATIC>(new DummyWMATIC__factory());

    tokenFake = await smock.fake<DummyERC20>(new DummyERC20__factory());
    tokenFake.transferFrom.returns(true);

    registrarConfig = {
      ...DEFAULT_REGISTRAR_CONFIG,
      haloToken: genWallet().address,
      indexFundContract: indexFund.address,
      wMaticAddress: wmaticFake.address,
      splitToLiquid: {defaultSplit: 50, max: 90, min: 10},
    };
    registrarFake.queryConfig.returns(registrarConfig);
    registrarFake.isTokenAccepted.whenCalledWith(tokenFake.address).returns(true);
  });

  describe("upon depositMatic", async function () {
    it("reverts if the deposit value is 0 (zero)", async () => {
      await expect(facet.depositMatic(depositToCharity, {value: 0})).to.be.revertedWith(
        "Invalid Amount"
      );
    });

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(charityId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(facet.depositMatic(depositToCharity, {value})).to.be.revertedWith(
        "Endowment is closed"
      );
    });

    it("reverts if the deposit to WMATIC fails", async () => {
      wmaticFake.deposit.reverts();
      await expect(facet.depositMatic(depositToCharity, {value})).to.be.revertedWith(
        "call reverted without message"
      );
    });

    it("reverts if the locked + liquid percentage does not equal 100", async () => {
      const invalidReq: AccountMessages.DepositRequestStruct = {
        id: charityId,
        liquidPercentage: 10,
        lockedPercentage: 10,
      };
      await expect(facet.depositMatic(invalidReq, {value})).to.be.revertedWith("InvalidSplit");
    });

    it("reverts if the deposit fee transfer fails", async () => {
      await state.setEndowmentDetails(charityId, {
        ...charity,
        depositFee: {payoutAddress: genWallet().address, bps: 5},
      });

      wmaticFake.transfer.returns(false);

      await expect(facet.depositMatic(depositToCharity, {value})).to.be.revertedWith(
        "Transfer Failed"
      );
    });

    it("reverts if no index fund contract is registered in the Registrar", async () => {
      const config: RegistrarStorage.ConfigStruct = {
        ...registrarConfig,
        indexFundContract: ethers.constants.AddressZero,
      };
      registrarFake.queryConfig.returns(config);

      await expect(facet.depositMatic(depositToCharity, {value})).to.be.revertedWith(
        "No Index Fund"
      );
    });

    describe("when sending from Index Fund", () => {
      let donationMatch: FakeContract<DonationMatch>;
      let donationMatchCharity: FakeContract<DonationMatchCharity>;

      before(async () => {
        donationMatch = await smock.fake<DonationMatch>(new DonationMatch__factory());
        donationMatchCharity = await smock.fake<DonationMatchCharity>(
          new DonationMatchCharity__factory()
        );
        await endowOwner.sendTransaction({
          value: ethers.utils.parseEther("1.0"),
          to: indexFund.address,
        });
      });

      describe("to charities", () => {
        it("successfully deposits MATIC", async () => {
          const expectedLockedAmt = BigNumber.from(0);
          const expectedLiquidAmt = BigNumber.from(value);

          await expect(
            facet
              .connect(indexFund)
              .depositMatic({id: charityId, lockedPercentage: 0, liquidPercentage: 100}, {value})
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(charityId, wmaticFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("successfully deposits MATIC including a deposit fee", async () => {
          const expectedFee = 10;
          const expectedLockedAmt = BigNumber.from(0);
          const expectedLiquidAmt = BigNumber.from(9990);

          const charityBps: AccountStorage.EndowmentStruct = {
            ...charity,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(charityId, charityBps);
          wmaticFake.transfer.returns(true);

          await expect(
            facet
              .connect(indexFund)
              .depositMatic({id: charityId, lockedPercentage: 0, liquidPercentage: 100}, {value})
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(charityId, wmaticFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(wmaticFake.transfer).to.have.been.calledWith(
            charityBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("skips donation matching when no donation match contract is registered in Registrar", async () => {
          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.connect(indexFund).depositMatic(depositToCharity, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToCharity.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation", async () => {
          const config: RegistrarStorage.ConfigStruct = {
            ...registrarConfig,
            donationMatchCharitesContract: donationMatchCharity.address,
          };
          registrarFake.queryConfig.returns(config);

          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.connect(indexFund).depositMatic(depositToCharity, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToCharity.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
            depositToCharity.id,
            expectedLockedAmt,
            indexFund.address,
            registrarConfig.haloToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation and includes a deposit fee", async () => {
          const expectedFee = 10;

          const charityBps: AccountStorage.EndowmentStruct = {
            ...charity,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(depositToCharity.id, charityBps);
          wmaticFake.transfer.returns(true);

          const config: RegistrarStorage.ConfigStruct = {
            ...registrarConfig,
            donationMatchCharitesContract: donationMatchCharity.address,
          };
          registrarFake.queryConfig.returns(config);

          const expectedLockedAmt = BigNumber.from(5994);
          const expectedLiquidAmt = BigNumber.from(3996);

          await expect(facet.connect(indexFund).depositMatic(depositToCharity, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToCharity.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(wmaticFake.transfer).to.have.been.calledWith(
            charityBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
            depositToCharity.id,
            expectedLockedAmt,
            indexFund.address,
            registrarConfig.haloToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });
      });

      describe("to normal endowments", () => {
        it("successfully deposits MATIC", async () => {
          const expectedLockedAmt = BigNumber.from(0);
          const expectedLiquidAmt = BigNumber.from(value);

          await expect(
            facet
              .connect(indexFund)
              .depositMatic(
                {id: normalEndowId, lockedPercentage: 0, liquidPercentage: 100},
                {value}
              )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(normalEndowId, wmaticFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("successfully deposits MATIC including a deposit fee", async () => {
          const expectedFee = 10;
          const expectedLockedAmt = BigNumber.from(0);
          const expectedLiquidAmt = BigNumber.from(9990);

          const normalEndowBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(normalEndowId, normalEndowBps);
          wmaticFake.transfer.returns(true);

          await expect(
            facet
              .connect(indexFund)
              .depositMatic(
                {id: normalEndowId, lockedPercentage: 0, liquidPercentage: 100},
                {value}
              )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(normalEndowId, wmaticFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(wmaticFake.transfer).to.have.been.calledWith(
            normalEndowBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("skips donation matching when no donation match contract is associated with said endowment", async () => {
          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.connect(indexFund).depositMatic(depositToNormalEndow, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation", async () => {
          await state.setEndowmentDetails(normalEndowId, {
            ...normalEndow,
            donationMatchContract: donationMatch.address,
          });

          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.connect(indexFund).depositMatic(depositToNormalEndow, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
            depositToNormalEndow.id,
            expectedLockedAmt,
            indexFund.address,
            normalEndow.daoToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation and includes a deposit fee", async () => {
          const expectedFee = 10;

          const normalEndowBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            donationMatchContract: donationMatch.address,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(depositToNormalEndow.id, normalEndowBps);
          wmaticFake.transfer.returns(true);

          const expectedLockedAmt = BigNumber.from(5994);
          const expectedLiquidAmt = BigNumber.from(3996);

          await expect(facet.connect(indexFund).depositMatic(depositToNormalEndow, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(wmaticFake.transfer).to.have.been.calledWith(
            normalEndowBps.depositFee.payoutAddress,
            expectedFee
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
          expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
            depositToNormalEndow.id,
            expectedLockedAmt,
            indexFund.address,
            normalEndow.daoToken
          );
        });
      });
    });

    describe("when sending from non-Index-Fund signers", () => {
      let donationMatch: FakeContract<DonationMatch>;
      let donationMatchCharity: FakeContract<DonationMatchCharity>;

      before(async () => {
        donationMatch = await smock.fake<DonationMatch>(new DonationMatch__factory());
        donationMatchCharity = await smock.fake<DonationMatchCharity>(
          new DonationMatchCharity__factory()
        );
      });

      describe("to charities", () => {
        it("deposits MATIC with no locked amount", async () => {
          const expectedLockedAmt = BigNumber.from(9000);
          const expectedLiquidAmt = BigNumber.from(1000);

          await expect(
            facet.depositMatic({id: charityId, lockedPercentage: 0, liquidPercentage: 100}, {value})
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(charityId, wmaticFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("deposits MATIC with no locked amount and includes a deposit fee", async () => {
          const expectedLockedAmt = BigNumber.from(8991);
          const expectedLiquidAmt = BigNumber.from(999);
          const expectedFee = 10;

          const charityBps: AccountStorage.EndowmentStruct = {
            ...charity,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(charityId, charityBps);
          wmaticFake.transfer.returns(true);

          await expect(
            facet.depositMatic({id: charityId, lockedPercentage: 0, liquidPercentage: 100}, {value})
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(charityId, wmaticFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(wmaticFake.transfer).to.have.been.calledWith(
            charityBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("skips donation matching when no donation match contract is registered in Registrar", async () => {
          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.depositMatic(depositToCharity, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToCharity.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation", async () => {
          const config: RegistrarStorage.ConfigStruct = {
            ...registrarConfig,
            donationMatchCharitesContract: donationMatchCharity.address,
          };
          registrarFake.queryConfig.returns(config);

          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.depositMatic(depositToCharity, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToCharity.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
            depositToCharity.id,
            expectedLockedAmt,
            await facet.signer.getAddress(),
            registrarConfig.haloToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation and includes a deposit fee", async () => {
          const expectedFee = 10;

          const charityBps: AccountStorage.EndowmentStruct = {
            ...charity,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(depositToCharity.id, charityBps);
          wmaticFake.transfer.returns(true);

          const config: RegistrarStorage.ConfigStruct = {
            ...registrarConfig,
            donationMatchCharitesContract: donationMatchCharity.address,
          };
          registrarFake.queryConfig.returns(config);

          const expectedLockedAmt = BigNumber.from(5994);
          const expectedLiquidAmt = BigNumber.from(3996);

          await expect(facet.depositMatic(depositToCharity, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToCharity.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(wmaticFake.transfer).to.have.been.calledWith(
            charityBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
            depositToCharity.id,
            expectedLockedAmt,
            await facet.signer.getAddress(),
            registrarConfig.haloToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });
      });

      describe("to normal endowments", () => {
        it("deposits MATIC with no locked amount", async () => {
          const expectedLockedAmt = BigNumber.from(8000);
          const expectedLiquidAmt = BigNumber.from(2000);

          await expect(
            facet.depositMatic(
              {id: normalEndowId, lockedPercentage: 0, liquidPercentage: 100},
              {value}
            )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(normalEndowId, wmaticFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("deposits MATIC with no locked amount and includes a deposit fee", async () => {
          const expectedLockedAmt = BigNumber.from(7992);
          const expectedLiquidAmt = BigNumber.from(1998);
          const expectedFee = 10;

          const normalEndowBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(normalEndowId, normalEndowBps);
          wmaticFake.transfer.returns(true);

          await expect(
            facet.depositMatic(
              {id: normalEndowId, lockedPercentage: 0, liquidPercentage: 100},
              {value}
            )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(normalEndowId, wmaticFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(wmaticFake.transfer).to.have.been.calledWith(
            normalEndowBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("skips donation matching when no donation match contract is associated with endowment being deposited to", async () => {
          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.depositMatic(depositToNormalEndow, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation", async () => {
          await state.setEndowmentDetails(normalEndowId, {
            ...normalEndow,
            donationMatchContract: donationMatch.address,
          });

          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.depositMatic(depositToNormalEndow, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
            depositToNormalEndow.id,
            expectedLockedAmt,
            await facet.signer.getAddress(),
            normalEndow.daoToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation and includes a deposit fee", async () => {
          const expectedFee = 10;

          const normalEndowBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            donationMatchContract: donationMatch.address,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(depositToNormalEndow.id, normalEndowBps);
          wmaticFake.transfer.returns(true);

          const expectedLockedAmt = BigNumber.from(5994);
          const expectedLiquidAmt = BigNumber.from(3996);

          await expect(facet.depositMatic(depositToNormalEndow, {value}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
          expect(wmaticFake.transfer).to.have.been.calledWith(
            normalEndowBps.depositFee.payoutAddress,
            expectedFee
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
          expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
            depositToNormalEndow.id,
            expectedLockedAmt,
            await facet.signer.getAddress(),
            normalEndow.daoToken
          );
        });
      });
    });
  });

  describe("upon depositERC20", async function () {
    const depositAmt = 10000;

    it("reverts if the token address is zero address", async () => {
      const invalidAddress = ethers.constants.AddressZero;
      await expect(
        facet.depositERC20(depositToCharity, invalidAddress, depositAmt)
      ).to.be.revertedWith("Invalid Token Address");
    });

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(charityId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(
        facet.depositERC20(depositToCharity, tokenFake.address, depositAmt)
      ).to.be.revertedWith("Endowment is closed");
    });

    it("reverts if the token is neither in the protocol-level accepted tokens list in the Registrar contract nor in the endowment-level accepted tokens list", async () => {
      registrarFake.isTokenAccepted.whenCalledWith(tokenFake.address).returns(false);
      await expect(
        facet.depositERC20(depositToCharity, tokenFake.address, depositAmt)
      ).to.be.revertedWith("Not in an Accepted Tokens List");
    });

    it("reverts if the ERC20 transfer to the facet fails", async () => {
      tokenFake.transferFrom.returns(false);

      await expect(
        facet.depositERC20(depositToCharity, tokenFake.address, depositAmt)
      ).to.be.revertedWith("Transfer failed");
    });

    it("reverts if the locked + liquid percentage does not equal 100", async () => {
      const invalidReq: AccountMessages.DepositRequestStruct = {
        id: charityId,
        liquidPercentage: 10,
        lockedPercentage: 10,
      };
      await expect(
        facet.depositERC20(invalidReq, tokenFake.address, depositAmt)
      ).to.be.revertedWith("InvalidSplit");
    });

    it("reverts if the deposit fee transfer fails", async () => {
      await state.setEndowmentDetails(charityId, {
        ...charity,
        depositFee: {payoutAddress: genWallet().address, bps: 5},
      });

      wmaticFake.transfer.returns(false);

      await expect(
        facet.depositERC20(depositToCharity, tokenFake.address, depositAmt)
      ).to.be.revertedWith("Transfer Failed");
    });

    it("reverts if no index fund contract is registered in the Registrar", async () => {
      const config: RegistrarStorage.ConfigStruct = {
        ...registrarConfig,
        indexFundContract: ethers.constants.AddressZero,
      };
      registrarFake.queryConfig.returns(config);

      await expect(
        facet.depositERC20(depositToCharity, tokenFake.address, depositAmt)
      ).to.be.revertedWith("No Index Fund");
    });

    describe("when sending from Index Fund", () => {
      let donationMatch: FakeContract<DonationMatch>;
      let donationMatchCharity: FakeContract<DonationMatchCharity>;

      before(async () => {
        donationMatch = await smock.fake<DonationMatch>(new DonationMatch__factory());
        donationMatchCharity = await smock.fake<DonationMatchCharity>(
          new DonationMatchCharity__factory()
        );
      });

      describe("to charities", () => {
        it("successfully deposits an ERC20", async () => {
          const expectedLockedAmt = BigNumber.from(0);
          const expectedLiquidAmt = BigNumber.from(depositAmt);

          await expect(
            facet
              .connect(indexFund)
              .depositERC20(
                {id: charityId, lockedPercentage: 0, liquidPercentage: 100},
                tokenFake.address,
                depositAmt
              )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(charityId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("successfully deposits an ERC20 including a deposit fee", async () => {
          const expectedFee = 10;
          const expectedLockedAmt = BigNumber.from(0);
          const expectedLiquidAmt = BigNumber.from(9990);

          const charityBps: AccountStorage.EndowmentStruct = {
            ...charity,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(charityId, charityBps);
          tokenFake.transfer.returns(true);

          await expect(
            facet
              .connect(indexFund)
              .depositERC20(
                {id: charityId, lockedPercentage: 0, liquidPercentage: 100},
                tokenFake.address,
                depositAmt
              )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(charityId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(tokenFake.transfer).to.have.been.calledWith(
            charityBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("skips donation matching when no donation match contract is registered in Registrar", async () => {
          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(
            facet.connect(indexFund).depositERC20(depositToCharity, tokenFake.address, depositAmt)
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(depositToCharity.id, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation", async () => {
          const config: RegistrarStorage.ConfigStruct = {
            ...registrarConfig,
            donationMatchCharitesContract: donationMatchCharity.address,
          };
          registrarFake.queryConfig.returns(config);

          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(
            facet.connect(indexFund).depositERC20(depositToCharity, tokenFake.address, depositAmt)
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(depositToCharity.id, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
            depositToCharity.id,
            expectedLockedAmt,
            indexFund.address,
            registrarConfig.haloToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation and includes a deposit fee", async () => {
          const expectedFee = 10;

          const charityBps: AccountStorage.EndowmentStruct = {
            ...charity,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(depositToCharity.id, charityBps);
          tokenFake.transfer.returns(true);

          const config: RegistrarStorage.ConfigStruct = {
            ...registrarConfig,
            donationMatchCharitesContract: donationMatchCharity.address,
          };
          registrarFake.queryConfig.returns(config);

          const expectedLockedAmt = BigNumber.from(5994);
          const expectedLiquidAmt = BigNumber.from(3996);

          await expect(
            facet.connect(indexFund).depositERC20(depositToCharity, tokenFake.address, depositAmt)
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(depositToCharity.id, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(tokenFake.transfer).to.have.been.calledWith(
            charityBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
            depositToCharity.id,
            expectedLockedAmt,
            indexFund.address,
            registrarConfig.haloToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });
      });

      describe("to normal endowments", () => {
        it("successfully deposits an ERC20", async () => {
          const expectedLockedAmt = BigNumber.from(0);
          const expectedLiquidAmt = BigNumber.from(depositAmt);

          await expect(
            facet
              .connect(indexFund)
              .depositERC20(
                {id: normalEndowId, lockedPercentage: 0, liquidPercentage: 100},
                tokenFake.address,
                depositAmt
              )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(normalEndowId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("successfully deposits an ERC20 including a deposit fee", async () => {
          const expectedFee = 10;
          const expectedLockedAmt = BigNumber.from(0);
          const expectedLiquidAmt = BigNumber.from(9990);

          const normalEndowBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(normalEndowId, normalEndowBps);
          tokenFake.transfer.returns(true);

          await expect(
            facet
              .connect(indexFund)
              .depositERC20(
                {id: normalEndowId, lockedPercentage: 0, liquidPercentage: 100},
                tokenFake.address,
                depositAmt
              )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(normalEndowId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(tokenFake.transfer).to.have.been.calledWith(
            normalEndowBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("skips donation matching when no donation match contract is associated with said endowment", async () => {
          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(
            facet
              .connect(indexFund)
              .depositERC20(depositToNormalEndow, tokenFake.address, depositAmt)
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              tokenFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation", async () => {
          await state.setEndowmentDetails(normalEndowId, {
            ...normalEndow,
            donationMatchContract: donationMatch.address,
          });

          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(
            facet
              .connect(indexFund)
              .depositERC20(depositToNormalEndow, tokenFake.address, depositAmt)
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              tokenFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
            depositToNormalEndow.id,
            expectedLockedAmt,
            indexFund.address,
            normalEndow.daoToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation and includes a deposit fee", async () => {
          const expectedFee = 10;

          const normalEndowBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            donationMatchContract: donationMatch.address,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(depositToNormalEndow.id, normalEndowBps);
          tokenFake.transfer.returns(true);

          const expectedLockedAmt = BigNumber.from(5994);
          const expectedLiquidAmt = BigNumber.from(3996);

          await expect(
            facet
              .connect(indexFund)
              .depositERC20(depositToNormalEndow, tokenFake.address, depositAmt)
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              tokenFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(tokenFake.transfer).to.have.been.calledWith(
            normalEndowBps.depositFee.payoutAddress,
            expectedFee
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
          expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
            depositToNormalEndow.id,
            expectedLockedAmt,
            indexFund.address,
            normalEndow.daoToken
          );
        });
      });
    });

    describe("when sending from non-Index-Fund signers", () => {
      let donationMatch: FakeContract<DonationMatch>;
      let donationMatchCharity: FakeContract<DonationMatchCharity>;

      before(async () => {
        donationMatch = await smock.fake<DonationMatch>(new DonationMatch__factory());
        donationMatchCharity = await smock.fake<DonationMatchCharity>(
          new DonationMatchCharity__factory()
        );
      });

      describe("to charities", () => {
        it("deposits an ERC20 with no locked amount", async () => {
          const expectedLockedAmt = BigNumber.from(9000);
          const expectedLiquidAmt = BigNumber.from(1000);

          await expect(
            facet.depositERC20(
              {id: charityId, lockedPercentage: 0, liquidPercentage: 100},
              tokenFake.address,
              depositAmt
            )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(charityId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("deposits an ERC20 with no locked amount and includes a deposit fee", async () => {
          const expectedLockedAmt = BigNumber.from(8991);
          const expectedLiquidAmt = BigNumber.from(999);
          const expectedFee = 10;

          const charityBps: AccountStorage.EndowmentStruct = {
            ...charity,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(charityId, charityBps);
          tokenFake.transfer.returns(true);

          await expect(
            facet.depositERC20(
              {id: charityId, lockedPercentage: 0, liquidPercentage: 100},
              tokenFake.address,
              depositAmt
            )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(charityId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(tokenFake.transfer).to.have.been.calledWith(
            charityBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("skips donation matching when no donation match contract is registered in Registrar", async () => {
          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.depositERC20(depositToCharity, tokenFake.address, depositAmt))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(depositToCharity.id, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation", async () => {
          const config: RegistrarStorage.ConfigStruct = {
            ...registrarConfig,
            donationMatchCharitesContract: donationMatchCharity.address,
          };
          registrarFake.queryConfig.returns(config);

          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.depositERC20(depositToCharity, tokenFake.address, depositAmt))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(depositToCharity.id, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
            depositToCharity.id,
            expectedLockedAmt,
            await facet.signer.getAddress(),
            registrarConfig.haloToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation and includes a deposit fee", async () => {
          const expectedFee = 10;

          const charityBps: AccountStorage.EndowmentStruct = {
            ...charity,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(depositToCharity.id, charityBps);
          tokenFake.transfer.returns(true);

          const config: RegistrarStorage.ConfigStruct = {
            ...registrarConfig,
            donationMatchCharitesContract: donationMatchCharity.address,
          };
          registrarFake.queryConfig.returns(config);

          const expectedLockedAmt = BigNumber.from(5994);
          const expectedLiquidAmt = BigNumber.from(3996);

          await expect(facet.depositERC20(depositToCharity, tokenFake.address, depositAmt))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(depositToCharity.id, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(tokenFake.transfer).to.have.been.calledWith(
            charityBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
            depositToCharity.id,
            expectedLockedAmt,
            await facet.signer.getAddress(),
            registrarConfig.haloToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });
      });

      describe("to normal endowments", () => {
        it("deposits an ERC20 with no locked amount", async () => {
          const expectedLockedAmt = BigNumber.from(8000);
          const expectedLiquidAmt = BigNumber.from(2000);

          await expect(
            facet.depositERC20(
              {id: normalEndowId, lockedPercentage: 0, liquidPercentage: 100},
              tokenFake.address,
              depositAmt
            )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(normalEndowId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("deposits an ERC20 with no locked amount and includes a deposit fee", async () => {
          const expectedLockedAmt = BigNumber.from(7992);
          const expectedLiquidAmt = BigNumber.from(1998);
          const expectedFee = 10;

          const normalEndowBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(normalEndowId, normalEndowBps);
          tokenFake.transfer.returns(true);

          await expect(
            facet.depositERC20(
              {id: normalEndowId, lockedPercentage: 0, liquidPercentage: 100},
              tokenFake.address,
              depositAmt
            )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(normalEndowId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(tokenFake.transfer).to.have.been.calledWith(
            normalEndowBps.depositFee.payoutAddress,
            expectedFee
          );
          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("skips donation matching when no donation match contract is associated with endowment being deposited to", async () => {
          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.depositERC20(depositToNormalEndow, tokenFake.address, depositAmt))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              tokenFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(donationMatch.executeDonorMatch).to.not.have.been.called;

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation", async () => {
          await state.setEndowmentDetails(normalEndowId, {
            ...normalEndow,
            donationMatchContract: donationMatch.address,
          });

          const expectedLockedAmt = BigNumber.from(6000);
          const expectedLiquidAmt = BigNumber.from(4000);

          await expect(facet.depositERC20(depositToNormalEndow, tokenFake.address, depositAmt))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              tokenFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
            depositToNormalEndow.id,
            expectedLockedAmt,
            await facet.signer.getAddress(),
            normalEndow.daoToken
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("matches the donation and includes a deposit fee", async () => {
          const expectedFee = 10;

          const normalEndowBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            donationMatchContract: donationMatch.address,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(depositToNormalEndow.id, normalEndowBps);
          tokenFake.transfer.returns(true);

          const expectedLockedAmt = BigNumber.from(5994);
          const expectedLiquidAmt = BigNumber.from(3996);

          await expect(facet.depositERC20(depositToNormalEndow, tokenFake.address, depositAmt))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              tokenFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(tokenFake.transfer).to.have.been.calledWith(
            normalEndowBps.depositFee.payoutAddress,
            expectedFee
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
          expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
            depositToNormalEndow.id,
            expectedLockedAmt,
            await facet.signer.getAddress(),
            normalEndow.daoToken
          );
        });
      });
    });
  });
});
