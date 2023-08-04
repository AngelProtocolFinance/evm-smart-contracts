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
  const dafEndowId = 3;

  const depositToCharity: AccountMessages.DepositRequestStruct = {
    id: charityId,
    liquidPercentage: 60,
    lockedPercentage: 40,
    donationMatch: ethers.constants.AddressZero,
  };
  const depositToNormalEndow: AccountMessages.DepositRequestStruct = {
    id: normalEndowId,
    liquidPercentage: 60,
    lockedPercentage: 40,
    donationMatch: ethers.constants.AddressZero,
  };
  const depositToDafEndow: AccountMessages.DepositRequestStruct = {
    id: dafEndowId,
    liquidPercentage: 60,
    lockedPercentage: 40,
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
  let dafEndow: AccountStorage.EndowmentStruct;

  let donationMatch: FakeContract<DonationMatch>;
  let donationMatchCharity: FakeContract<DonationMatchCharity>;
  let registrarFake: FakeContract<Registrar>;
  let wmaticFake: FakeContract<DummyWMATIC>;
  let tokenFake: FakeContract<DummyERC20>;

  let treasury: string;
  let depositAmt = 10000;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;
    indexFund = signers.apTeam2;

    charity = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      owner: endowOwner.address,
      splitToLiquid: {defaultSplit: 25, max: 90, min: 10},
    };
    normalEndow = {
      ...charity,
      endowType: 1,
      splitToLiquid: {defaultSplit: 50, max: 80, min: 20},
      withdrawFee: {
        bps: 30,
        payoutAddress: endowOwner.address,
      },
      earlyLockedWithdrawFee: {
        bps: 15,
        payoutAddress: endowOwner.address,
      },
    };
    dafEndow = {
      ...charity,
      endowType: 2,
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
    wmaticFake.transferFrom.returns(true);
    wmaticFake.transfer.returns(true);

    treasury = genWallet().address;
    const registrarConfig: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      haloToken: genWallet().address,
      indexFundContract: indexFund.address,
      wMaticAddress: wmaticFake.address,
      splitToLiquid: {defaultSplit: 50, max: 100, min: 0},
      treasury: treasury,
    };
    registrarFake.queryConfig.returns(registrarConfig);
    registrarFake.isTokenAccepted.whenCalledWith(tokenFake.address).returns(true);

    await state.setEndowmentDetails(charityId, charity);
    await state.setEndowmentDetails(normalEndowId, normalEndow);
    await state.setEndowmentDetails(dafEndowId, dafEndow);

    await state.setConfig({
      owner: accOwner.address,
      version: "1",
      networkName: "Polygon",
      registrarContract: registrarFake.address,
      nextAccountId: 4, // 3 endows already added
      reentrancyGuardLocked: false,
    });
  });

  describe("upon deposit", async () => {
    describe("of Matic", async () => {
      let maticValue = BigNumber.from(depositAmt);

      it("reverts if the deposited MATIC value is zero", async () => {
        await expect(facet.depositMatic(depositToCharity, {value: 0})).to.be.revertedWith(
          "Invalid Amount"
        );
      });

      it("reverts if the endowment is closed", async () => {
        await state.setClosingEndowmentState(charityId, true, {
          enumData: 0,
          data: {addr: ethers.constants.AddressZero, endowId: 0, fundId: 0},
        });
        await expect(facet.depositMatic(depositToCharity, {value: maticValue})).to.be.revertedWith(
          "Endowment is closed"
        );
      });

      it("reverts if the deposit of MATIC to wMATIC fails", async () => {
        wmaticFake.deposit.reverts();
        await expect(facet.depositMatic(depositToCharity, {value: maticValue})).to.be.revertedWith(
          "call reverted without message"
        );
      });
    });

    describe("of ERC20", async () => {
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

    describe("passing deposit information to the processDonation internal function", async () => {
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

      it("if sender is the Index Fund: successfully overrides Endowment-level split ranges & defaults", async () => {
        const expectedLockedAmt = BigNumber.from(0);
        const expectedLiquidAmt = BigNumber.from(10000);

        await expect(
          facet.connect(indexFund).depositERC20(
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

        const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
          charityId,
          tokenFake.address
        );
        expect(lockedBal).to.equal(expectedLockedAmt);
        expect(liquidBal).to.equal(expectedLiquidAmt);
      });

      describe("to Charity Endowments", async () => {
        it("adjust user split if it falls outside Endowment max/min split range", async () => {
          // min is 10% on Registrar splits, so we adj user split to be in-line with that
          const expectedLockedAmt = BigNumber.from(9000);
          const expectedLiquidAmt = BigNumber.from(1000);

          await expect(
            facet.depositERC20(
              {
                id: charityId,
                lockedPercentage: 100,
                liquidPercentage: 0,
                donationMatch: ethers.constants.AddressZero,
              },
              tokenFake.address,
              depositAmt
            )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(charityId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("if ignore user splits set, take Endowment-level split default, regardless of user values", async () => {
          const expectedLockedAmt = BigNumber.from(7500);
          const expectedLiquidAmt = BigNumber.from(2500);

          // turn on ignoring of user-passed splits
          const ignoreUserSplits: AccountStorage.EndowmentStruct = {
            ...charity,
            ignoreUserSplits: true,
          };
          await state.setEndowmentDetails(charityId, ignoreUserSplits);

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

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("skips donation matching when no donation match contract is in Registrar", async () => {
          const expectedLockedAmt = BigNumber.from(4000);
          const expectedLiquidAmt = BigNumber.from(6000);

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

        it("matches the donation when contract is in Registrar and Locked split passed", async () => {
          const curConfig = await registrarFake.queryConfig();
          const regConfig: RegistrarStorage.ConfigStruct = {
            ...curConfig,
            donationMatchCharitesContract: donationMatchCharity.address,
          };
          registrarFake.queryConfig.returns(regConfig);

          const expectedLockedAmt = BigNumber.from(4000);
          const expectedLiquidAmt = BigNumber.from(6000);

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

        it("deposit with protocol-level deposit fee only", async () => {
          const expectedLockedAmt = BigNumber.from(3996);
          const expectedLiquidAmt = BigNumber.from(5994);
          const expectedFee = 10;

          const depositBps: AccountStorage.EndowmentStruct = {
            ...charity,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(charityId, depositBps);

          await expect(
            facet.depositERC20(
              depositToCharity,
              tokenFake.address,
              depositAmt
            )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(charityId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(tokenFake.transfer).to.have.been.calledWith(
            depositBps.depositFee.payoutAddress,
            expectedFee
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });
      });

      describe("to other endowment-types", async () => {
        it("adjust user split if it falls outside Endowment max/min split range", async () => {
          // User splits 0 / 100 
          // Endow splits 50 / 80 / 20 
          // Final splits 20 / 80
          const expectedLockedAmt = BigNumber.from(2000);
          const expectedLiquidAmt = BigNumber.from(8000);

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

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("if ignore user splits set, take Endowment-level split default, regardless of user values", async () => {
          // take default split for Endow == 50%
          const expectedLockedAmt = BigNumber.from(5000);
          const expectedLiquidAmt = BigNumber.from(5000);

          // turn on ignoring of user-passed splits
          const ignoreUserSplits: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            ignoreUserSplits: true,
          };
          await state.setEndowmentDetails(normalEndowId, ignoreUserSplits);

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

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("skips donation matching when no donation match contract is associated with endowment being deposited to", async () => {
          const expectedLockedAmt = BigNumber.from(4000);
          const expectedLiquidAmt = BigNumber.from(6000);

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

        it("matches the donation when matching contract is setup & locked split amount is sent", async () => {
          await state.setEndowmentDetails(normalEndowId, {
            ...normalEndow,
            donationMatchContract: donationMatch.address,
          });

          const expectedLockedAmt = BigNumber.from(4000);
          const expectedLiquidAmt = BigNumber.from(6000);

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

        it("deposit with protocol-level deposit fee only", async () => {
          const expectedLockedAmt = BigNumber.from(3996);
          const expectedLiquidAmt = BigNumber.from(5994);
          const expectedFee = 10;

          const depositBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            depositFee: {payoutAddress: genWallet().address, bps: 10},
          };
          await state.setEndowmentDetails(normalEndowId, depositBps);

          await expect(
            facet.depositERC20(
              depositToNormalEndow,
              tokenFake.address,
              depositAmt
            )
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(normalEndowId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(tokenFake.transfer).to.have.been.calledWith(
            depositBps.depositFee.payoutAddress,
            expectedFee
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("deposit with protocol & endowment-level deposit fees", async () => {
          registrarFake.getFeeSettingsByFeeType.whenCalledWith(FeeTypes.Deposit).returns({payoutAddress: treasury, bps: 10});

          const depositBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            depositFee: {payoutAddress: endowOwner.address, bps: 100},
          };
          await state.setEndowmentDetails(depositToNormalEndow.id, depositBps);

          const expectedFeeAp = BigNumber.from(depositAmt).mul(10).div(10000); // 10000 * 0.1% = 10
          const amountLeftAfterApFees = BigNumber.from(depositAmt).sub(expectedFeeAp); // 9990
          const expectedFeeEndow = amountLeftAfterApFees.mul(100).div(10000); // 9990 * 1% = 99
          const finalAmountLeftover = amountLeftAfterApFees.sub(expectedFeeEndow); // 9990 - 99 = 9891

          const expectedLockedAmt = finalAmountLeftover.mul(depositToNormalEndow.lockedPercentage).div(100); // 9891 * 40% = 3956
          const expectedLiquidAmt = finalAmountLeftover.mul(depositToNormalEndow.liquidPercentage).div(100); // 9891 * 60% = 5934

          await expect(facet.depositERC20(depositToNormalEndow, tokenFake.address, BigNumber.from(depositAmt)))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              tokenFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(tokenFake.transfer).to.have.been.calledWith(
            treasury,
            expectedFeeAp
          );
          expect(tokenFake.transfer).to.have.been.calledWith(
            depositBps.depositFee.payoutAddress,
            expectedFeeEndow
          );

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });
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
