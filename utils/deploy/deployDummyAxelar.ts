import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
  DummyGateway__factory,
  DummyGateway,
  DummyGasService__factory,
  DummyGasService,
} from "typechain-types";
import {logger} from "utils";

export async function deployDummyGateway(deployer: SignerWithAddress): Promise<DummyGateway> {
  logger.out("Deploying DummyGateway...");
  const Gateway = new DummyGateway__factory(deployer);
  const gateway = await Gateway.deploy();
  await gateway.deployed();
  logger.out(`Address: ${gateway.address}`);
  return gateway;
}

export async function deployDummyGasService(deployer: SignerWithAddress): Promise<DummyGasService> {
  logger.out("Deploying DummyGasService...");
  const GasService = new DummyGasService__factory(deployer);
  const gasService = await GasService.deploy();
  await gasService.deployed();
  logger.out(`Address: ${gasService.address}`);
  return gasService;
}
