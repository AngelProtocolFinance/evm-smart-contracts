// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;
import {RegistrarStorage} from "../storage.sol";
import {RegistrarMessages} from "../message.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {ILocalRegistrar} from "./ILocalRegistrar.sol";

interface IRegistrar is ILocalRegistrar {
    function updateConfig(
        RegistrarMessages.UpdateConfigRequest memory details
    ) external;

    function updateOwner(address newOwner) external;

    function updateFees(
        RegistrarMessages.UpdateFeeRequest memory details
    ) external;

    function vaultAdd(
        RegistrarMessages.VaultAddRequest memory details
    ) external;

    function vaultRemove(string memory _stratagyName) external;

    function vaultUpdate(
        string memory _stratagyName,
        bool approved,
        AngelCoreStruct.EndowmentType[] memory restrictedfrom
    ) external;

    function updateNetworkConnections(
        AngelCoreStruct.NetworkInfo memory networkInfo,
        string memory action
    ) external;

    // Query functions for contract

    function queryConfig()
        external
        view
        returns (RegistrarStorage.Config memory);

    function testQuery() external view returns (string[] memory);
    
    function queryAllStrategies() view external returns (bytes4[] memory allStrategies);

    // function testQueryStruct()
    //     external
    //     view
    //     returns (AngelCoreStruct.YieldVault[] memory);

    // function queryVaultListDep(
    //     uint256 network,
    //     AngelCoreStruct.EndowmentType endowmentType,
    //     AngelCoreStruct.AccountType accountType,
    //     AngelCoreStruct.VaultType vaultType,
    //     AngelCoreStruct.BoolOptional approved,
    //     uint256 startAfter,
    //     uint256 limit
    // ) external view returns (AngelCoreStruct.YieldVault[] memory);

    // function queryVaultList(
    //     uint256 network,
    //     AngelCoreStruct.EndowmentType endowmentType,
    //     AngelCoreStruct.AccountType accountType,
    //     AngelCoreStruct.VaultType vaultType,
    //     AngelCoreStruct.BoolOptional approved,
    //     uint256 startAfter,
    //     uint256 limit
    // ) external view returns (AngelCoreStruct.YieldVault[] memory);

    // function queryVaultDetails(
    //     string memory _stratagyName
    // ) external view returns (AngelCoreStruct.YieldVault memory response);

    function queryNetworkConnection(
        uint256 chainId
    ) external view returns (AngelCoreStruct.NetworkInfo memory response);

    function queryFee(
        string memory name
    ) external view returns (uint256 response);

    function owner() external view returns (address);
}
