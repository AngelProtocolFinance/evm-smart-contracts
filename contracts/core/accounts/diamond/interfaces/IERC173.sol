// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title ERC-173 Contract Ownership Standard
///  Note: the ERC-165 identifier for this interface is 0x7f5828d0
/* is ERC165 */
interface IERC173 {
  /// @dev This emits when ownership of a contract changes.
  event OwnershipTransferred(address previousOwner, address newOwner);

  /// @notice Get the address of the owner
  /// @return owner The address of the owner.
  function owner() external view returns (address owner);

  /// @notice Set the address of the new owner of the contract
  /// @dev Set newowner to address(0) to renounce any ownership.
  /// @param newowner The address of the new owner of the contract
  function transferOwnership(address newowner) external;
}
