// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../struct.sol";

library RegistrarStorage {
    struct Config {
        address owner; // AP TEAM MULTISIG
        //Application review multisig
        address applicationsReview; // Endowment application review team's CW3 (set as owner to start). Owner can set and change/revoke.
        address indexFundContract;
        address accountsContract;
        address treasury;
        address subdaoGovCode; // subdao gov wasm code
        address subdaoCw20TokenCode; // subdao gov cw20 token wasm code
        address subdaoBondingTokenCode; // subdao gov bonding curve token wasm code
        address subdaoCw900Code; // subdao gov ve-CURVE contract for locked token voting
        address subdaoDistributorCode; // subdao gov fee distributor wasm code
        address subdaoEmitter;
        address donationMatchCode; // donation matching contract wasm code
        address donationMatchCharitesContract; // donation matching contract address for "Charities" endowments
        address donationMatchEmitter;
        AngelCoreStruct.SplitDetails splitToLiquid; // set of max, min, and default Split paramenters to check user defined split input against
        //TODO: pending check
        address haloToken; // TerraSwap HALO token addr
        address haloTokenLpContract;
        address govContract; // AP governance contract
        address collectorAddr; // Collector address for new fee
        uint256 collectorShare;
        address charitySharesContract;
        AngelCoreStruct.AcceptedTokens acceptedTokens; // list of approved native and CW20 coins can accept inward
        //PROTOCOL LEVEL
        address fundraisingContract;
        AngelCoreStruct.RebalanceDetails rebalance;
        address swapsRouter;
        address multisigFactory;
        address multisigEmitter;
        address charityProposal;
        address lockedWithdrawal;
        address proxyAdmin;
        address usdcAddress;
        address wethAddress;
        address cw900lvAddress;
    }

    struct State {
        Config config;
        mapping(string => AngelCoreStruct.YieldVault) VAULTS;
        string[] VAULT_POINTERS;
        mapping(uint256 => AngelCoreStruct.NetworkInfo) NETWORK_CONNECTIONS;
        mapping(string => uint256) FEES;
    }
}

contract Storage {
    RegistrarStorage.State state;
    bool initilized = false;
}
