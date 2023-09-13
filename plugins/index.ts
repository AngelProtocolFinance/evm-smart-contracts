/**
 * @author misicnenad
 * @description created based on unmaintained repo https://www.npmjs.com/package/hardhat-change-network
 */

import {extendEnvironment} from "hardhat/config";
import {createProvider} from "hardhat/internal/core/providers/construction";
import {lazyFunction} from "hardhat/plugins";
import {EthereumProvider} from "hardhat/types/provider";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

extendEnvironment((hre) => {
  // We add a field to the Hardhat Runtime Environment here.
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
        // check if network config is set
        if (!hre.config.networks[newNetwork]) {
          throw new Error(`changeNetwork: Couldn't find network '${newNetwork}'`);
        }

        // remember current network's provider for faster future changes
        if (!providers[hre.network.name]) {
          providers[hre.network.name] = hre.network.provider;
        }

        // update hardhat's network data
        hre.network.name = newNetwork;
        hre.network.config = hre.config.networks[newNetwork];
        hre.network.provider = await hre.getProvider(newNetwork);

        // update ethers's provider data
        if (hre.ethers) {
          const {
            EthersProviderWrapper,
          } = require("@nomiclabs/hardhat-ethers/internal/ethers-provider-wrapper");
          hre.ethers.provider = new EthersProviderWrapper(hre.network.provider);
        }
      }
  );
});
