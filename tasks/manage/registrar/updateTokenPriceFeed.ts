import {task} from "hardhat/config";
import {submitMultiSigTx} from "tasks/helpers";
import {IRegistrar__factory} from "typechain-types";
import {confirmAction, getAPTeamOwner, getAddresses, logger} from "utils";

type TaskArgs = {
  token: string;
  priceFeed: string;
  apTeamSignerPkey?: string;
  yes: boolean;
};

task(
  "manage:registrar:updateTokenPriceFeed",
  "Updates a Registrar-Level Accepted Token's Price Feed contract address in storage."
)
  .addParam("token", "Address of the token.")
  .addParam("priceFeed", "Address of the token's price feed.")
  .addOptionalParam(
    "apTeamSignerPkey",
    "If running on prod, provide a pkey for a valid APTeam Multisig Owner."
  )
  .addFlag("yes", "Automatic yes to prompt.")
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.divider();
      logger.out(
        `Updating price feed of token at address ${taskArgs.token} to: ${taskArgs.priceFeed}...`
      );

      const addresses = await getAddresses(hre);

      // checking current price feed address
      const registrar = IRegistrar__factory.connect(addresses.registrar.proxy, hre.ethers.provider);
      const curPriceFeed = await registrar.queryTokenPriceFeed(taskArgs.token);
      if (curPriceFeed === taskArgs.priceFeed) {
        return logger.out("Nothing to change.");
      }
      logger.out(`Current price feed: ${curPriceFeed}`);

      const isConfirmed = taskArgs.yes || (await confirmAction());
      if (!isConfirmed) {
        return logger.out("Confirmation denied.", logger.Level.Warn);
      }

      // submitting Tx
      const apTeamOwner = await getAPTeamOwner(hre, taskArgs.apTeamSignerPkey);

      const data = registrar.interface.encodeFunctionData("updateTokenPriceFeed", [
        taskArgs.token,
        taskArgs.priceFeed,
      ]);
      const isExecuted = await submitMultiSigTx(
        addresses.multiSig.apTeam.proxy,
        apTeamOwner,
        registrar.address,
        data
      );

      if (isExecuted) {
        // verify price feed was correctly updated
        const newPriceFeed = await registrar.queryTokenPriceFeed(taskArgs.token);
        if (newPriceFeed !== taskArgs.priceFeed) {
          throw new Error(
            `Error updating price feed: expected '${taskArgs.priceFeed}', actual: '${newPriceFeed}'`
          );
        }
      }
    } catch (error) {
      logger.out(error, logger.Level.Error);
    }
  });
