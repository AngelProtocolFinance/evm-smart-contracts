// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {AccountStorage} from "../storage.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {Validator} from "../../validator.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {IAccountsEvents} from "../interfaces/IAccountsEvents.sol";
import {IAccountsSwapRouter} from "../interfaces/IAccountsSwapRouter.sol";
import {IVault} from "../../vault/interfaces/IVault.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

uint256 constant ACCEPTABLE_PRICE_DELAY = 300; // 5 minutes, in seconds

/**
 * @title AccountsSwapRouter
 * @dev This contract manages the swaps for endowments
 */
contract AccountsSwapRouter is ReentrancyGuardFacet, IAccountsEvents, IAccountsSwapRouter {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  /**
   * @notice This function swaps tokens for an endowment
   * @dev This function swaps tokens for an endowment
   * @param id The id of the endowment
   * @param accountType The type of the account
   * @param tokenIn The address of the token to be swapped
   * @param amountIn The amount of tokens to be swapped in
   * @param tokenOut The address of the token to be received out
   * @param slippage Maximum slippage tolerance allowed for output token amount (max is 100% or 10000)
   */

  function swapToken(
    uint32 id,
    IVault.VaultType accountType,
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 slippage
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    require(
      registrar_config.uniswapRouter != address(0),
      "Uniswap Router address is not set in Registrar"
    );
    require(
      registrar_config.uniswapFactory != address(0),
      "Uniswap Factory addresses is not set in Registrar"
    );
    require(amountIn > 0, "Invalid Swap Input: Zero Amount");
    require(tokenIn != address(0) && tokenOut != address(0), "Invalid Swap Input: Zero Address");
    require(tokenIn != tokenOut, "Invalid Swap Input: Same Token");
    require(
      slippage < LibAccounts.FEE_BASIS,
      "Invalid Swap Input: Token Out slippage set too high"
    );
    // Check that the desired output token from the swap is either:
    // A. In the protocol-level accepted tokens list in the Registrar Contract OR
    // B. In the endowment-level accepted tokens list
    require(
      IRegistrar(state.config.registrarContract).isTokenAccepted(tokenOut) ||
        state.AcceptedTokens[id][tokenOut],
      "Output token not in an Accepted Tokens List"
    );

    // check if the msg sender is either the owner or their delegate address and
    // that they have the power to manage the investments for an account balance
    if (accountType == IVault.VaultType.LOCKED) {
      require(
        Validator.canChange(
          state.ENDOWMENTS[id].settingsController.lockedInvestmentManagement,
          msg.sender,
          state.ENDOWMENTS[id].owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    } else if (accountType == IVault.VaultType.LIQUID) {
      require(
        Validator.canChange(
          state.ENDOWMENTS[id].settingsController.liquidInvestmentManagement,
          msg.sender,
          state.ENDOWMENTS[id].owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    } else {
      revert("Invalid AccountType");
    }

    if (accountType == IVault.VaultType.LOCKED) {
      require(
        state.STATES[id].balances.locked[tokenIn] >= amountIn,
        "Requested swap amount is greater than Endowment Locked balance"
      );
      state.STATES[id].balances.locked[tokenIn] -= amountIn;
    } else {
      require(
        state.STATES[id].balances.liquid[tokenIn] >= amountIn,
        "Requested swap amount is greater than Endowment Liquid balance"
      );
      state.STATES[id].balances.liquid[tokenIn] -= amountIn;
    }

    // Check that both in & out tokens have chainlink price feed contract set for them
    // this could be either at the Registrar or the Endowment level
    address priceFeedIn = IRegistrar(state.config.registrarContract).queryTokenPriceFeed(tokenIn);
    address priceFeedOut = IRegistrar(state.config.registrarContract).queryTokenPriceFeed(tokenOut);
    if (priceFeedIn == address(0)) {
      priceFeedIn = state.PriceFeeds[id][tokenIn];
    }
    if (priceFeedOut == address(0)) {
      priceFeedOut = state.PriceFeeds[id][tokenOut];
    }
    require(
      (priceFeedIn != address(0) && priceFeedOut != address(0)),
      "Chainlink Oracle Price Feed contracts are required for all tokens swapping to/from"
    );

    IERC20(tokenIn).safeApprove(address(registrar_config.uniswapRouter), amountIn);

    // Who ya gonna call? Swap Function!
    uint256 amountOut = swap(
      tokenIn,
      amountIn,
      priceFeedIn,
      tokenOut,
      priceFeedOut,
      slippage,
      registrar_config.uniswapRouter,
      registrar_config.uniswapFactory
    );

    // Allocate the newly swapped tokens to the correct endowment balance
    if (accountType == IVault.VaultType.LOCKED) {
      state.STATES[id].balances.locked[tokenOut] += amountOut;
    } else {
      state.STATES[id].balances.liquid[tokenOut] += amountOut;
    }

    emit TokenSwapped(id, accountType, tokenIn, amountIn, tokenOut, amountOut);
  }

  /*///////////////////////////////////////////////
                    INTERNAL FUNCTIONS
    */ ///////////////////////////////////////////////

  /**
   * @dev This function fetches the latest token price from a Price Feed from Chainlink Oracles.
   * @param tokenFeed address
   * @return answer Returns the oracle answer of current price as an int
   */
  function getLatestPriceData(address tokenFeed) internal view returns (uint256) {
    (
      uint80 roundId,
      int256 answer,
      ,
      uint256 updatedAt,
      uint80 answeredInRound
    ) = AggregatorV3Interface(tokenFeed).latestRoundData();
    require(
      answer > 0 &&
        answeredInRound >= roundId &&
        updatedAt >= (block.timestamp - ACCEPTABLE_PRICE_DELAY),
      "Invalid price feed answer"
    );
    return uint256(answer);
  }

  /**
   * @dev This function swaps the given amount of tokenA for tokenB and transfers it to the specified recipient address.
   * @param tokenIn address
   * @param amountIn uint256
   * @param priceFeedIn address
   * @param tokenOut address
   * @param priceFeedOut address
   * @param slippage uint256
   * @param uniswapRouter address
   * @param uniswapFactory address
   * @return amountOut Returns the amount of token received fom pool after swapping to specific address
   */
  function swap(
    address tokenIn,
    uint256 amountIn,
    address priceFeedIn,
    address tokenOut,
    address priceFeedOut,
    uint256 slippage,
    address uniswapRouter,
    address uniswapFactory
  ) internal returns (uint256 amountOut) {
    uint256 priceRatio = getLatestPriceData(priceFeedOut).mul(LibAccounts.BIG_NUMBA_BASIS).div(
      getLatestPriceData(priceFeedIn)
    );
    uint256 estAmountOut = amountIn.mul(priceRatio).div(LibAccounts.BIG_NUMBA_BASIS);
    uint256 minAmountOut = estAmountOut.sub(estAmountOut.mul(slippage).div(LibAccounts.FEE_BASIS));

    // find the lowest fee pool available, if any, to swap tokens
    IUniswapV3Factory factory = IUniswapV3Factory(uniswapFactory);
    uint24 poolFee;
    // UniSwap V3 Pools support fees of 0.05%(500 bps), 0.3%(3000 bps), or 1%(10000 bps)
    // 3000 is the default tier today, so we start with that to hopefully save some gas
    if (factory.getPool(tokenIn, tokenOut, 3000) != address(0)) {
      poolFee = 3000;
    } else if (factory.getPool(tokenIn, tokenOut, 500) != address(0)) {
      poolFee = 500;
    } else if (factory.getPool(tokenIn, tokenOut, 10000) != address(0)) {
      poolFee = 10000;
    }
    require(poolFee > 0, "No pool found to swap");

    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      fee: poolFee,
      recipient: address(this),
      deadline: block.timestamp,
      amountIn: amountIn,
      amountOutMinimum: minAmountOut,
      sqrtPriceLimitX96: 0 // ensures that we swap our exact input amount
    });
    // execute the swap on the router
    amountOut = ISwapRouter(uniswapRouter).exactInputSingle(params);

    require(amountOut >= minAmountOut, "Output funds less than the minimum output");
  }
}
