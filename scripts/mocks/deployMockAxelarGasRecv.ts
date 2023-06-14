import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {MockERC20__factory, MockUSDC} from "typechain-types";
import {logger, updateAddresses} from "utils";

// temp function until real mock is created
export async function deployMockAxelarRecv(
  proxyAdmin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<MockUSDC> {
  logger.out("Deploying AxelarRecv...");
  const factory = new MockERC20__factory(proxyAdmin);
  const mockAxelarRecv = await factory.deploy("AxelarRecv", "AxelarRecv", 100);
  await mockAxelarRecv.deployed();
  logger.out(`Address: ${mockAxelarRecv.address}`);

  await updateAddresses({axelar: {gasRecv: mockAxelarRecv.address}}, hre);

  return mockAxelarRecv;
}
