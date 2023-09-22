import {ContractFactory} from "ethers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {
  APTeamMultiSig__factory,
  CharityApplications__factory,
  EndowmentMultiSigEmitter__factory,
  EndowmentMultiSigFactory__factory,
  GiftCards__factory,
  IndexFund__factory,
  Registrar__factory,
  Router__factory,
  VaultEmitter__factory,
} from "typechain-types";
import {Deployment} from "types";
import {AddressObj, getContractName} from "utils";

// no need to pass constructor arguments, they're initiated by their proxies using
// their respective initializer functions
export default function getProxies(
  addresses: AddressObj,
  hre: HardhatRuntimeEnvironment
): Deployment<ContractFactory>[] {
  const deployments: Deployment<ContractFactory>[] = [];

  deployments.push({
    contract: IndexFund__factory.connect(addresses.indexFund.proxy, hre.ethers.provider),
    contractName: getContractName(IndexFund__factory),
  });
  deployments.push({
    contract: CharityApplications__factory.connect(
      addresses.multiSig.charityApplications.proxy,
      hre.ethers.provider
    ),
    contractName: getContractName(CharityApplications__factory),
  });
  deployments.push({
    contract: APTeamMultiSig__factory.connect(addresses.multiSig.apTeam.proxy, hre.ethers.provider),
    contractName: getContractName(APTeamMultiSig__factory),
  });
  deployments.push({
    contract: EndowmentMultiSigEmitter__factory.connect(
      addresses.multiSig.endowment.emitter.proxy,
      hre.ethers.provider
    ),
    contractName: getContractName(EndowmentMultiSigEmitter__factory),
  });
  deployments.push({
    contract: EndowmentMultiSigFactory__factory.connect(
      addresses.multiSig.endowment.factory.proxy,
      hre.ethers.provider
    ),
    contractName: getContractName(EndowmentMultiSigFactory__factory),
  });
  deployments.push({
    contract: GiftCards__factory.connect(addresses.giftcards.proxy, hre.ethers.provider),
    contractName: getContractName(GiftCards__factory),
  });
  deployments.push({
    contract: Registrar__factory.connect(addresses.registrar.proxy, hre.ethers.provider),
    contractName: getContractName(Registrar__factory),
  });
  deployments.push({
    contract: Router__factory.connect(addresses.router.proxy, hre.ethers.provider),
    contractName: getContractName(Router__factory),
  });
  deployments.push({
    contract: VaultEmitter__factory.connect(addresses.vaultEmitter.proxy, hre.ethers.provider),
    contractName: getContractName(VaultEmitter__factory),
  });

  return deployments;
}
