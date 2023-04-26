// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

library Validator {

    function addressChecker(address curAddr1) internal pure returns(bool){
        if(curAddr1 == address(0)){
            return false;
        }
        return true;
    }

}