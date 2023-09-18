import {Signer} from "ethers";
import {
  DummyGateway__factory,
  DummyGateway,
  DummyGasService__factory,
  DummyGasService,
} from "typechain-types";

export async function deployDummyGateway(deployer: Signer): Promise<DummyGateway> {
  let Gateway = new DummyGateway__factory(deployer);
  const gateway = await Gateway.deploy();
  await gateway.deployed();
  return gateway;
}

export async function deployDummyGasService(deployer: Signer): Promise<DummyGasService> {
  let GasService = new DummyGasService__factory(deployer);
  const gasService = await GasService.deploy();
  await gasService.deployed();
  return gasService;
}
