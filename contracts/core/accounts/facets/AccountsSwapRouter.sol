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
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

/**
 * @title AccountsSwapEndowments
 * @dev This contract manages the swaps for endowments
 */
contract AccountsSwapRouter is ReentrancyGuardFacet, AccountsEvents {
    ISwapRouter public immutable swapRouter;
    uint24 public constant poolFee = 3000; // constant pool fee of 0.3%

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    /**
     * @notice This function swaps tokens for an endowment
     * @dev This function swaps tokens for an endowment
     * @param id The id of the endowment
     * @param accountType The type of the account
     * @param tokenIn The address of the token to be swapped
     * @param amountIn The amount of tokens to be swapped in
     * @param tokenOut The address of the token to be received out
     * @param minAmountOut Minimum cutoff of the target token to receive out
     */

    function swapToken(
        uint32 id,
        AngelCoreStruct.AccountType accountType,
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 minAmountOut
    ) public nonReentrant {
        AccountStorage.State storage state = LibAccounts.diamondStorage();

        require(amountIn > 0, "Invalid Swap Input: Zero Amount");
        require(tokenIn != address(0) && tokenOut != address(0), "Invalid Swap Input: Zero Address");
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
            require(AngelCoreStruct.canChange(
                state.ENDOWMENTS[id].settingsController.lockedInvestmentManagement,
                msg.sender,
                state.ENDOWMENTS[id].owner,
                block.timestamp
            ), "Unauthorized");
        } else if (accountType == AngelCoreStruct.AccountType.Locked) {
            require(AngelCoreStruct.canChange(
                state.ENDOWMENTS[id].settingsController.liquidInvestmentManagement,
                msg.sender,
                state.ENDOWMENTS[id].owner,
                block.timestamp
            ), "Unauthorized");
        }

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            state.config.registrarContract
        ).queryConfig();

        require(
            IERC20(tokenIn).balanceOf(address(this)) >= amountIn,
            "BalanceTooSmall"
        );

        if (accountType == AngelCoreStruct.AccountType.Locked) {
            state.STATES[id].balances.locked.balancesByToken[tokenIn] = 
                AngelCoreStruct.deductTokens(
                    state.STATES[id].balances.locked.balancesByToken[tokenIn],
                    amountIn
                );
        } else {
            state.STATES[id].balances.liquid.balancesByToken[tokenIn] = 
                AngelCoreStruct.deductTokens(
                    state.STATES[id].balances.liquid.balancesByToken[tokenIn],
                    amountIn
                );
        }

        // Who ya gonna call? Swap Function! 
        uint256 amountOut = swap(tokenIn, amountIn, tokenOut, minAmountOut);

        require(
            amountOut >= minAmountOut,
            "Output funds less than the minimum output"
        );

        // Allocate the newly swapped tokens to the correct endowment balance
        if (accountType == AngelCoreStruct.AccountType.Locked) {
            AngelCoreStruct.addToken(
                state.STATES[id].balances.locked,
                tokenOut,
                amountOut
            );
        } else {
            AngelCoreStruct.addToken(
                state.STATES[id].balances.liquid,
                tokenOut,
                amountOut
            );
        }

        emit SwapToken(
            id,
            accountType,
            tokenIn,
            amountIn,
            tokenOut,
            amountOut
        );
    }

    /*///////////////////////////////////////////////
                    INTERNAL FUNCTIONS
    */ ///////////////////////////////////////////////

    /**
     * @dev This function sorts two token addresses in ascending order and returns them.
     * @param tokenA address
     * @param tokenB address
     */
    function sortTokens(
        address tokenA,
        address tokenB
    ) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, "UniswapV3Library: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "UniswapV3Library: ZERO_ADDRESS");
    }

    /**
     * @dev This function checks the pool and returns the fee for a swap between the two given tokens.
     * @param tokenIn address
     * @param tokenOut address
     * @return fees Returns the fee for swapping
     */
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
        address tokenOut,
        uint256 minAmountOut
    ) internal returns (uint256 amountOut) {
        //Get pool fee
        // uint24 fees = checkPoolAndReturnFee(tokenIn, tokenOut);
        require(poolFee > 0, "Invalid Token sent to swap");
        
        require(
            IERC20(tokenIn).approve(address(swapRouter), amountIn),
            "Approve failed"
        );

        // Naively set amountOutMinimum to the user passed value, the alternative being to set it to 0 for now.
        // In production, we need to use an oracle or other data source to choose a safer value for amountOutMinimum.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
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
        amountOut = swapRouter.exactInputSingle(params);
    }
}
