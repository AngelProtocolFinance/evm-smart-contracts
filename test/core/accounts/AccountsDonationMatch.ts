import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_REGISTRAR_CONFIG,
  DEFAULT_STRATEGY_SELECTOR,
} from "test/utils";
import {
  AccountsDonationMatch,
  AccountsDonationMatch__factory,
  DummyERC20,
  DummyERC20__factory,
  Registrar,
  Registrar__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {RegistrarStorage} from "typechain-types/contracts/core/registrar/Registrar";
import {AccountStorage} from "typechain-types/contracts/test/accounts/TestFacetProxyContract";
import {genWallet, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils/deployTestFacet";

use(smock.matchers);

describe("AccountsDonationMatch", function () {
  const {ethers} = hre;

  const endowId = 1;

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let user: SignerWithAddress;

  let facet: AccountsDonationMatch;
  let state: TestFacetProxyContract;

  let daoTokenFake: FakeContract<DummyERC20>;
  let haloTokenFake: FakeContract<DummyERC20>;
  let registrarFake: FakeContract<Registrar>;

  before(async function () {
    const signers = await getSigners(hre);
    accOwner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    endowOwner = signers.deployer;
    user = signers.apTeam2;
  });

  beforeEach(async function () {
    const Facet = new AccountsDonationMatch__factory(accOwner);
    const facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, accOwner, proxyAdmin, facetImpl.address);

    facet = AccountsDonationMatch__factory.connect(state.address, endowOwner);

    registrarFake = await smock.fake<Registrar>(new Registrar__factory());
    daoTokenFake = await smock.fake<DummyERC20>(new DummyERC20__factory());
    haloTokenFake = await smock.fake<DummyERC20>(new DummyERC20__factory());

    const config: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      haloToken: haloTokenFake.address,
    };
    registrarFake.queryConfig.returns(config);

    const endowment: AccountStorage.EndowmentStruct = {
      ...DEFAULT_CHARITY_ENDOWMENT,
      owner: endowOwner.address,
      daoToken: daoTokenFake.address,
    };
    await state.setEndowmentDetails(endowId, endowment);
    await state.setConfig({
      owner: accOwner.address,
      version: "1",
      networkName: "Polygon",
      registrarContract: registrarFake.address,
      nextAccountId: endowId + 1,
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });
  });

  describe("upon depositDonationMatchERC20", () => {
    it("reverts if the token is neither HALO nor DAOToken", async () => {
      await expect(
        facet.depositDonationMatchERC20(endowId, genWallet().address, 10)
      ).to.be.revertedWith("Invalid Token");
    });

    it("passes when token used is HALO", async () => {
      const prevBalance = await state.getDaoTokenBalance(endowId);
      const amount = BigNumber.from(10);

      haloTokenFake.transferFrom.returns(true);

      await expect(facet.depositDonationMatchERC20(endowId, haloTokenFake.address, amount))
        .to.emit(facet, "DonationDeposited")
        .withArgs(endowId, haloTokenFake.address, amount);

      expect(await state.getDaoTokenBalance(endowId)).to.equal(prevBalance.add(amount));
    });

    it("passes when token used is DAOToken", async () => {
      const prevBalance = await state.getDaoTokenBalance(endowId);
      const amount = BigNumber.from(10);

      daoTokenFake.transferFrom.returns(true);

      await expect(facet.depositDonationMatchERC20(endowId, daoTokenFake.address, amount))
        .to.emit(facet, "DonationDeposited")
        .withArgs(endowId, daoTokenFake.address, amount);

      expect(await state.getDaoTokenBalance(endowId)).to.equal(prevBalance.add(amount));
    });
  });

  describe("upon withdrawDonationMatchERC20", () => {
    it("reverts if amount is 0 (zero)", async () => {
      await expect(
        facet.withdrawDonationMatchERC20(endowId, genWallet().address, 0)
      ).to.be.revertedWith("amount should be greater than 0");
    });

    it("reverts if sender is not the endowment owner", async () => {
      await expect(
        facet.connect(user).withdrawDonationMatchERC20(endowId, genWallet().address, 10)
      ).to.be.revertedWith("Unauthorized");
    });

    it("reverts if endowment's DAO token balance is smaller than the requested amount", async () => {
      // current DAO token balance is not set, which makes it 0 (zero) by default
      await expect(
        facet.withdrawDonationMatchERC20(endowId, genWallet().address, 10)
      ).to.be.revertedWith("Insufficient amount");
    });

    it("passes if DAO token balance is equal to the requested amount", async () => {
      const amount = 10;
      const recipient = genWallet().address;

      await state.setDaoTokenBalance(endowId, amount);

      daoTokenFake.transfer.whenCalledWith(recipient, amount).returns(true);

      await expect(facet.withdrawDonationMatchERC20(endowId, recipient, amount))
        .to.emit(facet, "DonationWithdrawn")
        .withArgs(endowId, recipient, daoTokenFake.address, amount);

      expect(await state.getDaoTokenBalance(endowId)).to.equal(0);
    });

    it("passes if DAO token balance is greater than the requested amount", async () => {
      const amount = 10;
      const recipient = genWallet().address;

      await state.setDaoTokenBalance(endowId, amount + 1);

      daoTokenFake.transfer.whenCalledWith(recipient, amount).returns(true);

      await expect(facet.withdrawDonationMatchERC20(endowId, recipient, amount))
        .to.emit(facet, "DonationWithdrawn")
        .withArgs(endowId, recipient, daoTokenFake.address, amount);

      expect(await state.getDaoTokenBalance(endowId)).to.equal(1);
    });
  });
});
