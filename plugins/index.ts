/**
 * @author misicnenad
 * @description created based on unmaintained repo https://www.npmjs.com/package/hardhat-change-network
 */

// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import {extendEnvironment} from "hardhat/config";
import {createProvider} from "hardhat/internal/core/providers/construction";
import {lazyFunction} from "hardhat/plugins";
import {EthereumProvider} from "hardhat/types/provider";
import "hardhat/types/runtime";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

extendEnvironment((hre) => {
  // We add a field to the Hardhat Runtime Environment here.
  // We use lazyObject to avoid initializing things until they are actually
  // needed.
  const providers: {[name: string]: EthereumProvider} = {};

  hre.getProvider = lazyFunction(
    () =>
      async function (name: string): Promise<EthereumProvider> {
        if (!providers[name]) {
          providers[name] = await createProvider(hre.config, name, hre.artifacts);
        }
        return providers[name];
      }
  );

  hre.changeNetwork = lazyFunction(
    () =>
      async function (newNetwork: string) {
        if (!hre.config.networks[newNetwork]) {
          throw new Error(`changeNetwork: Couldn't find network '${newNetwork}'`);
        }

        if (!providers[hre.network.name]) {
          providers[hre.network.name] = hre.network.provider;
        }

        hre.network.name = newNetwork;
        hre.network.config = hre.config.networks[newNetwork];
        hre.network.provider = await hre.getProvider(newNetwork);

        if (hre.ethers) {
          const {
            EthersProviderWrapper,
          } = require("@nomiclabs/hardhat-ethers/internal/ethers-provider-wrapper");
          hre.ethers.provider = new EthersProviderWrapper(hre.network.provider);
        }
      }
  );
});
