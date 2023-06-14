import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {MockERC20__factory, MockUSDC} from "typechain-types";
import {logger, updateAddresses} from "utils";

export async function deployMockWMatic(
  proxyAdmin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<MockUSDC> {
  logger.out("Deploying MockWMatic...");
  const factory = new MockERC20__factory(proxyAdmin);
  const mockWMatic = await factory.deploy("WMatic", "WMatic", 100);
  await mockWMatic.deployed();
  logger.out(`Address: ${mockWMatic.address}`);

  logger.out("Minting some WMatic to admin wallet...");
  const tx = await mockWMatic.mint(
    proxyAdmin.address,
    hre.ethers.utils.parseEther("10000000000000000000000")
  );
  await tx.wait();

  await updateAddresses({tokens: {wmatic: mockWMatic.address}}, hre);

  return mockWMatic;
}
