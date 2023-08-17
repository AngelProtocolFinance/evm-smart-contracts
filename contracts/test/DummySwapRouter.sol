// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DummySwapRouter is ISwapRouter {
  uint256 output;

  function exactInputSingle(
    ExactInputSingleParams calldata params
  ) external payable returns (uint256 amountOut) {
    IERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
    IERC20(params.tokenOut).transfer(msg.sender, output);
    return output;
  }

  function exactInput(ExactInputParams calldata) external payable returns (uint256 amountOut) {
    return output;
  }

  function exactOutputSingle(
    ExactOutputSingleParams calldata
  ) external payable returns (uint256 amountIn) {
    return output;
  }

  function exactOutput(ExactOutputParams calldata) external payable returns (uint256 amountIn) {
    return output;
  }

  function uniswapV3SwapCallback(
    int256 amount0Delta,
    int256 amount1Delta,
    bytes calldata data
  ) external {}

  function setOutputValue(uint256 _output) external {
    output = _output;
  }
}
