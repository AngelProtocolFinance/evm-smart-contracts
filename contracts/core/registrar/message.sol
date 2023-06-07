// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../struct.sol";

library RegistrarMessages {
    struct InstantiateRequest {
        address treasury;
        // uint256 taxRate;
        // AngelCoreStruct.RebalanceDetails rebalance;
        AngelCoreStruct.SplitDetails splitToLiquid;
        // AngelCoreStruct.AcceptedTokens acceptedTokens;
        address router;
        address axelarGateway;
        address axelarGasRecv;
    }

    struct UpdateConfigRequest {
        address accountsContract;
        // uint256 taxRate;
        // AngelCoreStruct.RebalanceDetails rebalance;
        string[] approved_charities;
        uint256 splitMax;
        uint256 splitMin;
        uint256 splitDefault;
        uint256 collectorShare;
        // AngelCoreStruct.AcceptedTokens acceptedTokens;
        
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
        address uniswapSwapRouter;
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

    struct VaultAddRequest {
        // chainid of network
        uint256 network;
        string stratagyName;
        address inputDenom;
        address yieldToken;
        AngelCoreStruct.EndowmentType[] restrictedFrom;
        AngelCoreStruct.AccountType acctType;
        AngelCoreStruct.VaultType vaultType;
    }

    struct UpdateFeeRequest {
        AngelCoreStruct.FeeTypes feeType;
        address payout;
        uint256 rate;
    }

    struct ConfigResponse {
        uint256 version;
        address accountsContract;
        address treasury;
        // uint256 taxRate;
        // AngelCoreStruct.RebalanceDetails rebalance;
        address indexFund;
        // AngelCoreStruct.SplitDetails splitToLiquid;
        address haloToken;
        address govContract;
        address charitySharesContract;
        uint256 endowmentMultisigContract;
        // AngelCoreStruct.AcceptedTokens acceptedTokens;
        address applicationsReview;
        address uniswapSwapRouter;
    }
}
