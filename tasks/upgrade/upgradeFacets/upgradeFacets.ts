import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ContractFactory, utils } from "ethers"
import { task, types } from "hardhat/config"
import { HardhatRuntimeEnvironment, Network } from "hardhat/types"
import addresses from "../../../contract-address.json"
import { FacetCutAction, getSelectors } from "../../../contracts/core/accounts/scripts/libraries/diamond"
import {
    AccountDepositWithdrawEndowments__factory,
    AccountDonationMatch__factory,
    AccountsAllowance__factory,
    AccountsCreateEndowment__factory,
    AccountsDAOEndowments__factory,
    AccountsQueryEndowments__factory,
    AccountsStrategiesCopyEndowments__factory,
    AccountsStrategiesUpdateEndowments__factory,
    AccountsSwapEndowments__factory,
    AccountsUpdateEndowmentSettingsController__factory,
    AccountsUpdateEndowments__factory,
    AccountsUpdateStatusEndowments__factory,
    AccountsVaultFacet__factory,
    AxelarExecutionContract__factory,
    DiamondCutFacet__factory,
    DiamondInit__factory,
    DiamondLoupeFacet__factory,
    IDiamondCut,
} from "../../../typechain-types"
import * as logger from "../../../utils/logger"

type FacetCut = { facetName: string; cut: IDiamondCut.FacetCutStruct }

type TaskArguments = { facets: string[] }

task("upgrade:upgradeFacets", "Will redeploy and upgrade all facets that use AccountStorage struct")
    .addVariadicPositionalParam("facets", "List of facets to upgrade")
    .setAction(async (taskArguments: TaskArguments, hre) => {
        try {
            const [_deployer, proxyAdmin] = await hre.ethers.getSigners()

            const cuts = await deployFacets(
                taskArguments.facets,
                proxyAdmin,
                addresses.libraries.ANGEL_CORE_STRUCT_LIBRARY,
                addresses.libraries.STRING_LIBRARY
            )

            await updateDiamond(addresses.accounts.diamond, proxyAdmin, cuts, hre)

            if (shouldVerify(hre.network)) {
                await verifyFacets(cuts, hre)
                await verifyDiamond(addresses.accounts.diamond, proxyAdmin, hre)
            }
        } catch (error) {
            logger.out(`Upgrade facets failed, reason: ${error}`, logger.Level.Error)
        } finally {
            console.log("Done.")
        }
    })

async function deployFacets(
    facetNames: string[],
    diamondOwner: SignerWithAddress,
    corestruct: string,
    stringlib: string
): Promise<FacetCut[]> {
    const cuts: FacetCut[] = []

    console.log("Instantiating factories...")

    const facetFactories = await getFacetFactories(facetNames, diamondOwner, corestruct, stringlib)

    console.log("Deploying all facets that use AccountStorage struct...")

    for (const facetFactory of facetFactories) {
        const { facetName, factory } = facetFactory
        try {
            const facet = await factory.deploy()
            await facet.deployed()
            console.log(`${facetName} deployed: ${facet.address}`)
            cuts.push({
                facetName,
                cut: {
                    facetAddress: facet.address,
                    action: FacetCutAction.Replace,
                    functionSelectors: getSelectors(facet),
                },
            })
        } catch (error) {
            logger.out(`Failed to deploy ${facetName}, reason: ${error}`, logger.Level.Error)
        }
    }
    return cuts
}

async function updateDiamond(
    diamondAddress: string,
    diamondOwner: SignerWithAddress,
    facetCuts: FacetCut[],
    hre: HardhatRuntimeEnvironment
) {
    console.log("Updating Diamond with new facet addresses...")

    const diamondCut = DiamondCutFacet__factory.connect(diamondAddress, diamondOwner)
    const diamondInit = DiamondInit__factory.connect(diamondAddress, diamondOwner)
    const cuts = facetCuts.map((x) => x.cut)
    const tx = await diamondCut.diamondCut(cuts, diamondInit.address, "0x")
    await hre.ethers.provider.waitForTransaction(tx.hash)
}

async function verifyFacets(facetCuts: FacetCut[], hre: HardhatRuntimeEnvironment): Promise<void> {
    console.log("Verifying newly deployed facets...")

    for (const { facetName, cut } of facetCuts) {
        try {
            await hre.run("verify:verify", {
                address: cut.facetAddress,
                constructorArguments: [],
            })
        } catch (error) {
            logger.out(`Failed to verify ${facetName} at ${cut.facetAddress}, reason: ${error}`, logger.Level.Error)
        }
    }
}

