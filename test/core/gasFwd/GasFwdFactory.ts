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

  let deployer: Signer;
  let admin: Signer;
  let user: Signer;

  let gasFwdFactory: GasFwdFactory;

  let registrarFake: FakeContract<Registrar>;

  before(async function () {
    const signers = await getSigners(hre);
    deployer = signers.deployer;
    user = signers.apTeam1;

    admin = await getProxyAdminOwner(hre);

    registrarFake = await smock.fake<Registrar>(new Registrar__factory(), {
      address: genWallet().address,
    });

    const config = {
      ...DEFAULT_REGISTRAR_CONFIG,
      accountsContract: genWallet().address,
    };
    registrarFake.queryConfig.returns(config);

    const GasFwd = new GasFwd__factory(deployer);
    const gasFwd = await GasFwd.deploy();
    gasFwdFactory = await deploy(
      gasFwd.address,
      await admin.getAddress(),
      registrarFake.address,
      deployer
    );
  });

  describe("upon deployement", async function () {
    const gffInterface = GasFwdFactory__factory.createInterface();

    it("reverts if the implementation address is invalid", async function () {
      await expect(
        deploy(
          ethers.constants.AddressZero,
          await admin.getAddress(),
          registrarFake.address,
          deployer
        )
      )
        .to.be.revertedWithCustomError({interface: gffInterface}, "InvalidAddress")
        .withArgs("_impl");
    });
    it("reverts if the admin address is invalid", async function () {
      await expect(
        deploy(genWallet().address, ethers.constants.AddressZero, registrarFake.address, deployer)
      )
        .to.be.revertedWithCustomError({interface: gffInterface}, "InvalidAddress")
        .withArgs("_admin");
    });
    it("reverts if the registrar address is invalid", async function () {
      await expect(
        deploy(
          genWallet().address,
          await admin.getAddress(),
          ethers.constants.AddressZero,
          deployer
        )
      )
        .to.be.revertedWithCustomError({interface: gffInterface}, "InvalidAddress")
        .withArgs("_registrar");
    });
  });

  describe("upon create", async function () {
    it("deploys a new proxy of the GasFwd contract", async function () {
      await expect(gasFwdFactory.create()).to.emit(gasFwdFactory, "GasFwdCreated");
    });
  });

  describe("upon updateImplementation", async function () {
    it("reverts if called by a non-owner ", async function () {
      await expect(
        gasFwdFactory.connect(admin).updateImplementation(ethers.constants.AddressZero)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("reverts if the new impl address is invalid", async function () {
      await expect(
        gasFwdFactory.updateImplementation(ethers.constants.AddressZero)
      ).to.be.revertedWithCustomError(gasFwdFactory, "InvalidAddress");
    });
  });
});

async function deploy(
  impl: string,
  admin: string,
  registrar: string,
  deployer: Signer
): Promise<GasFwdFactory> {
  let GFF = new GasFwdFactory__factory(deployer);
  let gff = await GFF.deploy(impl, admin, registrar);
  await gff.deployed();
  return gff;
}
