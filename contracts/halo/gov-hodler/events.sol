// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {GovHodlerStorage} from "./storage.sol";

library GovHodlerEvents {
    event updateConfig(GovHodlerStorage.Config config);
    event claimHalo(address recipient, uint amount);
}
