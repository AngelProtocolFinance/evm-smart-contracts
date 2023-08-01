import {FakeContract, smock} from "@defi-wonderland/smock";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {expect, use} from "chai";
import hre from "hardhat";
import {DEFAULT_ACCOUNTS_CONFIG, DEFAULT_CHARITY_ENDOWMENT} from "test/utils";
import {
  AccountsGasManager,
  AccountsGasManager__factory,
  GasFwd, 
  GasFwd__factory,
  DummyERC20,
  DummyERC20__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {genWallet, getSigners} from "utils";
import {deployFacetAsProxy} from "./utils";

use(smock.matchers);

describe("AccountsGasManager", function () {
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;
  let impl: AccountsGasManager;
  let token: FakeContract<DummyERC20>;
  let gasFwd: FakeContract<GasFwd>;
  const ACCOUNT_ID = 1;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.deployer;
    proxyAdmin = signers.proxyAdmin;
    user = signers.apTeam1;
    let Facet = new AccountsGasManager__factory(owner);
    impl = await Facet.deploy();
  });

  beforeEach(async () => {
    token = await smock.fake<DummyERC20>(new DummyERC20__factory());
    gasFwd = await smock.fake<GasFwd>(new GasFwd__factory());
  });

  describe("upon `sweepForClosure`", async function () {
    let facet: AccountsGasManager;
    let state: TestFacetProxyContract;

    beforeEach(async function () {
      state = await deployFacetAsProxy(hre, owner, proxyAdmin, impl.address);
      facet = AccountsGasManager__factory.connect(state.address, owner);
      
      let endowment = {
        ...DEFAULT_CHARITY_ENDOWMENT,
        gasFwd: gasFwd.address,
      };
      await state.setEndowmentDetails(ACCOUNT_ID, endowment)
      
      token.transfer.returns(true);
      token.transferFrom.returns(true);
    });

    it("reverts if not called by self", async function () {
      await expect(facet.sweepForClosure(ACCOUNT_ID, token.address))
        .to.be.revertedWithCustomError(facet, "OnlyAccountsContract")
    });

    it("calls the sweep method", async function () {
      let calldata = facet.interface.encodeFunctionData(
        "sweepForClosure",
        [
          ACCOUNT_ID,
          token.address
        ]
      );
      expect(await state.callSelf(
        0,
        calldata
      )).to.emit(gasFwd, "Sweep");
      expect(gasFwd.sweep).to.have.been.calledWith(token.address)
    });
  });

  describe("upon `sweepForEndowment`", async function () {
    let facet: AccountsGasManager;
    let state: TestFacetProxyContract;
    const BALANCE = 1000;

    beforeEach(async function () {
      state = await deployFacetAsProxy(hre, owner, proxyAdmin, impl.address);
      facet = AccountsGasManager__factory.connect(state.address, owner);
      
      let config = {
        ...DEFAULT_ACCOUNTS_CONFIG,
        owner: owner.address
      }
      await state.setConfig(config)

      let endowment = {
        ...DEFAULT_CHARITY_ENDOWMENT,
        owner: user.address,
        gasFwd: gasFwd.address,
      };
      await state.setEndowmentDetails(ACCOUNT_ID, endowment)
      
      token.transfer.returns(true);
      token.transferFrom.returns(true);
      gasFwd.sweep.returns(BALANCE)
    });

    it("reverts if not called by admin", async function () {
      await expect(facet.connect(user).sweepForClosure(ACCOUNT_ID, token.address))
        .to.be.revertedWithCustomError(facet, "OnlyAdmin")
    });

    it("calls the sweep method and updates the appropriate balance", async function () {
      expect(await facet.connect(owner).sweepForEndowment
    });
  });
});
