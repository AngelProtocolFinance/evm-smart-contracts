// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {IVault} from "../vault/interfaces/IVault.sol";

library RegistrarMessages {
  struct InstantiateRequest {
    address treasury;
    // uint256 taxRate;
    // LibAccounts.RebalanceDetails rebalance;
    LibAccounts.SplitDetails splitToLiquid;
    // LibAccounts.AcceptedTokens acceptedTokens;
    address router;
    address axelarGateway;
    address axelarGasRecv;
  }

  struct UpdateConfigRequest {
    address accountsContract;
    // uint256 taxRate;
    // LibAccounts.RebalanceDetails rebalance;
    string[] approved_charities;
    uint256 splitMax;
    uint256 splitMin;
    uint256 splitDefault;
    uint256 collectorShare;
    // LibAccounts.AcceptedTokens acceptedTokens;

    // CONTRACT ADDRESSES
    address indexFundContract;
    address govContract;
    address treasury;
    address donationMatchCharitesContract;
    address donationMatchEmitter;
    address haloToken;
    address haloTokenLpContract;
    address charitySharesContract;
    address fundraisingContract;
    address applicationsReview;
    address uniswapRouter;
    address uniswapFactory;
    address multisigFactory;
    address multisigEmitter;
    address charityProposal;
    address lockedWithdrawal;
    address proxyAdmin;
    address usdcAddress;
    address wMaticAddress;
    address subdaoGovContract;
    address subdaoTokenContract;
    address subdaoBondingTokenContract;
    address subdaoCw900Contract;
    address subdaoDistributorContract;
    address subdaoEmitter;
    address donationMatchContract;
    address cw900lvAddress;
  }

  struct UpdateFeeRequest {
    LibAccounts.FeeTypes feeType;
    address payout;
    uint256 rate;
  }

  struct ConfigResponse {
    uint256 version;
    address accountsContract;
    address treasury;
    // uint256 taxRate;
    // LibAccounts.RebalanceDetails rebalance;
    address indexFund;
    // LibAccounts.SplitDetails splitToLiquid;
    address haloToken;
    address govContract;
    address charitySharesContract;
    uint256 endowmentMultisigContract;
    // LibAccounts.AcceptedTokens acceptedTokens;
    address applicationsReview;
    address uniswapRouter;
    address uniswapFactory;
  }
}
