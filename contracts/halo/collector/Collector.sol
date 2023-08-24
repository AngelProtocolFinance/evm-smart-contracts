// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {CollectorMessage} from "./message.sol";
import {IRegistrar} from "../../core/registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./storage.sol";
import {LibAccounts} from "../../core/accounts/lib/LibAccounts.sol";
import {FixedPointMathLib} from "../../lib/FixedPointMathLib.sol";
import {ISwapRouter} from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {IUniswapV3Factory} from "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

// NOTE: Consider expanding to allow swept amounts to be distributed out to some number of addresses, each 
//        due N percent of the total. Add/Remove distributee address/percentages [in a storage mapping].

/**
 *@title Collector
 * @dev Collector contract
 * 1) The `Collector` contract  has functions to initialize the contract with the necessary details and to
 * 2) Update the configuration.
 * 3) It also has a sweep function to swap asset tokens to HALO tokens and distribute the result HALO tokens to the gov contract.
 * 4) Lastly, there is a queryConfig function to return the configuration details.
 */
contract Collector is Storage, Initializable, ReentrancyGuard, Ownable  {
  using SafeERC20 for IERC20;
  using FixedPointMathLib for uint256;

  /*///////////////////////////////////////////////
                    EVENTS
    */ ///////////////////////////////////////////////
  event ConfigUpdated();
  event CollectorSwept(address tokenSwept, uint256 amountSwept, uint256 haloOut);

  /**
   * @dev Initialize contract
   * @param details CollectorMessage.InstantiateMsg used to initialize contract
   */
  function initialize(CollectorMessage.InstantiateMsg memory details) public initializer {
    state.config = CollectorStorage.Config({
      registrarContract: details.registrarContract,
      rewardFactor: details.rewardFactor,
      slippage: details.slippage
    });
  }

  /**
   * @dev Update config for collector contract
   * @param rewardFactor uint256
   * @param registrarContract address
   */
  function updateConfig(uint256 rewardFactor, address registrarContract) public onlyOwner {
    require(state.config.rewardFactor <= LibAccounts.FEE_BASIS, "Invalid reward factor input given");
    state.config.registrarContract = registrarContract;
    state.config.rewardFactor = rewardFactor;
    emit ConfigUpdated();
  }

  /**
   * @dev swaps asset tokens to HALO tokens and distributes the result HALO tokens to the Governance contract.
   * @param sweepToken address of the token to be swept
   */
  function sweep(address sweepToken) public {
    require(sweepToken != address(0), "Invalid sweep token passed");

    uint256 sweepAmount = IERC20(sweepToken).balanceOf(address(this));
    require(sweepAmount > 0, "Nothing to sweep");

    RegistrarStorage.Config memory registrarConfig = IRegistrar(state.config.registrarContract)
          .queryConfig();

    // Check that both in & out tokens have chainlink price feed contract set for them in Registrar
    address priceFeedIn = IRegistrar(state.config.registrarContract).queryTokenPriceFeed(sweepToken);
    address priceFeedOut = IRegistrar(state.config.registrarContract).queryTokenPriceFeed(registrarConfig.haloToken);
    require(
      (priceFeedIn != address(0) && priceFeedOut != address(0)),
      "Chainlink Oracle Price Feed contracts are required for all tokens swapping to/from"
    );

    IERC20(sweepToken).safeApprove(address(registrarConfig.uniswapRouter), sweepAmount);

    // swap token into HALO
    uint256 amountOut = swap(
      sweepToken,
      sweepAmount,
      priceFeedIn,
      registrarConfig.haloToken,
      priceFeedOut,
      state.config.slippage,
      registrarConfig.uniswapRouter,
      registrarConfig.uniswapFactory
    );

    // distribute HALO token to gov contract
    uint256 distributeAmount = amountOut.mulDivDown(state.config.rewardFactor, LibAccounts.FEE_BASIS);
    if (distributeAmount > 0) {
      IERC20(registrarConfig.haloToken).safeTransfer(registrarConfig.govContract, distributeAmount);
      // distribute tax remainder to AP treasury
      if ((amountOut - distributeAmount) > 0) {
        IERC20(registrarConfig.haloToken).safeTransfer(registrarConfig.treasury, amountOut - distributeAmount);
      }
    }

    emit CollectorSwept(sweepToken, sweepAmount, amountOut);
  }

   /**
   * @notice Query the config of Collector
   */
  function queryConfig() public view returns (CollectorMessage.ConfigResponse memory) {
    return
      CollectorMessage.ConfigResponse({
        registrarContract: state.config.registrarContract,
        rewardFactor: state.config.rewardFactor,
        slippage: state.config.slippage
      });
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
        updatedAt >= (block.timestamp - LibAccounts.ACCEPTABLE_PRICE_DELAY),
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
    uint256 priceRatio = getLatestPriceData(priceFeedOut).mulDivDown(
      LibAccounts.BIG_NUMBA_BASIS,
      getLatestPriceData(priceFeedIn)
    );
    uint256 estAmountOut = amountIn.mulDivDown(priceRatio, LibAccounts.BIG_NUMBA_BASIS);
    uint256 minAmountOut = estAmountOut -
      (estAmountOut.mulDivDown(slippage, LibAccounts.FEE_BASIS));

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
