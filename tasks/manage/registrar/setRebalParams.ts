import {task, types} from "hardhat/config";
import {APTeamMultiSig__factory, Registrar__factory} from "typechain-types";
import {getAPTeamOwner, getAddresses, logger} from "utils";

const NULL_NUMBER = 0;
const NULL_STRING = "";
const NULL_BOOL = false;

type TaskArgs = {
  basis: number;
  interestDistribution: number;
  lockedPrincipleToLiquid: boolean;
  lockedRebalanceToLiquid: number;
  principleDistribution: number;
  rebalanceLiquidProfits: boolean;
  apTeamSignerPkey?: string;
};

task("manage:registrar:setRebalParams")
  .addOptionalParam(
    "rebalanceLiquidProfits",
    "Whether to rebalance liquid profits",
    NULL_BOOL,
    types.boolean
  )
  .addOptionalParam(
    "lockedRebalanceToLiquid",
    "The percent of harvested yield rebalanced to liquid vault",
    NULL_NUMBER,
    types.int
  )
  .addOptionalParam("interestDistribution", "interest distribution rate", NULL_NUMBER, types.int)
  .addOptionalParam(
    "lockedPrincipleToLiquid",
    "Whether locked principle can be rebalanced to liquid vaults",
    NULL_BOOL,
    types.boolean
  )
  .addOptionalParam(
    "principleDistribution",
    "The rate of principle distribution",
    NULL_NUMBER,
    types.int
  )
  .addOptionalParam("basis", "The precision of rebalance rates", NULL_NUMBER, types.int)
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
    logger.out("Fetching current Rebalance params...");
    let currentRebalParams = await registrar.getRebalanceParams();
    logger.pad(50, "Current rebalance liquid profits: ", currentRebalParams.rebalanceLiquidProfits);
    logger.pad(50, "Current locked rebal to liq: ", currentRebalParams.lockedRebalanceToLiquid);
    logger.pad(50, "Current interest distribution: ", currentRebalParams.interestDistribution);
    logger.pad(
      50,
      "Current locked principle to liquid: ",
      currentRebalParams.lockedPrincipleToLiquid
    );
    logger.pad(50, "Current principle distribution: ", currentRebalParams.principleDistribution);
    logger.pad(50, "Current percent basis: ", currentRebalParams.basis);

    logger.divider();
    let newRebalanceLiquidProfits = checkIfDefaultAndSet(
      taskArguments.rebalanceLiquidProfits,
      currentRebalParams.rebalanceLiquidProfits
    );
    let newLockedRebalanceToLiquid = checkIfDefaultAndSet(
      taskArguments.lockedRebalanceToLiquid,
      currentRebalParams.lockedRebalanceToLiquid
    );
    let newInterestDistribution = checkIfDefaultAndSet(
      taskArguments.interestDistribution,
      currentRebalParams.interestDistribution
    );
    let newLockedPrincipleToLiquid = checkIfDefaultAndSet(
      taskArguments.lockedPrincipleToLiquid,
      currentRebalParams.lockedPrincipleToLiquid
    );
    let newPrincipleDistribution = checkIfDefaultAndSet(
      taskArguments.principleDistribution,
      currentRebalParams.principleDistribution
    );
    let newBasis = checkIfDefaultAndSet(taskArguments.basis, currentRebalParams.basis);

    logger.out("Setting Rebalance params to:");
    logger.pad(50, "New rebalance liquid profits: ", newRebalanceLiquidProfits);
    logger.pad(50, "New locked rebal to liq: ", newLockedRebalanceToLiquid);
    logger.pad(50, "New interest distribution: ", newInterestDistribution);
    logger.pad(50, "New locked principle to liquid: ", newLockedPrincipleToLiquid);
    logger.pad(50, "New principle distribution: ", newPrincipleDistribution);
    logger.pad(50, "New percent basis: ", newBasis);
    const updateData = registrar.interface.encodeFunctionData("setRebalanceParams", [
      {
        rebalanceLiquidProfits: newRebalanceLiquidProfits,
        lockedRebalanceToLiquid: newLockedRebalanceToLiquid,
        interestDistribution: newInterestDistribution,
        lockedPrincipleToLiquid: newLockedPrincipleToLiquid,
        principleDistribution: newPrincipleDistribution,
        basis: newBasis,
      },
    ]);
    const apTeamMultisigContract = APTeamMultiSig__factory.connect(
      addresses.multiSig.apTeam.proxy,
      apTeamOwner
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

function checkIfDefaultAndSet(taskArg: any, currentValue: any) {
  let defaultValue: any;
  if (typeof (taskArg == Number)) {
    defaultValue = NULL_NUMBER;
  } else {
    defaultValue = NULL_STRING;
  }
  if (taskArg == defaultValue) {
    return currentValue;
  } else if (taskArg == currentValue) {
    return currentValue;
  } else {
    return taskArg;
  }
}
