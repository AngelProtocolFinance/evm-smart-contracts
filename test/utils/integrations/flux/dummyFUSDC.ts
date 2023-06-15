import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
  DummyFUSDC__factory,
  DummyFUSDC
} from "typechain-types"

export async function deployDummyFUSDC(
  deployer: SignerWithAddress,
  underlying: string
) : Promise<DummyFUSDC>
{
  let FUSDC = new DummyFUSDC__factory(deployer);
  const fUSDC = await FUSDC.deploy(underlying);
  await fUSDC.deployed();
  return fUSDC;
}