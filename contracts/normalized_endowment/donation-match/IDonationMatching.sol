// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./storage.sol";

interface IDonationMatching {
    function executeDonorMatch(
        uint256 endowmentId,
        uint256 amount,
        address donor,
        address token
    ) external;

    function queryConfig()
        external
        view
        returns (DonationMatchStorage.Config memory);
}
