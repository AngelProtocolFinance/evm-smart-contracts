import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {GasFwdFactory__factory, GasFwd__factory} from "typechain-types";
import {Deployment, getAddresses, getContractName, logger, updateAddresses} from "utils";

type Data = {
  deployer: SignerWithAddress;
  admin: SignerWithAddress;
  registrar?: string;
};

export async function deployGasFwd(
  {deployer, admin, registrar}: Data,
  hre: HardhatRuntimeEnvironment
): Promise<Deployment | undefined> {
  logger.out("Deploying Gas Forwarder...");

  try {
    logger.out("Deploying GasFwd implementation...");
    const GF = new GasFwd__factory(deployer);
    const gf = await GF.deploy();
    await gf.deployed();
    logger.out(`Address: ${gf.address}`);

    const addresses = await getAddresses(hre);
    let registrarAddress = registrar ? registrar : addresses.registrar.proxy;

    logger.out("Deploying factory...");
    const GFF = new GasFwdFactory__factory(admin);
    const constructorArguments: Parameters<GasFwdFactory__factory["deploy"]> = [
      gf.address,
      admin.address,
      registrarAddress,
    ];
    const gff = await GFF.deploy(...constructorArguments);
    await gff.deployed();
    logger.out(`Address: ${gff.address}`);

    await updateAddresses(
      {
        gasFwd: {
          implementation: gf.address,
          factory: gff.address,
        },
      },
      hre
    );
    logger.out(`File updated`);

    return {address: gff.address, contractName: getContractName(GFF), constructorArguments};
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
