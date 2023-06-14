import {defineConfig} from "@dethcrypto/eth-sdk";
import type {Opaque} from "ts-essentials";
import type {ZodTypeDef} from "zod";
import {z} from "zod";

import {DEFAULT_CONTRACT_ADDRESS_FILE_PATH} from "../utils/constants";
import {readAllAddresses, getAddressesByNetworkId} from "../utils/manageAddressFile/helpers";
import {AddressObj} from "../utils/manageAddressFile/types";

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
const mumbaiData: AddressObj = getAddressesByNetworkId(80001, DEFAULT_CONTRACT_ADDRESS_FILE_PATH);
const polygonData: AddressObj = getAddressesByNetworkId(137, DEFAULT_CONTRACT_ADDRESS_FILE_PATH);

export default defineConfig({
  contracts: {
    polygonMumbai: {
      accounts: {
        diamond: parseAddress(mumbaiData.accounts.diamond),
        facets: {
          accountDeployContract: parseAddress(mumbaiData.accounts.facets.accountDeployContract),
          accountDepositWithdrawEndowments: parseAddress(
            mumbaiData.accounts.facets.accountDepositWithdrawEndowments
          ),
          accountDonationMatch: parseAddress(mumbaiData.accounts.facets.accountDonationMatch),
          accountsAllowance: parseAddress(mumbaiData.accounts.facets.accountsAllowance),
          accountsCreateEndowment: parseAddress(mumbaiData.accounts.facets.accountsCreateEndowment),
          accountsDAOEndowments: parseAddress(mumbaiData.accounts.facets.accountsDAOEndowments),
          accountsQueryEndowments: parseAddress(mumbaiData.accounts.facets.accountsQueryEndowments),
          accountsSwapEndowments: parseAddress(mumbaiData.accounts.facets.accountsSwapEndowments),
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
          accountsVaultFacet: parseAddress(mumbaiData.accounts.facets.accountsVaultFacet),
          diamondCutFacet: parseAddress(mumbaiData.accounts.facets.diamondCutFacet),
          diamondInitFacet: parseAddress(mumbaiData.accounts.facets.diamondInitFacet),
          diamondLoupeFacet: parseAddress(mumbaiData.accounts.facets.diamondLoupeFacet),
          ownershipFacet: parseAddress(mumbaiData.accounts.facets.ownershipFacet),
        },
      },
      charityApplication: {
        implementation: parseAddress(mumbaiData.charityApplication.implementation),
        proxy: parseAddress(mumbaiData.charityApplication.proxy),
      },
      donationMatch: {
        implementation: parseAddress(mumbaiData.donationMatch.implementation),
        proxy: parseAddress(mumbaiData.donationMatch.proxy),
      },
      donationMatchCharity: {
        implementation: parseAddress(mumbaiData.donationMatchCharity.implementation),
        proxy: parseAddress(mumbaiData.donationMatchCharity.proxy),
      },
      indexFund: {
        implementation: parseAddress(mumbaiData.indexFund.implementation),
        proxy: parseAddress(mumbaiData.indexFund.proxy),
      },
      libraries: {
        angelCoreStructLibrary: parseAddress(mumbaiData.libraries.ANGEL_CORE_STRUCT_LIBRARY),
        stringLibrary: parseAddress(mumbaiData.libraries.STRING_LIBRARY),
      },
      multiSig: {
        applications: {
          implementation: parseAddress(mumbaiData.multiSig.applications.implementation),
          proxy: parseAddress(mumbaiData.multiSig.applications.proxy),
        },
        apTeam: {
          implementation: parseAddress(mumbaiData.multiSig.apTeam.implementation),
          proxy: parseAddress(mumbaiData.multiSig.apTeam.proxy),
        },
        endowment: {
          emitter: {
            implementation: parseAddress(mumbaiData.multiSig.endowment.emitter.implementation),
            proxy: parseAddress(mumbaiData.multiSig.endowment.emitter.proxy),
          },
          factory: parseAddress(mumbaiData.multiSig.endowment.factory),
          implementation: parseAddress(mumbaiData.multiSig.endowment.implementation),
        },
      },
      registrar: {
        implementation: parseAddress(mumbaiData.registrar.implementation),
        proxy: parseAddress(mumbaiData.registrar.proxy),
      },
      subDao: {
        emitter: {
          implementation: parseAddress(mumbaiData.subDao.emitter.implementation),
          proxy: parseAddress(mumbaiData.subDao.emitter.proxy),
        },
        implementation: parseAddress(mumbaiData.subDao.implementation),
        token: parseAddress(mumbaiData.subDao.token),
        veBondingToken: parseAddress(mumbaiData.subDao.veBondingToken),
      },
    },
    polygon: {},
  },
  rpc: {
    polygonMumbai: "https://api-testnet.polygonscan.com/",
    polygon: "https://api.polygonscan.com/",
  },
});