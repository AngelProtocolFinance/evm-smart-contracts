import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {MockERC20__factory, MockUSDC} from "typechain-types";
import {logger, updateAddresses} from "utils";

// temp function until real mock is created
export async function deployMockAxelarGateway(
  proxyAdmin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<MockUSDC> {
  logger.out("Deploying AxelarGateway...");
  const factory = new MockERC20__factory(proxyAdmin);
  const mockAxelarGateway = await factory.deploy("AxelarGateway", "AxelarGateway", 100);
  await mockAxelarGateway.deployed();
  logger.out(`Address: ${mockAxelarGateway.address}`);

  await updateAddresses({axelar: {gateway: mockAxelarGateway.address}}, hre);

  return mockAxelarGateway;
}
