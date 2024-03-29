// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LibAccounts} from "../accounts/lib/LibAccounts.sol";
import {LocalRegistrarLib} from "./lib/LocalRegistrarLib.sol";

library RegistrarStorage {
  struct Config {
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

  struct State {
    bytes4[] STRATEGIES;
    mapping(address => address) PriceFeeds;
    Config config;
  }
}

contract Storage {
  RegistrarStorage.State state;
}
