import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import hre from "hardhat";
import {
  AccountsDeployContract,
  AccountsDeployContract__factory,
  TestFacetProxyContract,
} from "typechain-types";
import {getSigners} from "utils";
import {deployFacetAsProxy} from "./utils/deployTestFacet";

describe("AccountsDeployContract", function () {
  const {ethers} = hre;

  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;

  let facet: AccountsDeployContract;
  let state: TestFacetProxyContract;

  before(async function () {
    const signers = await getSigners(hre);
    owner = signers.apTeam1;
    proxyAdmin = signers.proxyAdmin;
    user = signers.deployer;
  });

  beforeEach(async function () {
    const Facet = new AccountsDeployContract__factory(owner);
    const facetImpl = await Facet.deploy();
    state = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address);

    await state.setConfig({
      owner: owner.address,
      version: "1",
      networkName: "Polygon",
      registrarContract: ethers.constants.AddressZero,
      nextAccountId: 1,
      maxGeneralCategoryId: 1,
      subDao: ethers.constants.AddressZero,
      earlyLockedWithdrawFee: {bps: 1000, payoutAddress: ethers.constants.AddressZero},
      reentrancyGuardLocked: false,
    });

    facet = AccountsDeployContract__factory.connect(state.address, owner);
  });
});
