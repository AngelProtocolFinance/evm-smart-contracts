import {task, types} from "hardhat/config";
import {EndowmentMultiSig__factory, MultiSigWalletFactory__factory} from "typechain-types";
import {getAddresses, getSigners, updateAddresses} from "utils";
import {logger, isLocalNetwork} from "utils";

task(
  "upgrade:EndowmentMultiSig",
  "Will upgrade the implementation of the EndowmentMultiSig contracts"
)
  .addOptionalParam(
    "verify",
    "Indicates whether the contract should be verified",
    false,
    types.boolean
  )
  .setAction(async (taskArgs: {verify: boolean}, hre) => {
    try {
      logger.out("Deploying a new EndowmentMultiSig contract...");

      const {proxyAdmin} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      const factory = new EndowmentMultiSig__factory(proxyAdmin);
      const contract = await factory.deploy();
      await contract.deployed();

      logger.out(`Deployed at: ${contract.address}`);

      logger.out(
        `Upgrading EndowmentMultiSig implementation address inside MultiSigWalletFactory...`
      );

      const multisigWalletFactory = MultiSigWalletFactory__factory.connect(
        addresses.multiSig.endowment.factory,
        proxyAdmin
      );
      const tx = await multisigWalletFactory.updateImplementation(contract.address);
      logger.out(`Tx hash: ${tx.hash}`);

      const receipt = await hre.ethers.provider.waitForTransaction(tx.hash);
      if (!receipt.status) {
        throw new Error(
          `Failed to update EndowmentMultiSig implementation address inside MultiSigWalletFactory.`
        );
      }

      logger.out("Saving the new implementation address to JSON file...");

      await updateAddresses({multiSig: {endowment: {implementation: contract.address}}}, hre);

      if (!isLocalNetwork(hre) && taskArgs.verify) {
        logger.out("Verifying...");
        await hre.run("verify:verify", {
          address: contract.address,
          constructorArguments: [],
        });
      }
    } catch (error) {
      logger.out(`EndowmentMultiSig upgrade failed, reason: ${error}`, logger.Level.Error);
    } finally {
      logger.out("Done.");
    }
  });
