/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IAxelarExecutable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAxelarExecutable__factory>;
    getContractFactory(
      name: "IAxelarGasService",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAxelarGasService__factory>;
    getContractFactory(
      name: "IAxelarGateway",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IAxelarGateway__factory>;
    getContractFactory(
      name: "OwnableUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OwnableUpgradeable__factory>;
    getContractFactory(
      name: "Initializable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Initializable__factory>;
    getContractFactory(
      name: "IERC20Upgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Upgradeable__factory>;
    getContractFactory(
      name: "ContextUpgradeable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ContextUpgradeable__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "ERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721__factory>;
    getContractFactory(
      name: "IERC721Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Metadata__factory>;
    getContractFactory(
      name: "IERC721",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721__factory>;
    getContractFactory(
      name: "IERC721Receiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Receiver__factory>;
    getContractFactory(
      name: "ERC721Holder",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721Holder__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "IUniswapV3SwapCallback",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IUniswapV3SwapCallback__factory>;
    getContractFactory(
      name: "ISwapRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISwapRouter__factory>;
    getContractFactory(
      name: "AxelarExecutable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.AxelarExecutable__factory>;
    getContractFactory(
      name: "IERC20AP",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20AP__factory>;
    getContractFactory(
      name: "IERC20APMetadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20APMetadata__factory>;
    getContractFactory(
      name: "Registrar",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Registrar__factory>;
    getContractFactory(
      name: "Router",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Router__factory>;
    getContractFactory(
      name: "Accounting",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Accounting__factory>;
    getContractFactory(
      name: "APStrategy_V1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.APStrategy_V1__factory>;
    getContractFactory(
      name: "ERC721AngelProtocolExtension",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC721AngelProtocolExtension__factory>;
    getContractFactory(
      name: "APVault_V1",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.APVault_V1__factory>;
    getContractFactory(
      name: "Halo",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Halo__factory>;
    getContractFactory(
      name: "IStrategy",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IStrategy__factory>;
    getContractFactory(
      name: "IBeefyVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IBeefyVault__factory>;
    getContractFactory(
      name: "ICurveLP2Pool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICurveLP2Pool__factory>;
    getContractFactory(
      name: "ICurveLP3Pool",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICurveLP3Pool__factory>;
    getContractFactory(
      name: "GFITrader",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GFITrader__factory>;
    getContractFactory(
      name: "GoldfinchVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.GoldfinchVault__factory>;
    getContractFactory(
      name: "ICurveLP",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICurveLP__factory>;
    getContractFactory(
      name: "IRegistrarGoldfinch",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRegistrarGoldfinch__factory>;
    getContractFactory(
      name: "IStakingRewards",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IStakingRewards__factory>;
    getContractFactory(
      name: "DummyCRVLP",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DummyCRVLP__factory>;
    getContractFactory(
      name: "DummyStakingRewards",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DummyStakingRewards__factory>;
    getContractFactory(
      name: "IRegistrar",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRegistrar__factory>;
    getContractFactory(
      name: "IRouter",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRouter__factory>;
    getContractFactory(
      name: "IVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IVault__factory>;
    getContractFactory(
      name: "IVaultLiquid",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IVaultLiquid__factory>;
    getContractFactory(
      name: "IVaultLocked",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IVaultLocked__factory>;
    getContractFactory(
      name: "APVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.APVault__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "ERC4626",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC4626__factory>;
    getContractFactory(
      name: "StringToAddress",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.StringToAddress__factory>;
    getContractFactory(
      name: "Registrar",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Registrar__factory>;
    getContractFactory(
      name: "Router",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Router__factory>;
    getContractFactory(
      name: "DummyERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DummyERC20__factory>;
    getContractFactory(
      name: "DummyGasService",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DummyGasService__factory>;
    getContractFactory(
      name: "DummyGateway",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DummyGateway__factory>;
    getContractFactory(
      name: "DummyERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DummyERC20__factory>;
    getContractFactory(
      name: "DummyUSDC",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DummyUSDC__factory>;
    getContractFactory(
      name: "DummyVault",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.DummyVault__factory>;

    getContractAt(
      name: "IAxelarExecutable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAxelarExecutable>;
    getContractAt(
      name: "IAxelarGasService",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAxelarGasService>;
    getContractAt(
      name: "IAxelarGateway",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IAxelarGateway>;
    getContractAt(
      name: "OwnableUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.OwnableUpgradeable>;
    getContractAt(
      name: "Initializable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Initializable>;
    getContractAt(
      name: "IERC20Upgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Upgradeable>;
    getContractAt(
      name: "ContextUpgradeable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ContextUpgradeable>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "ERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721>;
    getContractAt(
      name: "IERC721Metadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Metadata>;
    getContractAt(
      name: "IERC721",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721>;
    getContractAt(
      name: "IERC721Receiver",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Receiver>;
    getContractAt(
      name: "ERC721Holder",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721Holder>;
    getContractAt(
      name: "ERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "IUniswapV3SwapCallback",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IUniswapV3SwapCallback>;
    getContractAt(
      name: "ISwapRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ISwapRouter>;
    getContractAt(
      name: "AxelarExecutable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.AxelarExecutable>;
    getContractAt(
      name: "IERC20AP",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20AP>;
    getContractAt(
      name: "IERC20APMetadata",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20APMetadata>;
    getContractAt(
      name: "Registrar",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Registrar>;
    getContractAt(
      name: "Router",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Router>;
    getContractAt(
      name: "Accounting",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Accounting>;
    getContractAt(
      name: "APStrategy_V1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.APStrategy_V1>;
    getContractAt(
      name: "ERC721AngelProtocolExtension",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC721AngelProtocolExtension>;
    getContractAt(
      name: "APVault_V1",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.APVault_V1>;
    getContractAt(
      name: "Halo",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Halo>;
    getContractAt(
      name: "IStrategy",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IStrategy>;
    getContractAt(
      name: "IBeefyVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IBeefyVault>;
    getContractAt(
      name: "ICurveLP2Pool",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICurveLP2Pool>;
    getContractAt(
      name: "ICurveLP3Pool",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICurveLP3Pool>;
    getContractAt(
      name: "GFITrader",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.GFITrader>;
    getContractAt(
      name: "GoldfinchVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.GoldfinchVault>;
    getContractAt(
      name: "ICurveLP",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ICurveLP>;
    getContractAt(
      name: "IRegistrarGoldfinch",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRegistrarGoldfinch>;
    getContractAt(
      name: "IStakingRewards",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IStakingRewards>;
    getContractAt(
      name: "DummyCRVLP",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DummyCRVLP>;
    getContractAt(
      name: "DummyStakingRewards",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DummyStakingRewards>;
    getContractAt(
      name: "IRegistrar",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRegistrar>;
    getContractAt(
      name: "IRouter",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRouter>;
    getContractAt(
      name: "IVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IVault>;
    getContractAt(
      name: "IVaultLiquid",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IVaultLiquid>;
    getContractAt(
      name: "IVaultLocked",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IVaultLocked>;
    getContractAt(
      name: "APVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.APVault>;
    getContractAt(
      name: "ERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "ERC4626",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC4626>;
    getContractAt(
      name: "StringToAddress",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.StringToAddress>;
    getContractAt(
      name: "Registrar",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Registrar>;
    getContractAt(
      name: "Router",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Router>;
    getContractAt(
      name: "DummyERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DummyERC20>;
    getContractAt(
      name: "DummyGasService",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DummyGasService>;
    getContractAt(
      name: "DummyGateway",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DummyGateway>;
    getContractAt(
      name: "DummyERC20",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DummyERC20>;
    getContractAt(
      name: "DummyUSDC",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DummyUSDC>;
    getContractAt(
      name: "DummyVault",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.DummyVault>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
