import {FakeContract, smock} from "@defi-wonderland/smock";
import {
  SnapshotRestorer,
  impersonateAccount,
  setBalance,
  takeSnapshot,
  time,
} from "@nomicfoundation/hardhat-network-helpers";
import {expect, use} from "chai";
import {BigNumber, Signer} from "ethers";
import hre from "hardhat";
import {DEFAULT_CHARITY_ENDOWMENT, DEFAULT_REGISTRAR_CONFIG, wait} from "test/utils";
import {
  AccountsDepositWithdrawEndowments,
  AccountsDepositWithdrawEndowments__factory,
  DummyWMATIC,
  DummyWMATIC__factory,
  IAccountsDepositWithdrawEndowments,
  IERC20,
  IERC20__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsDepositWithdrawEndowments";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {VaultType} from "types";
import {genWallet, getProxyAdminOwner, getSigners} from "utils";
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

  let accOwner: Signer;
  let proxyAdmin: Signer;
  let endowOwner: Signer;
  let indexFund: Signer;

  let facet: AccountsDepositWithdrawEndowments;
  let state: TestFacetProxyContract;

  let charity: AccountStorage.EndowmentStruct;
  let normalEndow: AccountStorage.EndowmentStruct;
  let dafEndow: AccountStorage.EndowmentStruct;

  let registrarFake: FakeContract<Registrar>;
  let wmaticFake: FakeContract<DummyWMATIC>;
  let tokenFake: FakeContract<IERC20>;

  let treasury: string;
  let depositAmt = 10000;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    endowOwner = signers.deployer;
    indexFund = signers.apTeam2;

    proxyAdmin = await getProxyAdminOwner(hre);

    charity = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      owner: await endowOwner.getAddress(),
      splitToLiquid: {defaultSplit: 25, max: 90, min: 10},
    };
    normalEndow = {
      ...charity,
      endowType: 1,
      splitToLiquid: {defaultSplit: 50, max: 80, min: 20},
    };
    dafEndow = {
      ...charity,
      endowType: 2,
    };

    treasury = genWallet().address;

    const Facet = new AccountsDepositWithdrawEndowments__factory(accOwner);
    const facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);
    facet = AccountsDepositWithdrawEndowments__factory.connect(state.address, endowOwner);

    registrarFake = await smock.fake<Registrar>(new Registrar__factory());

    tokenFake = await smock.fake<IERC20>(IERC20__factory.createInterface());
    wmaticFake = await smock.fake<DummyWMATIC>(new DummyWMATIC__factory());

    await wait(state.setEndowmentDetails(charityId, charity));
    await wait(state.setEndowmentDetails(normalEndowId, normalEndow));
    await wait(state.setEndowmentDetails(dafEndowId, dafEndow));

    await wait(
      state.setConfig({
        owner: await accOwner.getAddress(),
        version: "1",
        networkName: "Polygon",
        registrarContract: registrarFake.address,
        nextAccountId: 4, // 2 endows already added
        reentrancyGuardLocked: false,
      })
    );
  });

  let snapshot: SnapshotRestorer;

  beforeEach(async () => {
    snapshot = await takeSnapshot();

    const registrarConfig: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      haloToken: genWallet().address,
      indexFundContract: await indexFund.getAddress(),
      wMaticAddress: wmaticFake.address,
      treasury: treasury,
    };
    registrarFake.queryConfig.returns(registrarConfig);
    registrarFake.isTokenAccepted.whenCalledWith(tokenFake.address).returns(true);
    registrarFake.getFeeSettingsByFeeType.returns({
      payoutAddress: ethers.constants.AddressZero,
      bps: 0,
    });

    tokenFake.transferFrom.returns(true);
    tokenFake.transfer.returns(true);

    wmaticFake.transferFrom.returns(true);
    wmaticFake.transfer.returns(true);
    wmaticFake.deposit.returns();
  });

  afterEach(async () => {
    await snapshot.restore();
  });

  describe("upon deposit", () => {
    describe("of Matic", () => {
      let maticValue = BigNumber.from(depositAmt);

      it("reverts if the deposited MATIC value is zero", async () => {
        await expect(facet.depositMatic(depositToCharity, {value: 0})).to.be.revertedWith(
          "Amount must be greater than zero"
        );
      });

      it("reverts if the endowment is closed", async () => {
        await wait(
          state.setClosingEndowmentState(charityId, true, {
            enumData: 0,
            data: {addr: ethers.constants.AddressZero, endowId: 0},
          })
        );
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

    describe("of ERC20", () => {
      it("reverts if the token address is zero address", async () => {
        const invalidAddress = ethers.constants.AddressZero;
        await expect(
          facet.depositERC20(depositToCharity, invalidAddress, depositAmt)
        ).to.be.revertedWith("Invalid Token Address");
      });

      it("reverts if the deposited token amount is zero", async () => {
        await expect(facet.depositERC20(depositToCharity, tokenFake.address, 0)).to.be.revertedWith(
          "Amount must be greater than zero"
        );
      });

      it("reverts if the endowment is closed", async () => {
        await wait(
          state.setClosingEndowmentState(charityId, true, {
            enumData: 0,
            data: {addr: ethers.constants.AddressZero, endowId: 0},
          })
        );
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

    describe("passing deposit information to the processDonation internal function", () => {
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

      describe("to Charity Endowments", () => {
        it("adjust user liquid split downward if it falls outside max liquid split range", async () => {
          // max is 90% on splits, so we adj user split to be in-line with that
          const expectedLockedAmt = BigNumber.from(1000);
          const expectedLiquidAmt = BigNumber.from(9000);

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

        it("adjust user liquid split upward if it falls outside min liquid split range", async () => {
          // min is 10% on splits, so we adj user split to be in-line with that
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
          await wait(state.setEndowmentDetails(charityId, ignoreUserSplits));

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

        it("deposit with protocol-level deposit fee only", async () => {
          registrarFake.getFeeSettingsByFeeType.returns({payoutAddress: treasury, bps: 10});

          const expectedFeeAp = BigNumber.from(depositAmt).mul(10).div(10000); // 10000 * 0.1% = 10
          const finalAmountLeftover = BigNumber.from(depositAmt).sub(expectedFeeAp); // 10000 - 10 = 9990

          const expectedLockedAmt = finalAmountLeftover
            .mul(depositToCharity.lockedPercentage)
            .div(100);
          const expectedLiquidAmt = finalAmountLeftover
            .mul(depositToCharity.liquidPercentage)
            .div(100);

          await expect(facet.depositERC20(depositToCharity, tokenFake.address, depositAmt))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(depositToCharity.id, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);

          expect(tokenFake.transfer).to.have.been.calledWith(treasury, expectedFeeAp);

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToCharity.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });
      });

      describe("to other endowment-types", () => {
        it("adjust user liquid split upward if it falls outside Endowment min liquid split range", async () => {
          // User splits (lock: 100 | liq: 0)
          // Endow splits (def: 50 | max: 80 | min: 20)
          // Final splits (lock: 80 | liq: 20)
          const expectedLockedAmt = BigNumber.from(8000);
          const expectedLiquidAmt = BigNumber.from(2000);

          await expect(
            facet.depositERC20(
              {
                id: normalEndowId,
                lockedPercentage: 100,
                liquidPercentage: 0,
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

        it("adjust user liquid split downward if it falls outside Endowment max liquid split range", async () => {
          // User splits (lock: 0 | liq: 100)
          // Endow splits (def: 50 | max: 80 | min: 20)
          // Final splits (lock: 20 | liq: 80)
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
          await wait(state.setEndowmentDetails(normalEndowId, ignoreUserSplits));

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

        it("reverts if endowment has reached maturity", async () => {
          const currTime = await time.latest();

          const matureEndowment: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            maturityTime: currTime,
          };
          await wait(state.setEndowmentDetails(normalEndowId, matureEndowment));

          await expect(
            facet
              .connect(indexFund)
              .depositERC20(depositToNormalEndow, tokenFake.address, depositAmt)
          ).to.be.revertedWith("Mature Endowments cannot receive contributions");
        });

        it("reverts if allowlistedContributors is populated and sender is not in the allowlist", async () => {
          // setup an allowed contributor wallet to sign/send
          const allowedContributor = await genWallet().address;
          await impersonateAccount(allowedContributor);
          await setBalance(allowedContributor, 1000000000000000000); // give it some gas money, as impersonateAccount does not
          const acctSigner = await ethers.getSigner(allowedContributor);
          // set a different wallet in allowlist
          await wait(state.setAllowlist(normalEndowId, 1, [genWallet().address]));

          await expect(
            facet
              .connect(acctSigner)
              .depositERC20(depositToNormalEndow, tokenFake.address, depositAmt)
          ).to.be.revertedWith("Contributor address is not listed in allowlistedContributors");
        });

        it("passes if allowlistedContributors is populated and sender is in the allowlist", async () => {
          // setup an allowed contributor wallet to sign/send and setup in allowlist
          const allowedContributor = await genWallet().address;
          await impersonateAccount(allowedContributor);
          await setBalance(allowedContributor, 1000000000000000000); // give it some gas money, as impersonateAccount does not
          const acctSigner = await ethers.getSigner(allowedContributor);
          // set new signer's wallet in allowlist
          await wait(state.setAllowlist(normalEndowId, 1, [allowedContributor]));

          const expectedLockedAmt = BigNumber.from(4000);
          const expectedLiquidAmt = BigNumber.from(6000);

          await expect(
            facet
              .connect(acctSigner)
              .depositERC20(depositToNormalEndow, tokenFake.address, depositAmt)
          )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(normalEndowId, tokenFake.address, expectedLockedAmt, expectedLiquidAmt);
        });

        it("deposit with protocol-level deposit fee only", async () => {
          registrarFake.getFeeSettingsByFeeType.returns({payoutAddress: treasury, bps: 10});

          const expectedFeeAp = BigNumber.from(depositAmt).mul(10).div(10000); // 10
          const finalAmountLeftover = BigNumber.from(depositAmt).sub(expectedFeeAp); // 9990

          const expectedLockedAmt = finalAmountLeftover
            .mul(depositToNormalEndow.lockedPercentage)
            .div(100);
          const expectedLiquidAmt = finalAmountLeftover
            .mul(depositToNormalEndow.liquidPercentage)
            .div(100);

          await expect(facet.depositERC20(depositToNormalEndow, tokenFake.address, depositAmt))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              tokenFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );

          expect(tokenFake.transfer).to.have.been.calledWith(treasury, expectedFeeAp);

          const [lockedBal, liquidBal] = await state.getEndowmentTokenBalance(
            depositToNormalEndow.id,
            tokenFake.address
          );
          expect(lockedBal).to.equal(expectedLockedAmt);
          expect(liquidBal).to.equal(expectedLiquidAmt);
        });

        it("deposit with endowment-level deposit fee only", async () => {
          const depositBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            depositFee: {payoutAddress: await endowOwner.getAddress(), bps: 100},
          };
          await wait(state.setEndowmentDetails(depositToNormalEndow.id, depositBps));

          const expectedFeeEndow = BigNumber.from(depositAmt).mul(100).div(10000); // 10000 * 1% = 100
          const finalAmountLeftover = BigNumber.from(depositAmt).sub(expectedFeeEndow); // 10000 - 100 = 9900

          const expectedLockedAmt = finalAmountLeftover
            .mul(depositToNormalEndow.lockedPercentage)
            .div(100);
          const expectedLiquidAmt = finalAmountLeftover
            .mul(depositToNormalEndow.liquidPercentage)
            .div(100);

          await expect(facet.depositERC20(depositToNormalEndow, tokenFake.address, depositAmt))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              tokenFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
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

        it("deposit with protocol & endowment-level deposit fees", async () => {
          registrarFake.getFeeSettingsByFeeType.returns({payoutAddress: treasury, bps: 10});

          const depositBps: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            depositFee: {payoutAddress: await endowOwner.getAddress(), bps: 100},
          };
          await wait(state.setEndowmentDetails(depositToNormalEndow.id, depositBps));

          const expectedFeeAp = BigNumber.from(depositAmt).mul(10).div(10000); // 10000 * 0.1% = 10
          const amountLeftAfterApFees = BigNumber.from(depositAmt).sub(expectedFeeAp); // 9990
          const expectedFeeEndow = amountLeftAfterApFees.mul(100).div(10000); // 9990 * 1% = 99
          const finalAmountLeftover = amountLeftAfterApFees.sub(expectedFeeEndow); // 9990 - 99 = 9891

          const expectedLockedAmt = finalAmountLeftover
            .mul(depositToNormalEndow.lockedPercentage)
            .div(100); // 9891 * 40% = 3956
          const expectedLiquidAmt = finalAmountLeftover
            .mul(depositToNormalEndow.liquidPercentage)
            .div(100); // 9891 * 60% = 5934

          await expect(facet.depositERC20(depositToNormalEndow, tokenFake.address, depositAmt))
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(
              depositToNormalEndow.id,
              tokenFake.address,
              expectedLockedAmt,
              expectedLiquidAmt
            );
          expect(tokenFake.transfer).to.have.been.calledWith(treasury, expectedFeeAp);
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

  describe("upon withdraw", () => {
    const tokenLimit = 10;
    const liqBal = BigNumber.from(10000);
    const lockBal = BigNumber.from(9000);
    const beneficiaryAddress = genWallet().address;

    let rootSnapshot: SnapshotRestorer;

    before(async () => {
      rootSnapshot = await takeSnapshot();

      await wait(state.setEndowmentTokenBalance(charityId, tokenFake.address, lockBal, liqBal));
      await wait(state.setEndowmentTokenBalance(charityId, wmaticFake.address, lockBal, liqBal));
      await wait(state.setEndowmentTokenBalance(normalEndowId, tokenFake.address, lockBal, liqBal));
      await wait(
        state.setEndowmentTokenBalance(normalEndowId, wmaticFake.address, lockBal, liqBal)
      );
      await wait(state.setEndowmentTokenBalance(dafEndowId, tokenFake.address, lockBal, liqBal));
      await wait(state.setEndowmentTokenBalance(dafEndowId, wmaticFake.address, lockBal, liqBal));
    });

    after(async () => {
      await rootSnapshot.restore();
    });

    it("reverts if the endowment is closed", async () => {
      await wait(
        state.setClosingEndowmentState(charityId, true, {
          enumData: 0,
          data: {addr: ethers.constants.AddressZero, endowId: 0},
        })
      );
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

      await wait(
        state.setClosingEndowmentState(beneficiaryId, true, {
          enumData: 0,
          data: {addr: ethers.constants.AddressZero, endowId: 0},
        })
      );

      await expect(
        facet.withdraw(charityId, VaultType.LIQUID, ethers.constants.AddressZero, beneficiaryId, [
          {addr: tokenFake.address, amnt: 5000},
        ])
      ).to.be.revertedWith("Beneficiary endowment is closed");
    });

    describe("from Non-Mature endowments", () => {
      it("reverts if beneficiary address is not listed in allowlistedBeneficiaries nor is it the Endowment Owner", async () => {
        await wait(state.setAllowlist(normalEndowId, 0, [genWallet().address]));

        await expect(
          facet.withdraw(normalEndowId, VaultType.LIQUID, genWallet().address, 0, [
            {addr: tokenFake.address, amnt: 1},
          ])
        ).to.be.revertedWith(
          "Beneficiary address is not listed in allowlistedBeneficiaries nor is it the Endowment Owner"
        );
      });

      describe("LIQUID withdrawals", () => {
        it("reverts for a closed endowment (wallet beneficiary) when a non-beneficiary wallet tries to withdraw", async () => {
          const beneficiaryAddress = genWallet().address;
          const beneficiaryId = 0;
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          await wait(
            state.setClosingEndowmentState(charityId, true, {
              enumData: 1,
              data: {addr: beneficiaryAddress, endowId: beneficiaryId},
            })
          );

          await expect(
            facet.withdraw(charityId, acctType, beneficiaryAddress, beneficiaryId, tokens)
          ).to.be.revertedWith("Endowment is closed");
        });

        it("reverts for a closed endowment (endow beneficiary) when a wallet that is not the beneficiary endowment owner tries to withdraw", async () => {
          const beneficiaryAddress = genWallet().address;
          await impersonateAccount(beneficiaryAddress);
          await setBalance(beneficiaryAddress, 1000000000000000000); // give it some gas money, as impersonateAccount does not
          const acctSigner = await ethers.getSigner(beneficiaryAddress);

          // setup new charity-type endow
          const newCharityId = 3;
          await wait(state.setEndowmentDetails(newCharityId, charity));

          const beneficiaryId = newCharityId;
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          await wait(
            state.setClosingEndowmentState(charityId, true, {
              enumData: 0,
              data: {addr: ethers.constants.AddressZero, endowId: beneficiaryId},
            })
          );

          await expect(
            facet
              .connect(acctSigner)
              .withdraw(charityId, acctType, beneficiaryAddress, beneficiaryId, tokens)
          ).to.be.revertedWith("Endowment is closed");
        });

        it("passes: closed endowment with beneficiary address set, sender is beneficiary wallet, no fees applied ", async () => {
          const beneficiaryAddress = genWallet().address;
          await impersonateAccount(beneficiaryAddress);
          await setBalance(beneficiaryAddress, 1000000000000000000); // give it some gas money, as impersonateAccount does not
          const acctSigner = await ethers.getSigner(beneficiaryAddress);
          const beneficiaryId = 0;
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          await wait(
            state.setClosingEndowmentState(charityId, true, {
              enumData: 1,
              data: {addr: beneficiaryAddress, endowId: beneficiaryId},
            })
          );

          await expect(
            facet
              .connect(acctSigner)
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
            );
        });

        it("passes: closed endowment with beneficiary endow ID set, sender is beneficiary endow. owner, no fees applied ", async () => {
          // setup new charity-type endow
          const newCharityId = 3;
          await wait(state.setEndowmentDetails(newCharityId, charity));

          const beneficiaryAddress = ethers.constants.AddressZero;
          const beneficiaryId = newCharityId;
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          await wait(
            state.setClosingEndowmentState(charityId, true, {
              enumData: 0,
              data: {addr: beneficiaryAddress, endowId: beneficiaryId},
            })
          );

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
        });

        it("passes: normal, beneficiary address, sender is endow. owner, no fees applied", async () => {
          const beneficiaryId = 0;
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

          expect(tokenFake.transfer).to.have.been.calledWith(beneficiaryAddress, tokens[0].amnt);

          const [, liquidBalance] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokenFake.address
          );
          expect(liquidBalance).to.equal(liqBal.sub(tokens[0].amnt));
        });

        it("passes: charity, beneficiary address, sender is endow. owner, protocol-level withdraw fee applied", async () => {
          const beneficiaryId = 0;
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          // set protocol-level withdraw fees to 2%
          registrarFake.getFeeSettingsByFeeType.returns({payoutAddress: treasury, bps: 200});

          let amount = BigNumber.from(tokens[0].amnt);
          let expectedFeeAp = amount.mul(200).div(10000); // 5000 * 2% = 100
          let finalAmountLeftover = amount.sub(expectedFeeAp); // 5000 - 100 = 4900

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

          expect(tokenFake.transfer).to.have.been.calledWith(treasury, expectedFeeAp);
          expect(tokenFake.transfer).to.have.been.calledWith(
            beneficiaryAddress,
            finalAmountLeftover
          );

          const [lockedBalance, liquidBalance] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(liquidBalance).to.equal(liqBal.sub(tokens[0].amnt));
        });

        it("passes: normal, beneficiary address, sender is endow. owner, endowment-level withdraw fee applied", async () => {
          const beneficiaryId = 0;
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          // set endowment-level withdraw fee to 0.1%
          const normalWithFee: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            withdrawFee: {payoutAddress: await endowOwner.getAddress(), bps: 10},
          };
          await wait(state.setEndowmentDetails(normalEndowId, normalWithFee));

          let amount = BigNumber.from(tokens[0].amnt);
          let expectedFeeEndow = amount.mul(10).div(10000); // 5000 * 0.1% = 5
          let finalAmountLeftover = amount.sub(expectedFeeEndow); // 5000 - 5 = 4995

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

          expect(tokenFake.transfer).to.have.been.calledWith(
            await endowOwner.getAddress(),
            expectedFeeEndow
          );
          expect(tokenFake.transfer).to.have.been.calledWith(
            beneficiaryAddress,
            finalAmountLeftover
          );

          const [lockedBalance, liquidBalance] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokenFake.address
          );
          expect(liquidBalance).to.equal(liqBal.sub(tokens[0].amnt));
        });

        it("reverts if a charity endow tries to withdraw to a non-Charity type endow beneficiary", async () => {
          const beneficiaryAddress = ethers.constants.AddressZero;
          const beneficiaryId = normalEndowId;
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          await expect(
            facet.withdraw(charityId, acctType, beneficiaryAddress, beneficiaryId, tokens)
          ).to.be.revertedWith(
            "Charity Endowments may only transfer funds to other Charity Endowments"
          );
        });

        it("passes: charity, beneficiary ID(charity-type), sender is endow. owner, no withdraw fees applied", async () => {
          // setup new charity-type endow
          const newCharityId = 3;
          await wait(state.setEndowmentDetails(newCharityId, charity));

          const beneficiaryAddress = ethers.constants.AddressZero;
          const beneficiaryId = newCharityId;
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          let amount = BigNumber.from(tokens[0].amnt);

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
            )
            .to.emit(facet, "EndowmentDeposit")
            .withArgs(beneficiaryId, tokens[0].addr, 0, tokens[0].amnt);

          // assert withdrawing endow balances have been deducted in correct amounts
          const [lockedBalance, liquidBalance] = await state.getEndowmentTokenBalance(
            charityId,
            tokenFake.address
          );
          expect(lockedBalance).to.equal(lockBal);
          expect(liquidBalance).to.equal(liqBal.sub(amount));

          // asset that the receiving endow balances have been credited with the correct amounts
          const [lockBalBen, liqBalBen] = await state.getEndowmentTokenBalance(
            beneficiaryId,
            tokenFake.address
          );
          expect(lockBalBen).to.equal(lockBal);
          expect(liqBalBen).to.equal(liqBal.add(amount));
        });

        it("passes: normal, beneficiary address, sender is endow. owner, protocol-level and endow-level withdraw fees applied", async () => {
          const beneficiaryId = 0;
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];

          // set protocol-level withdraw fee to 2%
          registrarFake.getFeeSettingsByFeeType.returns({payoutAddress: treasury, bps: 200});

          // set Endowment allowlist & withdraw fee
          const normalWithAllowlist: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            withdrawFee: {payoutAddress: await endowOwner.getAddress(), bps: 10}, // 0.1%
          };
          await wait(state.setEndowmentDetails(normalEndowId, normalWithAllowlist));

          let amount = BigNumber.from(tokens[0].amnt);
          let expectedFeeAp = amount.mul(200).div(10000);
          let amountLeftAfterApFees = amount.sub(expectedFeeAp);
          let expectedFeeEndow = amountLeftAfterApFees.mul(10).div(10000);
          let finalAmountLeftover = amountLeftAfterApFees.sub(expectedFeeEndow);

          await expect(
            facet
              .connect(endowOwner)
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

          expect(tokenFake.transfer).to.have.been.calledWith(treasury, expectedFeeAp);
          expect(tokenFake.transfer).to.have.been.calledWith(
            await endowOwner.getAddress(),
            expectedFeeEndow
          );
          expect(tokenFake.transfer).to.have.been.calledWith(
            beneficiaryAddress,
            finalAmountLeftover
          );

          const [, liquidBalance] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokens[0].addr
          );
          expect(liquidBalance).to.equal(liqBal.sub(tokens[0].amnt));
        });

        it("passes: normal, beneficiary address (allowlisted beneficiary), 2 tokens, (endow-level withdraw fees)", async () => {
          const beneficiaryId = 0;
          const acctType = VaultType.LIQUID;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
            {addr: wmaticFake.address, amnt: 3000},
          ];

          // set Endowment allowlist & withdraw fee
          const normalWithAllowlist: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            withdrawFee: {payoutAddress: await endowOwner.getAddress(), bps: 10}, // 0.1%
          };
          await wait(state.setEndowmentDetails(normalEndowId, normalWithAllowlist));
          await wait(state.setAllowlist(normalEndowId, 0, [beneficiaryAddress]));

          await expect(
            facet
              .connect(endowOwner)
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
            )
            .and.to.emit(facet, "EndowmentWithdraw")
            .withArgs(
              normalEndowId,
              tokens[1].addr,
              tokens[1].amnt,
              acctType,
              beneficiaryAddress,
              beneficiaryId
            );

          // tokens[0]
          let amount = BigNumber.from(tokens[0].amnt);
          let expectedFeeEndow = amount.mul(10).div(10000);
          let finalAmountLeftover = amount.sub(expectedFeeEndow);

          expect(tokenFake.transfer).to.have.been.calledWith(
            await endowOwner.getAddress(),
            expectedFeeEndow
          );
          expect(tokenFake.transfer).to.have.been.calledWith(
            beneficiaryAddress,
            finalAmountLeftover
          );

          const [, liquidBalance] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokens[0].addr
          );
          expect(liquidBalance).to.equal(liqBal.sub(tokens[0].amnt));

          // tokens[1]
          amount = BigNumber.from(tokens[1].amnt);
          expectedFeeEndow = amount.mul(10).div(10000);
          finalAmountLeftover = amount.sub(expectedFeeEndow);

          expect(wmaticFake.transfer).to.have.been.calledWith(
            await endowOwner.getAddress(),
            expectedFeeEndow
          );
          expect(wmaticFake.transfer).to.have.been.calledWith(
            beneficiaryAddress,
            finalAmountLeftover
          );

          const [, liquidBalance2] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokens[1].addr
          );
          expect(liquidBalance2).to.equal(liqBal.sub(tokens[1].amnt));
        });
      });

      describe("LOCKED withdrawals", () => {
        it("passes: normal endowment, beneficiary address, 1 token, sender: endow. owner, protocol-level & endow-level withdraw & protocol-level early withdraw fees apply", async () => {
          registrarFake.getFeeSettingsByFeeType.returns({bps: 200, payoutAddress: treasury});

          const normalEndowWithFee: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            withdrawFee: {bps: 10, payoutAddress: await endowOwner.getAddress()},
          };
          await wait(state.setEndowmentDetails(normalEndowId, normalEndowWithFee));

          const acctType = VaultType.LOCKED;
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

          const amount = BigNumber.from(tokens[0].amnt);
          const protocolWithdrawFee = amount.mul(200).div(10000);
          const protocolEarlyWithdrawFee = amount.mul(200).div(10000);
          const amountLeftAfterApFees = amount.sub(
            protocolWithdrawFee.add(protocolEarlyWithdrawFee)
          );
          const endowmentWithdrawFee = amountLeftAfterApFees.mul(10).div(10000);
          const finalAmountLeftover = amountLeftAfterApFees.sub(endowmentWithdrawFee);

          expect(tokenFake.transfer).to.have.been.calledWith(treasury, protocolWithdrawFee);
          expect(tokenFake.transfer).to.have.been.calledWith(treasury, protocolEarlyWithdrawFee);
          expect(tokenFake.transfer).to.have.been.calledWith(
            await endowOwner.getAddress(),
            endowmentWithdrawFee
          );
          expect(tokenFake.transfer).to.have.been.calledWith(
            beneficiaryAddress,
            finalAmountLeftover
          );

          const [lockedBalance] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokens[0].addr
          );
          expect(lockedBalance).to.equal(lockBal.sub(amount));
        });

        it("passes: charity, beneficiary address, 1 token, sender: endow. owner, protocol-level early & normal withdraw fees apply", async () => {
          registrarFake.getFeeSettingsByFeeType.returns({bps: 200, payoutAddress: treasury});

          const acctType = VaultType.LOCKED;
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

          const amount = BigNumber.from(tokens[0].amnt);
          const protocolWithdrawFee = amount.mul(200).div(10000);
          const protocolEarlyWithdrawFee = amount.mul(200).div(10000);
          const finalAmountLeftover = amount.sub(protocolWithdrawFee.add(protocolEarlyWithdrawFee));

          expect(tokenFake.transfer).to.have.been.calledWith(treasury, protocolWithdrawFee);
          expect(tokenFake.transfer).to.have.been.calledWith(treasury, protocolEarlyWithdrawFee);
          expect(tokenFake.transfer).to.have.been.calledWith(
            beneficiaryAddress,
            finalAmountLeftover
          );

          const [lockedBalance] = await state.getEndowmentTokenBalance(charityId, tokens[0].addr);
          expect(lockedBalance).to.equal(lockBal.sub(amount));
        });
      });
    });

    describe("from Mature endowments", () => {
      it("reverts if beneficiary address is not listed in maturityAllowlist", async () => {
        const currTime = await time.latest();

        const matureEndowment: AccountStorage.EndowmentStruct = {
          ...normalEndow,
          maturityTime: currTime,
        };
        await wait(state.setEndowmentDetails(normalEndowId, matureEndowment));
        await wait(state.setAllowlist(normalEndowId, 2, [genWallet().address]));

        const acctType = VaultType.LIQUID;
        const beneficiaryId = 0;
        const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
          {addr: tokenFake.address, amnt: 5000},
        ];

        await expect(
          facet.withdraw(normalEndowId, acctType, beneficiaryAddress, beneficiaryId, tokens)
        ).to.be.revertedWith("Unauthorized");
      });

      describe("LOCKED withdrawals", () => {
        it("passes: Normal to Address (protocol-level normal fee only)", async () => {
          const currTime = await time.latest();

          registrarFake.getFeeSettingsByFeeType.returns({bps: 200, payoutAddress: treasury});

          const matureEndowment: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            maturityTime: currTime,
          };
          await wait(state.setEndowmentDetails(normalEndowId, matureEndowment));
          const beneficiarySigner = new ethers.Wallet(
            genWallet().privateKey, 
            hre.ethers.provider
          );
          await accOwner.sendTransaction({value: ethers.utils.parseEther("1"), to: beneficiarySigner.address})

          await wait(state.setAllowlist(normalEndowId, 2, [beneficiarySigner.address]));

          const acctType = VaultType.LOCKED;
          const beneficiaryId = 0;
          const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
            {addr: tokenFake.address, amnt: 5000},
          ];
          const amount = BigNumber.from(tokens[0].amnt);
          const expectedFeeAp = amount.mul(200).div(10000);
          const finalAmountLeftover = amount.sub(expectedFeeAp);

          await expect(
            facet.connect(beneficiarySigner).withdraw(normalEndowId, acctType, beneficiarySigner.address, beneficiaryId, tokens)
          )
            .to.emit(facet, "EndowmentWithdraw")
            .withArgs(
              normalEndowId,
              tokens[0].addr,
              tokens[0].amnt,
              acctType,
              beneficiarySigner.address,
              beneficiaryId
            );

          expect(tokenFake.transfer).to.have.been.calledWith(treasury, expectedFeeAp);
          expect(tokenFake.transfer).to.have.been.calledWith(
            beneficiarySigner.address,
            finalAmountLeftover
          );

          const [lockedBalance] = await state.getEndowmentTokenBalance(
            normalEndowId,
            tokens[0].addr
          );
          expect(lockedBalance).to.equal(lockBal.sub(amount));
        });

        it("passes: Normal to a Charity Endowment transfer", async () => {
          const currTime = await time.latest();

          const matureEndowment: AccountStorage.EndowmentStruct = {
            ...normalEndow,
            maturityTime: currTime,
          };
          await wait(state.setEndowmentDetails(normalEndowId, matureEndowment));
          await wait(state.setAllowlist(normalEndowId, 2, [await indexFund.getAddress()]));

          const acctType = VaultType.LOCKED;
          const beneficiaryAddress = ethers.constants.AddressZero;
          const beneficiaryId = charityId;
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
            normalEndowId,
            tokens[0].addr
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

    describe("for DAF endowment withdraw/transfer (no fees are applied)", () => {
      it("reverts if a non-DAF approved beneficiary Endow ID is passed", async () => {
        const acctType = VaultType.LOCKED;
        const beneficiaryAddress = ethers.constants.AddressZero;
        const beneficiaryId = charityId;
        const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
          {addr: tokenFake.address, amnt: 5000},
        ];
        const amount = BigNumber.from(tokens[0].amnt);

        await expect(
          facet.withdraw(dafEndowId, acctType, beneficiaryAddress, beneficiaryId, tokens)
        ).to.revertedWith("Endowment beneficiary must be a DAF-Approved Endowment");
      });

      it("reverts if a beneficiary address is passed", async () => {
        const acctType = VaultType.LOCKED;
        const beneficiaryId = charityId;
        const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
          {addr: tokenFake.address, amnt: 5000},
        ];
        const amount = BigNumber.from(tokens[0].amnt);

        await expect(
          facet.withdraw(dafEndowId, acctType, beneficiaryAddress, beneficiaryId, tokens)
        ).to.revertedWith("Beneficiary address is not allowed for DAF withdrawals");
      });

      it("passes if approved Endowment ID is passed", async () => {
        // set the beneficiary endowment as DAF approved
        await wait(state.setDafApprovedEndowment(charityId, true));

        const acctType = VaultType.LOCKED;
        const beneficiaryAddress = ethers.constants.AddressZero;
        const beneficiaryId = charityId;
        const tokens: IAccountsDepositWithdrawEndowments.TokenInfoStruct[] = [
          {addr: tokenFake.address, amnt: 5000},
        ];
        const amount = BigNumber.from(tokens[0].amnt);

        await expect(
          facet.withdraw(dafEndowId, acctType, beneficiaryAddress, beneficiaryId, tokens)
        )
          .to.emit(facet, "EndowmentWithdraw")
          .withArgs(
            dafEndowId,
            tokens[0].addr,
            tokens[0].amnt,
            acctType,
            beneficiaryAddress,
            beneficiaryId
          );

        const [lockedBalance, liquidBalance] = await state.getEndowmentTokenBalance(
          dafEndowId,
          tokens[0].addr
        );
        expect(lockedBalance).to.equal(lockBal.sub(amount));
        expect(liquidBalance).to.equal(liqBal);

        const [lockBalBen, liqBalBen] = await state.getEndowmentTokenBalance(
          beneficiaryId,
          tokens[0].addr
        );
        expect(lockBalBen).to.equal(lockBal.add(amount));
        expect(liqBalBen).to.equal(liqBal);
      });
    });
  });
});
