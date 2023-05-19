// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import {SwapRouterMessages} from "./message.sol";
import {AngelCoreStruct} from "../struct.sol";
import {IRegistrar} from "../registrar/interfaces/IRegistrar.sol";
import {RegistrarStorage} from "../registrar/storage.sol";
// import {IUniswapV2Router, IUniswapV2Pair, IUniswapV2Factory} from "./interfaces/ISwapping.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

import {IPool} from "./interfaces/Ipool.sol";

// Interface
// import "./interfaces/ISwapping.sol";

//Storage
import "./storage.sol";

/**
 *@title SwapRouter
 * @dev SwapRouter contract
 * The `SwapRouter` contract implements a swap router that facilitates the swapping of ERC20 tokens.
 */
contract SwapRouter is Storage {
    using SafeMath for uint256;

    /**
     * @dev Initialize contract
     * @param details SwapRouterMessages.InstantiateMsg used to initialize contract
     */
    function intiSwapRouter(
        SwapRouterMessages.InstantiateMsg memory details
    ) public {
        require(!initSwapRouterFlag, "Already Initilized");

        initSwapRouterFlag = true;
        config.registrarContract = details.registrarContract;
        config.accountsContract = details.accountsContract;
        swapRouter = details.swapRouter;
        swapFactory = details.swapFactory;

        swappingFees.push(500);
        swappingFees.push(3000);
        swappingFees.push(10000);
    }

    /**
     * @dev This function sorts two token addresses in ascending order and returns them.
     * @param tokenA address
     * @param tokenB address
     */
    function sortTokens(
        address tokenA,
        address tokenB
    ) internal pure returns (address token0, address token1) {
        require(tokenA != tokenB, "UniswapV2Library: IDENTICAL_ADDRESSES");
        (token0, token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "UniswapV2Library: ZERO_ADDRESS");
    }

    /**
     * @dev This function checks the pool and returns the fee for a swap between the two given tokens.
     * @param tokena address
     * @param tokenb address
     * @return fees Retruns the fee for swapping
     */
    function checkPoolAndReturFee(
        address tokena,
        address tokenb
    ) internal view returns (uint24) {
        require(tokena != address(0), "Invalid Token A");
        require(tokenb != address(0), "Invalid Token B");

        //sort Token
        (tokena, tokenb) = sortTokens(tokena, tokenb);

        uint24 fees = 0;
        address tempAddress = address(0);
        for (uint256 i = 0; i < 3; i++) {
            tempAddress = IPool(swapFactory).getPool(
                tokena,
                tokenb,
                swappingFees[i]
            );
            if (tempAddress != address(0)) {
                fees = swappingFees[i];
                break;
            }
        }
        // if(fees == 0) revert("No Pool Found");
        return fees;
    }

    /**
     * @dev This function swaps the given amount of tokenA for tokenB and transfers it to the specified recipient address.
     * @param tokena address
     * @param tokenb address
     * @param amount uint256
     * @param to address
     * @return amountOut Returns the amount of token received fom pool after swapping to specific address
     */
    function swap(
        address tokena,
        address tokenb,
        uint256 amount,
        address to
    ) internal returns (uint256) {
        //Get pool
        uint24 fees = checkPoolAndReturFee(tokena, tokenb);

        require(fees > 0, "Invalid Token Send to swap");

        require(
            IERC20(tokena).transferFrom(
                msg.sender,
                address(this),
                amount
            ),
            "TransferFrom failed"
        );

        require(
            IERC20(tokena).approve(swapRouter, amount),
            "Approve failed"
        );

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokena,
                tokenOut: tokenb,
                fee: fees,
                recipient: to,
                deadline: block.timestamp + 600,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        uint256 amountOut = ISwapRouter(swapRouter).exactInputSingle(params);
        //Perform Swap
        return amountOut;
    }

    /**
     * @dev This function swaps a token for the specified output token and returns the amount obtained.
     * @param tokenIn address
     * @param tokenOut address
     * @param amountIn uint256
     * @param amountOut uint256
     * @return amountPossible Returns the amount of token obtained after swapping the tokens.
     */
    function executeSwapOperations(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOut
    ) public returns (uint256) {

        uint256 amountPossible;
        
        amountPossible += swap(
            tokenIn,
            tokenOut,
            amountIn,
            address(this)
        );


        require(
            amountPossible >= amountOut,
            "Output funds less than the minimum funds"
        );

        require(
            IERC20(tokenOut).transfer(msg.sender, amountPossible),
            "Transfer failed"
        );

        return amountPossible;
    }

    /**
     * @dev This function swaps the given amount of the specified token for USDC. This function can only be called by the registrar contract or the accounts contract.
     * @param tokena address
     * @param amountin uint256
     * @return account Returns the amount of token after swapping specified USDC token.
     */
    function swapTokenToUsdc(
        address tokena,
        uint256 amountin
    ) public returns (uint256) {
        require(
            msg.sender == config.registrarContract ||
                msg.sender == config.accountsContract,
            "Unauthorized"
        );

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            config.registrarContract
        ).queryConfig();

        uint256 account = swap(
            tokena,
            registrar_config.usdcAddress,
            amountin,
            msg.sender
        );

        return account;
    }

    /**
     * @dev This function swaps the sent ETH for the specified token.
     * @return amountOut Returns the amount of token after swapping with ETH.
     */
    function swapEthToToken() public payable returns (uint256) {
        require(
            msg.sender == config.registrarContract ||
                msg.sender == config.accountsContract,
            "Unauthorized"
        );

        require(msg.value > 0, "Invalid Amount");

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            config.registrarContract
        ).queryConfig();

        //Get pool
        uint24 fees = checkPoolAndReturFee(
            registrar_config.wethAddress,
            registrar_config.usdcAddress
        );

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: registrar_config.wethAddress,
                tokenOut: registrar_config.usdcAddress,
                fee: fees,
                recipient: msg.sender,
                deadline: block.timestamp + 600,
                amountIn: msg.value,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        uint256 amountOut = ISwapRouter(swapRouter).exactInputSingle{
            value: msg.value
        }(params);

        //Perform Swap
        return amountOut;
    }

    /**
     * @dev This function swaps the sent ETH to any token.
     * @param token address
     * @return amountOut Returns the amount of token after swapping with ETH.
     */
    function swapEthToAnyToken(address token) public payable returns (uint256) {
        require(msg.value > 0, "Invalid Amount");

        RegistrarStorage.Config memory registrar_config = IRegistrar(
            config.registrarContract
        ).queryConfig();

        //Get pool
        uint24 fees = checkPoolAndReturFee(registrar_config.wethAddress, token);

        // Naively set amountOutMinimum to 0. In production, use an oracle or other data source to choose a safer value for amountOutMinimum.
        // We also set the sqrtPriceLimitx96 to be 0 to ensure we swap our exact input amount.
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: registrar_config.wethAddress,
                tokenOut: token,
                fee: fees,
                recipient: msg.sender,
                deadline: block.timestamp + 600,
                amountIn: msg.value,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        uint256 amountOut = ISwapRouter(swapRouter).exactInputSingle{
            value: msg.value
        }(params);

        //Perform Swap
        return amountOut;
    }
}
