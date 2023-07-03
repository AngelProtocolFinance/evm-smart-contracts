import {ADDRESS_ZERO} from "./constants";

export function validateAddress(address: string | undefined, fieldName: string): address is string {
  if (!address || address === ADDRESS_ZERO) {
    throw new Error(`Invalid "${fieldName}" value: "${address}"`);
  }
  return true;
}
