import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import config from "config";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {MockUSDC, MockUSDC__factory} from "typechain-types";
import {logger, updateAddresses} from "utils";

export async function deployMockUSDC(
  proxyAdmin: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
): Promise<MockUSDC | undefined> {
  try {
    logger.out("Deploying MockUSDC...");
    const factory = new MockUSDC__factory(proxyAdmin);
    const mockUSDC = await factory.deploy("USDC", "USDC", 100);
    await mockUSDC.deployed();
    logger.out(`Address: ${mockUSDC.address}`);

    logger.out("Updating global config...");
    config.REGISTRAR_DATA.acceptedTokens.cw20 = [mockUSDC.address];
    config.REGISTRAR_UPDATE_CONFIG.usdcAddress = mockUSDC.address;
    config.DONATION_MATCH_CHARITY_DATA.usdcAddress = mockUSDC.address;

    logger.out("Minting some USDC to admin wallet...");
    const tx = await mockUSDC.mint(
      proxyAdmin.address,
      hre.ethers.utils.parseEther("10000000000000000000000")
    );
    await tx.wait();

    await updateAddresses({tokens: {usdc: mockUSDC.address}}, hre);

    return mockUSDC;
  } catch (error) {
    logger.out(error, logger.Level.Error);
  }
}
