import {HardhatRuntimeEnvironment} from "hardhat/types";
import {APTeamMultiSig__factory, ProxyContract, Registrar__factory} from "typechain-types";
import {getSigners, logger} from "utils";

export default async function updateRegistrar(
  registrar: string,
  routerProxy: ProxyContract,
  axelarGateway: string,
  gasReceiver: string,
  apTeamMultisig: string,
  hre: HardhatRuntimeEnvironment
) {
  logger.out("Updating router address in Registrar...");

  const network = await hre.ethers.provider.getNetwork();

  const {proxyAdmin, apTeamMultisigOwners} = await getSigners(hre);

  const registrarContract = Registrar__factory.connect(registrar, proxyAdmin);
  const updateNetworkConnectionsData = registrarContract.interface.encodeFunctionData(
    "updateNetworkConnections",
    [
      {
        name: network.name,
        chainId: network.chainId,
        router: routerProxy.address,
        axelarGateway,
        gasReceiver,
        ibcChannel: "",
        transferChannel: "",
        gasLimit: 0,
      },
      "post",
    ]
  );
  const apTeamMultisigContract = APTeamMultiSig__factory.connect(
    apTeamMultisig,
    apTeamMultisigOwners[0]
  );
  const tx = await apTeamMultisigContract.submitTransaction(
    "Registrar: Update Network Connections",
    "",
    registrar,
    0,
    updateNetworkConnectionsData,
    "0x"
  );
  await tx.wait();
}
