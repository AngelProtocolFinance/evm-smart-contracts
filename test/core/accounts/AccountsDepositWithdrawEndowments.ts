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
      await expect(facet.depositMatic(depositToCharity, {value: 10000})).to.be.revertedWith(
        "Endowment is closed"
      );
    });

    it("reverts if the locked + liquid percentage does not equal 100", async () => {
      const invalidReq: AccountMessages.DepositRequestStruct = {
        id: charityId,
        liquidPercentage: 10,
        lockedPercentage: 10,
      };
      await expect(facet.depositMatic(invalidReq, {value: 10000})).to.be.revertedWith(
        "InvalidSplit"
      );
    });

    it("reverts if the deposit fee transfer fails", async () => {
      await state.setEndowmentDetails(charityId, {
        ...charity,
        depositFee: {payoutAddress: genWallet().address, bps: 5},
      });

      wmaticFake.transfer.returns(false);

      await expect(facet.depositMatic(depositToCharity, {value: 10000})).to.be.revertedWith(
        "Transfer Failed"
      );
    });

    it("reverts if no index fund contract is registered in the Registrar", async () => {
      const config: RegistrarStorage.ConfigStruct = {
        ...registrarConfig,
        indexFundContract: ethers.constants.AddressZero,
      };
      registrarFake.queryConfig.returns(config);

      await expect(facet.depositMatic(depositToCharity, {value: 10000})).to.be.revertedWith(
        "No Index Fund"
      );
    });

    describe("from Index Fund", () => {
      before(async () => {
        await endowOwner.sendTransaction({
          value: ethers.utils.parseEther("1.0"),
          to: indexFund.address,
        });
      });

      it("deposits MATIC with no locked amount", async () => {
        await expect(
          facet
            .connect(indexFund)
            .depositMatic(
              {id: charityId, lockedPercentage: 0, liquidPercentage: 100},
              {value: 10000}
            )
        )
          .to.emit(facet, "EndowmentDeposit")
          .withArgs(charityId, wmaticFake.address, 0, 10000);

        const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
          charityId,
          wmaticFake.address
        );
        expect(lockedBal).to.equal(BigNumber.from(0));
        expect(liquidBal).to.equal(BigNumber.from(10000));
      });

      describe("upon depositing MATIC with locked amount", () => {
        let donationMatch: FakeContract<DonationMatch>;
        let donationMatchCharity: FakeContract<DonationMatchCharity>;

        before(async () => {
          donationMatch = await smock.fake<DonationMatch>(new DonationMatch__factory());
          donationMatchCharity = await smock.fake<DonationMatchCharity>(
            new DonationMatchCharity__factory()
          );
        });

        it("matches the donation using DonationMatchCharity when called for a charity", async () => {
          const config: RegistrarStorage.ConfigStruct = {
            ...registrarConfig,
            donationMatchCharitesContract: donationMatchCharity.address,
          };
          registrarFake.queryConfig.returns(config);

          const expectedLockedAmt = 6000;
          const expectedLiquidAmt = 4000;

          await expect(facet.connect(indexFund).depositMatic(depositToCharity, {value: 10000}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToCharity.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(BigNumber.from(expectedLockedAmt));
          expect(liquidBal).to.equal(BigNumber.from(expectedLiquidAmt));
          expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
            depositToCharity.id,
            expectedLockedAmt,
            indexFund.address,
            registrarConfig.haloToken
          );
        });

        it("matches the donation using DonationMatch when called for a normal endowment", async () => {
          await state.setEndowmentDetails(normalEndowId, {
            ...normalEndow,
            donationMatchContract: donationMatch.address,
          });

          const expectedLockedAmt = 6000;
          const expectedLiquidAmt = 4000;

          await expect(facet.connect(indexFund).depositMatic(depositToNormalEndow, {value: 10000}))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              wmaticFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            wmaticFake.address
          );
          expect(lockedBal).to.equal(BigNumber.from(expectedLockedAmt));
          expect(liquidBal).to.equal(BigNumber.from(expectedLiquidAmt));
          expect(donationMatch.executeDonorMatch).to.have.been.calledWith(
            depositToNormalEndow.id,
            expectedLockedAmt,
            indexFund.address,
            normalEndow.daoToken
          );
        });
      });
    });
  });
});
