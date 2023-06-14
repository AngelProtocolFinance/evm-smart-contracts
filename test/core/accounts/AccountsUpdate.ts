import {expect} from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  TestFacetProxyContract,
  AccountsUpdate__factory,
  AccountsUpdate,
  AngelCoreStruct,
  AngelCoreStruct__factory,
} from "typechain-types"

import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet"

describe("AccountsUpdate", function () {
  const {ethers} = hre
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;

  async function deployCoreStruct() : Promise<AngelCoreStruct> {
    let CoreStruct = new AngelCoreStruct__factory(owner)
    let corestruct = await CoreStruct.deploy()
    return await corestruct.deployed()
  }

  describe("Testing `updateOwner`", async function () {
    let facet: AccountsUpdate
    let proxy: TestFacetProxyContract
    let corestruct: AngelCoreStruct

    before(async function () {
      [owner, proxyAdmin, user] = await ethers.getSigners()
      corestruct = await deployCoreStruct()
    })

    beforeEach(async function () {
      let Facet = new AccountsUpdate__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct.address},
        owner
      )
      let facetImpl = await Facet.deploy()
      proxy = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address)
      facet = AccountsUpdate__factory.connect(proxy.address, owner)
    })
    
    it("reverts when sender is not the current Accounts owner", async function () {
      await proxy.setConfig(
        user.address,
        "2.1.1",
        ethers.constants.AddressZero,
        1,
        0,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        true,
        {data: {payoutAddress: ethers.constants.AddressZero, bps: 0}}
      );
      await expect(facet.manageUpdateOwner(0,0,user2.address,ethers.constants.AddressZero,1)).to.be.revertedWith("Unauthorized");
    })
    
    it("reverts when passed an invalid new owner address", async function () {
      await proxy.setConfig(0, false, {data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero}, enumData: 0});
      await expect(facet.manageUpdateOwner(0,0,user2.address,ethers.constants.AddressZero,1)).to.be.revertedWith("Enter a valid owner address");
    })

    // it("success when current owner sends a valid new owner address", async function () {

    // })
  })
})
