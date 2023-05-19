// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IERC20WithCheckpointing} from "../lib/shared/IERC20WithCheckpointing.sol";

abstract contract IIncentivisedVotingLockup is IERC20WithCheckpointing {
    function getLastUserPoint(address addr)
        external
        view
        virtual
        returns (
            int128 bias,
            int128 slope,
            uint256 ts
        );

    function createLock(uint256 value, uint256 unlocktime) external virtual;

    function withdraw() external virtual;

    function increaseLockAmount(uint256 value) external virtual;

    function increaseLockLength(uint256 unlocktime) external virtual;

    function eject(address user) external virtual;

    function expireContract() external virtual;

    function exit() external virtual;
}
