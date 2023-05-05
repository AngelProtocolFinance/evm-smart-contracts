import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractFactory } from "ethers";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import addresses from "../../contract-address.json";
import { FacetCutAction, getSelectors } from "../../contracts/core/accounts/scripts/libraries/diamond";
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
    IDiamondCut,
} from "../../typechain-types";
import * as logger from "../../utils/logger";

task(
    "upgrade:upgradeFacetsUsingAccountStorage",
    "Will redeploy and upgrade all facets that use AccountStorage struct"
).setAction(async (_taskArguments, hre) => {
    try {
        const [_deployer, proxyAdmin] = await hre.ethers.getSigners();

        const cuts = await deployFacets(
            proxyAdmin,
            addresses.libraries.ANGEL_CORE_STRUCT_LIBRARY,
            addresses.libraries.STRING_LIBRARY
        );

        await updateDiamond(proxyAdmin, cuts, hre);

        console.log("Done.");
    } catch (error) {
        logger.out(`Facet upgrade failed, reason: ${error}`, logger.Level.Error);
    }
});

async function deployFacets(
    diamondOwner: SignerWithAddress,
    corestruct: string,
    stringlib: string
): Promise<IDiamondCut.FacetCutStruct[]> {
    const cuts: IDiamondCut.FacetCutStruct[] = [];

    console.log("Instantiating factories...");

    const factories = await getFactories(diamondOwner, corestruct, stringlib);

    console.log("Deploying all facets that use AccountStorage struct...");

    for (const Factory of factories) {
        const contractName = Factory.constructor.name.replace("__factory", "");
        try {
            const facet = await Factory.deploy();
            await facet.deployed();
            console.log(`${contractName} deployed: ${facet.address}`);
            cuts.push({
                facetAddress: facet.address,
                action: FacetCutAction.Replace,
                functionSelectors: getSelectors(facet),
            });
        } catch (error) {
            logger.out(`Failed to deploy ${contractName}, reason: ${error}`, logger.Level.Error);
        }
    }
    return cuts;
}

async function updateDiamond(
    diamondOwner: SignerWithAddress,
    cuts: IDiamondCut.FacetCutStruct[],
    hre: HardhatRuntimeEnvironment
) {
    console.log("Updating Diamond with new facet addresses...");

    const diamondCut = DiamondCutFacet__factory.connect(addresses.accounts.diamond, diamondOwner);

    const diamondInit = DiamondInit__factory.connect(addresses.accounts.diamond, diamondOwner);
    const tx = await diamondCut.diamondCut(cuts, diamondInit.address, "0x");
    await hre.ethers.provider.waitForTransaction(tx.hash);
}

// Getting factories instantiated in bulk as they share the deploy/cut creation logic.
async function getFactories(
    diamondOwner: SignerWithAddress,
    corestruct: string,
    stringlib: string
): Promise<ContractFactory[]> {
    const factories = [
        // no lib
        new AccountsAllowance__factory(diamondOwner),
        new AccountsDAOEndowments__factory(diamondOwner),
        new AccountDonationMatch__factory(diamondOwner),
        new AccountsStrategiesCopyEndowments__factory(diamondOwner),
        // core lib
        new AccountsCreateEndowment__factory({ "contracts/core/struct.sol:AngelCoreStruct": corestruct }, diamondOwner),
        new AccountsQueryEndowments__factory({ "contracts/core/struct.sol:AngelCoreStruct": corestruct }, diamondOwner),
        new AccountsSwapEndowments__factory({ "contracts/core/struct.sol:AngelCoreStruct": corestruct }, diamondOwner),
        new AccountsUpdateEndowments__factory(
            { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
            diamondOwner
        ),
        new AccountsUpdateEndowmentSettingsController__factory(
            { "contracts/core/struct.sol:AngelCoreStruct": corestruct },
            diamondOwner
        ),
        new AxelarExecutionContract__factory({ "contracts/core/struct.sol:AngelCoreStruct": corestruct }, diamondOwner),
        // string lib
        new AccountsStrategiesUpdateEndowments__factory(
            { "contracts/lib/Strings/string.sol:StringArray": stringlib },
            diamondOwner
        ),
        new AccountsUpdateStatusEndowments__factory(
            { "contracts/lib/Strings/string.sol:StringArray": stringlib },
            diamondOwner
        ),
        // all libs
        new AccountDepositWithdrawEndowments__factory(
            {
                "contracts/core/struct.sol:AngelCoreStruct": corestruct,
                "contracts/lib/Strings/string.sol:StringArray": stringlib,
            },
            diamondOwner
        ),
        new AccountsVaultFacet__factory(
            {
                "contracts/core/struct.sol:AngelCoreStruct": corestruct,
                "contracts/lib/Strings/string.sol:StringArray": stringlib,
            },
            diamondOwner
        ),
    ];
    return factories;
}
