// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";

contract DummyGateway is IAxelarGateway {
    
    /********************\
    |* Public Functions *|
    \********************/

    address tokenAddress;

    function setTestTokenAddress(address _addr) external {
        tokenAddress = _addr;
    }

    function sendToken(
        string calldata destinationChain,
        string calldata destinationAddress,
        string calldata symbol,
        uint256 amount
    ) external {

    }

    function callContract(
        string calldata destinationChain,
        string calldata contractAddress,
        bytes calldata payload
    ) external {

    }

    function callContractWithToken(
        string calldata destinationChain,
        string calldata contractAddress,
        bytes calldata payload,
        string calldata symbol,
        uint256 amount
    ) external{

    }

    function isContractCallApproved(
        bytes32 commandId,
        string calldata sourceChain,
        string calldata sourceAddress,
        address contractAddress,
        bytes32 payloadHash
    ) external view returns (bool){
        return _testParser(commandId);
    }

    function isContractCallAndMintApproved(
        bytes32 commandId,
        string calldata sourceChain,
        string calldata sourceAddress,
        address contractAddress,
        bytes32 payloadHash,
        string calldata symbol,
        uint256 amount
    ) external view returns (bool){
        return _testParser(commandId);
    }

    function validateContractCall(
        bytes32 commandId,
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes32 payloadHash
    ) external returns (bool){
        return _testParser(commandId);
    }

    function validateContractCallAndMint(
        bytes32 commandId,
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes32 payloadHash,
        string calldata symbol,
        uint256 amount
    ) external returns (bool){
        return _testParser(commandId);
    }

    /***********\
    |* Getters *|
    \***********/

    function authModule() external view returns (address){}

    function tokenDeployer() external view returns (address) {}

    function tokenMintLimit(string memory symbol) external view returns (uint256) {}

    function tokenMintAmount(string memory symbol) external view returns (uint256) {}

    function allTokensFrozen() external view returns (bool) {}

    function implementation() external view returns (address) {}

    function tokenAddresses(string memory symbol) external view returns (address) {
        if(keccak256(abi.encodePacked(symbol)) == keccak256(abi.encodePacked("TKN"))){
            return tokenAddress;
        }
    }

    function tokenFrozen(string memory symbol) external view returns (bool) {}

    function isCommandExecuted(bytes32 commandId) external view returns (bool) {}

    function adminEpoch() external view returns (uint256) {}

    function adminThreshold(uint256 epoch) external view returns (uint256) {}

    function admins(uint256 epoch) external view returns (address[] memory) {}

    /*******************\
    |* Admin Functions *|
    \*******************/

    function setTokenMintLimits(string[] calldata symbols, uint256[] calldata limits) external {}

    function upgrade(
        address newImplementation,
        bytes32 newImplementationCodeHash,
        bytes calldata setupParams
    ) external {}

    /**********************\
    |* External Functions *|
    \**********************/

    function setup(bytes calldata params) external {}

    function execute(bytes calldata input) external {}

    function _testParser(bytes32 commandId) internal pure returns (bool) {
        if (commandId == bytes32("true")) {
            return true;
        }
        else {
            return false;
        }
    }  
}