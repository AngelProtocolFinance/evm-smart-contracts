// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {LocalRegistrarLib} from "./lib/LocalRegistrarLib.sol";

library RegistrarStorage {
  struct Config {
    address indexFundContract;
    address accountsContract;
    address treasury;
    address subdaoGovContract;
    address subdaoTokenContract;
    address subdaoBondingTokenContract;
    address subdaoCw900Contract;
    address subdaoDistributorContract;
    address subdaoEmitter;
    address donationMatchContract;
    address donationMatchCharitesContract;
    address donationMatchEmitter;
    LibAccounts.SplitDetails splitToLiquid; // set of max, min, and default Split paramenters to check user defined split input against
    address haloToken;
    address govContract;
    //PROTOCOL LEVEL
    address fundraisingContract;
    address uniswapRouter;
    address uniswapFactory;
    address multisigFactory;
    address multisigEmitter;
    address charityApplications;
    address lockedWithdrawal;
    address proxyAdmin;
    address usdcAddress;
    address wMaticAddress;
    address cw900lvAddress;
    address gasFwdFactory;
  }

  struct State {
    bytes4[] STRATEGIES;
    mapping(LibAccounts.FeeTypes => LibAccounts.FeeSetting) FeeSettingsByFeeType;
    mapping(string => LocalRegistrarLib.NetworkInfo) NETWORK_CONNECTIONS;
    mapping(address => address) PriceFeeds;
    Config config;
  }
}

contract Storage {
  RegistrarStorage.State state;
}
