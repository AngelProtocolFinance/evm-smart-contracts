import {HardhatRuntimeEnvironment} from "hardhat/types";
import {IEndowmentMultiSigFactory__factory} from "typechain-types";
import {getAddresses} from "utils";

export default async function updateEndowmentProxiesAdmin(
  targetAddress: string,
  proxyAdminPkey: string | undefined,
  hre: HardhatRuntimeEnvironment
) {
  const addresses = await getAddresses(hre);

  const endowmentMultiSigFactory = IEndowmentMultiSigFactory__factory.connect(
    addresses.multiSig.endowment.factory,
    hre.ethers.provider
  );
  const endowmentProxies = await endowmentMultiSigFactory.getInstantiations();

  for (const endowmentProxy of endowmentProxies) {
    await hre.run("manage:changeProxyAdmin", {
      to: targetAddress,
      proxy: endowmentProxy,
      proxyAdminPkey: proxyAdminPkey,
      yes: true,
    });
  }
}
