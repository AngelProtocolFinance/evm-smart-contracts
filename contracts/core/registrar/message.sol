// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {IVault} from "../vault/interfaces/IVault.sol";

library RegistrarMessages {
  struct InstantiateRequest {
    address apTeamMultisig;
    address treasury;
    address router;
    address axelarGateway;
    address axelarGasService;
    string networkName;
    address refundAddr;
  }

  struct UpdateConfigRequest {
    address accountsContract;
    address apTeamMultisig;
    address treasury;
    address indexFundContract;
    address haloToken;
    address govContract;
    address fundraisingContract;
    address uniswapRouter;
    address uniswapFactory;
    address multisigFactory;
    address multisigEmitter;
    address charityApplications;
    address proxyAdmin;
    address usdcAddress;
    address wMaticAddress;
    address gasFwdFactory;
  }

  struct UpdateFeeRequest {
    LibAccounts.FeeTypes feeType;
    address payout;
    uint256 rate;
  }
}
