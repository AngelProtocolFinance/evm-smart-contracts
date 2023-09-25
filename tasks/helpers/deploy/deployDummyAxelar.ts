import {Signer} from "ethers";
import {
  DummyGasService__factory,
  DummyGateway__factory,
  IAxelarGasService,
  IAxelarGasService__factory,
  IAxelarGateway,
  IAxelarGateway__factory,
} from "typechain-types";
import {deploy} from "utils";

export async function deployDummyGateway(deployer: Signer): Promise<IAxelarGateway> {
  const gateway = await deploy(new DummyGateway__factory(deployer));
  return IAxelarGateway__factory.connect(gateway.contract.address, deployer);
}

export async function deployDummyGasService(deployer: Signer): Promise<IAxelarGasService> {
  const gasService = await deploy(new DummyGasService__factory(deployer));
  return IAxelarGasService__factory.connect(gasService.contract.address, deployer);
}
