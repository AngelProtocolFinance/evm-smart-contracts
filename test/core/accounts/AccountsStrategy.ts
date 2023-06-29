import {expect} from "chai";
import hre from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  TestFacetProxyContract,
  AccountsStrategy,
  AccountsStrategy__factory,
} from "typechain-types"
import { getSigners } from "utils";

import {deployFacetAsProxy} from "test/utils"

describe("AccountsStrategy", function () {
  const {ethers} = hre
  let owner: SignerWithAddress;
  let admin: SignerWithAddress;
  let user: SignerWithAddress;

  before(async function () {
    const {deployer, proxyAdmin, apTeam1} = await getSigners(hre)
    owner = deployer
    admin = proxyAdmin
    user = apTeam1
  })

  describe("upon strategyInvest", async function () {
    let facet: AccountsStrategy
    let proxy: TestFacetProxyContract
    
    beforeEach(async function () {
      let Facet = new AccountsStrategy__factory(owner)
      let facetImpl = await Facet.deploy()
      proxy = await deployFacetAsProxy(hre, owner, admin, facetImpl.address)
      facet = AccountsStrategy__factory.connect(proxy.address, owner)
    })
  })
  
  describe("upon strategyRedeem", async function () {
    let facet: AccountsStrategy
    let proxy: TestFacetProxyContract
    
    beforeEach(async function () {
      let Facet = new AccountsStrategy__factory(owner)
      let facetImpl = await Facet.deploy()
      proxy = await deployFacetAsProxy(hre, owner, admin, facetImpl.address)
      facet = AccountsStrategy__factory.connect(proxy.address, owner)
    })
  })

  describe("upon strategyRedeemAll", async function () {
    let facet: AccountsStrategy
    let proxy: TestFacetProxyContract
    
    beforeEach(async function () {
      let Facet = new AccountsStrategy__factory(owner)
      let facetImpl = await Facet.deploy()
      proxy = await deployFacetAsProxy(hre, owner, admin, facetImpl.address)
      facet = AccountsStrategy__factory.connect(proxy.address, owner)
    })
  })

})