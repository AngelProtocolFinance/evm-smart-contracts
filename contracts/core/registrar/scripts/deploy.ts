// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.

import {HardhatRuntimeEnvironment} from "hardhat/types";
import {ProxyContract__factory, Registrar__factory} from "typechain-types";
import {RegistrarMessages} from "typechain-types/contracts/core/registrar/registrar.sol/Registrar";
import {getSigners, updateAddresses} from "utils";

export async function deployRegistrar(
  registrarData: RegistrarMessages.InstantiateRequestStruct,
  owner: string,
  verify: boolean,
  hre: HardhatRuntimeEnvironment
) {
  const {run, ethers} = hre;

  const {proxyAdmin} = await getSigners(ethers);

  const factory = new Registrar__factory(proxyAdmin);
  const registrar = await factory.deploy();
  await registrar.deployed();
  console.log("Registrar implementation deployed at: ", registrar.address);

  console.log("Updating Registrar owner to: ", owner, "...");
  const tx = await registrar.transferOwnership(owner);
  await tx.wait();

  // Deploy proxy contract
  const data = registrar.interface.encodeFunctionData(
    "initialize((address,(uint256,uint256,uint256),address,address,address))",
    [registrarData]
  );
  const proxyFactory = new ProxyContract__factory(proxyAdmin);
  const proxy = await proxyFactory.deploy(registrar.address, proxyAdmin.address, data);
  await proxy.deployed();
  console.log("Registrar Proxy deployed at: ", proxy.address);

  await updateAddresses(
    {
      registrar: {
        implementation: registrar.address,
        proxy: proxy.address,
      },
    },
    hre
  );

  if (verify) {
    await run(`verify:verify`, {
      address: registrar.address,
      constructorArguments: [],
    });
    await run(`verify:verify`, {
      address: proxy.address,
      constructorArguments: [registrar.address, proxyAdmin.address, data],
    });
  }

  return {implementation: registrar, proxy};
}
