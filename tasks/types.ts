import {CLIArgumentType} from "hardhat/types";

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

export const cliTypes = {
  array: {
    boolean: booleanArray,
    string: stringArray,
  },
};
