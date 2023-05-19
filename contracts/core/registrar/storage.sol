// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AngelCoreStruct} from "../struct.sol";

library RegistrarStorage {
    struct Config {
        //Application review multisig
        address applicationsReview; // Endowment application review team's multisig (set as owner to start). Owner can set and change/revoke.
        address indexFundContract;
        address accountsContract;
        address treasury;
        address subdaoGovContract; // subdao gov wasm code
        address subdaoCw20TokenContract; // subdao gov cw20 token wasm code
        address subdaoBondingTokenContract; // subdao gov bonding ve token wasm code
        address subdaoCw900Contract; // subdao gov ve-vE contract for locked token voting
        address subdaoDistributorContract; // subdao gov fee distributor wasm code
        address subdaoEmitter;
        address donationMatchContract; // donation matching contract wasm code
        address donationMatchCharitesContract; // donation matching contract address for "Charities" endowments
        address donationMatchEmitter;
        AngelCoreStruct.SplitDetails splitToLiquid; // set of max, min, and default Split paramenters to check user defined split input against
        //TODO: pending check
        address haloToken; // TerraSwap HALO token addr
        address haloTokenLpContract;
        address govContract; // AP governance contract
        uint256 collectorShare;
        address charitySharesContract;
        // AngelCoreStruct.AcceptedTokens acceptedTokens; // list of approved native and CW20 coins can accept inward
        //PROTOCOL LEVEL
        address fundraisingContract;
        // AngelCoreStruct.RebalanceDetails rebalance;
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
        bytes4[] STRATEGIES;
        mapping(string => uint256) FEES;
        mapping(uint256 => AngelCoreStruct.NetworkInfo) NETWORK_CONNECTIONS;
    }
}

contract Storage {
    RegistrarStorage.State state;
}
