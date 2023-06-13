// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import {subDaoMessage} from "./../../../normalized_endowment/subdao/subdao.sol";

interface IAccountsDeployContract {
  function createDaoContract(
    subDaoMessage.InstantiateMsg memory createdaomessage
  ) external returns (address daoAddress);
}
