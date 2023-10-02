import {allStrategyConfigs} from "contracts/integrations/stratConfig";
import {constants} from "ethers";
import {isAddress} from "ethers/lib/utils";
import {HardhatError} from "hardhat/internal/core/errors";
import {ERRORS} from "hardhat/internal/core/errors-list";
import {boolean, int, string} from "hardhat/internal/core/params/argumentTypes";
import {CLIArgumentType} from "hardhat/types";
import {StratConfig} from "utils";

const address: CLIArgumentType<string> = {
  name: "address",
  parse: (argname, strValue) => string.parse(argname, strValue),
  /**
   * Check if argument value is a valid EVM address
   *
   * @param argName {string} argument's name - used for context in case of error.
   * @param argValue {any} argument's value to validate.
   *
   * @throws HH301 if value is not a valid EVM address
   */
  validate: (argName: string, argValue: any): void => {
    string.validate(argName, argValue);

    if (!isAddress(argValue) || argValue === constants.AddressZero) {
      throw new Error(
        `Invalid value '${argValue}' for argument '${argName}' - must be a valid non-zero EVM address`
      );
    }
  },
};

const addressArray: CLIArgumentType<Array<string>> = {
  name: "addressArray",
  parse: (argName, strValue) => stringArray.parse(argName, strValue),
  /**
   * Check if argument value is an array of valid EVM addresses
   *
   * @param argName {string} argument's name - used for context in case of error.
   * @param argValue {any} argument's value to validate.
   *
   * @throws HH301 if value is not an array of valid EVM addresses
   */
  validate: (argName: string, argValue: any): void => {
    // verify this is a string array
    stringArray.validate(argName, argValue);
    // cast to string[]
    const strArr = argValue as string[];
    // verify each item in the array is a valid EVM address
    strArr.forEach((strValue, i) => address.validate(`${argName}[${i}]`, strValue));
  },
};

const booleanArray: CLIArgumentType<Array<boolean>> = {
  name: "booleanArray",
  parse: (argName, strValue) => {
    const values = strValue.split(/\s*,\s*/);
    const result = values.map((value, i) => boolean.parse(`${argName}[${i}]`, value));
    return result;
  },
  /**
   * Check if argument value is of type "boolean[]"
   *
   * @param argName {string} argument's name - used for context in case of error.
   * @param argValue {any} argument's value to validate.
   *
   * @throws HH301 if value is not of type "boolean[]"
   */
  validate: (argName: string, argValue: any): void => {
    if (!Array.isArray(argValue)) {
      throw new Error(
        `Invalid value '${argValue}' for argument '${argName}' of type \`boolean[]\``
      );
    }
    (argValue as any[]).forEach((value, i) => boolean.validate(`${argName}[${i}]`, value));
  },
};

const stratConfig: CLIArgumentType<string> = {
  name: "StratConfig",
  parse: (argName, strValue) => string.parse(argName, strValue),
  /**
   * Check if argument value is of type "StratConfig"
   *
   * @param argName {string} argument's name - used for context in case of error.
   * @param argValue {any} argument's value to validate.
   *
   * @throws HH301 if value is not of type "StratConfig"
   */
  validate: (argName: string, argValue: any): void => {
    string.validate(argName, argValue);

    const possibleValues = Object.keys(allStrategyConfigs);

    if (!possibleValues.includes(argValue)) {
      throw new Error(
        `Invalid value '${argValue}' for argument '${argName}', possible values: ${possibleValues}`
      );
    }
  },
};

const stringArray: CLIArgumentType<Array<string>> = {
  name: "stringArray",
  parse: (_, strValue) => strValue.split(/\s*,\s*/),
  /**
   * Check if argument value is of type "string[]"
   *
   * @param argName {string} argument's name - used for context in case of error.
   * @param argValue {any} argument's value to validate.
   *
   * @throws HH301 if value is not of type "string[]"
   */
  validate: (argName: string, argValue: any): void => {
    if (!Array.isArray(argValue)) {
      throw new Error(`Invalid value '${argValue}' for argument '${argName}' of type \`string[]\``);
    }
    (argValue as any[]).forEach((value, i) => string.validate(`${argName}[${i}]`, value));
  },
};

function enums<T extends {[key in string]: string | number}>(
  enumObj: T,
  fieldName: string
): CLIArgumentType<string | number> {
  const cliArgType: CLIArgumentType<string | number> = {
    name: fieldName,
    parse: (argName, strValue) => {
      if (Object.values(enumObj).includes(strValue)) {
        return strValue;
      }
      try {
        const val = int.parse(argName, strValue);
        if (val in enumObj) {
          return val;
        }
      } catch (error) {
        if (!(error instanceof HardhatError)) {
          throw error;
        }
      }
      throw new HardhatError(ERRORS.ARGUMENTS.INVALID_VALUE_FOR_TYPE, {
        value: strValue,
        name: argName,
        type: cliArgType.name,
      });
    },
    /**
     * Check if argument value is of enum type "T"
     *
     * @param argName {string} argument's name - used for context in case of error.
     * @param value {any} argument's value to validate.
     *
     * @throws HH301 if value is not of type "T"
     */
    validate: (argName: string, value: any): void => {
      if (Object.values(enumObj).includes(value)) {
        return;
      }
      try {
        int.validate(argName, value);
      } catch (error) {
        if (error instanceof HardhatError) {
          throw new HardhatError(ERRORS.ARGUMENTS.INVALID_VALUE_FOR_TYPE, {
            value,
            name: argName,
            type: cliArgType.name,
          });
        }
        throw error;
      }
      if (!(value in enumObj)) {
        throw new HardhatError(ERRORS.ARGUMENTS.INVALID_VALUE_FOR_TYPE, {
          value,
          name: argName,
          type: cliArgType.name,
        });
      }
    },
  };
  return cliArgType;
}

export const cliTypes = {
  address,
  array: {
    address: addressArray,
    boolean: booleanArray,
    string: stringArray,
  },
  enums,
  stratConfig,
};
