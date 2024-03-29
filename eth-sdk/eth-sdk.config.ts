import {defineConfig} from "@dethcrypto/eth-sdk";
import type {Opaque} from "ts-essentials";
import type {ZodTypeDef} from "zod";
import {z} from "zod";

import {AddressObj, getAddressesByNetworkId} from "../utils";
import {ChainID} from "types";

type AddressInput = `0x${string}`;
type Address = Opaque<AddressInput, "Address">;
const addressSchema: z.ZodType<Address, ZodTypeDef, AddressInput> = z
  .string()
  .length(42, {message: "An address must be 42 characters long"})
  .regex(/^0x[0-9a-fA-F]+$/, {message: "An address must be a hexadecimal number string"}) as any;

/**
 * @see https://info.etherscan.com/what-is-an-ethereum-address/
 * @param address - string representation of an address
 * @returns the same string branded as Address if it's a valid address
 */
export function parseAddress(address: string): Address {
  const res = addressSchema.safeParse(address);
  if (res.success) return res.data;
  else {
    const errorCode = res.error.issues[0].code;
    throw new Error(`"${address}" is not a valid address.`);
  }
}

/**
 * Loads and parses the Contract addresses from the contract-address.json
 * file based on the network ID passed
 */
const mumbaiData: AddressObj = getAddressesByNetworkId(ChainID.mumbai);
// const polygonData: AddressObj = getAddressesByNetworkId(ChainID.polygon);

export default defineConfig({
  contracts: {
    polygonMumbai: {
      accounts: {
        diamond: parseAddress(mumbaiData.accounts.diamond),
        facets: {
          accountsDepositWithdrawEndowments: parseAddress(
            mumbaiData.accounts.facets.accountsDepositWithdrawEndowments
          ),
          accountsAllowance: parseAddress(mumbaiData.accounts.facets.accountsAllowance),
          accountsCreateEndowment: parseAddress(mumbaiData.accounts.facets.accountsCreateEndowment),
          accountsQueryEndowments: parseAddress(mumbaiData.accounts.facets.accountsQueryEndowments),
          accountsSwapRouter: parseAddress(mumbaiData.accounts.facets.accountsSwapRouter),
          accountsUpdate: parseAddress(mumbaiData.accounts.facets.accountsUpdate),
          accountsUpdateEndowments: parseAddress(
            mumbaiData.accounts.facets.accountsUpdateEndowments
          ),
          accountsUpdateEndowmentSettingsController: parseAddress(
            mumbaiData.accounts.facets.accountsUpdateEndowmentSettingsController
          ),
          accountsUpdateStatusEndowments: parseAddress(
            mumbaiData.accounts.facets.accountsUpdateStatusEndowments
          ),
          accountsStrategy: parseAddress(mumbaiData.accounts.facets.accountsStrategy),
          diamondCutFacet: parseAddress(mumbaiData.accounts.facets.diamondCutFacet),
          diamondInitFacet: parseAddress(mumbaiData.accounts.facets.diamondInit),
          diamondLoupeFacet: parseAddress(mumbaiData.accounts.facets.diamondLoupeFacet),
          ownershipFacet: parseAddress(mumbaiData.accounts.facets.ownershipFacet),
        },
      },
      axelar: {
        gasService: parseAddress(mumbaiData.axelar.gasService),
        gateway: parseAddress(mumbaiData.axelar.gateway),
      },
      indexFund: {
        implementation: parseAddress(mumbaiData.indexFund.implementation),
        proxy: parseAddress(mumbaiData.indexFund.proxy),
      },
      multiSig: {
        apTeam: {
          implementation: parseAddress(mumbaiData.multiSig.apTeam.implementation),
          proxy: parseAddress(mumbaiData.multiSig.apTeam.proxy),
        },
        charityApplications: {
          implementation: parseAddress(mumbaiData.multiSig.charityApplications.implementation),
          proxy: parseAddress(mumbaiData.multiSig.charityApplications.proxy),
        },
        endowment: {
          emitter: {
            implementation: parseAddress(mumbaiData.multiSig.endowment.emitter.implementation),
            proxy: parseAddress(mumbaiData.multiSig.endowment.emitter.proxy),
          },
          factory: {
            implementation: parseAddress(mumbaiData.multiSig.endowment.factory.implementation),
            proxy: parseAddress(mumbaiData.multiSig.endowment.factory.proxy),
          },
          implementation: parseAddress(mumbaiData.multiSig.endowment.implementation),
        },
      },
      registrar: {
        implementation: parseAddress(mumbaiData.registrar.implementation),
        proxy: parseAddress(mumbaiData.registrar.proxy),
      },
      router: {
        implementation: parseAddress(mumbaiData.router.implementation),
        proxy: parseAddress(mumbaiData.router.proxy),
      },
      // tokens: {
      //   halo: parseAddress(mumbaiData.tokens.halo),
      // },
    },
    polygon: {},
  },
  rpc: {
    polygonMumbai: "https://api-testnet.polygonscan.com/",
    polygon: "https://api.polygonscan.com/",
  },
});
