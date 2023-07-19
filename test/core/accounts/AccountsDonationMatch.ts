import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import {BigNumber} from "ethers";
import hre from "hardhat";
import {
  DEFAULT_CHARITY_ENDOWMENT,
  DEFAULT_REGISTRAR_CONFIG,
  DEFAULT_STRATEGY_SELECTOR,
  DonationMatchEnum,
} from "test/utils";
import {
  AccountsDonationMatch,
  AccountsDonationMatch__factory,
  DonationMatch,
  DonationMatchEmitter,
  DonationMatchEmitter__factory,
  DonationMatch__factory,
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
import {AccountMessages} from "typechain-types/contracts/core/accounts/facets/AccountsDonationMatch";
import {DonationMatchStorage} from "typechain-types/contracts/normalized_endowment/donation-match/DonationMatchEmitter";

use(smock.matchers);

describe("AccountsDonationMatch", function () {
  const {ethers} = hre;

  const endowId = 1;

  const usdcAddress = genWallet().address;

  let accOwner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let endowOwner: SignerWithAddress;
  let user: SignerWithAddress;

  let facet: AccountsDonationMatch;
  let state: TestFacetProxyContract;

  let daoTokenFake: FakeContract<DummyERC20>;
  let donationMatchFake: FakeContract<DonationMatch>;
  let donationMatchEmitterFake: FakeContract<DonationMatchEmitter>;
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

    daoTokenFake = await smock.fake<DummyERC20>(new DummyERC20__factory());
    donationMatchFake = await smock.fake<DonationMatch>(new DonationMatch__factory());
    donationMatchEmitterFake = await smock.fake<DonationMatchEmitter>(
      new DonationMatchEmitter__factory()
    );
    haloTokenFake = await smock.fake<DummyERC20>(new DummyERC20__factory());
    registrarFake = await smock.fake<Registrar>(new Registrar__factory());

    const config: RegistrarStorage.ConfigStruct = {
      ...DEFAULT_REGISTRAR_CONFIG,
      donationMatchContract: donationMatchFake.address,
      donationMatchEmitter: donationMatchEmitterFake.address,
      haloToken: haloTokenFake.address,
      proxyAdmin: proxyAdmin.address,
      usdcAddress,
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

  describe("upon setupDonationMatch", () => {
    let details: AccountMessages.DonationMatchStruct;

    beforeEach(() => {
      details = {
        enumData: DonationMatchEnum.HaloTokenReserve,
        data: {
          poolFee: 5,
          reserveToken: ethers.constants.AddressZero,
          uniswapFactory: genWallet().address,
        },
      };
    });

    it("reverts if sender is not the endowment owner", async () => {
      await expect(facet.connect(user).setupDonationMatch(endowId, details)).to.be.revertedWith(
        "Unauthorized"
      );
    });

    it("reverts if a donation match contract has already been created for an endowment", async () => {
      const prevEndow = await state.getEndowmentDetails(endowId);
      const endowWithDonMatch: AccountStorage.EndowmentStruct = {
        ...prevEndow,
        donationMatchContract: genWallet().address,
      };
      await state.setEndowmentDetails(endowId, endowWithDonMatch);

      await expect(facet.setupDonationMatch(endowId, details)).to.be.revertedWith(
        "A Donation Match contract already exists for this Endowment"
      );
    });

    it("reverts if the passed uniswapFactory address is a zero address", async () => {
      details.data.uniswapFactory = ethers.constants.AddressZero;

      await expect(facet.setupDonationMatch(endowId, details)).to.be.revertedWith(
        "Invalid UniswapFactory address"
      );
    });

    it("reverts if the passed pool fee is 0 (zero)", async () => {
      details.data.poolFee = 0;

      await expect(facet.setupDonationMatch(endowId, details)).to.be.revertedWith(
        "Invalid pool fee"
      );
    });

    it("reverts if there is no donation matching contract implementation in the Registrar", async () => {
      const prevConfig = await registrarFake.queryConfig();
      const config: RegistrarStorage.ConfigStruct = {
        ...prevConfig,
        donationMatchContract: ethers.constants.AddressZero,
      };
      registrarFake.queryConfig.returns(config);

      await expect(facet.setupDonationMatch(endowId, details)).to.be.revertedWith(
        "Missing implementation for donation matching contract"
      );
    });

    it("reverts if there is no USDC address in the Registrar", async () => {
      const prevConfig = await registrarFake.queryConfig();
      const config: RegistrarStorage.ConfigStruct = {
        ...prevConfig,
        usdcAddress: ethers.constants.AddressZero,
      };
      registrarFake.queryConfig.returns(config);

      await expect(facet.setupDonationMatch(endowId, details)).to.be.revertedWith(
        "Invalid USDC address in Registrar"
      );
    });

    it("reverts if there is no HALO address in the Registrar", async () => {
      const prevConfig = await registrarFake.queryConfig();
      const config: RegistrarStorage.ConfigStruct = {
        ...prevConfig,
        haloToken: ethers.constants.AddressZero,
      };
      registrarFake.queryConfig.returns(config);

      await expect(facet.setupDonationMatch(endowId, details)).to.be.revertedWith(
        "Invalid HALO address in Registrar"
      );
    });

    it("reverts if the passed reserveToken address is a zero address", async () => {
      details.enumData = DonationMatchEnum.Cw20TokenReserve;
      details.data.reserveToken = ethers.constants.AddressZero;

      await expect(facet.setupDonationMatch(endowId, details)).to.be.revertedWith(
        "Invalid reserve token address"
      );
    });

    it("passes when setting up HALO as the reserve token", async () => {
      await expect(facet.setupDonationMatch(endowId, details)).to.emit(
        facet,
        "DonationMatchCreated"
      );

      const endow = await state.getEndowmentDetails(endowId);
      expect(endow.donationMatchContract).to.not.equal(ethers.constants.AddressZero);

      const expectedConfig: DonationMatchStorage.ConfigStruct = {
        poolFee: details.data.poolFee,
        uniswapFactory: details.data.uniswapFactory,
        registrarContract: registrarFake.address,
        reserveToken: haloTokenFake.address,
        usdcAddress,
      };
      expect(donationMatchEmitterFake.initializeDonationMatch).to.have.been.calledWith(
        endowId,
        endow.donationMatchContract,
        expectedConfig
      );
    });

    it("passes when setting up some custom reserve token", async () => {
      details.enumData = DonationMatchEnum.Cw20TokenReserve;
      details.data.reserveToken = genWallet().address;

      await expect(facet.setupDonationMatch(endowId, details)).to.emit(
        facet,
        "DonationMatchCreated"
      );

      const endow = await state.getEndowmentDetails(endowId);
      expect(endow.donationMatchContract).to.not.equal(ethers.constants.AddressZero);

      const expectedConfig: DonationMatchStorage.ConfigStruct = {
        poolFee: details.data.poolFee,
        uniswapFactory: details.data.uniswapFactory,
        registrarContract: registrarFake.address,
        reserveToken: details.data.reserveToken,
        usdcAddress,
      };
      expect(donationMatchEmitterFake.initializeDonationMatch).to.have.been.calledWith(
        endowId,
        endow.donationMatchContract,
        expectedConfig
      );
    });
  });
});
