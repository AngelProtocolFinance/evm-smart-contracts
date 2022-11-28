// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import { ISwapRouter } from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract GFITrader {

    ISwapRouter swapRouter;

                            // Mainnet addresses
    address public GFI;     // 0xdab396cCF3d84Cf2D07C4454e10C8A6F5b008D2b;
    address public WETH9;   // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public USDC;    // 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    uint24 public constant poolFee = 3000;

    constructor(address _swapRouterAddr, address _gfi, address _weth9, address _usdc) {
        swapRouter = ISwapRouter(_swapRouterAddr);
        GFI = _gfi;
        WETH9 = _weth9;
        USDC = _usdc;
    }

    /// @notice swapInputMultiplePools swaps a fixed amount of GFI for a maximum possible amount of USDC through an intermediary pool.
    /// For this example, we will swap GFI to WETH9, then WETH9 to USDC to achieve our desired output.
    /// @dev The calling address must approve this contract to spend at least `amountIn` worth of its GFI for this function to succeed.
    /// @param amountIn The amount of GFI to be swapped.
    /// @return amountOut The amount of USDC received after the swap.
    function swapExactInputMultihop(uint256 amountIn, uint256 amountOutMin) external returns (uint256 amountOut) {

        // Multiple pool swaps are encoded through bytes called a `path`. A path is a sequence of token addresses and poolFees that define the pools used in the swaps.
        // The format for pool encoding is (tokenIn, fee, tokenOut/tokenIn, fee, tokenOut) where tokenIn/tokenOut parameter is the shared token across the pools.
        // Since we are swapping GFI to USDC and then USDC to WETH9 the path encoding is (GFI, 0.3%, USDC, 0.3%, WETH9).
        ISwapRouter.ExactInputParams memory params =
            ISwapRouter.ExactInputParams({
                path: abi.encodePacked(GFI, poolFee, WETH9, poolFee, USDC),
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: amountOutMin
            });

        // Executes the swap.
        amountOut = swapRouter.exactInput(params);
    }
}