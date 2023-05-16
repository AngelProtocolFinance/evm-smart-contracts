// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {RegistrarStorage} from "../storage.sol";
import {RegistrarMessages} from "../message.sol";
import {AngelCoreStruct} from "../../struct.sol";

library RegistrarEventsLib {
    event UpdateRegistrarConfig(RegistrarStorage.Config details);
    event UpdateRegistrarOwner(address newOwner);
    event UpdateRegistrarFees(RegistrarMessages.UpdateFeeRequest details);
    event AddVault(string strategyName, AngelCoreStruct.YieldVault vault);
    event RemoveVault(string strategyName);
    event UpdateVault(
        string strategyName,
        bool approved,
        AngelCoreStruct.EndowmentType[] endowmentTypes
    );
    event PostNetworkConnection(
        uint256 chainId,
        AngelCoreStruct.NetworkInfo networkInfo
    );
    event DeleteNetworkConnection(uint256 chainId);
}
