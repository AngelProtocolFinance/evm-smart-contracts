import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {MockUSDC__factory} from "typechain-types";
import {logger, updateAddresses} from "utils";

export async function deployMockUSDC(
  proxyAdmin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<string> {
  logger.out("Deploying MockUSDC...");
  const factory = new MockUSDC__factory(proxyAdmin);
  const mockUSDC = await factory.deploy("USDC", "USDC", 100);
  await mockUSDC.deployed();
  logger.out(`Address: ${mockUSDC.address}`);

  logger.out("Minting some USDC to admin wallet...");
  const tx = await mockUSDC.mint(
    proxyAdmin.address,
    hre.ethers.utils.parseEther("10000000000000000000000")
  );
  await tx.wait();

  await updateAddresses({tokens: {usdc: mockUSDC.address}}, hre);

  return mockUSDC.address;
}
