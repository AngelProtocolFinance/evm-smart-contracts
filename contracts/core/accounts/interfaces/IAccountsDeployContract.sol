// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {SubDaoMessages} from "../../../normalized_endowment/subdao/message.sol";

interface IAccountsDeployContract {
  function createDaoContract(
    SubDaoMessages.InstantiateMsg memory createdaomessage
  ) external returns (address daoAddress);
}
