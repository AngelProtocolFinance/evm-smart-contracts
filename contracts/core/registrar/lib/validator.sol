// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {AngelCoreStruct} from "../../struct.sol";

library Validator {
    function addressChecker(address curAddr1) internal pure returns (bool) {
        if (curAddr1 == address(0)) {
            return false;
        }
        return true;
    }

    function splitChecker(
        AngelCoreStruct.SplitDetails memory split
    ) internal pure returns (bool) {
        if(
            (split.max > 100) || 
            (split.min > 100) ||
            (split.defaultSplit > 100)
        ) {
                return false;
        } 
        else if (
            !(split.max >= split.min &&
                split.defaultSplit <= split.max &&
                split.defaultSplit >= split.min)
        ) {
            return false;
        } 
        else {
            return true;
        }
    }

    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
