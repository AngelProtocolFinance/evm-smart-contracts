// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
pragma abicoder v2;

import {RegistrarStorage} from "../core/registrar/storage.sol";
import {IRegistrar} from "../core/registrar/interface/IRegistrar.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "../core/swap-router/Interface/Ipool.sol";
import "./INonfungiblePositionManager.sol";
import "hardhat/console.sol";

interface IERC20Decimals {
    function decimals() external view returns (uint8);
}

contract UniswapUtils {
    INonfungiblePositionManager public nonfungiblePositionManager;
    constructor() {
        nonfungiblePositionManager = INonfungiblePositionManager(
            0xC36442b4a4522E871399CD717aBDD847Ab11FE88
        );
    }
    function getTokenOrder(address tokenA, address tokenB)
        internal
        pure
        returns (
            address token0,
            address token1,
            bool isPtLower
        )
    {
        require(tokenA != tokenB, "same token");
        if (tokenA < tokenB) {
            isPtLower = true;
            token0 = tokenA;
            token1 = tokenB;
        } else {
            isPtLower = false;
            token0 = tokenB;
            token1 = tokenA;
        }
        require(token0 != address(0), "no address zero");
    }


    struct createUniswapPoolERC20Args {
        address projectToken;
        address usdcToken;
        uint24 uniswapFee;
        uint256 amountA;
        uint256 amountB;
        uint160 sqrtPriceX96;
        int24 tickLower;
        int24 tickUpper;
    }
    function createPoolAndMintPositionErC20(createUniswapPoolERC20Args memory details)
        public
        returns (address)
    {
        bool success;
        require(
            IERC20(details.projectToken).balanceOf(msg.sender) >=
                details.amountA,
            "Insufficient projectToken balance"
        );
        require(
            IERC20(details.usdcToken).balanceOf(msg.sender) >= details.amountB,
            "Insufficient usdcToken balance"
        );

        success = IERC20(details.projectToken).transferFrom(
            msg.sender,
            address(this),
            details.amountA
        );
        require(success, "transferFrom failed");
        success = IERC20(details.usdcToken).transferFrom(
            msg.sender,
            address(this),
            details.amountB
        );
        require(success, "transferFrom failed");

        success = IERC20(details.projectToken).approve(
            address(nonfungiblePositionManager),
            details.amountA
        );
        require(success, "approve failed");
        success = IERC20(details.usdcToken).approve(
            address(nonfungiblePositionManager),
            details.amountB
        );
        require(success, "approve failed");

        bytes[] memory data = new bytes[](2);

        address tokenA;
        address tokenB;
        bool isPtLower;
        (tokenA, tokenB, isPtLower) = getTokenOrder(
            details.projectToken,
            details.usdcToken
        );

        {
            uint256 tokenAAmount = isPtLower
                ? details.amountA
                : details.amountB;
            uint256 tokenBAmount = isPtLower
                ? details.amountB
                : details.amountA;
            uint160 decimalDiff;
            // if(tokenA < tokenB) {
            //     decimalDiff = IERC20Decimals(tokenB).decimals() - IERC20Decimals(tokenA).decimals();
            // }
            // else{
            //     decimalDiff = IERC20Decimals(tokenA).decimals() - IERC20Decimals(tokenB).decimals();
            // }
            // details.sqrtPriceX96 = uint160(details.sqrtPriceX96 * (10 ** decimalDiff));

            data[0] = abi.encodeWithSignature(
                "createAndInitializePoolIfNecessary(address,address,uint24,uint160)",
                tokenA,
                tokenB,
                details.uniswapFee,
                details.sqrtPriceX96
            );
            data[1] = abi.encodeWithSignature(
                "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
                tokenA,
                tokenB,
                details.uniswapFee,
                details.tickLower,
                details.tickUpper,
                tokenAAmount,
                tokenBAmount,
                1,
                1,
                address(this),
                block.timestamp + 2000
            );
        }

        // create and mint new position
        bytes[] memory res;
        res = nonfungiblePositionManager.multicall{value: 0}(data);
        address pool = abi.decode(res[0], (address));
        (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        ) = abi.decode(res[1], (uint256, uint128, uint256, uint256));

        (amount0, amount1) = isPtLower
            ? (amount0, amount1)
            : (amount1, amount0);
        // Remove allowance and refund in both assets.
        if (amount0 < details.amountA) {
            success = IERC20(details.projectToken).approve(
                address(nonfungiblePositionManager),
                0
            );
            require(success, "approve failed");
            uint256 refund = details.amountA - amount0;
            console.log("Refund amt0", refund);
            success = IERC20(details.projectToken).transfer(msg.sender, refund);
            require(success, "transfer failed");
        }
        if (amount1 < details.amountB) {
            success = IERC20(details.usdcToken).approve(
                address(nonfungiblePositionManager),
                0
            );
            require(success, "approve failed");
            uint256 refund = details.amountB - amount1;
            console.log("Refund amt1", refund);
            success = IERC20(details.usdcToken).transfer(msg.sender, refund);
            require(success, "transfer failed");
        }
        console.log("created pool: ", pool);
        return pool;
    }


    struct createUniswapPoolArgs {
        address tokenA;
        address tokenB;
        uint24 uniswapFee;
        uint256 amountA;
        uint160 sqrtPriceX96;
        int24 tickLower;
        int24 tickUpper;
    }

    function createPoolAndMintPosition(createUniswapPoolArgs memory details)
        public
        payable
        returns (address)
    {
        require(
            IERC20(details.tokenA).balanceOf(msg.sender) >=
                details.amountA,
            "Insufficient tokenA balance"
        );

        bool success = IERC20(details.tokenA).transferFrom(
            msg.sender,
            address(this),
            details.amountA
        );
        require(success, "transferFrom failed");

        success = IERC20(details.tokenA).approve(
            address(nonfungiblePositionManager),
            details.amountA
        );
        require(success, "approve failed");
        success = IERC20(details.tokenB).approve(
            address(nonfungiblePositionManager),
            msg.value
        );
        require(success, "approve failed");

        bytes[] memory data = new bytes[](2);

        address tokenA;
        address tokenB;
        bool isPtLower;
        (tokenA, tokenB, isPtLower) = getTokenOrder(
            details.tokenA,
            details.tokenB
        );

        {
            uint256 tokenAAmount = isPtLower
                ? details.amountA
                : msg.value;
            uint256 tokenBAmount = isPtLower
                ? msg.value
                : details.amountA;

            data[0] = abi.encodeWithSignature(
                "createAndInitializePoolIfNecessary(address,address,uint24,uint160)",
                tokenA,
                tokenB,
                details.uniswapFee,
                details.sqrtPriceX96
            );
            data[1] = abi.encodeWithSignature(
                "mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))",
                tokenA,
                tokenB,
                details.uniswapFee,
                details.tickLower,
                details.tickUpper,
                tokenAAmount,
                tokenBAmount,
                1,
                1,
                address(this),
                block.timestamp + 2000
            );
        }

        // create and mint new position
        bytes[] memory res;
        res = nonfungiblePositionManager.multicall{value: msg.value}(data);
        (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        ) = abi.decode(res[1], (uint256, uint128, uint256, uint256));
        (amount0, amount1) = isPtLower
            ? (amount0, amount1)
            : (amount1, amount0);
        // Remove allowance and refund in both assets.
        if (amount0 < details.amountA) {
            success = IERC20(details.tokenA).approve(
                address(nonfungiblePositionManager),
                0
            );
            require(success, "approve failed");
            uint256 refund = details.amountA - amount0;
            console.log("refund", refund);
            success = IERC20(details.tokenA).transfer(msg.sender, refund);
            require(success, "transfer failed");
        }
        if (amount1 < msg.value) {
            success = IERC20(details.tokenB).approve(
                address(nonfungiblePositionManager),
                0
            );
            require(success, "approve failed");
            uint256 refund = msg.value - amount1;
            console.log("refund", refund);
            // TODO: send refund to msg.sender 
            
        }
        address pool = abi.decode(res[0], (address));
        console.log("pool address");
        return pool;
    }
}