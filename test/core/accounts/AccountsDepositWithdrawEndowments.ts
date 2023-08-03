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
  DonationMatchCharity__factory,
  DonationMatch__factory,
  DummyERC20,
  DummyERC20__factory,
  DummyWMATIC,
  DummyWMATIC__factory,
  IAccountsDepositWithdrawEndowments,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsDepositWithdrawEndowments";
import {LibAccounts, RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {FeeTypes, VaultType, genWallet, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";

use(smock.matchers);

describe("AccountsDepositWithdrawEndowments", function () {
  const {ethers} = hre;

  const charityId = 1;
  const normalEndowId = 2;

  const depositToCharity: AccountMessages.DepositRequestStruct = {
    id: charityId,
    liquidPercentage: 40,
    lockedPercentage: 60,
    donationMatch: ethers.constants.AddressZero,
  };
  const depositToNormalEndow: AccountMessages.DepositRequestStruct = {
    id: normalEndowId,
    liquidPercentage: 40,
    lockedPercentage: 60,
    donationMatch: ethers.constants.AddressZero,
  };

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let indexFund: SignerWithAddress;

  let facet: AccountsDepositWithdrawEndowments;
  let state: TestFacetProxyContract;

  let charity: AccountStorage.EndowmentStruct;
  let normalEndow: AccountStorage.EndowmentStruct;

  let donationMatch: FakeContract<DonationMatch>;
  let donationMatchCharity: FakeContract<DonationMatchCharity>;
  let registrarFake: FakeContract<Registrar>;
  let wmaticFake: FakeContract<DummyWMATIC>;
  let tokenFake: FakeContract<DummyERC20>;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;
    indexFund = signers.apTeam2;

    charity = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      owner: endowOwner.address,
      withdrawFee: {
        bps: 30,
        payoutAddress: genWallet().address,
      },
    };
    normalEndow = {
      ...charity,
      endowType: 1,
      splitToLiquid: {defaultSplit: 40, max: 80, min: 20},
      daoToken: genWallet().address,
      earlyLockedWithdrawFee: {
        bps: 15,
        payoutAddress: genWallet().address,
      },
    };
  });

  beforeEach(async () => {
    const Facet = new AccountsDepositWithdrawEndowments__factory(accOwner);
    const facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);

    facet = AccountsDepositWithdrawEndowments__factory.connect(state.address, endowOwner);

    donationMatch = await smock.fake<DonationMatch>(new DonationMatch__factory());
    donationMatchCharity = await smock.fake<DonationMatchCharity>(
      new DonationMatchCharity__factory()
    );

    registrarFake = await smock.fake<Registrar>(new Registrar__factory());

    tokenFake = await smock.fake<DummyERC20>(new DummyERC20__factory());

    wmaticFake = await smock.fake<DummyWMATIC>(new DummyWMATIC__factory());

    tokenFake.transferFrom.returns(true);
    tokenFake.transfer.returns(true);

    const registrarConfig: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      haloToken: genWallet().address,
      indexFundContract: indexFund.address,
      wMaticAddress: wmaticFake.address,
      splitToLiquid: {defaultSplit: 50, max: 90, min: 10},
      treasury: genWallet().address,
    };
    registrarFake.queryConfig.returns(registrarConfig);
    registrarFake.isTokenAccepted.whenCalledWith(tokenFake.address).returns(true);

    await state.setEndowmentDetails(charityId, charity);
    await state.setEndowmentDetails(normalEndowId, normalEndow);

    await state.setConfig({
      owner: accOwner.address,
      version: "1",
      networkName: "Polygon",
      registrarContract: registrarFake.address,
      nextAccountId: 3, // 2 endows already added
      reentrancyGuardLocked: false,
    });
  });

  describe("upon depositMatic", async () => {
    const value = BigNumber.from(10000);

    it("reverts if the deposit value is zero", async () => {
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

    it("reverts if the token is neither in the protocol-level accepted tokens list in the Registrar contract nor in the endowment-level accepted tokens list", async () => {
      registrarFake.isTokenAccepted.whenCalledWith(tokenFake.address).returns(false);
      await expect(
        facet.depositERC20(depositToCharity, tokenFake.address, depositAmt)
      ).to.be.revertedWith("Not in an Accepted Tokens List");
    });

    it("reverts if the deposit to WMATIC fails", async () => {
      wmaticFake.deposit.reverts();
      await expect(facet.depositMatic(depositToCharity, {value})).to.be.revertedWith(
        "call reverted without message"
      );
    });
  });

  describe("upon depositERC20", async () => {
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
      ).to.be.revertedWith("SafeERC20: ERC20 operation did not succeed");
    });
  });

  describe("upon passing deposit information to the processDonation internal function", async () => {
    it("reverts if the locked + liquid percentage does not equal 100", async () => {
      const invalidReq: AccountMessages.DepositRequestStruct = {
        id: charityId,
        liquidPercentage: 10,
        lockedPercentage: 10,
        donationMatch: ethers.constants.AddressZero,
      };
      await expect(
        facet.depositERC20(invalidReq, tokenFake.address, depositAmt)
      ).to.be.revertedWith("InvalidSplit");
    });

    it("reverts if no index fund contract is registered in the Registrar", async () => {
      const curConfig = await registrarFake.queryConfig();
      const regConfig: RegistrarStorage.ConfigStruct = {
        ...curConfig,
        indexFundContract: ethers.constants.AddressZero,
      };
      registrarFake.queryConfig.returns(regConfig);

      await expect(
        facet.depositERC20(depositToCharity, tokenFake.address, depositAmt)
      ).to.be.revertedWith("No Index Fund");
    });

    it("if sender is the Index Fund: successfully overrides endowment-level fee split", async () => {
      await endowOwner.sendTransaction({
        value: ethers.utils.parseEther("1.0"),
        to: indexFund.address,
      });

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
        facet.connect(indexFund).depositMatic(
          {
            id: normalEndowId,
            lockedPercentage: 0,
            liquidPercentage: 100,
            donationMatch: ethers.constants.AddressZero,
          },
          {value}
        )
      )
        .to.emit(facet, "EndowmentDeposit")
        .withArgs(charityId, wmaticFake.address, expectedLockedAmt, expectedLiquidAmt);

      expect(wmaticFake.deposit).to.have.been.calledWithValue(value);
      expect(wmaticFake.transfer).to.have.been.calledWith(
        charityBps.depositFee.payoutAddress,
        expectedFee
      );

      const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
        charityId,
        wmaticFake.address
      );
      expect(lockedBal).to.equal(expectedLockedAmt);
      expect(liquidBal).to.equal(expectedLiquidAmt);
    });

    describe("to charities", async () => {
      it("deposits an ERC20 with no locked amount", async () => {
        const expectedLockedAmt = BigNumber.from(9000);
        const expectedLiquidAmt = BigNumber.from(1000);

        await expect(
          facet.depositERC20(
            {
              id: charityId,
              lockedPercentage: 0,
              liquidPercentage: 100,
              donationMatch: ethers.constants.AddressZero,
            },
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

        await expect(
          facet.depositERC20(
            {
              id: charityId,
              lockedPercentage: 0,
              liquidPercentage: 100,
              donationMatch: ethers.constants.AddressZero,
            },
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
        const curConfig = await registrarFake.queryConfig();
        const regConfig: RegistrarStorage.ConfigStruct = {
          ...curConfig,
          donationMatchCharitesContract: donationMatchCharity.address,
        };
        registrarFake.queryConfig.returns(regConfig);

        const expectedLockedAmt = BigNumber.from(6000);
        const expectedLiquidAmt = BigNumber.from(4000);

        await expect(facet.depositERC20(depositToCharity, tokenFake.address, depositAmt))
          .to.emit(facet, "EndowmentDeposit")
          .withArgs(depositToCharity.id, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

        expect(donationMatchCharity.executeDonorMatch).to.have.been.calledWith(
          depositToCharity.id,
          expectedLockedAmt,
          await facet.signer.getAddress(),
          regConfig.haloToken
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

        const curConfig = await registrarFake.queryConfig();
        const regConfig: RegistrarStorage.ConfigStruct = {
          ...curConfig,
          donationMatchCharitesContract: donationMatchCharity.address,
        };
        registrarFake.queryConfig.returns(regConfig);

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
          regConfig.haloToken
        );

        const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
          depositToCharity.id,
          tokenFake.address
        );
        expect(lockedBal).to.equal(expectedLockedAmt);
        expect(liquidBal).to.equal(expectedLiquidAmt);
      });
    });

    describe("to normal endowments", async () => {
      it("deposits an ERC20 with no locked amount", async () => {
        const expectedLockedAmt = BigNumber.from(8000);
        const expectedLiquidAmt = BigNumber.from(2000);

        await expect(
          facet.depositERC20(
            {
              id: normalEndowId,
              lockedPercentage: 0,
              liquidPercentage: 100,
              donationMatch: ethers.constants.AddressZero,
            },
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

        await expect(
          facet.depositERC20(
            {
              id: normalEndowId,
              lockedPercentage: 0,
              liquidPercentage: 100,
              donationMatch: ethers.constants.AddressZero,
            },
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

  describe("upon withdraw", async () => {
    const tokenLimit = 10;
    const liqBal = BigNumber.from(10000);
    const lockBal = BigNumber.from(9000);
    const beneficiaryAddress = genWallet().address;

    const charityEarlyLockedWithdrawFeeSetting: LibAccounts.FeeSettingStruct = {
      bps: 100,
      payoutAddress: genWallet().address,
    };
    const earlyLockedWithdrawFeeSetting: LibAccounts.FeeSettingStruct = {
      bps: 200,
      payoutAddress: genWallet().address,
    };
    const charityWithdrawFeeSetting: LibAccounts.FeeSettingStruct = {
      bps: 10,
      payoutAddress: genWallet().address,
    };
    const withdrawFeeSetting: LibAccounts.FeeSettingStruct = {
      bps: 20,
      payoutAddress: genWallet().address,
    };

    beforeEach(async () => {
      let beneficiaryId = 0;

      registrarFake.getFeeSettingsByFeeType
        .whenCalledWith(FeeTypes.EarlyLockedWithdrawCharity)
        .returns(charityEarlyLockedWithdrawFeeSetting);
      registrarFake.getFeeSettingsByFeeType
        .whenCalledWith(FeeTypes.EarlyLockedWithdraw)
        .returns(earlyLockedWithdrawFeeSetting);
      registrarFake.getFeeSettingsByFeeType
        .whenCalledWith(FeeTypes.WithdrawCharity)
        .returns(charityWithdrawFeeSetting);
      registrarFake.getFeeSettingsByFeeType
        .whenCalledWith(FeeTypes.Withdraw)
        .returns(withdrawFeeSetting);

      await state.setEndowmentTokenBalance(charityId, tokenFake.address, lockBal, liqBal);
      await state.setEndowmentTokenBalance(charityId, wmaticFake.address, lockBal, liqBal);
      await state.setEndowmentTokenBalance(normalEndowId, tokenFake.address, lockBal, liqBal);
      await state.setEndowmentTokenBalance(normalEndowId, wmaticFake.address, lockBal, liqBal);
    });

    it("reverts if the endowment is closed", async () => {
      await state.setClosingEndowmentState(charityId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });
      await expect(
        facet.withdraw(charityId, VaultType.LIQUID, genWallet().address, 0, [
          {addr: tokenFake.address, amnt: 1},
        ])
      ).to.be.revertedWith("Endowment is closed");
    });

    it("reverts if no tokens are provided", async () => {
      await expect(
        facet.withdraw(charityId, VaultType.LIQUID, genWallet().address, 0, [])
      ).to.be.revertedWith("No tokens provided");
    });

    it("reverts if number of tokens to withdraw is bigger than limit", async () => {
      const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = Array.from(
        Array(tokenLimit + 1)
      ).map((_) => ({
        addr: tokenFake.address,
        amnt: 1,
      }));

      await expect(
        facet.withdraw(charityId, VaultType.LIQUID, genWallet().address, 0, tokens)
      ).to.be.revertedWith("Upper-limit is ten(10) unique ERC20 tokens per withdraw");
    });

    it("reverts if any of the tokens to withdraw has a zero address", async () => {
      const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
        {addr: tokenFake.address, amnt: 1},
        {addr: ethers.constants.AddressZero, amnt: 1},
      ];

      await expect(
        facet.withdraw(charityId, VaultType.LIQUID, genWallet().address, 0, tokens)
      ).to.be.revertedWith("Invalid withdraw token passed: zero address");
    });

    it("reverts if any of the tokens to withdraw has a zero amount", async () => {
      const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
        {addr: tokenFake.address, amnt: 1},
        {addr: tokenFake.address, amnt: 0},
      ];

      await expect(
        facet.withdraw(charityId, VaultType.LIQUID, genWallet().address, 0, tokens)
      ).to.be.revertedWith("Invalid withdraw token passed: zero amount");
    });

    it("reverts if the specified token balance to withdraw is larger than the available balance", async () => {
      await expect(
        facet.withdraw(charityId, VaultType.LIQUID, genWallet().address, 0, [
          {addr: tokenFake.address, amnt: liqBal.add(1)},
        ])
      ).to.be.revertedWith("Insufficient Funds");
    });

    it("reverts if the beneficiary endowment passed is of closed status", async () => {
      const beneficiaryId = normalEndowId;

      await state.setClosingEndowmentState(beneficiaryId, true, {
        enumData: 0,
        data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
      });

      await expect(
        facet.withdraw(charityId, VaultType.LIQUID, ethers.constants.AddressZero, beneficiaryId, [
          {addr: tokenFake.address, amnt: 5000},
        ])
      ).to.be.revertedWith("Beneficiary endowment is closed");
    });

    describe("from Non-Mature endowments", async () => {
      it("reverts if sender address is not listed in allowlistedBeneficiaries nor is it the Endowment Owner", async () => {
        await expect(
          facet
            .connect(indexFund)
            .withdraw(charityId, VaultType.LIQUID, genWallet().address, 0, [
              {addr: tokenFake.address, amnt: 1},
            ])
        ).to.be.revertedWith(
          "Sender address is not listed in allowlistedBeneficiaries nor is it the Endowment Owner"
        );
      });

      describe("LIQUID withdrawals (normal withdraw fees may apply)", async () => {
        it("passes: normal, beneficiary address, 1 token, sender: endow. owner", async () => {
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          await expect(
            facet.withdraw(normalEndowId, acctType, beneficiaryAddress, beneficiaryId, tokens)
          )
            .to.emit(facet, "EndowmentWithdraw")
            .withArgs(
              normalEndowId,
              tokens[0].addr,
              tokens[0].amnt,
              acctType,
              beneficiaryAddress,
              beneficiaryId
            );

          const regConfig = await registrarFake.queryConfig();

          const withdrawFeeAp = 5;
          const withdrawFeeEndow = 14;
          const remainder = BigNumber.from(tokens[0].amnt).sub(withdrawFeeAp + withdrawFeeEndow);

          expect(tokenFake.transfer).to.have.been.calledWith(regConfig.treasury, withdrawFeeAp);
          expect(tokenFake.transfer).to.have.been.calledWith(
            charity.withdrawFee.payoutAddress,
            withdrawFeeEndow
          );
          expect(tokenFake.transfer).to.have.been.calledWith(beneficiaryAddress, remainder);

          const [, liquidBalance] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(liquidBalance).to.equal(liqBal.sub(await tokens[0].amnt));
        });

        it("passes: charity, beneficiary address, 2 tokens, sender: allowlisted beneficiary", async () => {
          const charityWithAllowlist: AccountStorage.EndowmentStruct = {
            ...charity,
            allowlistedBeneficiaries: [indexFund.address],
          };
          await state.setEndowmentDetails(charityId, charityWithAllowlist);
          await state.setEndowmentTokenBalance(charityId, tokenFake.address, lockBal, liqBal);

          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
            {addr: tokenFake2.address, amnt: 3000},
          ];

          await expect(
            facet
              .connect(indexFund)
              .withdraw(charityId, acctType, beneficiaryAddress, beneficiaryId, tokens)
          )
            .to.emit(facet, "EndowmentWithdraw")
            .withArgs(
              charityId,
              tokens[0].addr,
              tokens[0].amnt,
              acctType,
              beneficiaryAddress,
              beneficiaryId
            )
            .and.to.emit(facet, "EndowmentWithdraw")
            .withArgs(
              charityId,
              tokens[1].addr,
              tokens[1].amnt,
              acctType,
              beneficiaryAddress,
              beneficiaryId
            );

          const regConfig = await registrarFake.queryConfig();

          // tokens[0]
          const amount = BigNumber.from(tokens[0].amnt);
          const withdrawFeeAp = 5;
          const withdrawFeeEndow = 14;
          const remainder = amount.sub(withdrawFeeAp + withdrawFeeEndow);

          expect(tokenFake.transfer).to.have.been.calledWith(regConfig.treasury, withdrawFeeAp);
          expect(tokenFake.transfer).to.have.been.calledWith(
            charity.withdrawFee.payoutAddress,
            withdrawFeeEndow
          );
          expect(tokenFake.transfer).to.have.been.calledWith(beneficiaryAddress, remainder);

          const [, liquidBalance] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(liquidBalance).to.equal(liqBal.sub(amount));

          // tokens[1]
          const amount2 = BigNumber.from(tokens[1].amnt);
          const withdrawFeeAp2 = 3;
          const withdrawFeeEndow2 = 8;
          const remainder2 = amount2.sub(withdrawFeeAp2 + withdrawFeeEndow2);

          expect(tokenFake2.transfer).to.have.been.calledWith(regConfig.treasury, withdrawFeeAp2);
          expect(tokenFake2.transfer).to.have.been.calledWith(
            charity.withdrawFee.payoutAddress,
            withdrawFeeEndow2
          );
          expect(tokenFake2.transfer).to.have.been.calledWith(beneficiaryAddress, remainder2);

          const [, liquidBalance2] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake2.address
          );
          expect(liquidBalance2).to.equal(liqBal.sub(amount2));
        });
      });

      describe("LOCKED withdrawals", async () => {
        it("passes: charity, beneficiary address, 1 token, sender: endow. owner, early & normal withdraw fees apply", async () => {
          const charityNoWithFee: AccountStorage.EndowmentStruct = {
            ...charity,
            withdrawFee: {bps: 0, payoutAddress: ethers.constants.AddressZero},
          };
          await state.setEndowmentDetails(charityId, charityNoWithFee);

          const earlyLockWithFeeSetting: LibAccounts.FeeSettingStruct = {
            bps: 30,
            payoutAddress: genWallet().address,
          };
          registrarFake.getFeeSettingsByFeeType
            .whenCalledWith(FeeTypes.EarlyLockedWithdrawCharity)
            .returns(earlyLockWithFeeSetting);

          const acctType = VaultType.LOCKED;
          const beneficiaryAddress = genWallet().address;
          const beneficiaryId = 0;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          await expect(
            facet.withdraw(charityId, acctType, beneficiaryAddress, beneficiaryId, tokens)
          )
            .to.emit(facet, "EndowmentWithdraw")
            .withArgs(
              charityId,
              tokens[0].addr,
              tokens[0].amnt,
              acctType,
              beneficiaryAddress,
              beneficiaryId
            );

          const regConfig = await registrarFake.queryConfig();

          const amount = BigNumber.from(tokens[0].amnt);
          const withdrawAndEarlyWithdrawPenaltyFee = 20;
          const remainder = amount.sub(withdrawAndEarlyWithdrawPenaltyFee);

          expect(tokenFake.transfer).to.have.been.calledWith(
            regConfig.treasury,
            withdrawAndEarlyWithdrawPenaltyFee
          );
          expect(tokenFake.transfer).to.have.been.calledWith(beneficiaryAddress, remainder);

          const [lockedBalance] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(lockedBalance).to.equal(lockBal.sub(amount));
        });

        it("passes: normal endowment, beneficiary address, 1 token, sender: endow. owner, normal withdraw fee apply", async () => {
          const normalEndowNoWithFee: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            withdrawFee: {bps: 0, payoutAddress: ethers.constants.AddressZero},
          };
          await state.setEndowmentDetails(normalEndowId, normalEndowNoWithFee);

          const acctType = VaultType.LOCKED;
          const beneficiaryAddress = genWallet().address;
          const beneficiaryId = 0;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          await expect(
            facet.withdraw(normalEndowId, acctType, beneficiaryAddress, beneficiaryId, tokens)
          )
            .to.emit(facet, "EndowmentWithdraw")
            .withArgs(
              normalEndowId,
              tokens[0].addr,
              tokens[0].amnt,
              acctType,
              beneficiaryAddress,
              beneficiaryId
            );

          const regConfig = await registrarFake.queryConfig();

          const amount = BigNumber.from(tokens[0].amnt);
          const withdrawAndEarlyWithdrawPenaltyFee = 17;
          const remainder = amount.sub(withdrawAndEarlyWithdrawPenaltyFee);

          expect(tokenFake.transfer).to.have.been.calledWith(
            regConfig.treasury,
            withdrawAndEarlyWithdrawPenaltyFee
          );
          expect(tokenFake.transfer).to.have.been.calledWith(beneficiaryAddress, remainder);

          const [lockedBalance] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokenFake.address
          );
          expect(lockedBalance).to.equal(lockBal.sub(amount));
        });
      });
    });

    describe("from Mature endowments (normal withdraw fees may apply)", async () => {
      it("reverts if sender address is not listed in maturityAllowlist", async () => {
        const matureEndowment: AccountStorage.EndowmentStruct = {
          ...normalEndow,
          maturityTime: 1,
          maturityAllowlist: [beneficiaryAddress],
        };
        await state.setEndowmentDetails(normalEndowId, matureEndowment);

        await expect(
          facet.withdraw(normalEndowId, VaultType.LIQUID, genWallet().address, 0, [
            {addr: tokenFake.address, amnt: 1},
          ])
        ).to.be.revertedWith("Sender address is not listed in maturityAllowlist");
      });

      describe("LIQUID withdrawals", async () => {});

      describe("LOCKED withdrawals", async () => {
        it("passes: Normal, Protocol-withdraw fee", async () => {
          const matureEndowment: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            maturityTime: 1,
            maturityAllowlist: [indexFund.address],
          };
          await state.setEndowmentDetails(normalEndowId, matureEndowment);

          const acctType = VaultType.LOCKED;
          const beneficiaryAddress = ethers.constants.AddressZero;
          const beneficiaryId = normalEndowId;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];
          const regConfig = await registrarFake.queryConfig();
          const amount = BigNumber.from(tokens[0].amnt);

          await expect(
            facet
              .connect(indexFund)
              .withdraw(normalEndowId, acctType, beneficiaryAddress, beneficiaryId, tokens)
          )
            .to.emit(facet, "EndowmentWithdraw")
            .withArgs(
              normalEndowId,
              tokens[0].addr,
              tokens[0].amnt,
              acctType,
              beneficiaryAddress,
              beneficiaryId
            );

          const [lockedBalance] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(lockedBalance).to.equal(lockBal.sub(amount));

          const [lockBalBen, liqBalBen] = await state.getEndowmentTokenBalance(
            beneficiaryId,
            tokens[0].addr
          );
          expect(lockBalBen).to.equal(lockBal.add(amount));
          expect(liqBalBen).to.equal(liqBal);
        });
      });
    });

    describe("for DAF endowments (no fees are ever applied)", async () => {
      it("reverts if a beneficiary address is passed", async () => {
        expect(false).to.equal(true);
      });

      it("passes if only a valid Endowment ID is passed", async () => {
        expect(false).to.equal(true);
      });
    });
  });
});
