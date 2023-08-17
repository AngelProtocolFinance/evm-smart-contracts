// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./storage.sol";
import {DonationMatchMessages} from "./message.sol";
import {IDonationMatching} from "./IDonationMatching.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {IRegistrar} from "../../core/registrar/interfaces/IRegistrar.sol";
import {AccountStorage} from "../../core/accounts/storage.sol";
import {AccountMessages} from "../../core/accounts/message.sol";
import {IAccounts} from "../../core/accounts/interfaces/IAccounts.sol";
import {LibAccounts} from "../../core/accounts/lib/LibAccounts.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolState.sol";
import {IAccountsDonationMatch} from "../../core/accounts/interfaces/IAccountsDonationMatch.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ISubDaoToken} from "../../normalized_endowment/subdao-token/ISubDaoToken.sol";

interface IERC20Burnable is IERC20 {
  function burn(uint256 amount) external;
}

contract DonationMatchCharity is IDonationMatching, Storage, Initializable, ReentrancyGuard {
  event DonationMatchCharityInitialized(address donationMatch);
  event Approval(uint32 endowmentId, address tokenAddress, address spender, uint256 amount);
  event Transfer(uint32 endowmentId, address tokenAddress, address recipient, uint256 amount);
  event Burn(uint32 endowmentId, address tokenAddress, uint256 amount);
  event DonationMatchExecuted(
    address donationMatch,
    address tokenAddress,
    uint256 amount,
    address accountsContract,
    uint32 endowmentId,
    address donor
  );

  using SafeERC20 for IERC20Burnable;

  function initialize(DonationMatchMessages.InstantiateMessage memory details) public initializer {
    require(details.reserveToken != address(0), "Invalid Address");
    state.config.reserveToken = details.reserveToken;

    require(details.uniswapFactory != address(0), "Invalid Address");
    state.config.uniswapFactory = details.uniswapFactory;

    require(details.registrarContract != address(0), "Invalid Address");
    state.config.registrarContract = details.registrarContract;

    require(details.poolFee > 0, "Invalid Fee");
    state.config.poolFee = details.poolFee;

    require(details.usdcAddress != address(0), "Invalid Address");
    state.config.usdcAddress = details.usdcAddress;

    emit DonationMatchCharityInitialized(address(this));
  }

  function executeDonorMatch(
    uint32 endowmentId,
    uint256 amount,
    address donor,
    address token
  ) public nonReentrant {
    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    require(registrar_config.accountsContract != address(0), "Accounts Not Configured");

    require(registrar_config.accountsContract == msg.sender, "Unauthorized");

    AccountMessages.EndowmentResponse memory endow_detail = IAccounts(
      registrar_config.accountsContract
    ).queryEndowmentDetails(endowmentId);

    if (endow_detail.endowType == LibAccounts.EndowmentType.Charity) {
      require(address(this) == registrar_config.donationMatchCharitesContract, "Unauthorized");
    } else if (endow_detail.endowType == LibAccounts.EndowmentType.Ast) {
      require(address(this) == endow_detail.donationMatchContract, "Unauthorized");
    }

    // amount donated and the amount supplied to this contract (transferFrom from the sender)
    // TODO: Check if this transfer is required
    // bool sent = IERC20(state.config.usdcAddress).transferFrom(
    //     msg.sender,
    //     address(this),
    //     amount
    // );
    // require(sent, "Token transfer failed");

    // determine how much halo/reserve token is equivivalent to usdc donated
    uint256 reserveTokenAmount = queryUniswapPrice(
      state.config.usdcAddress,
      amount,
      state.config.reserveToken
    );

    // handle decimals for reserve token
    // reserveTokenAmount =
    //     (reserveTokenAmount *
    //         10**IERC20Metadata(state.config.reserveToken).decimals()) /
    //     (10**IERC20Metadata(state.config.usdcAddress).decimals());

    uint256 reserveBal = IERC20Burnable(state.config.reserveToken).balanceOf(address(this));

    require(reserveBal >= reserveTokenAmount, "Insufficient Reserve Token");

    // give allowance to dao token contract

    IERC20Burnable(token).safeApprove(state.config.reserveToken, reserveTokenAmount);

    emit Approval(endowmentId, token, state.config.reserveToken, reserveTokenAmount);

    if (token == state.config.reserveToken) {
      uint256 donorAmount = (reserveTokenAmount * 40) / (100);
      uint256 endowmentAmount = (reserveTokenAmount * 40) / (100);

      //NO need to do anything autometically it is counted as burned
      uint256 burnAmount = reserveTokenAmount - (donorAmount + endowmentAmount);

      IERC20Burnable(token).transfer(donor, donorAmount);

      emit Transfer(endowmentId, token, donor, donorAmount);

      IERC20Burnable(token).safeApprove(registrar_config.accountsContract, endowmentAmount);

      IAccountsDonationMatch(registrar_config.accountsContract).depositDonationMatchERC20(
        endowmentId,
        token,
        endowmentAmount
      );

      emit Transfer(endowmentId, token, registrar_config.accountsContract, endowmentAmount);

      IERC20Burnable(token).burn(burnAmount);
      emit Burn(endowmentId, token, burnAmount);
    } else {
      // approve reserve rency to dao token contract [GIvE approval]

      IERC20Burnable(state.config.reserveToken).safeApprove(token, reserveTokenAmount);

      // call execute donor match on dao token contract
      ISubDaoToken(token).executeDonorMatch(
        reserveTokenAmount,
        registrar_config.accountsContract,
        endowmentId,
        donor
      );
      emit DonationMatchExecuted(
        address(this),
        token,
        reserveTokenAmount,
        registrar_config.accountsContract,
        endowmentId,
        donor
      );
    }
  }

  function queryConfig() public view returns (DonationMatchStorage.Config memory) {
    return state.config;
  }

  function queryUniswapPrice(
    address tokenin,
    uint256 amountin,
    address tokenout
  ) internal view returns (uint256) {
    if (tokenin == tokenout) {
      return amountin;
    }
    address pool = IUniswapV3Factory(state.config.uniswapFactory).getPool(
      tokenin,
      tokenout,
      state.config.poolFee
    );
    if (pool == address(0)) {
      return 0;
    }

    (uint160 sqrtPriceX96, , , , , , ) = IUniswapV3PoolState(pool).slot0();

    if (tokenin < tokenout) {
      return (((amountin * sqrtPriceX96) / 2 ** 96) * sqrtPriceX96) / 2 ** 96;
    } else {
      return (((amountin * 2 ** 96) / sqrtPriceX96) * 2 ** 96) / sqrtPriceX96;
    }
  }
}
