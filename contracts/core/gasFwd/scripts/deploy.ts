import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {GasFwdFactory__factory, GasFwd__factory} from "typechain-types";
import {Deployment, getAddresses, getContractName, logger, updateAddresses} from "utils";

type Data = {
  deployer: SignerWithAddress;
  admin: string;
  registrar?: string;
};

export async function deployGasFwd(
  {deployer, admin, registrar}: Data,
  hre: HardhatRuntimeEnvironment
): Promise<{factory: Deployment; implementation: Deployment}> {
  logger.out("Deploying Gas Forwarder...");

  logger.out("Deploying GasFwd implementation...");
  const GF = new GasFwd__factory(deployer);
  const gf = await GF.deploy();
  await gf.deployed();
  logger.out(`Address: ${gf.address}`);

  const addresses = await getAddresses(hre);
  let registrarAddress = registrar ? registrar : addresses.registrar.proxy;

  logger.out("Deploying factory...");
  const GFF = new GasFwdFactory__factory(deployer);
  const constructorArguments: Parameters<GasFwdFactory__factory["deploy"]> = [
    gf.address,
    admin,
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

  return {
    implementation: {address: gf.address, contractName: getContractName(GF)},
    factory: {address: gff.address, contractName: getContractName(GFF), constructorArguments},
  };
}
