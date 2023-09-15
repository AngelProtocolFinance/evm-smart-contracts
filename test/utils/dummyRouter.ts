import {Signer} from "ethers";
import {DummyRouter, DummyRouter__factory} from "typechain-types";

export async function deployDummyRouter(deployer: Signer): Promise<DummyRouter> {
  let Router = new DummyRouter__factory(deployer);
  const router = await Router.deploy();
  await router.deployed();
  return router;
}
