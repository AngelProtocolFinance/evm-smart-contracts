import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Registrar, Registrar__factory, IRegistrar } from "../typechain-types"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("Registrar", async function () {
  let owner: SignerWithAddress
  let user: SignerWithAddress
  let Registrar: Registrar__factory

  let defaultRebalParams = {    
    "rebalanceLiquidProfits": false,
    "lockedRebalanceToLiquid":  75, 
    "interestDistribution" : 20,
    "lockedPrincipleToLiquid":  false,
    "principleDistribution" : 0}

  let defaultApParams = {
    "protocolTaxRate" :2,
    "protocolTaxBasis" : 100,
    "protocolTaxCollector" : ethers.constants.AddressZero,
    "primaryChain" : "Polygon",
    "primaryChainRouter" : "",
    "routerAddr" : ethers.constants.AddressZero
  } 

  async function deployRegistrarAsProxy(): Promise<Registrar> {
    [owner, user] = await ethers.getSigners();
    Registrar = await ethers.getContractFactory("Registrar") as Registrar__factory;
    const registrar = await upgrades.deployProxy(Registrar) as Registrar
    await registrar.deployed();
    return registrar;
  }

  describe("Deployment", async function () {
    let registrar: Registrar
    beforeEach(async function () {
      registrar = await deployRegistrarAsProxy();
    })

    it("Should successfully deploy the contract as an upgradable proxy", async function () {  
      expect(registrar.address);
      expect(await upgrades.upgradeProxy(registrar.address, Registrar))
    });

    it("Should set the right owner", async function () {
      expect(await registrar.owner()).to.equal(owner.address);
    });

    it("Should set the default parameters as specified by the Registrar Config", async function () {
      
      let rebalParams = await registrar.getRebalanceParams()
      expect(rebalParams.rebalanceLiquidProfits).to.equal(defaultRebalParams.rebalanceLiquidProfits)
      expect(rebalParams.lockedRebalanceToLiquid).to.equal(defaultRebalParams.lockedRebalanceToLiquid)
      expect(rebalParams.interestDistribution).to.equal(defaultRebalParams.interestDistribution)
      expect(rebalParams.lockedPrincipleToLiquid).to.equal(defaultRebalParams.lockedPrincipleToLiquid)
      expect(rebalParams.principleDistribution).to.equal(defaultRebalParams.principleDistribution)

      let apParams = await registrar.getAngelProtocolParams()
      expect(apParams.protocolTaxRate).to.equal(defaultApParams.protocolTaxRate)
      expect(apParams.protocolTaxBasis).to.equal(defaultApParams.protocolTaxBasis)
      expect(apParams.protocolTaxCollector).to.equal(defaultApParams.protocolTaxCollector)
      expect(apParams.primaryChain).to.equal(defaultApParams.primaryChain)
      expect(apParams.primaryChainRouter).to.equal(defaultApParams.primaryChainRouter)
      expect(apParams.routerAddr).to.equal(defaultApParams.routerAddr)
    })

    it("Should not allow a non-owner to run an upgrade", async function () {
      const UserRegistrar = await ethers.getContractFactory("Registrar", user) as Registrar__factory
      await expect(upgrades.upgradeProxy(registrar.address, UserRegistrar)).to.be.reverted
    })
  })

  describe("Setters and Getters", async function () {
    let registrar: Registrar
    beforeEach(async function () {
      registrar = await deployRegistrarAsProxy();
    })

    describe("setRebalanceParams and getRebalanceParams", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setRebalanceParams(defaultRebalParams)).to.be.reverted
      })

      it("Should accept and set the values", async function () {
        let newValues = defaultRebalParams
        newValues.rebalanceLiquidProfits = true
        await registrar.setRebalanceParams(newValues)
        let returnedValues = await registrar.getRebalanceParams()
        expect(returnedValues.rebalanceLiquidProfits).to.equal(newValues.rebalanceLiquidProfits)
      })
    })

    describe("setAngelProtocolParams and getAngelProtocolParams", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setAngelProtocolParams(defaultApParams)).to.be.reverted
      })

      it("Should accept and set the values", async function () {
        let newValues = defaultApParams
        newValues.protocolTaxRate = 0
        await registrar.setAngelProtocolParams(newValues)
        let returnedValues = await registrar.getAngelProtocolParams()
        expect(returnedValues.protocolTaxRate).to.equal(newValues.protocolTaxRate)
      })
    })

    describe("setTokenAccepted and isTokenAccepted", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setTokenAccepted(user.address, true)).to.be.reverted
      })

      it("Should accept and set the new value", async function () {
        await registrar.setTokenAccepted(user.address, true)
        let returnedValue = await registrar.isTokenAccepted(user.address)
        expect(returnedValue).to.be.true
      })
    })

    describe("setGasByToken and getGasByToken", async function () {
      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setGasByToken(user.address, 1)).to.be.reverted
      })

      it("Should accept and set the new value", async function () {
        await registrar.setGasByToken(user.address, 1)
        let returnedValue = await registrar.getGasByToken(user.address)
        expect(returnedValue.toNumber()).to.equal(1)
      })
    })

    describe("setStrategyParams, setStrategyApproved, getStrategyParams, and isStrategyApproved", async function () {
      let strategyId = "0x23b872dd" // random 4-byte hash
      let strategyParams = {
        isApproved: false, 
        Locked : {
          Type: 0,
          vaultAddr: ethers.constants.AddressZero
        },
        Liquid: {
          Type: 1,
          vaultAddr: user.address
        }
      }

      it("Should be an owner restricted method", async function () {
        await expect(registrar.connect(user).setStrategyParams(
          strategyId, 
          strategyParams.Locked.vaultAddr, 
          strategyParams.Liquid.vaultAddr, 
          strategyParams.isApproved))
          .to.be.reverted
      })

      it("Should accept and set new values", async function () {
        await registrar.setStrategyParams(
          strategyId, 
          strategyParams.Locked.vaultAddr, 
          strategyParams.Liquid.vaultAddr, 
          strategyParams.isApproved)
        let returnedValue = await registrar.getStrategyParamsById(strategyId)
        expect(returnedValue.isApproved).to.equal(strategyParams.isApproved)
        expect(returnedValue.Locked.Type).to.equal(strategyParams.Locked.Type)
        expect(returnedValue.Locked.vaultAddr).to.equal(strategyParams.Locked.vaultAddr)
        expect(returnedValue.Liquid.Type).to.equal(strategyParams.Liquid.Type)
        expect(returnedValue.Liquid.vaultAddr).to.equal(strategyParams.Liquid.vaultAddr)
      })

      it("Should let the owner change the approval state", async function () {
        await registrar.setStrategyApproved(strategyId, true)
        let returnedValue = await registrar.isStrategyApproved(strategyId)
        expect(returnedValue).to.be.true
        await registrar.setStrategyApproved(strategyId, false)
        returnedValue = await registrar.isStrategyApproved(strategyId)
        expect(returnedValue).to.be.false
      })
    })

  })
})