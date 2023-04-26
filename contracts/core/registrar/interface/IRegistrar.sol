// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.16;
// import {RegistrarStorage} from "../storage.sol";
// import {RegistrarMessages} from "../message.sol";
// import {AngelCoreStruct} from "../../struct.sol";

// interface IRegistrar {
//     function queryConfig()
//         external
//         view
//         returns (RegistrarStorage.Config memory);

//     function queryNetworkConnection(
//         uint256 chainId
//     ) external view returns (AngelCoreStruct.NetworkInfo memory);

//     function queryVaultDetails(
//         address vaultAddr
//     ) external view returns (AngelCoreStruct.YieldVault memory);

//     function queryVaultList(
//         uint256 network,
//         AngelCoreStruct.EndowmentType endowmentType,
//         AngelCoreStruct.AccountType accountType,
//         AngelCoreStruct.VaultType vaultType,
//         AngelCoreStruct.BoolOptional approved,
//         uint256 startAfter,
//         uint256 limit
//     ) external view returns (AngelCoreStruct.YieldVault[] memory);

//     function updateConfig(
//         RegistrarMessages.UpdateConfigRequest memory curDetails
//     ) external returns (bool);

//     function updateNetworkConnections(
//         AngelCoreStruct.NetworkInfo memory networkInfo,
//         string memory action
//     ) external returns (bool);

//     function updateOwner(address newOwner) external returns (bool);

//     function vaultAdd(
//         RegistrarMessages.VaultAddRequest memory curDetails
//     ) external returns (bool);

//     function vaultRemove(address vaultAddr) external returns (bool);

//     function vaultUpdate(
//         address vaultAddr,
//         bool approved,
//         AngelCoreStruct.EndowmentType[] memory restrictedFrom
//     ) external returns (bool);

//     function queryFee(string memory name) external returns (uint256);

//     function testQuery() external view returns (address[] memory);

//     function testQueryStruct()
//         external
//         view
//         returns (AngelCoreStruct.YieldVault[] memory);

//     function queryVaultListBg(
//         uint256 network,
//         AngelCoreStruct.EndowmentType endowmentType,
//         AngelCoreStruct.AccountType accountType,
//         AngelCoreStruct.VaultType vaultType,
//         AngelCoreStruct.BoolOptional approved,
//         uint256 startAfter,
//         uint256 limit
//     ) external view returns (AngelCoreStruct.YieldVault[] memory);
// }

pragma solidity ^0.8.16;
import {RegistrarStorage} from "../storage.sol";
import {RegistrarMessages} from "../message.sol";
import {AngelCoreStruct} from "../../struct.sol";

interface IRegistrar {
    function updateConfig(
        RegistrarMessages.UpdateConfigRequest memory curDetails
    ) external;

    function updateOwner(address newOwner) external;

    function updateFees(
        RegistrarMessages.UpdateFeeRequest memory curDetails
    ) external;

    function vaultAdd(
        RegistrarMessages.VaultAddRequest memory curDetails
    ) external;

    function vaultRemove(string memory _stratagyName) external;

    function vaultUpdate(
        string memory _stratagyName,
        bool curApproved,
        AngelCoreStruct.EndowmentType[] memory curRestrictedfrom
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

    function testQueryStruct()
        external
        view
        returns (AngelCoreStruct.YieldVault[] memory);

    function queryVaultListDep(
        uint256 network,
        AngelCoreStruct.EndowmentType endowmentType,
        AngelCoreStruct.AccountType accountType,
        AngelCoreStruct.VaultType vaultType,
        AngelCoreStruct.BoolOptional approved,
        uint256 startAfter,
        uint256 limit
    ) external view returns (AngelCoreStruct.YieldVault[] memory);

    function queryVaultList(
        uint256 network,
        AngelCoreStruct.EndowmentType endowmentType,
        AngelCoreStruct.AccountType accountType,
        AngelCoreStruct.VaultType vaultType,
        AngelCoreStruct.BoolOptional approved,
        uint256 startAfter,
        uint256 limit
    ) external view returns (AngelCoreStruct.YieldVault[] memory);

    function queryVaultDetails(
        string memory _stratagyName
    ) external view returns (AngelCoreStruct.YieldVault memory response);

    function queryNetworkConnection(
        uint256 chainId
    ) external view returns (AngelCoreStruct.NetworkInfo memory response);

    function queryFee(
        string memory name
    ) external view returns (uint256 response);
}
