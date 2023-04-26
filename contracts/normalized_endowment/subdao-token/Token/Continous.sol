// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

import "./BancorBondingCurve.sol";

// contract ContinuousToken is BancorBondingCurve, Ownable, ERC20 {
contract ContinuousToken is
    BancorBondingCurve,
    AccessControl,
    ERC20Upgradeable
{
    using SafeMath for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public scale = 10**18;
    uint256 public reserveBalance = 10 * scale;
    uint256 public reserveRatio;

    uint256 private FLOATING_POINTS = 1;

    address public denomTokenAddress;

    function initCurveToken(
        string memory curName,
        string memory curSymbol,
        uint256 curReserveratio,
        address curDenomtokenaddress
    ) public initializer {
        require(curDenomtokenaddress != address(0), "Invalid denom token address");
        scale = 10**18;
        reserveBalance = 10 * scale;
        // FLOATING_POINTS = 1;

        _grantRole(DEFAULT_ADMIN_ROLE, address(0));
        _grantRole(MINTER_ROLE, msg.sender);
        __ERC20_init(curName, curSymbol);

        require(
            curReserveratio > 0 && curReserveratio <= 1000000,
            "Invalid Reserve Ratio"
        );

        uint256 curDenomtokendecimals = ERC20(curDenomtokenaddress).decimals();

        require(curDenomtokendecimals <= 18, "Token not supported");

        FLOATING_POINTS = 10**(18 - curDenomtokendecimals);

        reserveRatio = curReserveratio;
        _mint(msg.sender, 1 * scale);
        denomTokenAddress = curDenomtokenaddress;
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function mint(uint256 curTokenamount, address curReciever)
        internal
        returns (uint256 ret)
    {
        ret = _continuousMint(curTokenamount.mul(FLOATING_POINTS), curReciever);
    }

    function burn(uint256 curAmount, address curBurnedfrom)
        internal
        returns (uint256 returnAmount)
    {
        returnAmount = _continuousBurn(
            curAmount.mul(FLOATING_POINTS),
            curBurnedfrom
        );
        returnAmount = returnAmount.div(FLOATING_POINTS);
    }

    function calculateContinuousMintReturn(uint256 curAmount)
        public
        view
        returns (uint256 mintAmount)
    {
        return
            calculatePurchaseReturn(
                totalSupply(),
                reserveBalance,
                uint32(reserveRatio),
                curAmount.mul(FLOATING_POINTS)
            );
    }

    function calculateContinuousBurnReturn(uint256 curAmount)
        public
        view
        returns (uint256 burnAmount)
    {
        burnAmount = calculateSaleReturn(
            totalSupply(),
            reserveBalance,
            uint32(reserveRatio),
            curAmount.mul(FLOATING_POINTS)
        );

        burnAmount = burnAmount.div(FLOATING_POINTS);
    }

    function _continuousMint(uint256 curDeposit, address curReciever)
        internal
        returns (uint256)
    {
        require(curDeposit > 0, "Deposit must be non-zero.");

        uint256 amount = calculateContinuousMintReturn(curDeposit);
        _mint(curReciever, amount);
        reserveBalance = reserveBalance.add(curDeposit);
        return amount;
    }

    function _continuousBurn(uint256 curAmount, address curBurnedfrom)
        internal
        returns (uint256)
    {
        require(curAmount > 0, "Amount must be non-zero.");
        require(
            balanceOf(curBurnedfrom) >= curAmount,
            "Insufficient tokens to burn."
        );

        uint256 reimburseAmount = calculateContinuousBurnReturn(curAmount);
        reserveBalance = reserveBalance.sub(reimburseAmount);
        _burn(curBurnedfrom, curAmount);
        return reimburseAmount;
    }

    /// @dev Internal function that needs to be override
    function _msgSender()
        internal
        view
        virtual
        override(Context, ContextUpgradeable)
        returns (address)
    {
        return msg.sender;
    }

    function _msgData()
        internal
        view
        virtual
        override(Context, ContextUpgradeable)
        returns (bytes calldata)
    {
        return msg.data;
    }
}
