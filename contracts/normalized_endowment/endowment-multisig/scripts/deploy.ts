import {HardhatRuntimeEnvironment} from "hardhat/types";
import {EndowmentMultiSig__factory, MultiSigWalletFactory__factory} from "typechain-types";
import {getSigners, logger, updateAddresses} from "utils";
import deployEndowmentMultiSigEmitter from "./deployEndowmentMultiSigEmitter";

export async function deployEndowmentMultiSig(
  verify_contracts: boolean,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Deploying EndowmentMultiSig contracts...");

  const {proxyAdmin} = await getSigners(hre);

  logger.out("Deploying EndowmentMultiSig implementation...");
  const endowmentMultiSigFactory = new EndowmentMultiSig__factory(proxyAdmin);
  const endowmentMultiSig = await endowmentMultiSigFactory.deploy();
  await endowmentMultiSig.deployed();
  logger.out(`Address: ${endowmentMultiSig.address}`);

  logger.out("Deploying EndowmentMultiSigFactory...");
  const multiSigWalletFactoryFactory = new MultiSigWalletFactory__factory(proxyAdmin);
  const multiSigWalletFactory = await multiSigWalletFactoryFactory.deploy(
    endowmentMultiSig.address,
    proxyAdmin.address
  );
  await multiSigWalletFactory.deployed();
  logger.out(`Address: ${multiSigWalletFactory.address}`);

  const emitter = await deployEndowmentMultiSigEmitter(proxyAdmin, multiSigWalletFactory.address);

  await updateAddresses(
    {
      multiSig: {
        endowment: {
          emitter: {
            implementation: emitter.implementation.address,
            proxy: emitter.proxy.contract.address,
          },
          factory: multiSigWalletFactory.address,
          implementation: endowmentMultiSig.address,
        },
      },
    },
    hre
  );

  if (verify_contracts) {
    logger.out("Verifying EndowmentMultiSigEmitter...");
    await hre.run("verify:verify", {
      address: emitter.implementation.address,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: emitter.proxy.contract.address,
      constructorArguments: emitter.proxy.constructorArguments,
    });
    logger.out("Verifying EndowmentMultiSig...");
    await hre.run("verify:verify", {
      address: endowmentMultiSig.address,
      constructorArguments: [],
    });
    logger.out("Verifying MultiSigWalletFactory...");
    await hre.run("verify:verify", {
      address: multiSigWalletFactory.address,
      constructorArguments: [endowmentMultiSig.address, proxyAdmin.address],
    });
  }

  return {implementation: endowmentMultiSig, factory: multiSigWalletFactory, emitter};
}
