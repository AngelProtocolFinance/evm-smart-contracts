// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// interfaces
import {IAccountsAllowance} from "./IAccountsAllowance.sol";
import {IAccountsCreateEndowment} from "./IAccountsCreateEndowment.sol";
import {IAccountsDepositWithdrawEndowments} from "./IAccountsDepositWithdrawEndowments.sol";
import {IAccountsEvents} from "./IAccountsEvents.sol";
import {IAccountsGasManager} from "./IAccountsGasManager.sol";
import {IAccountsQueryEndowments} from "./IAccountsQueryEndowments.sol";
import {IAccountsSwapRouter} from "./IAccountsSwapRouter.sol";
import {IAccountsUpdate} from "./IAccountsUpdate.sol";
import {IAccountsUpdateEndowments} from "./IAccountsUpdateEndowments.sol";
import {IAccountsUpdateEndowmentSettingsController} from "./IAccountsUpdateEndowmentSettingsController.sol";
import {IAccountsUpdateStatusEndowments} from "./IAccountsUpdateStatusEndowments.sol";
import {IAccountsStrategy} from "./IAccountsStrategy.sol";

interface IAccounts is
  IAccountsAllowance,
  IAccountsCreateEndowment,
  IAccountsDepositWithdrawEndowments,
  IAccountsEvents,
  IAccountsGasManager,
  IAccountsQueryEndowments,
  IAccountsSwapRouter,
  IAccountsUpdate,
  IAccountsUpdateEndowments,
  IAccountsUpdateEndowmentSettingsController,
  IAccountsUpdateStatusEndowments,
  IAccountsStrategy
{}
