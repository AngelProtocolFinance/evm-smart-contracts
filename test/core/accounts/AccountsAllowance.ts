import {expect} from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  TestFacetProxyContract,
  AccountsAllowance__factory,
  AccountsAllowance,
  AngelCoreStruct,
  AngelCoreStruct__factory,
} from "typechain-types"

import {deployFacetAsProxy} from "test/core/accounts/utils/deployTestFacet"

describe("AccountsAllowance", function () {
  const {ethers} = hre
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;

  async function deployCoreStruct() : Promise<AngelCoreStruct> {
    let CoreStruct = new AngelCoreStruct__factory(owner)
    let corestruct = await CoreStruct.deploy()
    return await corestruct.deployed()
  }

  describe("Revert cases for `manageAllowances`", async function () {
    let facet: AccountsAllowance
    let proxy: TestFacetProxyContract
    let corestruct: AngelCoreStruct

    before(async function () {
      [owner, proxyAdmin, user] = await ethers.getSigners()
      corestruct = await deployCoreStruct()
    })

    beforeEach(async function () {
      let Facet = new AccountsAllowance__factory(
        {"contracts/core/struct.sol:AngelCoreStruct": corestruct.address},
        owner
      )
      let facetImpl = await Facet.deploy()
      proxy = await deployFacetAsProxy(hre, owner, proxyAdmin, facetImpl.address)
      facet = AccountsAllowance__factory.connect(proxy.address, owner)
    })
    
    it("reverts when the endowment is closed", async function () {
      await proxy.setClosingEndowmentState(0, true,{data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero}, enumData: 0})
      await expect(facet.manageAllowances(0,0,user.address,ethers.constants.AddressZero,1)).to.be.revertedWith("Endowment is closed")
    })
    
    it("reverts when the token is invalid", async function () {
      await proxy.setClosingEndowmentState(0, false, {data: {endowId: 0, fundId: 0, addr: ethers.constants.AddressZero}, enumData: 0})
      await expect(facet.manageAllowances(0, 0, user.address, ethers.constants.AddressZero, 1)).to.be.revertedWith("Invalid Token")
    })
  })
})