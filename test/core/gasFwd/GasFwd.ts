import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {
  GasFwd,
  GasFwd__factory,
  IERC20,
  IERC20__factory,
  ProxyContract__factory,
} from "typechain-types";
import {getSigners} from "utils";

use(smock.matchers);

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
    let token: FakeContract<IERC20>;
    let gasFwd: GasFwd;
    beforeEach(async function () {
      token = await smock.fake<IERC20>(IERC20__factory.createInterface());
      gasFwd = await deployGasFwdAsProxy(owner, admin, user);
    });
    it("reverts if called by non-accounts contract", async function () {
      await expect(gasFwd.payForGas(token.address, 1)).to.be.revertedWithCustomError(
        gasFwd,
        "OnlyAccounts"
      );
    });
    it("nothing happens when requested amount is 0", async function () {
      token.balanceOf.returns(BALANCE);
      await expect(gasFwd.connect(user).payForGas(token.address, 0)).to.not.emit(gasFwd, "GasPay");
      expect(token.transfer).to.not.be.called;
    });
    it("nothing happens when current balance is 0", async function () {
      token.balanceOf.returns(0);
      await expect(gasFwd.connect(user).payForGas(token.address, 1)).to.not.emit(gasFwd, "GasPay");
      expect(token.transfer).to.not.be.called;
    });
    it("transfers tokens which do not exceed the balance", async function () {
      const amount = 1;
      token.transfer.returns(true);
      token.balanceOf.returns(BALANCE);
      await expect(gasFwd.connect(user).payForGas(token.address, amount))
        .to.emit(gasFwd, "GasPay")
        .withArgs(token.address, amount);
      expect(token.transfer).to.have.been.calledWith(user.address, amount);
    });
    it("transfers tokens when amount to transfer is equal to balance", async function () {
      token.transfer.returns(true);
      token.balanceOf.returns(BALANCE);
      await expect(gasFwd.connect(user).payForGas(token.address, BALANCE))
        .to.emit(gasFwd, "GasPay")
        .withArgs(token.address, BALANCE);
      expect(token.transfer).to.have.been.calledWith(user.address, BALANCE);
    });
    it("transfers tokens when the call exceeds the balance", async function () {
      token.transfer.returns(true);
      token.balanceOf.returns(BALANCE);
      await expect(gasFwd.connect(user).payForGas(token.address, BALANCE + 1))
        .to.emit(gasFwd, "GasPay")
        .withArgs(token.address, BALANCE);
      expect(token.transfer).to.have.been.calledWith(user.address, BALANCE);
    });
  });

  describe("upon sweep", async function () {
    let token: FakeContract<IERC20>;
    let gasFwd: GasFwd;
    beforeEach(async function () {
      token = await smock.fake<IERC20>(IERC20__factory.createInterface());
      gasFwd = await deployGasFwdAsProxy(owner, admin, user);
    });
    it("reverts if called by non-accounts contract", async function () {
      await expect(gasFwd.sweep(token.address)).to.be.revertedWithCustomError(
        gasFwd,
        "OnlyAccounts"
      );
    });
    it("nothing happens if there's no balance to sweep", async () => {
      token.balanceOf.returns(0);
      await expect(gasFwd.connect(user).sweep(token.address)).to.not.emit(gasFwd, "Sweep");
      expect(token.transfer).to.not.be.called;
    });
    it("transfers the token balance", async function () {
      const balance = 10;
      token.transfer.returns(true);
      token.balanceOf.returns(balance);

      await expect(gasFwd.connect(user).sweep(token.address))
        .to.emit(gasFwd, "Sweep")
        .withArgs(token.address, balance);
      expect(token.transfer).to.have.been.calledWith(user.address, balance);
    });
  });
});
