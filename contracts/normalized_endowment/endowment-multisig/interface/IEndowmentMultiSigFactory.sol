// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IEndowmentMultiSigFactory {
    function create(
        uint256 endowmentId,
        address emitterAddress,
        address[] memory curOwners,
        uint256 curRequired
    ) external returns (address);

    function updateImplementation(address implementationAddress) external;

    function updateProxyAdmin(address proxyAdminAddress) external;

    function endowmentIdToMultisig(
        uint256 endowmentId
    ) external returns (address);
}
