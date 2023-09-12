// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import {EthereumProvider} from "hardhat/types/provider";
import "hardhat/types/runtime";

declare module "hardhat/types/runtime" {
  // This is an example of an extension to the Hardhat Runtime Environment.
  // This new field will be available in tasks' actions, scripts, and tests.
  export interface HardhatRuntimeEnvironment {
    changeNetwork(newNetwork: string): Promise<void>;
    getProvider(name: string): Promise<EthereumProvider>;
  }
}
