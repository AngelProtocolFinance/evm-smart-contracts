// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface QueryIIncentivisedVotingLockup {
    function balanceOf(address curOwner) external view returns (uint256);

    function balanceOfAt(address curOwner, uint256 curBlocknumber)
        external
        view
        returns (uint256);

    function totalSupply() external view returns (uint256);

    function totalSupplyAt(uint256 curBlocknumber)
        external
        view
        returns (uint256);
}
