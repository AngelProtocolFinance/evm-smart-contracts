import {FakeContract, smock} from "@defi-wonderland/smock";
import {SnapshotRestorer, takeSnapshot} from "@nomicfoundation/hardhat-network-helpers";
import {expect, use} from "chai";
import {Signer} from "ethers";
import hre from "hardhat";
import {
  GasFwd,
  GasFwd__factory,
  IERC20,
  IERC20__factory,
  ProxyContract__factory,
} from "typechain-types";
import {getProxyAdminOwner, getSigners} from "utils";

use(smock.matchers);

describe("GasFwd", function () {
  const BALANCE = 1000;

  let owner: Signer;
  let admin: Signer;
  let accounts: Signer;

  let token: FakeContract<IERC20>;
  let gasFwd: GasFwd;

  before(async function () {
    const {deployer, apTeam1} = await getSigners(hre);
    owner = deployer;
    accounts = apTeam1;

    admin = await getProxyAdminOwner(hre);

    token = await smock.fake<IERC20>(IERC20__factory.createInterface());

    gasFwd = await deployGasFwdAsProxy(owner, admin, accounts);
  });

  let snapshot: SnapshotRestorer;

  beforeEach(async function () {
    snapshot = await takeSnapshot();

    token.balanceOf.returns(BALANCE);
    token.transfer.reset();
    token.transfer.returns(true);
  });

  afterEach(async () => {
    await snapshot.restore();
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
      expect(token.transfer).to.have.been.calledWith(await accounts.getAddress(), amount);
    });
    it("transfers tokens when amount to transfer is equal to balance", async function () {
      await expect(gasFwd.payForGas(token.address, BALANCE))
        .to.emit(gasFwd, "GasPay")
        .withArgs(token.address, BALANCE);
      expect(token.transfer).to.have.been.calledWith(await accounts.getAddress(), BALANCE);
    });
    it("transfers tokens when the call exceeds the balance", async function () {
      await expect(gasFwd.payForGas(token.address, BALANCE + 1))
        .to.emit(gasFwd, "GasPay")
        .withArgs(token.address, BALANCE);
      expect(token.transfer).to.have.been.calledWith(await accounts.getAddress(), BALANCE);
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
      await expect(gasFwd.sweep(token.address))
        .to.emit(gasFwd, "Sweep")
        .withArgs(token.address, BALANCE);
      expect(token.transfer).to.have.been.calledWith(await accounts.getAddress(), BALANCE);
    });
  });
});

async function deployGasFwdAsProxy(
  owner: Signer,
  admin: Signer,
  accounts: Signer
): Promise<GasFwd> {
  let GasFwd = new GasFwd__factory(admin);
  let gasFwdImpl = await GasFwd.deploy();
  await gasFwdImpl.deployed();
  const data = gasFwdImpl.interface.encodeFunctionData("initialize", [
    accounts ? await accounts.getAddress() : await owner.getAddress(),
  ]);
  let proxyFactory = new ProxyContract__factory(owner);
  let proxy = await proxyFactory.deploy(gasFwdImpl.address, await admin.getAddress(), data);
  await proxy.deployed();
  return GasFwd__factory.connect(proxy.address, accounts);
}
