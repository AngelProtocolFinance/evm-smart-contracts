import {Signer} from "ethers";
import {
  DummyGasService__factory,
  DummyGateway__factory,
  IAxelarGasService,
  IAxelarGasService__factory,
  IAxelarGateway,
  IAxelarGateway__factory,
} from "typechain-types";

export async function deployDummyGateway(deployer: Signer): Promise<IAxelarGateway> {
  const Gateway = new DummyGateway__factory(deployer);
  const gateway = await Gateway.deploy();
  await gateway.deployed();
  return IAxelarGateway__factory.connect(gateway.address, deployer);
}

export async function deployDummyGasService(deployer: Signer): Promise<IAxelarGasService> {
  const GasService = new DummyGasService__factory(deployer);
  const gasService = await GasService.deploy();
  await gasService.deployed();
  return IAxelarGasService__factory.connect(gasService.address, deployer);
}
