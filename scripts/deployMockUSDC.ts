import {logger, updateAddresses} from "utils";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {MockUSDC, MockUSDC__factory} from "typechain-types";

export async function deployMockUSDC(
  proxyAdmin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<MockUSDC> {
  logger.out("Deploying MockUSDC...");
  const factory = new MockUSDC__factory(proxyAdmin);
  const mockUSDC = await factory.deploy("USDC", "USDC", 100);
  await mockUSDC.deployed();
  console.log("Deployed at: ", mockUSDC.address);

  logger.out("Updating global config...");
  config.REGISTRAR_DATA.acceptedTokens.cw20 = [mockUSDC.address];

  logger.out("Minting some USDC to admin wallet...");
  const tx = await mockUSDC.mint(
    proxyAdmin.address,
    hre.ethers.utils.parseEther("10000000000000000000000")
  );
  await tx.wait();

  await updateAddresses({tokens: {usdc: mockUSDC.address}}, hre);

  return mockUSDC;
}
