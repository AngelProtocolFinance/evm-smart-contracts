import {FakeContract, smock} from "@defi-wonderland/smock";
import {Signer} from "ethers";
import {expect, use} from "chai";
import hre from "hardhat";
import {DEFAULT_REGISTRAR_CONFIG} from "test/utils";
import {
  GasFwdFactory,
  GasFwdFactory__factory,
  GasFwd__factory,
  Registrar,
  Registrar__factory,
} from "typechain-types";
import {genWallet, getProxyAdminOwner, getSigners} from "utils";

use(smock.matchers);

describe("GasFwdFactory", function () {
  const {ethers} = hre;
  let owner: Signer;
  let admin: Signer;
  let user: Signer;
  let registrarFake: FakeContract<Registrar>;

  async function deployGasFwdFactory(
    owner: Signer,
    admin: Signer,
    registrar: string
  ): Promise<GasFwdFactory> {
    let GasFwd = new GasFwd__factory(admin);
    let gasFwdImpl = await GasFwd.deploy();
    await gasFwdImpl.deployed();
    let GFF = new GasFwdFactory__factory(owner);
    let gff = await GFF.deploy(gasFwdImpl.address, await admin.getAddress(), registrar);
    await gff.deployed();
    return gff;
  }

  before(async function () {
    const {deployer, apTeam1} = await getSigners(hre);
    owner = deployer;
    user = apTeam1;

    admin = await getProxyAdminOwner(hre);
  });

  beforeEach(async function () {
    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
    });
    const config = {
      ...DEFAULT_REGISTRAR_CONFIG,
      accountsContract: genWallet().address,
    };
    registrarFake.queryConfig.returns(config);
  });

  describe("upon deployement", async function () {
    it("reverts if the registrar address is invalid", async function () {
      await expect(deployGasFwdFactory(owner, admin, ethers.constants.AddressZero)).to.be.reverted;
    });

    it("successfully deploys", async function () {
      expect(await deployGasFwdFactory(owner, admin, registrarFake.address));
    });
  });

  describe("upon create", async function () {
    let gff: GasFwdFactory;
    beforeEach(async function () {
      gff = await deployGasFwdFactory(owner, admin, registrarFake.address);
    });

    it("deploys a new proxy of the GasFwd contract", async function () {
      expect(gff.address);
      expect(await gff.create()).to.emit(gff, "GasFwdCreated");
    });
  });

  describe("upon updateImplementation", async function () {
    let gff: GasFwdFactory;
    beforeEach(async function () {
      gff = await deployGasFwdFactory(owner, admin, registrarFake.address);
    });

    it("reverts if called by a non-owner ", async function () {
      await expect(
        gff.connect(admin).updateImplementation(ethers.constants.AddressZero)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("reverts if the new impl address is invalid", async function () {
      await expect(
        gff.updateImplementation(ethers.constants.AddressZero)
      ).to.be.revertedWithCustomError(gff, "InvalidAddress");
    });
  });
});
