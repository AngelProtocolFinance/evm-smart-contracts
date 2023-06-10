import {expect} from "chai";
import {ethers, upgrades} from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  DummyERC20,
  DummyERC20__factory,
  DummyGasService,
  DummyGasService__factory,
  DummyGateway,
  DummyGateway__factory,
  IVault,
  APVault_V1,
  APVault_V1__factory,
  LocalRegistrar,
  LocalRegistrar__factory,
  Router,
  Router__factory,
} from "typechain-types";
import {
  ArrayToVaultActionStruct,
  IVaultHelpers,
  StrategyApprovalState,
  VaultActionStructToArray,
  getSigners
} from "utils";
import {LocalRegistrarLib} from "../../../typechain-types/contracts/core/registrar/LocalRegistrar";

describe("Vault", function () {
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let collector: SignerWithAddress;

  let Router: Router__factory;
  let Registrar: LocalRegistrar__factory;

  async function deployRegistrarAsProxy(): Promise<LocalRegistrar> {
    Registrar = (await ethers.getContractFactory("LocalRegistrar")) as LocalRegistrar__factory;
    const registrar = (await upgrades.deployProxy(Registrar)) as LocalRegistrar;
    await registrar.deployed();
    return registrar;
  }

  async function deployRouterAsProxy(
    gatewayAddress: string = "0xe432150cce91c13a887f7D836923d5597adD8E31",
    gasRecvAddress: string = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6",
    registrar?: LocalRegistrar
  ): Promise<Router> {
    let defaultApParams = {
      routerAddr: ethers.constants.AddressZero,
      refundAddr: ethers.constants.AddressZero,
    } as LocalRegistrarLib.AngelProtocolParamsStruct;

    [owner, user] = await ethers.getSigners();
    let apParams = defaultApParams;
    apParams.refundAddr = collector.address;
    if (!registrar) {
      registrar = await deployRegistrarAsProxy();
    }
    await registrar.setAngelProtocolParams(apParams);
    Router = (await ethers.getContractFactory("Router")) as Router__factory;
    const router = (await upgrades.deployProxy(Router, [
      "polygon",
      gatewayAddress,
      gasRecvAddress,
      registrar.address,
    ])) as Router;
    await router.deployed();
    return router;
  }

  async function deployDummyGateway(): Promise<DummyGateway> {
    let Gateway = (await ethers.getContractFactory("DummyGateway")) as DummyGateway__factory;
    const gateway = await Gateway.deploy();
    await gateway.deployed();
    return gateway;
  }

  async function deployDummyGasService(): Promise<DummyGasService> {
    let GasService = (await ethers.getContractFactory(
      "DummyGasService"
    )) as DummyGasService__factory;
    const gasService = await GasService.deploy();
    await gasService.deployed();
    return gasService;
  }

  async function deployVault(
    {
      baseToken, 
      yieldToken,
      vaultType = 0, 
      strategySelector = "0x12345678",
      strategy = ethers.constants.AddressZero,
      registrar = ethers.constants.AddressZero,
      apTokenName = "TestVault",
      apTokenSymbol = "TV"
    } : {
      baseToken: string, 
      yieldToken: string,
      vaultType?: number, 
      strategySelector?: string,
      strategy?: string,
      registrar?: string,
      apTokenName?: string,
      apTokenSymbol?: string
    }
    ): Promise<APVault_V1> {
    let Vault = new APVault_V1__factory(owner);
    let vaultInitConfig: IVault.VaultConfigStruct = {
      vaultType: vaultType,
      strategySelector: strategySelector,
      strategy: strategy,
      registrar: registrar,
      baseToken: baseToken, 
      yieldToken: yieldToken,
      apTokenName: apTokenName,
      apTokenSymbol: apTokenSymbol,
      admin: owner.address
    }
    const vault = await Vault.deploy(vaultInitConfig); // Liquid type by default
    await vault.deployed();
    return vault;
  }
})