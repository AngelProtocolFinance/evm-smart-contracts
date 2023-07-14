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
    normalEndow = {...charity, endowType: 1};

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

    registrarConfig = {
      ...DEFAULT_REGISTRAR_CONFIG,
      wMaticAddress: wmaticFake.address,
      indexFundContract: indexFund.address,
      haloToken: genWallet().address,
    };
    registrarFake.queryConfig.returns(registrarConfig);
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

      it("deposits MATIC with no locked amount", async () => {
        await expect(
          facet
            .connect(indexFund)
            .depositMatic({id: charityId, lockedPercentage: 0, liquidPercentage: 100}, {value})
        )
          .to.emit(facet, "EndowmentDeposit")
          .withArgs(charityId, wmaticFake.address, 0, 10000);

        expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
        expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;
        expect(donationMatch.executeDonorMatch).to.not.have.been.called;

        const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
          charityId,
          wmaticFake.address
        );
        expect(lockedBal).to.equal(BigNumber.from(0));
        expect(liquidBal).to.equal(BigNumber.from(10000));
      });

      it("deposits MATIC with no locked amount but including a deposit fee", async () => {
        const expectedFee = 10;

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
          .withArgs(charityId, wmaticFake.address, 0, 9990);

        expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
        expect(wmaticFake.transfer).to.have.been.calledWith(
          charityBps.depositFee.payoutAddress,
          expectedFee
        );
        expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;
        expect(donationMatch.executeDonorMatch).to.not.have.been.called;

        const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
          charityId,
          wmaticFake.address
        );
        expect(lockedBal).to.equal(BigNumber.from(0));
        expect(liquidBal).to.equal(BigNumber.from(9990));
      });

      describe("upon depositing MATIC with locked amount", () => {
        it("skips donation matching for a charity when no donation match contract is registered in Registrar", async () => {
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

        it("skips donation matching for a normal endowment when no donation match contract is associated with said endowment", async () => {
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

        it("matches the donation to a charity", async () => {
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

        it("matches the donation to a normal endowment", async () => {
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

        it("matches the donation to a charity, but includes a deposit fee", async () => {
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

        it("matches the donation to a normal endowment, but includes a deposit fee", async () => {
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

      it("deposits MATIC with no locked amount", async () => {
        await expect(
          facet.depositMatic({id: charityId, lockedPercentage: 0, liquidPercentage: 100}, {value})
        )
          .to.emit(facet, "EndowmentDeposit")
          .withArgs(charityId, wmaticFake.address, 0, 10000);

        expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
        expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;
        expect(donationMatch.executeDonorMatch).to.not.have.been.called;

        const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
          charityId,
          wmaticFake.address
        );
        expect(lockedBal).to.equal(BigNumber.from(0));
        expect(liquidBal).to.equal(BigNumber.from(10000));
      });

      // it("deposits MATIC with no locked amount but including a deposit fee", async () => {
      //   const expectedFee = 10;

      //   const charityBps: AccountStorage.EndowmentStruct = {
      //     ...charity,
      //     depositFee: {payoutAddress: genWallet().address, bps: 10},
      //   };
      //   await state.setEndowmentDetails(charityId, charityBps);
      //   wmaticFake.transfer.returns(true);

      //   await expect(
      //     facet
      //
      //       .depositMatic({id: charityId, lockedPercentage: 0, liquidPercentage: 100}, {value})
      //   )
      //     .to.emit(facet, "EndowmentDeposit")
      //     .withArgs(charityId, wmaticFake.address, 0, 9990);

      //   expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
      //   expect(wmaticFake.transfer).to.have.been.calledWith(
      //     charityBps.depositFee.payoutAddress,
      //     expectedFee
      //   );
      //   expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;
      //   expect(donationMatch.executeDonorMatch).to.not.have.been.called;

      //   const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
      //     charityId,
      //     wmaticFake.address
      //   );
      //   expect(lockedBal).to.equal(BigNumber.from(0));
      //   expect(liquidBal).to.equal(BigNumber.from(9990));
      // });

      // describe("upon depositing MATIC with locked amount", () => {
      //   it("skips donation matching for a charity when no donation match contract is registered in Registrar", async () => {
      //     const expectedLockedAmt = BigNumber.from(6000);
      //     const expectedLiquidAmt = BigNumber.from(4000);

      //     await expect(facet.depositMatic(depositToCharity, {value}))
      //       .to.emit(facet, "EndowmentDeposit")
      //       .withArgs(
      //         depositToCharity.id,
      //         wmaticFake.address,
      //         expectedLockedAmt,
      //         expectedLiquidAmt
      //       );

      //     expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
      //     expect(donationMatchCharity.executeDonorMatch).to.not.have.been.called;

      //     const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
      //       depositToCharity.id,
      //       wmaticFake.address
      //     );
      //     expect(lockedBal).to.equal(expectedLockedAmt);
      //     expect(liquidBal).to.equal(expectedLiquidAmt);
      //   });

      //   it("skips donation matching for a normal endowment when no donation match contract is associated with said endowment", async () => {
      //     const expectedLockedAmt = BigNumber.from(6000);
      //     const expectedLiquidAmt = BigNumber.from(4000);

      //     await expect(facet.depositMatic(depositToNormalEndow, {value}))
      //       .to.emit(facet, "EndowmentDeposit")
      //       .withArgs(
      //         depositToNormalEndow.id,
      //         wmaticFake.address,
      //         expectedLockedAmt,
      //         expectedLiquidAmt
      //       );

      //     expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
      //     expect(donationMatch.executeDonorMatch).to.not.have.been.called;

      //     const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
      //       depositToNormalEndow.id,
      //       wmaticFake.address
      //     );
      //     expect(lockedBal).to.equal(expectedLockedAmt);
      //     expect(liquidBal).to.equal(expectedLiquidAmt);
      //   });

      //   it("matches the donation to a charity", async () => {
      //     const config: RegistrarStorage.ConfigStruct = {
      //       ...registrarConfig,
      //       donationMatchCharitesContract: donationMatchCharity.address,
      //     };
      //     registrarFake.queryConfig.returns(config);

      //     const expectedLockedAmt = BigNumber.from(6000);
      //     const expectedLiquidAmt = BigNumber.from(4000);

      //     await expect(facet.depositMatic(depositToCharity, {value}))
      //       .to.emit(facet, "EndowmentDeposit")
      //       .withArgs(
      //         depositToCharity.id,
      //         wmaticFake.address,
      //         expectedLockedAmt,
      //         expectedLiquidAmt
      //       );

      //     expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
      //     expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
      //       depositToCharity.id,
      //       expectedLockedAmt,
      //       indexFund.address,
      //       registrarConfig.haloToken
      //     );

      //     const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
      //       depositToCharity.id,
      //       wmaticFake.address
      //     );
      //     expect(lockedBal).to.equal(expectedLockedAmt);
      //     expect(liquidBal).to.equal(expectedLiquidAmt);
      //   });

      //   it("matches the donation to a normal endowment", async () => {
      //     await state.setEndowmentDetails(normalEndowId, {
      //       ...normalEndow,
      //       donationMatchContract: donationMatch.address,
      //     });

      //     const expectedLockedAmt = BigNumber.from(6000);
      //     const expectedLiquidAmt = BigNumber.from(4000);

      //     await expect(facet.depositMatic(depositToNormalEndow, {value}))
      //       .to.emit(facet, "EndowmentDeposit")
      //       .withArgs(
      //         depositToNormalEndow.id,
      //         wmaticFake.address,
      //         expectedLockedAmt,
      //         expectedLiquidAmt
      //       );

      //     expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
      //     expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
      //       depositToNormalEndow.id,
      //       expectedLockedAmt,
      //       indexFund.address,
      //       normalEndow.daoToken
      //     );

      //     const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
      //       depositToNormalEndow.id,
      //       wmaticFake.address
      //     );
      //     expect(lockedBal).to.equal(expectedLockedAmt);
      //     expect(liquidBal).to.equal(expectedLiquidAmt);
      //   });

      //   it("matches the donation to a charity, but includes a deposit fee", async () => {
      //     const expectedFee = 10;

      //     const charityBps: AccountStorage.EndowmentStruct = {
      //       ...charity,
      //       depositFee: {payoutAddress: genWallet().address, bps: 10},
      //     };
      //     await state.setEndowmentDetails(depositToCharity.id, charityBps);
      //     wmaticFake.transfer.returns(true);

      //     const config: RegistrarStorage.ConfigStruct = {
      //       ...registrarConfig,
      //       donationMatchCharitesContract: donationMatchCharity.address,
      //     };
      //     registrarFake.queryConfig.returns(config);

      //     const expectedLockedAmt = BigNumber.from(5994);
      //     const expectedLiquidAmt = BigNumber.from(3996);

      //     await expect(facet.depositMatic(depositToCharity, {value}))
      //       .to.emit(facet, "EndowmentDeposit")
      //       .withArgs(
      //         depositToCharity.id,
      //         wmaticFake.address,
      //         expectedLockedAmt,
      //         expectedLiquidAmt
      //       );

      //     expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
      //     expect(wmaticFake.transfer).to.have.been.calledWith(
      //       charityBps.depositFee.payoutAddress,
      //       expectedFee
      //     );
      //     expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
      //       depositToCharity.id,
      //       expectedLockedAmt,
      //       indexFund.address,
      //       registrarConfig.haloToken
      //     );

      //     const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
      //       depositToCharity.id,
      //       wmaticFake.address
      //     );
      //     expect(lockedBal).to.equal(expectedLockedAmt);
      //     expect(liquidBal).to.equal(expectedLiquidAmt);
      //   });

      //   it("matches the donation to a normal endowment, but includes a deposit fee", async () => {
      //     const expectedFee = 10;

      //     const normalEndowBps: AccountStorage.EndowmentStruct = {
      //       ...normalEndow,
      //       donationMatchContract: donationMatch.address,
      //       depositFee: {payoutAddress: genWallet().address, bps: 10},
      //     };
      //     await state.setEndowmentDetails(depositToNormalEndow.id, normalEndowBps);
      //     wmaticFake.transfer.returns(true);

      //     const expectedLockedAmt = BigNumber.from(5994);
      //     const expectedLiquidAmt = BigNumber.from(3996);

      //     await expect(facet.depositMatic(depositToNormalEndow, {value}))
      //       .to.emit(facet, "EndowmentDeposit")
      //       .withArgs(
      //         depositToNormalEndow.id,
      //         wmaticFake.address,
      //         expectedLockedAmt,
      //         expectedLiquidAmt
      //       );

      //     expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
      //     expect(wmaticFake.transfer).to.have.been.calledWith(
      //       normalEndowBps.depositFee.payoutAddress,
      //       expectedFee
      //     );

      //     const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
      //       depositToNormalEndow.id,
      //       wmaticFake.address
      //     );
      //     expect(lockedBal).to.equal(expectedLockedAmt);
      //     expect(liquidBal).to.equal(expectedLiquidAmt);
      //     expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
      //       depositToNormalEndow.id,
      //       expectedLockedAmt,
      //       indexFund.address,
      //       normalEndow.daoToken
      //     );
      //   });
      // });
    });
  });
});
