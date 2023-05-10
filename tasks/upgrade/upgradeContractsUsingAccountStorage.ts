import { task, types } from "hardhat/config"
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
} from "../../typechain-types"
import getContractName from "../../utils/getContractName"
import * as logger from "../../utils/logger"

type TaskArguments = { verify: boolean }

task("upgrade:upgradeContractsUsingAccountStorage", "Will redeploy all contracts that use AccountStorage struct")
    .addOptionalParam("verify", "Flag specifying whether to verify the contract", false, types.boolean)
    .setAction(async ({ verify }: TaskArguments, hre) => {
        try {
            await hre.run("upgrade:upgradeCharityApplication", { verify })
            await hre.run("upgrade:upgradeFacets", { facets })
        } catch (error) {
            logger.out(
                `Redeployment of all contracts that use AccountStorage struct failed, reason: ${error}`,
                logger.Level.Error
            )
        }
    })

const facets: string[] = [
    getContractName(AccountsAllowance__factory),
    getContractName(AccountsDAOEndowments__factory),
    getContractName(AccountDonationMatch__factory),
    getContractName(AccountsStrategiesCopyEndowments__factory),
    getContractName(AccountsCreateEndowment__factory),
    getContractName(AccountsQueryEndowments__factory),
    getContractName(AccountsSwapEndowments__factory),
    getContractName(AccountsUpdateEndowments__factory),
    getContractName(AccountsUpdateEndowmentSettingsController__factory),
    getContractName(AxelarExecutionContract__factory),
    getContractName(AccountsStrategiesUpdateEndowments__factory),
    getContractName(AccountsUpdateStatusEndowments__factory),
    getContractName(AccountDepositWithdrawEndowments__factory),
    getContractName(AccountsVaultFacet__factory),
]
