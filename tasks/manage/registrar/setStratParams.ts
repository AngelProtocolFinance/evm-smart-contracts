import {task, types} from "hardhat/config";
import {Registrar__factory, APTeamMultiSig__factory} from "typechain-types";
import {StratConfig, getAddresses, getSigners, logger} from "utils";
import {allStrategyConfigs} from "../../../contracts/integrations/stratConfig";

type TaskArgs = {
  name: string;
  modifyExisting: boolean;
};

task("manage:registrar:setStratParams")
  .addParam(
    "name",
    `The name of the strategy according to StratConfig, possible values: ${Object.keys(
      allStrategyConfigs
    ).join(", ")}`,
    "",
    types.string
  )
  .addOptionalParam(
    "modifyExisting",
    "Whether to modify an existing strategy",
    false,
    types.boolean
  )
  .setAction(async function (taskArguments: TaskArgs, hre) {
    logger.divider();
    logger.out("Connecting to registrar on specified network...");
    const addresses = await getAddresses(hre);
    const {apTeamMultisigOwners} = await getSigners(hre);
    const registrar = Registrar__factory.connect(addresses.registrar.proxy, apTeamMultisigOwners[0]);
    logger.pad(50, "Connected to Registrar at: ", registrar.address);

    logger.divider();
    logger.out("Checking current strategy params at specified selector");
    const config: StratConfig = allStrategyConfigs[taskArguments.name];
    let currentStratParams = await registrar.getStrategyParamsById(config.id);
    if (
      currentStratParams.Liquid.vaultAddr == hre.ethers.constants.AddressZero &&
      currentStratParams.Locked.vaultAddr == hre.ethers.constants.AddressZero
    ) {
      logger.out("No strategy currently exists for this selector");
    } else {
      logger.out("A strategy has already been set at this selctor", logger.Level.Warn);
      logger.pad(50, "Current strategy state:", currentStratParams.approvalState);
      logger.pad(50, "Current Locked vault address:", currentStratParams.Locked.vaultAddr);
      logger.pad(50, "Current Liquid vault address:", currentStratParams.Liquid.vaultAddr);
      if (!taskArguments.modifyExisting) {
        logger.out("To modify this strategy, use the modifyExisting flag", logger.Level.Warn);
        return;
      }
    }

    logger.divider();
    logger.out("Setting strategy params to: ");
    logger.pad(50, "New strategy selector", config.id);
    logger.pad(50, "New approval state", config.params.approvalState);
    logger.pad(50, "New locked vault address", config.params.Locked.vaultAddr);
    logger.pad(50, "New liquid vault address", config.params.Liquid.vaultAddr);
    const updateData = registrar.interface.encodeFunctionData("setStrategyParams", [
      config.id,
      config.params.network,
      config.params.Locked.vaultAddr,
      config.params.Liquid.vaultAddr,
      config.params.approvalState,
    ]);
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(
      addresses.multiSig.apTeam.proxy,
      apTeamMultisigOwners[0]
    );
    const tx = await apTeamMultisigContract.submitTransaction(
      registrar.address,
      0,
      updateData,
      "0x"
    );
    logger.out(`Tx hash: ${tx.hash}`);
    await tx.wait();
  });
