/* global ethers */
/* eslint prefer-const: "off" */

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { IDiamondCut } from "../../../../typechain-types/contracts/core/accounts/diamond/facets/DiamondCutFacet"
import { FacetCutAction, getSelectors } from "./libraries/diamond"
// const hre = require("hardhat");

export async function deployDiamond(
    owner: string,
    registrar: string,
    ANGEL_CORE_STRUCT: string,
    STRING_LIBRARY: string,
    hre: HardhatRuntimeEnvironment
) {
    try {
        const ethers = hre.ethers
        const [_deployer, diamondOwner] = await ethers.getSigners()
        // deploy DiamondCutFacet
        const DiamondCutFacet = await ethers.getContractFactory(
            "DiamondCutFacet"
        )
        const diamondCutFacet = await DiamondCutFacet.deploy()
        await diamondCutFacet.deployed()
        console.log("DiamondCutFacet deployed:", diamondCutFacet.address)

        // deploy Diamond
        const Diamond = await ethers.getContractFactory("Diamond")
        const diamond = await Diamond.deploy(
            diamondOwner.address,
            diamondCutFacet.address
        )
        await diamond.deployed()
        console.log("Diamond deployed:", diamond.address)

        // deploy DiamondInit
        // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
        // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
        const DiamondInit = await ethers.getContractFactory("DiamondInit")
        const diamondInit = await DiamondInit.deploy()
        await diamondInit.deployed()
        console.log("DiamondInit deployed:", diamondInit.address, "\n")

        const cut: IDiamondCut.FacetCutStruct[] = []

        // deploy facets
        console.log("Deploying facets")
        const noLib = [
            "DiamondLoupeFacet",
            "OwnershipFacet",
            "AccountDeployContract",
            "AccountsAllowance",
            "AccountsDAOEndowments",
            "AccountsStrategiesCopyEndowments",
            "AccountsUpdate",
            "AccountDonationMatch",
        ]

        for (const FacetName of noLib) {
            const Facet = await ethers.getContractFactory(FacetName)
            const facet = await Facet.deploy()
            await facet.deployed()
            console.log(`${FacetName} deployed: ${facet.address}`)
            cut.push({
                facetAddress: facet.address,
                action: FacetCutAction.Add,
                functionSelectors: getSelectors(facet),
            })
        }

        const coreLib = [
            "AccountsCreateEndowment",
            "AccountsQueryEndowments",
            "AccountsSwapEndowments",
            "AccountsUpdateEndowments",
            "AccountsUpdateEndowmentSettingsController",
            "AxelarExecutionContract",
        ]

        for (const FacetName of coreLib) {
            const Facet = await ethers.getContractFactory(FacetName, {
                libraries: {
                    AngelCoreStruct: ANGEL_CORE_STRUCT,
                },
            })
            const facet = await Facet.deploy()
            await facet.deployed()
            console.log(`${FacetName} deployed: ${facet.address}`)
            cut.push({
                facetAddress: facet.address,
                action: FacetCutAction.Add,
                functionSelectors: getSelectors(facet),
            })
        }

        const stringLib = [
            "AccountsStrategiesUpdateEndowments",
            "AccountsUpdateStatusEndowments",
        ]

        for (const FacetName of stringLib) {
            const Facet = await ethers.getContractFactory(FacetName, {
                libraries: {
                    StringArray: STRING_LIBRARY,
                },
            })
            const facet = await Facet.deploy()
            await facet.deployed()
            console.log(`${FacetName} deployed: ${facet.address}`)
            cut.push({
                facetAddress: facet.address,
                action: FacetCutAction.Add,
                functionSelectors: getSelectors(facet),
            })
        }

        const allLib = [
            "AccountDepositWithdrawEndowments",
            "AccountsVaultFacet",
        ]

        for (const FacetName of allLib) {
            const Facet = await ethers.getContractFactory(FacetName, {
                libraries: {
                    StringArray: STRING_LIBRARY,
                    AngelCoreStruct: ANGEL_CORE_STRUCT,
                },
            })
            const facet = await Facet.deploy()
            await facet.deployed()
            console.log(`${FacetName} deployed: ${facet.address}`)
            cut.push({
                facetAddress: facet.address,
                action: FacetCutAction.Add,
                functionSelectors: getSelectors(facet),
            })
        }

        // upgrade diamond with facets
        console.log("")
        console.log("Diamond Cut:", cut)
        const diamondCut = await ethers.getContractAt(
            "IDiamondCut",
            diamond.address
        )
        // call to init function
        let functionCall = diamondInit.interface.encodeFunctionData("init", [
            owner,
            registrar,
        ])
        let tx = await diamondCut
            .connect(diamondOwner)
            .diamondCut(cut, diamondInit.address, functionCall)
        console.log("Diamond cut tx: ", tx.hash)
        let receipt = await tx.wait()
        if (!receipt.status) {
            throw Error(`Diamond upgrade failed: ${tx.hash}`)
        }
        console.log("Completed diamond cut")
        return Promise.resolve(diamond.address)
    } catch (error) {
        return Promise.reject(error)
    }
}
