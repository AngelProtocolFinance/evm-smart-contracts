// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IERC20WithCheckpointing} from "../lib/shared/IERC20WithCheckpointing.sol";

abstract contract IIncentivisedVotingLockup is IERC20WithCheckpointing {
    function getLastUserPoint(address curAddr)
        external
        view
        virtual
        returns (
            int128 bias,
            int128 slope,
            uint256 ts
        );

    function createLock(uint256 curValue, uint256 curUnlocktime) external virtual;

    function withdraw() external virtual;

    function increaseLockAmount(uint256 curValue) external virtual;

    function increaseLockLength(uint256 curUnlocktime) external virtual;

    function eject(address curUser) external virtual;

    function expireContract() external virtual;

    function exit() external virtual;
}
