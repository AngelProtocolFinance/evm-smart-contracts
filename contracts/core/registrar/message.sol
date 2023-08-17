// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {IVault} from "../vault/interfaces/IVault.sol";

library RegistrarMessages {
  struct InstantiateRequest {
    address apTeamMultisig;
    address treasury;
    LibAccounts.SplitDetails splitToLiquid;
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
    address subdaoGovContract;
    address subdaoTokenContract;
    address subdaoBondingTokenContract;
    address subdaoCw900Contract;
    address subdaoDistributorContract;
    address subdaoEmitter;
    address donationMatchContract;
    address donationMatchCharitesContract;
    address donationMatchEmitter;
    uint256 splitMax;
    uint256 splitMin;
    uint256 splitDefault;
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
    address cw900lvAddress;
    address gasFwdFactory;
  }

  struct UpdateFeeRequest {
    LibAccounts.FeeTypes feeType;
    address payout;
    uint256 rate;
  }
}
