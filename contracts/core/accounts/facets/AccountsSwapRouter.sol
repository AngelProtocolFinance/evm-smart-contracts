// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {LibAccounts} from "../lib/LibAccounts.sol";
import {Validator} from "../lib/validator.sol";
import {AccountStorage} from "../storage.sol";
import {AccountMessages} from "../message.sol";
import {RegistrarStorage} from "../../registrar/storage.sol";
import {AngelCoreStruct} from "../../struct.sol";
import {IRegistrar} from "../../registrar/interfaces/IRegistrar.sol";
import {ReentrancyGuardFacet} from "./ReentrancyGuardFacet.sol";
import {AccountsEvents} from "./AccountsEvents.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
 * @title AccountsSwapEndowments
 * @dev This contract manages the swaps for endowments
 */
contract AccountsSwapRouter is ReentrancyGuardFacet, AccountsEvents {
  using SafeMath for uint256;
  uint24 public constant poolFee = 3000; // constant pool fee of 0.3%

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
    AngelCoreStruct.AccountType accountType,
    address tokenIn,
    uint256 amountIn,
    address tokenOut,
    uint256 slippage
  ) public nonReentrant {
    AccountStorage.State storage state = LibAccounts.diamondStorage();
    AccountStorage.Endowment storage tempEndowment = state.ENDOWMENTS[id];

    RegistrarStorage.Config memory registrar_config = IRegistrar(state.config.registrarContract)
      .queryConfig();

    require(
      registrar_config.uniswapSwapRouter != address(0),
      "Uniswap Swap Router address is not set in Registrar"
    );
    require(amountIn > 0, "Invalid Swap Input: Zero Amount");
    require(tokenIn != address(0) && tokenOut != address(0), "Invalid Swap Input: Zero Address");
    require(
      slippage < AngelCoreStruct.FEE_BASIS,
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
    if (accountType == AngelCoreStruct.AccountType.Locked) {
      require(
        AngelCoreStruct.canChange(
          state.ENDOWMENTS[id].settingsController.lockedInvestmentManagement,
          msg.sender,
          state.ENDOWMENTS[id].owner,
          block.timestamp
        ),
        "Unauthorized"
      );
    } else if (accountType == AngelCoreStruct.AccountType.Locked) {
      require(
        AngelCoreStruct.canChange(
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

    if (accountType == AngelCoreStruct.AccountType.Locked) {
      require(
        state.STATES[id].balances.locked.balancesByToken[tokenIn] >= amountIn,
        "Requested swap amount is greater than Endowment Locked balance"
      );
      state.STATES[id].balances.locked.balancesByToken[tokenIn] = AngelCoreStruct.deductTokens(
        state.STATES[id].balances.locked.balancesByToken[tokenIn],
        amountIn
      );
    } else {
      require(
        state.STATES[id].balances.liquid.balancesByToken[tokenIn] >= amountIn,
        "Requested swap amount is greater than Endowment Liquid balance"
      );
      state.STATES[id].balances.liquid.balancesByToken[tokenIn] = AngelCoreStruct.deductTokens(
        state.STATES[id].balances.liquid.balancesByToken[tokenIn],
        amountIn
      );
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
      "Chinlink Oracle Price Feed contracts are required for all tokens swapping to/from"
    );

    require(
      IERC20(tokenIn).approve(address(registrar_config.uniswapSwapRouter), amountIn),
      "Approval failed"
    );

    // Who ya gonna call? Swap Function!
    uint256 amountOut = swap(
      tokenIn,
      amountIn,
      priceFeedIn,
      tokenOut,
      priceFeedOut,
      slippage,
      registrar_config.uniswapSwapRouter
    );

    // Allocate the newly swapped tokens to the correct endowment balance
    if (accountType == AngelCoreStruct.AccountType.Locked) {
      AngelCoreStruct.addToken(state.STATES[id].balances.locked, tokenOut, amountOut);
    } else {
      AngelCoreStruct.addToken(state.STATES[id].balances.liquid, tokenOut, amountOut);
    }

    emit SwapToken(id, accountType, tokenIn, amountIn, tokenOut, amountOut);
  }

  /*///////////////////////////////////////////////
                    INTERNAL FUNCTIONS
    */ ///////////////////////////////////////////////

  /**
   * @dev This function fetches the latest token price from a Price Feed from Chainlink Oracles.
   * @param tokenFeed address
   * @return answer Returns the oracle answer of current price as an int
   */
  function getLatestPriceData(address tokenFeed) internal returns (uint256) {
    AggregatorV3Interface chainlinkFeed = AggregatorV3Interface(tokenFeed);
    (
      uint80 roundID,
      int256 answer,
      uint256 startedAt,
      uint256 timeStamp,
      uint80 answeredInRound
    ) = chainlinkFeed.latestRoundData();
    return uint256(answer);
  }

  // /**
  //  * @dev This function sorts two token addresses in ascending order and returns them.
  //  * @param tokenA address
  //  * @param tokenB address
  //  */
  function sortTokens(
    address tokenA,
    address tokenB
  ) internal pure returns (address token0, address token1) {
    require(tokenA != tokenB, "UniswapV3Library: IDENTICAL_ADDRESSES");
    (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    require(token0 != address(0), "UniswapV3Library: ZERO_ADDRESS");
  }

  // /**
  //  * @dev This function checks the pool and returns the fee for a swap between the two given tokens.
  //  * @param tokenIn address
  //  * @param tokenOut address
  //  * @return fees Returns the fee for swapping
  //  */
  // function checkPoolAndReturnFee(
  //     address tokenA,
  //     address tokenB
  // ) internal view returns (uint24) {
  //     require(tokenA != address(0) && tokenB != address(0), "Invalid Token Inputs");
  //     (token1, token2) = sortTokens(tokenA, tokenB);
  //     uint24 fees = 0;
  //     address tempAddress = address(0);
  //     for (uint256 i = 0; i < 3; i++) {
  //         tempAddress = swapRouter.getPool(
  //             token1,
  //             token2,
  //             swappingFees[i]
  //         );
  //         if (tempAddress != address(0)) {
  //             fees = swappingFees[i];
  //             break;
  //         }
  //     }
  //     return fees;
  // }

  /**
   * @dev This function swaps the given amount of tokenA for tokenB and transfers it to the specified recipient address.
   * @param tokenIn address
   * @param tokenOut address
   * @param amountIn uint256
   * @return amountOut Returns the amount of token received fom pool after swapping to specific address
   */
  function swap(
    address tokenIn,
    uint256 amountIn,
    address priceFeedIn,
    address tokenOut,
    address priceFeedOut,
    uint256 slippage,
    address uniswapSwapRouter
  ) internal returns (uint256 amountOut) {
    //Get pool fee
    // uint24 fees = checkPoolAndReturnFee(tokenIn, tokenOut);
    require(poolFee > 0, "Invalid Token sent to swap");
    uint256 priceRatio = getLatestPriceData(priceFeedOut).mul(AngelCoreStruct.BIG_NUMBA_BASIS).div(
      getLatestPriceData(priceFeedIn)
    );
    uint256 estAmountOut = amountIn.mul(priceRatio).div(AngelCoreStruct.BIG_NUMBA_BASIS);
    uint256 minAmountOut = estAmountOut.sub(
      estAmountOut.mul(slippage).div(AngelCoreStruct.FEE_BASIS)
    );

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
    amountOut = ISwapRouter(uniswapSwapRouter).exactInputSingle(params);

    require(amountOut >= minAmountOut, "Output funds less than the minimum output");
  }
}
