// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity ^0.8.19;

import {APStrategy_V1} from "../../core/strategy/APStrategy_V1.sol";
import {IFlux} from "./IFlux.sol";
import {FixedPointMathLib} from "../../lib/FixedPointMathLib.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FluxStrategy is APStrategy_V1, ReentrancyGuard {
  using FixedPointMathLib for uint256;
  using SafeERC20 for IERC20;

  constructor(StrategyConfig memory _config) {
    config = _config;
  }

  /*//////////////////////////////////////////////////////////////
                                IMPLEMENTATION
  //////////////////////////////////////////////////////////////*/
  /// @notice Accepts deposits of `baseToken` and converts/trades/interacts to achieve `yieldToken`
  /// @dev This method must:
  /// 1) Transfer the `amt` of `config.baseToken` to this contract
  /// 2) Convert the base token into the `config.yieldToken via integration-specific methods
  /// 3) Set the msg.sender as approved() for the returned amt
  /// @param amt the qty of `config.baseToken` that the strategy has been approved to use
  /// @return yieldTokenAmt the qty of `config.yieldToken` that were yielded from the deposit action
  function deposit(
    uint256 amt,
    uint256[] memory
  ) external payable override whenNotPaused nonReentrant nonZeroAmount(amt) returns (uint256) {
    IERC20(config.baseToken).safeTransferFrom(_msgSender(), address(this), amt);
    IERC20(config.baseToken).safeApprove(config.yieldToken, amt);
    uint256 yieldTokens = _enterPosition(amt);
    if (!IFlux(config.yieldToken).approve(_msgSender(), yieldTokens)) {
      revert ApproveFailed();
    }
    emit EnteredPosition(amt, yieldTokens);
    return yieldTokens;
  }

  /// @notice Accepts `yieldTokens` and converts them back into `baseToken`
  /// @dev This method must:
  /// 1) Transfer the provided `amt` of `config.yieldToken` to this contract
  /// 2) Convert the yield tokens provided back into the `config.baseToken via integration-specific methods
  /// 3) Set the msg.sender as approved() for the returned amt
  /// @param amt the qty of `config.yieldToken` that this contract has been approved to use by msg.sender
  /// @return baseTokenAmt the qty of `config.baseToken` that are approved for transfer by msg.sender
  function withdraw(
    uint256 amt,
    uint256[] memory
  ) external payable override whenNotPaused nonReentrant nonZeroAmount(amt) returns (uint256) {
    if (!IFlux(config.yieldToken).transferFrom(_msgSender(), address(this), amt)) {
      revert TransferFailed();
    }
    if (!IFlux(config.yieldToken).approve(config.yieldToken, amt)) {
      revert ApproveFailed();
    }
    uint256 baseTokens = _withdrawPosition(amt);
    IERC20(config.baseToken).safeApprove(_msgSender(), baseTokens);
    emit WithdrewPosition(amt, baseTokens);
    return baseTokens;
  }

  /// @notice Provide an estimate for the current exchange rate for a given deposit
  /// @dev This method expects that the `amt` provided is denominated in `baseToken`
  /// @param amt the qty of the `baseToken` that should be checked for conversion rates
  /// @return yieldTokenAmt the expected qty of `yieldToken` if this strategy received `amt` of `baseToken`
  function previewDeposit(uint256 amt) external view override returns (uint256) {
    // Exchange Rate == (EXP_SCALE * USDC) / fUSDC
    uint256 exRate = IFlux(config.yieldToken).exchangeRateStored();
    // Expected fUSDC == (amtUSDC * EXP_SCALE / exRate)
    return amt.mulDivDown(EXP_SCALE, exRate);
  }

  /// @notice Provide an estimate for the current exchange rate for a given withdrawal
  /// @dev This method expects that the `amt` provided is denominated in `yieldToken`
  /// @param amt the qty of the `yieldToken` that should be checked for conversion rates
  /// @return yieldTokenAmt the expected qty of `baseToken` if this strategy received `amt` of `yieldToken`
  function previewWithdraw(uint256 amt) external view override returns (uint256) {
    // Exchange Rate == (EXP_SCALE * USDC) / fUSDC
    uint256 exRate = IFlux(config.yieldToken).exchangeRateStored();
    // Expected USDC == (amtfUSDC * exRate) / EXP_SCALE
    return amt.mulDivDown(exRate, EXP_SCALE);
  }

  /*//////////////////////////////////////////////////////////////
                                INTERNAL
  //////////////////////////////////////////////////////////////*/

  function _enterPosition(uint256 amt) internal returns (uint256) {
    try IFlux(config.yieldToken).mint(amt) returns (uint256 yieldTokens) {
      return yieldTokens;
    } catch Error(string memory reason) {
      emit LogError(reason);
      revert DepositFailed();
    } catch (bytes memory data) {
      emit LogErrorBytes(data);
      revert DepositFailed();
    }
  }

  function _withdrawPosition(uint256 amt) internal returns (uint256) {
    try IFlux(config.yieldToken).redeem(amt) returns (uint256 baseTokens) {
      return baseTokens;
    } catch Error(string memory reason) {
      emit LogError(reason);
      revert WithdrawFailed();
    } catch (bytes memory data) {
      emit LogErrorBytes(data);
      revert WithdrawFailed();
    }
  }
}
