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
  const BALANCE = 1000;

  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let accounts: SignerWithAddress;

  let token: FakeContract<IERC20>;
  let gasFwd: GasFwd;

  async function deployGasFwdAsProxy(
    owner: SignerWithAddress,
    admin: SignerWithAddress,
    accounts: SignerWithAddress
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
    return GasFwd__factory.connect(proxy.address, accounts);
  }

  before(async function () {
    const {deployer, proxyAdminSigner, apTeam1} = await getSigners(hre);
    owner = deployer;
    admin = proxyAdminSigner;
    accounts = apTeam1;
  });

  beforeEach(async function () {
    token = await smock.fake<IERC20>(IERC20__factory.createInterface());
    gasFwd = await deployGasFwdAsProxy(owner, admin, accounts);
    token.balanceOf.returns(BALANCE);
    token.transfer.returns(true);
  });

  describe("upon payForGas", async function () {
    it("reverts if called by non-accounts contract", async function () {
      await expect(gasFwd.connect(owner).payForGas(token.address, 1)).to.be.revertedWithCustomError(
        gasFwd,
        "OnlyAccounts"
      );
    });
    it("nothing happens when requested amount is 0", async function () {
      await expect(gasFwd.payForGas(token.address, 0)).to.not.emit(gasFwd, "GasPay");
      expect(token.transfer).to.not.be.called;
    });
    it("nothing happens when current balance is 0", async function () {
      token.balanceOf.returns(0);
      await expect(gasFwd.payForGas(token.address, 1)).to.not.emit(gasFwd, "GasPay");
      expect(token.transfer).to.not.be.called;
    });
    it("transfers tokens which do not exceed the balance", async function () {
      const amount = 1;
      await expect(gasFwd.payForGas(token.address, amount))
        .to.emit(gasFwd, "GasPay")
        .withArgs(token.address, amount);
      expect(token.transfer).to.have.been.calledWith(accounts.address, amount);
    });
    it("transfers tokens when amount to transfer is equal to balance", async function () {
      await expect(gasFwd.payForGas(token.address, BALANCE))
        .to.emit(gasFwd, "GasPay")
        .withArgs(token.address, BALANCE);
      expect(token.transfer).to.have.been.calledWith(accounts.address, BALANCE);
    });
    it("transfers tokens when the call exceeds the balance", async function () {
      await expect(gasFwd.payForGas(token.address, BALANCE + 1))
        .to.emit(gasFwd, "GasPay")
        .withArgs(token.address, BALANCE);
      expect(token.transfer).to.have.been.calledWith(accounts.address, BALANCE);
    });
  });

  describe("upon sweep", async function () {
    it("reverts if called by non-accounts contract", async function () {
      await expect(gasFwd.connect(owner).sweep(token.address)).to.be.revertedWithCustomError(
        gasFwd,
        "OnlyAccounts"
      );
    });
    it("nothing happens if there's no balance to sweep", async () => {
      token.balanceOf.returns(0);
      await expect(gasFwd.sweep(token.address)).to.not.emit(gasFwd, "Sweep");
      expect(token.transfer).to.not.be.called;
    });
    it("transfers the token balance", async function () {
      token.transfer.returns(true);
      await expect(gasFwd.sweep(token.address))
        .to.emit(gasFwd, "Sweep")
        .withArgs(token.address, BALANCE);
      expect(token.transfer).to.have.been.calledWith(accounts.address, BALANCE);
    });
  });
});
