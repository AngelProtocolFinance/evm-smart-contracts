import {allStrategyConfigs} from "contracts/integrations/stratConfig";
import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {cliTypes} from "tasks/types";
import {Registrar__factory} from "typechain-types";
import {StrategyApprovalState} from "types";
import {StratConfig, getAPTeamOwner, getAddresses, getEnumValuesAsString, logger} from "utils";

type TaskArgs = {
  stratConfig: StratConfig;
  approvalState: StrategyApprovalState;
  apTeamSignerPkey?: string;
};

task("manage:registrar:setStratApproval")
  .addParam(
    "stratConfig",
    `The name of the strategy according to StratConfig, possible values: ${Object.keys(
      allStrategyConfigs
    ).join(", ")}`,
    undefined,
    cliTypes.stratConfig
  )
  .addParam(
    "approvalState",
    getEnumValuesAsString(StrategyApprovalState),
    StrategyApprovalState.NOT_APPROVED,
    cliTypes.enums(StrategyApprovalState, "StrategyApprovalState")
  )
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const registrarAddress = addresses["registrar"]["proxy"];

    const apTeamOwner = await getAPTeamOwner(hre, taskArguments.apTeamSignerPkey);

    const registrar = Registrar__factory.connect(registrarAddress, apTeamOwner);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.out("Checking current strategy approval state");
    let currentStratParams = await registrar.getStrategyParamsById(taskArguments.stratConfig.id);
    if (currentStratParams.approvalState == taskArguments.approvalState) {
      logger.out("Strategy approval state already matches desired state");
      return;
    }

    logger.divider();
    logger.out("Setting strategy approval state to:");
    logger.pad(
      50,
      "New strategy approval state",
      StrategyApprovalState[taskArguments.approvalState]
    );
    const updateData = registrar.interface.encodeFunctionData("setStrategyApprovalState", [
      taskArguments.stratConfig.id,
      taskArguments.approvalState,
    ]);
    await submitMultiSigTx(
      addresses.multiSig.apTeam.proxy,
      apTeamOwner,
      registrar.address,
      updateData
    );
  });
