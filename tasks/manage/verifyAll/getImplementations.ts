import {ContractFactory} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  APTeamMultiSig__factory,
  CharityApplications__factory,
  EndowmentMultiSigEmitter__factory,
  EndowmentMultiSigFactory__factory,
  IndexFund__factory,
  Registrar__factory,
  Router__factory,
  VaultEmitter__factory,
} from "typechain-types";
import {Deployment} from "types";
import {AddressObj, getContractName} from "utils";

// no need to pass constructor arguments, they're initiated by their proxies using
// their respective initializer functions
export default function getImplementations(
  addresses: AddressObj,
  hre: HardhatRuntimeEnvironment
): Deployment<ContractFactory>[] {
  const result: Deployment<ContractFactory>[] = [];

  result.push({
    contract: IndexFund__factory.connect(addresses.indexFund.implementation, hre.ethers.provider),
    contractName: getContractName(IndexFund__factory),
  });
  result.push({
    contract: CharityApplications__factory.connect(
      addresses.multiSig.charityApplications.implementation,
      hre.ethers.provider
    ),
    contractName: getContractName(CharityApplications__factory),
  });
  result.push({
    contract: APTeamMultiSig__factory.connect(
      addresses.multiSig.apTeam.implementation,
      hre.ethers.provider
    ),
    contractName: getContractName(APTeamMultiSig__factory),
  });
  result.push({
    contract: EndowmentMultiSigEmitter__factory.connect(
      addresses.multiSig.endowment.emitter.implementation,
      hre.ethers.provider
    ),
    contractName: getContractName(EndowmentMultiSigEmitter__factory),
  });
  result.push({
    contract: EndowmentMultiSigFactory__factory.connect(
      addresses.multiSig.endowment.factory.implementation,
      hre.ethers.provider
    ),
    contractName: getContractName(EndowmentMultiSigFactory__factory),
    constructorArguments: [
      addresses.multiSig.endowment.implementation,
      addresses.multiSig.proxyAdmin,
      addresses.registrar.proxy,
    ],
  });
  result.push({
    contract: Registrar__factory.connect(addresses.registrar.implementation, hre.ethers.provider),
    contractName: getContractName(Registrar__factory),
  });
  result.push({
    contract: Router__factory.connect(addresses.router.implementation, hre.ethers.provider),
    contractName: getContractName(Router__factory),
  });
  result.push({
    contract: VaultEmitter__factory.connect(
      addresses.vaultEmitter.implementation,
      hre.ethers.provider
    ),
    contractName: getContractName(VaultEmitter__factory),
  });

  return result;
}
