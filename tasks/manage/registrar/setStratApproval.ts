import {task, types} from "hardhat/config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {Registrar__factory, APTeamMultiSig__factory} from "typechain-types";
import {
  connectSignerFromPkey,
  getAddresses,
  getSigners,
  StratConfig,
  logger,
  StrategyApprovalState,
  getEnumKeys,
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

    const {apTeamMultisigOwners} = await getSigners(hre);
    let apTeamSigner: SignerWithAddress;
    if(!apTeamMultisigOwners && taskArguments.apTeamSignerPkey) {
      apTeamSigner = await connectSignerFromPkey(taskArguments.apTeamSignerPkey, hre);
    }
    else if(!apTeamMultisigOwners) {
      throw new Error("Must provide a pkey for AP Team signer on this network");
    }
    else {
      apTeamSigner = apTeamMultisigOwners[0]
    }

    const registrar = Registrar__factory.connect(registrarAddress, apTeamSigner);
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
    logger.pad(50, "New strategy approval state", taskArguments.approvalState);
    const updateData = registrar.interface.encodeFunctionData("setStrategyApprovalState", [
      config.id,
      taskArguments.approvalState,
    ]);
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(
      addresses.multiSig.apTeam.proxy,
      apTeamSigner
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
