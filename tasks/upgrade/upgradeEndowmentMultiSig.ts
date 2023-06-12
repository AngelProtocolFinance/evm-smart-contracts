import {task, types} from "hardhat/config";
import {EndowmentMultiSig__factory, MultiSigWalletFactory__factory} from "typechain-types";
import {getAddresses, getSigners, isLocalNetwork, logger, updateAddresses, verify} from "utils";

type TaskArgs = {factory?: string; verify: boolean};

task(
  "upgrade:EndowmentMultiSig",
  "Will upgrade the implementation of the EndowmentMultiSig contracts"
)
  .addOptionalParam(
    "factory",
    "MultiSigFactory contract address. Will do a local lookup from contract-address.json if none is provided."
  )
  .addOptionalParam(
    "verify",
    "Flag indicating whether the contract should be verified",
    true,
    types.boolean
  )
  .setAction(async (taskArgs: TaskArgs, hre) => {
    try {
      logger.out("Upgrading EndowmentMultiSig implementation contract...");

      const {proxyAdmin} = await getSigners(hre);

      const addresses = await getAddresses(hre);

      const multisigWalletFactoryAddress = taskArgs.factory || addresses.multiSig.endowment.factory;

      logger.out("Deploying a new EndowmentMultiSig contract...");
      const factory = new EndowmentMultiSig__factory(proxyAdmin);
      const contract = await factory.deploy();
      await contract.deployed();
      logger.out(`Address: ${contract.address}`);

      logger.out("Upgrading MultiSigWalletFactory's implementation address...");
      const multisigWalletFactory = MultiSigWalletFactory__factory.connect(
        multisigWalletFactoryAddress,
        proxyAdmin
      );
      const tx = await multisigWalletFactory.updateImplementation(contract.address);
      logger.out(`Tx hash: ${tx.hash}`);
      await tx.wait();

      await updateAddresses({multiSig: {endowment: {implementation: contract.address}}}, hre);

      if (!isLocalNetwork(hre) && taskArgs.verify) {
        await verify(hre, {address: contract.address});
      }
    } catch (error) {
      logger.out(`EndowmentMultiSig upgrade failed, reason: ${error}`, logger.Level.Error);
    }
  });
