// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract ERC721AngelProtocolExtension is ERC721
{

  struct Position {
    uint32 accountId; 
    uint256 USDCPrinciple;
    uint256 underlyingPrinciple;
  }

  mapping (uint256 => Position) positionByTokenId;
  mapping (uint32 => uint256) tokenIdByAccountId;

  function getPositionByTokenId(uint256 id) external view returns (Position memory) {
    return positionByTokenId[id];
  }

  function getTokenIdByAccountId(uint32 accountId) external view returns (uint256) {
    return tokenIdByAccountId[accountId];
  }

  function setPositionBytokenId(uint256 id, Position memory newPosition) internal {
    positionByTokenId[id] = newPosition;
  }
}