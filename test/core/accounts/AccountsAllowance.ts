import {expect} from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  TestFacetProxyContract,
  AccountsAllowance__factory,
  AccountsAllowance,
} from "typechain-types"

import {deployFacetAsProxy} from "test/utils"

describe("AccountsAllowance", function () {
  const {ethers} = hre
  let owner: SignerWithAddress;
  let proxyAdmin: SignerWithAddress;
  let user: SignerWithAddress;

  describe("Revert cases for `manageAllowances`", async function () {
    let facet: AccountsAllowance
    let proxy: TestFacetProxyContract

    before(async function () {
      [owner, proxyAdmin, user] = await ethers.getSigners()
    })

    beforeEach(async function () {
      let Facet = new AccountsAllowance__factory(owner)
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