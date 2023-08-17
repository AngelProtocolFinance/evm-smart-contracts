// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {QueryIIncentivisedVotingLockup} from "./../incentivised-voting/interfaces/QueryIIncentivisedVotingLockup.sol";

library SubDaoLib {
  enum VeTypeEnum {
    Constant,
    Linear,
    SquarRoot
  }

  struct VeTypeData {
    uint128 value;
    uint256 scale;
    uint128 slope;
    uint128 power;
  }

  struct VeType {
    VeTypeEnum ve_type;
    VeTypeData data;
  }

  enum TokenType {
    Existing,
    New,
    VeBonding
  }

  struct DaoTokenData {
    address existingData;
    uint256 newInitialSupply;
    string newName;
    string newSymbol;
    VeType veBondingType;
    string veBondingName;
    string veBondingSymbol;
    uint256 veBondingDecimals;
    address veBondingReserveDenom;
    uint256 veBondingReserveDecimals;
    uint256 veBondingPeriod;
  }

  struct DaoToken {
    TokenType token;
    DaoTokenData data;
  }

  struct DaoSetup {
    uint256 quorum; //: Decimal,
    uint256 threshold; //: Decimal,
    uint256 votingPeriod; //: u64,
    uint256 timelockPeriod; //: u64,
    uint256 expirationPeriod; //: u64,
    uint128 proposalDeposit; //: Uint128,
    uint256 snapshotPeriod; //: u64,
    DaoToken token; //: DaoToken,
  }

  uint256 constant MIN_TITLE_LENGTH = 4;
  uint256 constant MAX_TITLE_LENGTH = 64;
  uint256 constant MIN_DESC_LENGTH = 4;
  uint256 constant MAX_DESC_LENGTH = 1024;
  uint256 constant MIN_LINK_LENGTH = 12;
  uint256 constant MAX_LINK_LENGTH = 128;

  /**
   * @dev internal function returns length of utf string
   * @param str string to be checked
   */
  function utfStringLength(string memory str) public pure returns (uint256 length) {
    uint256 i = 0;
    bytes memory string_rep = bytes(str);

    while (i < string_rep.length) {
      if (string_rep[i] >> 7 == 0) i += 1;
      else if (string_rep[i] >> 5 == bytes1(uint8(0x6))) i += 2;
      else if (string_rep[i] >> 4 == bytes1(uint8(0xE))) i += 3;
      else if (string_rep[i] >> 3 == bytes1(uint8(0x1E))) i += 4;
      else i += 1;

      length++;
    }
  }

  /**
   * @notice function used to validate title
   * @dev validate title
   * @param title title to be validated
   */
  function validateTitle(string memory title) public pure returns (bool) {
    require(utfStringLength(title) > MIN_TITLE_LENGTH, "Title too short");

    require(utfStringLength(title) < MAX_TITLE_LENGTH, "Title too long");

    return true;
  }

  /**
   * @notice function used to validate description
   * @dev validate description
   * @param description description to be validated
   */
  function validateDescription(string memory description) public pure returns (bool) {
    require(utfStringLength(description) > MIN_DESC_LENGTH, "Description too short");

    require(utfStringLength(description) < MAX_DESC_LENGTH, "Description too long");

    return true;
  }

  /**
   * @notice function used to validate link
   * @dev validate link
   * @param link link to be validated
   */

  function validateLink(string memory link) public pure returns (bool) {
    require(utfStringLength(link) > MIN_LINK_LENGTH, "Link too short");

    require(utfStringLength(link) < MAX_LINK_LENGTH, "Link too long");

    return true;
  }

  /**
   * @notice function used to validate quorum
   * @dev validate quorum
   * @param quorum quorum to be validated
   */
  function validateQuorum(uint256 quorum) public pure returns (bool) {
    require(quorum < 100, "quorum must be 0 to 100");

    return true;
  }

  /**
   * @notice function used to validate threshold
   * @dev validate threshold
   * @param threshold threshold to be validated
   */
  function validateThreshold(uint256 threshold) public pure returns (bool) {
    require(threshold < 100, "threshold must be 0 to 100");

    return true;
  }

  /**
   * @notice function used to query voting balance of an address
   * @dev query voting balance of an address
   * @param veAddr ve address
   * @param targetAddr address to be queried
   * @param blocknumber block number to be queried
   */
  function queryAddressVotingBalanceAtBlock(
    address veAddr,
    address targetAddr,
    uint256 blocknumber
  ) public view returns (uint256) {
    // return IERC20(veaddr).balanceOf(addr);
    return QueryIIncentivisedVotingLockup(veAddr).balanceOfAt(targetAddr, blocknumber);
  }

  /**
   * @notice function used to query total voting balance
   * @dev query total voting balance
   * @param veaddr ve address
   * @param blocknumber block number to be queried
   */
  function queryTotalVotingBalanceAtBlock(
    address veaddr,
    uint256 blocknumber
  ) public view returns (uint256) {
    return QueryIIncentivisedVotingLockup(veaddr).totalSupplyAt(blocknumber);
  }
}
