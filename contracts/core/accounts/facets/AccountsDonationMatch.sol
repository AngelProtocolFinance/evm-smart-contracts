// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AccountStorage} from "../storage.sol";
import {LibAccounts} from "../lib/LibAccounts.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {AccountMessages} from "../message.sol";
import {IDonationMatchEmitter} from "../../../normalized_endowment/donation-match/IDonationMatchEmitter.sol";
import {DonationMatchStorage} from "../../../normalized_endowment/donation-match/storage.sol";
import {DonationMatchMessages} from "../../../normalized_endowment/donation-match/message.sol";
import {ProxyContract} from "../../proxy.sol";
import {IAccountsDonationMatch} from "../interfaces/IAccountsDonationMatch.sol";

/**
 * @title AccountsDonationMatch
 * @dev This contract is used to manage donation match tokens
 */
contract AccountsDonationMatch is ReentrancyGuardFacet, IAccountsEvents, IAccountsDonationMatch {
  using SafeERC20 for IERC20;

  /**
   * @notice Deposit DAOToken(or Halo) to the endowment and store its balance
   * @dev Function manages reserve token sent by donation matching contract
   * @param id Endowment ID
   * @param token DAOToken or HALO address
   * @param amount Amount of DAOToken to deposit
   */
  function depositDonationMatchERC20(uint32 id, address token, uint256 amount) public {
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    require(
      (registrar_config.haloToken == token || tempEndowment.daoToken == token),
      "Invalid Token"
    );

    IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

    state.DAOTOKENBALANCE[id] += amount;
    emit DonationDeposited(id, token, amount);
  }

  /**
   * @notice Withdraw DAOToken(or Halo) from the endowment
   * @dev Function manages reserve token sent by donation matching contract
   * @param id Endowment ID
   * @param recipient Recipient address
   * @param amount Amount of DAOToken to withdraw
   */
  function withdrawDonationMatchERC20(uint32 id, address recipient, uint256 amount) public {
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

    require(amount > 0, "amount should be grater than 0");

    require(msg.sender == tempEndowment.owner, "UnAuthorized");

    require(state.DAOTOKENBALANCE[id] >= amount, "Insufficient amount");

    state.DAOTOKENBALANCE[id] -= amount;

    IERC20(tempEndowment.daoToken).safeTransfer(recipient, amount);
    emit DonationWithdrawn(id, recipient, tempEndowment.daoToken, amount);
  }

  /**
   * @notice This function creates a donation match contract for an endowment
   * @dev creates a donation match contract for an endowment based on parameters (performs donation matching for contract against USDC)
   * @param id The id of the endowment
   * @param details The details of the donation match contract
   */
  function setupDonationMatch(
    uint32 id,
    AccountMessages.DonationMatch memory details
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();

    AccountStorage.Endowment memory tempEndowment = state.ENDOWMENTS[id];
    // AccountStorage.Config memory tempConfig = state.config;

    require(msg.sender == tempEndowment.owner, "Unauthorized");

    require(tempEndowment.owner != address(0), "AD E02"); //A DAO does not exist yet for this Endowment. Please set that up first.
    require(tempEndowment.donationMatchContract == address(0), "AD E03"); // A Donation Match contract already exists for this Endowment

    require(details.data.uniswapFactory != address(0), "Invalid Data");
    require(details.data.poolFee != 0, "Invalid Data");

    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    require(registrar_config.donationMatchContract != address(0), "AD E04"); // No implementation for donation matching contract
    require(registrar_config.usdcAddress != address(0), "AD E05"); // Invalid Registrar Data

    address inputtoken;
    if (details.enumData == AccountMessages.DonationMatchEnum.HaloTokenReserve) {
      require(registrar_config.haloToken != address(0), "AD E05"); // Invalid Registrar Data

      inputtoken = registrar_config.haloToken;
    } else {
      require(details.data.reserveToken != address(0), "Invalid  Data");
      inputtoken = details.data.reserveToken;
    }

    DonationMatchMessages.InstantiateMessage memory _inputParam = DonationMatchMessages
      .InstantiateMessage({
        reserveToken: inputtoken,
        uniswapFactory: details.data.uniswapFactory,
        registrarContract: state.config.registrarContract,
        poolFee: details.data.poolFee,
        usdcAddress: registrar_config.usdcAddress
      });

    bytes memory data = abi.encodeWithSignature(
      "initialize((address,address,address,uint24,address),address)",
      _inputParam,
      registrar_config.donationMatchEmitter
    );

    address donationMatch = address(
      new ProxyContract(registrar_config.donationMatchContract, registrar_config.proxyAdmin, data)
    );
    // TODO: add donation match address?? :
    state.ENDOWMENTS[id].donationMatchContract = donationMatch;

    IDonationMatchEmitter(registrar_config.donationMatchEmitter).initializeDonationMatch(
      id,
      donationMatch,
      DonationMatchStorage.Config({
        reserveToken: inputtoken,
        uniswapFactory: details.data.uniswapFactory,
        registrarContract: state.config.registrarContract,
        poolFee: details.data.poolFee,
        usdcAddress: registrar_config.usdcAddress
      })
    );
    emit DonationMatchCreated(id, state.ENDOWMENTS[id].donationMatchContract);
  }
}
