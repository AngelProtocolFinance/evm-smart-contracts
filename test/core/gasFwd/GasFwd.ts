import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect} from "chai";
import hre from "hardhat";
import {getSigners} from "utils";
import {GasFwd__factory, GasFwd, ProxyContract__factory, DummyERC20} from "typechain-types";
import {deployDummyERC20} from "test/utils";

describe("GasFwd", function () {
  const {ethers, upgrades} = hre;
  const BALANCE = 1000;

  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;

  async function deployGasFwdAsProxy(
    owner: SignerWithAddress,
    admin: SignerWithAddress,
    accounts?: SignerWithAddress
  ): Promise<GasFwd> {
    let GasFwd = new GasFwd__factory(admin);
    let gasFwdImpl = await GasFwd.deploy();
    await gasFwdImpl.deployed();
    const data = gasFwdImpl.interface.encodeFunctionData("initialize", [
      accounts ? accounts.address : owner.address,
    ]);
    let proxyFactory = new ProxyContract__factory(owner);
    let proxy = await proxyFactory.deploy(gasFwdImpl.address, admin.address, data);
    await proxy.deployed();
    return GasFwd__factory.connect(proxy.address, owner);
  }

  before(async function () {
    const {deployer, proxyAdmin, apTeam1} = await getSigners(hre);
    owner = deployer;
    admin = proxyAdmin;
    user = apTeam1;
  });

  describe("upon deployment", async function () {
    it("can be deployed as a proxy", async function () {
      expect(await deployGasFwdAsProxy(owner, admin));
    });
  });

  describe("upon payForGas", async function () {
    let token: DummyERC20;
    let gasFwd: GasFwd;
    beforeEach(async function () {
      token = await deployDummyERC20(owner);
      gasFwd = await deployGasFwdAsProxy(owner, admin, user);
      await token.mint(gasFwd.address, BALANCE);
    });
    it("reverts if called by non-accounts contract", async function () {
      await expect(gasFwd.payForGas(token.address, 1)).to.be.revertedWithCustomError(
        gasFwd,
        "OnlyAccounts"
      );
    });
    it("transfers tokens which do not exceed the balance", async function () {
      await gasFwd.connect(user).payForGas(token.address, 1);
      let balance = await token.balanceOf(user.address);
      expect(balance).to.equal(1);
    });
    it("transfers tokens when the call exceeds the balance", async function () {
      await gasFwd.connect(user).payForGas(token.address, BALANCE + 1);
      let balance = await token.balanceOf(user.address);
      expect(balance).to.equal(BALANCE);
    });
  });

  describe("upon sweep", async function () {
    let token: DummyERC20;
    let gasFwd: GasFwd;
    beforeEach(async function () {
      token = await deployDummyERC20(owner);
      gasFwd = await deployGasFwdAsProxy(owner, admin, user);
    });
    it("reverts if called by non-accounts contract", async function () {
      await expect(gasFwd.sweep(token.address)).to.be.revertedWithCustomError(
        gasFwd,
        "OnlyAccounts"
      );
    });
    it("returns 0 (zero) if there's no balance to sweep", async () => {
      expect(await gasFwd.connect(user).sweep(token.address))
        .to.not.emit(gasFwd, "Sweep")
        .and.to.equal(0);
    });
    it("transfers the token balance", async function () {
      await token.mint(gasFwd.address, BALANCE);
      await gasFwd.connect(user).sweep(token.address);
      let balance = await token.balanceOf(user.address);
      expect(balance).to.equal(BALANCE);
    });
  });
});
