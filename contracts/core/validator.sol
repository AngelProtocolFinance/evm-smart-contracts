// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {AngelCoreStruct} from "./struct.sol";

library Validator {
  function addressChecker(address addr1) internal pure returns (bool) {
    if (addr1 == address(0)) {
      return false;
    }
    return true;
  }

  function splitChecker(AngelCoreStruct.SplitDetails memory split) internal pure returns (bool) {
    if ((split.max > 100) || (split.min > 100) || (split.defaultSplit > 100)) {
      return false;
    } else if (
      !(split.max >= split.min &&
        split.defaultSplit <= split.max &&
        split.defaultSplit >= split.min)
    ) {
      return false;
    } else {
      return true;
    }
  }

  function compareStrings(string memory a, string memory b) internal pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
  }

  function delegateIsValid(
    AngelCoreStruct.Delegate memory delegate,
    address sender,
    uint256 envTime
  ) internal pure returns (bool) {
    return (delegate.addr != address(0) &&
      sender == delegate.addr &&
      (delegate.expires == 0 || envTime <= delegate.expires));
  }

  function canChange(
    AngelCoreStruct.SettingsPermission memory permissions,
    address sender,
    address owner,
    uint256 envTime
  ) internal pure returns (bool) {
    // Can be changed if both critera are satisfied:
    // 1. permission is not locked forever (read: `locked` == true)
    // 2. sender is a valid delegate address and their powers have not expired OR
    //    sender is the endow owner (ie. owner must first revoke their delegation)
    return (!permissions.locked &&
      (delegateIsValid(permissions.delegate, sender, envTime) || sender == owner));
  }

  function validateFee(AngelCoreStruct.FeeSetting memory fee) internal pure {
    if (fee.bps > 0 && fee.payoutAddress == address(0)) {
      revert("Invalid fee payout zero address given");
    } else if (fee.bps > AngelCoreStruct.FEE_BASIS) {
      revert("Invalid fee basis points given. Should be between 0 and 10000.");
    }
  }
}
