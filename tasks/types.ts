import {allStrategyConfigs} from "contracts/integrations/stratConfig";
import {constants} from "ethers";
import {isAddress} from "ethers/lib/utils";
import {HardhatError} from "hardhat/internal/core/errors";
import {ERRORS} from "hardhat/internal/core/errors-list";
import {int} from "hardhat/internal/core/params/argumentTypes";
import {CLIArgumentType} from "hardhat/types";
import {StratConfig} from "utils";

const address: CLIArgumentType<string> = {
  name: "address",
  parse: (_, strValue) => strValue.trim(),
  /**
   * Check if argument value is a valid EVM address
   *
   * @param argName {string} argument's name - used for context in case of error.
   * @param argValue {any} argument's value to validate.
   *
   * @throws HH301 if value is not a valid EVM address
   */
  validate: (argName: string, argValue: any): void => {
    if (
      !argValue ||
      typeof argValue !== "string" ||
      !isAddress(argValue) ||
      argValue === constants.AddressZero
    ) {
      throw new Error(
        `Invalid value ${argValue} for argument ${argName} - must be a valid non-zero EVM address`
      );
    }
  },
};

const booleanArray: CLIArgumentType<Array<boolean>> = {
  name: "booleanArray",
  parse: (argName, strValue) => {
    const values = strValue.split(/\s*,\s*/);
    const result = values.map((val) => {
      if (val.toLowerCase() === "true") {
        return true;
      }
      if (val.toLowerCase() === "false") {
        return false;
      }

      throw new Error(`Invalid value ${val} in argument ${argName} of type \`boolean[]\``);
    });

    return result;
  },
  /**
   * Check if argument value is of type "boolean[]"
   *
   * @param argName {string} argument's name - used for context in case of error.
   * @param arr {any} argument's array value to validate.
   *
   * @throws HH301 if value is not of type "boolean[]"
   */
  validate: (argName: string, arr: any): void => {
    const isBooleanArray =
      Array.isArray(arr) && (arr.length === 0 || arr.every((val) => typeof val === "boolean"));

    if (!isBooleanArray) {
      throw new Error(`Invalid value ${arr} for argument ${argName} of type \`boolean[]\``);
    }
  },
};

const stratConfig: CLIArgumentType<StratConfig> = {
  name: "StratConfig",
  parse: (_, strValue) => allStrategyConfigs[strValue.trim()],
  /**
   * Check if argument value is of type "StratConfig"
   *
   * @param argName {string} argument's name - used for context in case of error.
   * @param argValue {any} argument's value to validate.
   *
   * @throws HH301 if value is not of type "StratConfig"
   */
  validate: (argName: string, argValue: any): void => {
    if (!argValue || typeof argValue !== "object") {
      throw new Error(`Invalid value ${argValue} for argument ${argName} of type \`StratConfig\``);
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
   * @param arr {any} argument's array value to validate.
   *
   * @throws HH301 if value is not of type "string[]"
   */
  validate: (argName: string, arr: any): void => {
    const isStringArray =
      Array.isArray(arr) && (arr.length === 0 || arr.every((val) => typeof val === "string"));

    if (!isStringArray) {
      throw new Error(`Invalid value ${arr} for argument ${argName} of type \`string[]\``);
    }
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
    boolean: booleanArray,
    string: stringArray,
  },
  enums,
  stratConfig,
};
