import {task, types} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {Registrar__factory} from "typechain-types";
import {
  StratConfig,
  StrategyApprovalState,
  getAPTeamOwner,
  getAddresses,
  getEnumKeys,
  logger,
} from "utils";
import {allStrategyConfigs} from "../../../contracts/integrations/stratConfig";

type TaskArgs = {name: string; approvalState: number; apTeamSignerPkey?: string};

task("manage:registrar:setStratApproval")
  .addParam(
    "name",
    `The name of the strategy according to StratConfig, possible values: ${Object.keys(
      allStrategyConfigs
    ).join(", ")}`,
    "",
    types.string
  )
  .addParam(
    "approvalState",
    `Whether the strategy is currently approved or not, possible values: ${getEnumKeys(
      StrategyApprovalState
    )
      .map((key) => `${key} - ${StrategyApprovalState[key]}`)
      .join(", ")}`,
    0,
    types.int
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
    const config: StratConfig = allStrategyConfigs[taskArguments.name];
    let currentStratParams = await registrar.getStrategyParamsById(config.id);
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
      config.id,
      taskArguments.approvalState,
    ]);
    await submitMultiSigTx(
      addresses.multiSig.apTeam.proxy,
      apTeamOwner,
      registrar.address,
      updateData
    );
  });
