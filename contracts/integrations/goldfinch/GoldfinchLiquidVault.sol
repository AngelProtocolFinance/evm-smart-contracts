// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

// Angel Protocol
import {IVaultLiquid} from "../../interfaces/IVaultLiquid.sol";
import {IRegistrar} from "../../interfaces/IRegistrar.sol";

// Integrations
import {IStakingRewards} from "./IStakingRewards.sol";
import {ICurveLP} from "./ICurveLP.sol";
import {GFITrader} from "./GFITrader.sol";

// Util
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {Pausable} from "@openzeppelin/contracts/security/Pausable.sol";

contract GoldfinchLiquidVault is IVaultLiquid, IERC721Receiver, GFITrader, Pausable {
    bytes4 constant STRATEGY_ID = bytes4(keccak256(abi.encode("Goldfinch")));
    
                            // Mainnet address
    address public FIDU;    // 0x6a445E9F40e0b97c92d0b8a3366cEF1d67F700BF

    IRegistrar registrar;
    ICurveLP crvPool;
    IStakingRewards stakingPool;

    constructor(
        address _registrar,
        address _stakingPool,
        address _crvPool,
        address _swapRouterAddr,
        address _gfi,
        address _weth9,
        address _usdc
    ) GFITrader(_swapRouterAddr, _gfi, _weth9, _usdc) {
        registrar = IRegistrar(_registrar);
        stakingPool = IStakingRewards(_stakingPool);
        crvPool = ICurveLP(_crvPool);
    }

    /// @notice returns the vault type
    /// @dev a vault must declare its Type upon initialization/construction
    function getVaultType() external pure returns (VaultType) {
        return VaultType.LIQUID;
    }

    /// @notice deposit tokens into vault position of specified Account
    /// @dev the deposit method allows the Vault contract to create or add to an existing
    /// position for the specified Account. In the case that multiple different tokens can be deposited,
    /// the method requires the deposit token address and amount. The transfer of tokens to the Vault
    /// contract must occur before the deposit method is called.
    /// @param accountId a unique Id for each Angel Protocol account
    /// @param token the deposited token
    /// @param amt the amount of the deposited token
    function deposit(
        uint32 accountId,
        address token,
        uint256 amt
    ) external payable {

        // convert USDC to FIDU
        // if new position: 
            // stake
            // store position NFT id 
        // else:
            // addToStake with NFT id
            // update principleByAcct
    }

    /// @notice redeem value from the vault contract
    /// @dev allows an Account to redeem from its staked value. The behavior is different dependent on VaultType.
    /// @param accountId a unique Id for each Angel Protocol account
    /// @param token the deposited token
    /// @param amt the amount of the deposited token
    function redeem(
        uint32 accountId,
        address token,
        uint256 amt
    ) external payable {

        // determine yield denominated in USDC
        // harvest GFI and market dump
        // unstake necessary FIDU 
        // convert FIDU to USDC
        // send USDC to router
    }

    /// @notice restricted method for harvesting accrued rewards
    /// @dev Claim reward tokens accumulated to the staked value. The underlying behavior will vary depending
    /// on the target yield strategy and VaultType. Only callable by an Angel Protocol Keeper
    /// @param accountId Used to specify whether the harvest should be called against a specific account or, if left as 0,
    /// against all accounts. A vault must implement the 0 = default functionality.
    function harvest(uint32 accountId) external {

        // if accountId == 0, for each tokenId:
            // determine rewards per tokenId
            // call getReward against each
            // convert GFI -> USDC
            // convert USDC to FIDU (according to split?)
            // addToStake for each
        // else do above for just the one 
    }

    /// @notice allows an account to stake specified Liquid value into its sister Locked Vault
    /// @dev An Account can choose to allocate some of its liquid balance into the locked vault.
    /// The value is specifiable and unrestricted up to the maximum value of the liquid account.
    /// @param accountId a unique Id for each Angel Protocol account
    /// @param token the deposited token
    /// @param amt the amount of the deposited token
    function reinvestToLocked(
        uint32 accountId,
        address token,
        uint256 amt
    ) external {

        // determine yield for account
        // harvest yield and send result to locked pair
    }

    /**
     * @dev Whenever an {IERC721} `tokenId` token is transferred to this contract via {IERC721-safeTransferFrom}
     * by `operator` from `from`, this function is called.
     *
     * It must return its Solidity selector to confirm the token transfer.
     * If any other value is returned or the interface is not implemented by the recipient, the transfer will be reverted.
     *
     * The selector can be obtained in Solidity with `IERC721Receiver.onERC721Received.selector`.
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
