// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {RegistrarStorage} from "../storage.sol";
import {RegistrarMessages} from "../message.sol";
import {AngelCoreStruct} from "../../struct.sol";

library RegistrarEventsLib {
    event UpdateRegistrarConfig(RegistrarStorage.Config details);
    event UpdateRegistrarOwner(address newOwner);
    event UpdateRegistrarFees(RegistrarMessages.UpdateFeeRequest details);
    event PostNetworkConnection(
        uint256 chainId,
        AngelCoreStruct.NetworkInfo networkInfo
    );
    event DeleteNetworkConnection(uint256 chainId);
}