async function verifyDiamond(
    diamondAddress: string,
    diamondOwner: SignerWithAddress,
    hre: HardhatRuntimeEnvironment
): Promise<void> {
    console.log("Verifying the updated Diamond...")

    // need to get the actual DiamondCut address by looking it up using its `diamondCut` function selector
    const diamondCut = DiamondCutFacet__factory.connect(diamondAddress, diamondOwner)

    // generate the selector using the `diamondCut` function's ABI
    // https://docs.ethers.org/v5/api/utils/hashing/#utils-id
    const funcAbi = diamondCut.interface.functions["diamondCut((address,uint8,bytes4[])[],address,bytes)"].format()
    const diamondCutSelector = utils.id(funcAbi).substring(0, 10)

    const loupe = DiamondLoupeFacet__factory.connect(diamondAddress, diamondOwner)
    const diamondCutAddress = await loupe.facetAddress(diamondCutSelector)

    await hre.run("verify:verify", {
        address: diamondAddress,
        constructorArguments: [diamondOwner.address, diamondCutAddress],
    })
}

type FacetFactory = { facetName: string; factory: ContractFactory }

// Getting factories instantiated in bulk as they share the deploy/cut creation logic.
async function getFacetFactories(
    facetNames: string[],
    diamondOwner: SignerWithAddress,
    corestruct: string,
    stringlib: string
): Promise<FacetFactory[]> {
    const factories: FacetFactory[] = []
    const nonExistentFacets: string[] = []

    facetNames.forEach((facetName) => {
        const factory = getFacetFactory(facetName, diamondOwner, corestruct, stringlib)
        if (typeof factory === "string") {
            nonExistentFacets.push(factory)
        } else {
            factories.push({ facetName, factory })
        }
    })

    if (!nonExistentFacets.length) {
        return factories
    }

    throw new Error(`Nonexistent facets detected: ${nonExistentFacets.join(", ")}.`)
}

function getFacetFactory(
    facetName: string,
    diamondOwner: SignerWithAddress,
    corestruct: string,
    stringlib: string
): ContractFactory | string {
    switch (facetName) {
        // no lib
        case getFacetName(AccountsAllowance__factory):
            return new AccountsAllowance__factory(diamondOwner)
        case getFacetName(AccountsDAOEndowments__factory):
            return new AccountsDAOEndowments__factory(diamondOwner)
        case getFacetName(AccountDonationMatch__factory):
            return new AccountDonationMatch__factory(diamondOwner)
        case getFacetName(AccountsStrategiesCopyEndowments__factory):
            return new AccountsStrategiesCopyEndowments__factory(diamondOwner)
        // core lib
        case getFacetName(AccountsCreateEndowment__factory):
            return new AccountsCreateEndowment__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        case getFacetName(AccountsQueryEndowments__factory):
            return new AccountsQueryEndowments__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        case getFacetName(AccountsSwapEndowments__factory):
            return new AccountsSwapEndowments__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        case getFacetName(AccountsUpdateEndowments__factory):
            return new AccountsUpdateEndowments__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        case getFacetName(AccountsUpdateEndowmentSettingsController__factory):
            return new AccountsUpdateEndowmentSettingsController__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        case getFacetName(AxelarExecutionContract__factory):
            return new AxelarExecutionContract__factory(
                { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
                diamondOwner
            )
        // string lib
        case getFacetName(AccountsStrategiesUpdateEndowments__factory):
            return new AccountsStrategiesUpdateEndowments__factory(
                { "contracts/lib/Strings/string.sol:StringArray": stringlib },
                diamondOwner
            )
        case getFacetName(AccountsUpdateStatusEndowments__factory):
            return new AccountsUpdateStatusEndowments__factory(
                { "contracts/lib/Strings/string.sol:StringArray": stringlib },
                diamondOwner
            )
        // all libs
        case getFacetName(AccountDepositWithdrawEndowments__factory):
            return new AccountDepositWithdrawEndowments__factory(
                {
                    "contracts/core/struct.sol:AngelCoreStruct": corestruct,
                    "contracts/lib/Strings/string.sol:StringArray": stringlib,
                },
                diamondOwner
            )
        case getFacetName(AccountsVaultFacet__factory):
            return new AccountsVaultFacet__factory(
                {
                    "contracts/core/struct.sol:AngelCoreStruct": corestruct,
                    "contracts/lib/Strings/string.sol:StringArray": stringlib,
                },
                diamondOwner
            )
        default:
            return facetName
    }
}

function getFacetName<T extends new (...args: any[]) => any>(clazz: T): string {
    return clazz.name.replace("__factory", "")
}

function shouldVerify(network: Network): boolean {
    return network.name !== "hardhat" && network.name !== "localhost"
}
