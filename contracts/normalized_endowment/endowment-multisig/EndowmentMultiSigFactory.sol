// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {ProxyContract} from "../../core/proxy.sol";
import {IEndowmentMultiSigEmitter} from "./interface/IEndowmentMultiSigEmitter.sol";

contract Factory {
    /*
     *  Events
     */
    event ContractInstantiation(address sender, address instantiation);

    /*
     *  Storage
     */
    mapping(address => bool) public isInstantiation;
    mapping(address => address[]) public instantiations;
    mapping(uint256 => address) public endowmentIdToMultisig;

    /*
     * Public functions
     */
    /// @dev Returns number of instantiations by creator.
    /// @param creator Contract creator.
    /// @return Returns number of instantiations by creator.
    function getInstantiationCount(
        address creator
    ) public view returns (uint256) {
        return instantiations[creator].length;
    }

    /*
     * Internal functions
     */
    /// @dev Registers contract in factory registry.
    /// @param instantiation Address of contract instantiation.
    function register(address instantiation) internal {
        isInstantiation[instantiation] = true;
        instantiations[msg.sender].push(instantiation);
        emit ContractInstantiation(msg.sender, instantiation);
    }
}

/// @title Multisignature wallet factory - Allows creation of multisigs wallet.
/// @author Stefan George - <stefan.george@consensys.net>
contract MultiSigWalletFactory is Factory, Ownable {
    address IMPLEMENTATION_ADDRESS;
    address PROXY_ADMIN;

    constructor(address implementationAddress, address proxyAdmin) {
        require(implementationAddress != address(0), "Invalid Address");
        require(proxyAdmin != address(0), "Invalid Address");
        IMPLEMENTATION_ADDRESS = implementationAddress;
        PROXY_ADMIN = proxyAdmin;
    }

    /**
     * @dev Updates the implementation address
     * @param implementationAddress The address of the new implementation
     */
    function updateImplementation(
        address implementationAddress
    ) public onlyOwner {
        IMPLEMENTATION_ADDRESS = implementationAddress;
    }

    /**
     * @dev Updates the proxy admin address
     * @param proxyAdmin The address of the new proxy admin
     */
    function updateProxyAdmin(address proxyAdmin) public onlyOwner {
        PROXY_ADMIN = proxyAdmin;
    }

    /// @dev Allows verified creation of multisignature wallet.
    /// @param owners List of initial owners.
    /// @param required Number of required confirmations.
    /// @return wallet Returns wallet address.
    function create(
        uint256 endowmentId,
        address emitterAddress,
        address[] memory owners,
        uint256 required
    ) public returns (address wallet) {
        bytes memory EndowmentData = abi.encodeWithSignature(
            "initialize(uint256,address,address[],uint256,bool)",
            endowmentId,
            emitterAddress,
            owners,
            required,
            false
        );
        wallet = address(
            new ProxyContract(
                IMPLEMENTATION_ADDRESS,
                PROXY_ADMIN,
                EndowmentData
            )
        );

        IEndowmentMultiSigEmitter(emitterAddress).createMultisig(
            wallet,
            endowmentId,
            emitterAddress,
            owners,
            required,
            false
        );
        register(wallet);
        // also store address of multisig in endowmentIdToMultisig
        endowmentIdToMultisig[endowmentId] = wallet;
    }
}
