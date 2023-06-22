// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// libraries
import {subDaoMessage} from "../../../normalized_endowment/subdao/subdao.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {AccountStorage} from "../storage.sol";

// interfaces
import {IAccountsAllowance} from "./IAccountsAllowance.sol";
import {IAccountsCreateEndowment} from "./IAccountsCreateEndowment.sol";
import {IAccountsDaoEndowments} from "./IAccountsDaoEndowments.sol";
import {IAccountsDeployContract} from "./IAccountsDeployContract.sol";
import {IAccountsDepositWithdrawEndowments} from "./IAccountsDepositWithdrawEndowments.sol";
import {IAccountsDonationMatch} from "./IAccountsDonationMatch.sol";
import {IAccountsEvents} from "./IAccountsEvents.sol";
import {IAccountsQueryEndowments} from "./IAccountsQueryEndowments.sol";
import {IAccountsSwapRouter} from "./IAccountsSwapRouter.sol";
import {IAccountsUpdate} from "./IAccountsUpdate.sol";
import {IAccountsUpdateEndowments} from "./IAccountsUpdateEndowments.sol";
import {IAccountsUpdateEndowmentSettingsController} from "./IAccountsUpdateEndowmentSettingsController.sol";
import {IAccountsUpdateStatusEndowments} from "./IAccountsUpdateStatusEndowments.sol";
import {IAccountsVaultFacet} from "./IAccountsVaultFacet.sol";

interface IAccounts is
  IAccountsAllowance,
  IAccountsCreateEndowment,
  IAccountsDaoEndowments,
  IAccountsDeployContract,
  IAccountsDepositWithdrawEndowments,
  IAccountsDonationMatch,
  IAccountsEvents,
  IAccountsQueryEndowments,
  IAccountsSwapRouter,
  IAccountsUpdate,
  IAccountsUpdateEndowments,
  IAccountsUpdateEndowmentSettingsController,
  IAccountsUpdateStatusEndowments,
  IAccountsVaultFacet
{}
