// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

// Angel Protocol
import {IVault} from "../../interfaces/IVault.sol";
import {IRegistrarGoldfinch} from "./IRegistrarGoldfinch.sol";
import {APGoldfinchConfigLib} from "./APGoldfinchConfig.sol";

// Integrations
import {IStakingRewards} from "./IStakingRewards.sol";
import {ICurveLP} from "./ICurveLP.sol";

// Token
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GoldfinchVault is IVault, IERC721Receiver {
    bytes4 constant STRATEGY_ID = bytes4(keccak256(abi.encode("Goldfinch")));
    uint256 constant PRECISION = 10**24;
    
    IVault.VaultType vaultType;

                            // Mainnet address
    address public USDC;    // 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
    address public FIDU;    // 0x6a445E9F40e0b97c92d0b8a3366cEF1d67F700BF
    address public GFI;     // 0xdab396cCF3d84Cf2D07C4454e10C8A6F5b008D2b

    IRegistrarGoldfinch registrar;
    ICurveLP crvPool;
    IStakingRewards stakingPool;

    mapping(uint32 => uint256) public tokenIdByAccountId;
    mapping(uint32 => IRegistrarGoldfinch.principle) public principleByAccountId;

    constructor(
        IVault.VaultType _vaultType,
        address _registrar,
        address _stakingPool,
        address _crvPool,
        address _usdc,
        address _fidu,
        address _gfi
    ) {
        vaultType = _vaultType;
        registrar = IRegistrarGoldfinch(_registrar);
        stakingPool = IStakingRewards(_stakingPool);
        crvPool = ICurveLP(_crvPool);
        USDC = _usdc;
        FIDU = _fidu;
        GFI = _gfi;
    }

    /*////////////////////////////////////////////////
                        MODIFIERS
    */////////////////////////////////////////////////

    modifier onlyUSDC(address token) {
        require(token == USDC, "Only USDC accepted");
        _;
    }

    modifier approvedRouterOnly() {
        require(_isApprovedRouter(), "Not approved Router");
        _;
    }

    // Either the router or the sibling vault
    modifier approvedOnly() {
        require(_isApprovedRouter() || _isSiblingVault(), "Not approved");
        _;
    }

    modifier nonzeroPositionOnly(uint32 accountId) {
        require(tokenIdByAccountId[accountId] != 0, "No position");
        IStakingRewards.StakedPosition memory position = stakingPool.getPosition(tokenIdByAccountId[accountId]);
        require(position.amount > 0, "No position");
        _;
    }

    function _isApprovedRouter() internal view override returns (bool){
        IRegistrarGoldfinch.AngelProtocolParams memory apParams = registrar.getAngelProtocolParams();
        return(apParams.routerAddr == msg.sender);
    }

    function _isSiblingVault() internal view returns (bool) {
        IRegistrarGoldfinch.StrategyParams memory stratParams = registrar.getStrategyParamsById(STRATEGY_ID);
        return(msg.sender == stratParams.Locked.vaultAddr);
    }


    /*////////////////////////////////////////////////
                        IVAULT IMPL
    */////////////////////////////////////////////////

    /// @notice returns the vault type
    /// @dev a vault must declare its Type upon initialization/construction
    function getVaultType() external view override returns (VaultType) {
        return vaultType;
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
    ) external payable override approvedOnly onlyUSDC(token) {

        // convert USDC to FIDU
        uint256 slippageThreshhold = _getSlippageTolerance();
        uint256 minAmtOut = _calcSlippageTolernace(0, 1, amt, slippageThreshhold);
        IERC20(USDC).approve(address(crvPool), amt);
        uint256 fiduReturned = crvPool.exchange(0, 1, amt, minAmtOut);

        // if new position: 
            // stake
            // store position NFT id 
        if(tokenIdByAccountId[accountId] == 0) {
            IERC20(FIDU).approve(address(stakingPool), fiduReturned);
            uint256 id = stakingPool.stake(fiduReturned, IStakingRewards.StakedPositionType.Fidu);
            principleByAccountId[accountId].usdcP += amt;
            principleByAccountId[accountId].fiduP += fiduReturned;
            tokenIdByAccountId[accountId] = id;
        }

        // else:
            // addToStake with NFT id
            // update principleByAcct
        else {
            uint256 id = tokenIdByAccountId[accountId];
            IERC20(FIDU).approve(address(stakingPool), fiduReturned);
            stakingPool.addToStake(id, fiduReturned);
            principleByAccountId[accountId].usdcP += amt;
            principleByAccountId[accountId].fiduP += fiduReturned;
        }
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
    ) external payable override approvedRouterOnly onlyUSDC(token) nonzeroPositionOnly(accountId) returns (uint256)  {
        IRegistrarGoldfinch.AngelProtocolParams memory apParams = registrar.getAngelProtocolParams();
        IStakingRewards.StakedPosition memory position = stakingPool.getPosition(tokenIdByAccountId[accountId]);

        _claimGFI(accountId);                                                                               // harvest GFI -> Tax Collector
        uint256 yield_withPrecision = _calcYield_withPrecision(accountId, position.amount);                 // determine yield as a rate demoninated in USDC
        (uint256 redeemedUSDC, uint256 redeemedFIDU) = _redeemFiduForUsdc(accountId, position.amount, amt); // unstake necessary FIDU 
        
        if(yield_withPrecision > 0) {
            redeemedUSDC = _taxRedemption(apParams, yield_withPrecision, redeemedUSDC);
        }

        _updatePrinciples(accountId, redeemedFIDU);
        IERC20(USDC).approve(apParams.routerAddr, redeemedUSDC);
        return redeemedUSDC;
    }

    /// @notice redeem all of the value from the vault contract
    /// @dev allows an Account to redeem all of its staked value. Good for rebasing tokens wherein the value isn't
    /// known explicitly 
    /// @param accountId a unique Id for each Angel Protocol account
    /// @return redemptionAmt returns the number of tokens redeemed by the call
    function redeemAll(uint32 accountId) payable external override approvedRouterOnly nonzeroPositionOnly(accountId) returns (uint256) {
        IStakingRewards.StakedPosition memory position = stakingPool.getPosition(tokenIdByAccountId[accountId]);
        IRegistrarGoldfinch.AngelProtocolParams memory apParams = registrar.getAngelProtocolParams();

        _claimGFI(accountId);      
        uint256 yield_withPrecision = _calcYield_withPrecision(accountId, position.amount);             // determine yield as a rate demoninated in USDC
        uint256 minUsdcOut =  _calcSlippageTolernace(1, 0, position.amount, _getSlippageTolerance());   // determine usdc less slippage tolerance 
        uint256 redeemedUSDC = _unstakeAndSwap(accountId, position.amount, minUsdcOut);
        
        if(yield_withPrecision > 0) {
            redeemedUSDC = _taxRedemption(apParams, yield_withPrecision, redeemedUSDC);
        }

        // Zero out principles
        principleByAccountId[accountId].fiduP = 0;
        principleByAccountId[accountId].usdcP = 0;
        IERC20(USDC).approve(apParams.routerAddr, redeemedUSDC);
        return redeemedUSDC;
    }

    /// @notice restricted method for harvesting accrued rewards
    /// @dev Claim reward tokens accumulated to the staked value. The underlying behavior will vary depending
    /// on the target yield strategy and VaultType. Only callable by an Angel Protocol Keeper
    /// @param accountIds Used to specify whether the harvest should be called against a specific account or accounts
    function harvest(uint32[] calldata accountIds) external override approvedRouterOnly {
        IRegistrarGoldfinch.AngelProtocolParams memory apParams = registrar.getAngelProtocolParams();
        for (uint256 i; i < accountIds.length; i++) {
            _harvestSingle(accountIds[i], apParams);
        }
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


    /*////////////////////////////////////////////////
                        INTERNAL
    */////////////////////////////////////////////////

    function _harvestSingle(
        uint32 accountId, 
        IRegistrarGoldfinch.AngelProtocolParams memory apParams
        ) internal nonzeroPositionOnly(accountId) {
        IStakingRewards.StakedPosition memory position = stakingPool.getPosition(tokenIdByAccountId[accountId]);
        
        // Scrape GFI to tax collector 
        _claimGFI(accountId);
        
        uint256 yield_withPrecision = _calcYield_withPrecision(accountId, position.amount);
        // Only tax and rebal if the yield is positive, return early and save gas otherwise 
        if(yield_withPrecision == 0) {   
            return;
        }

        // If yield nonzero then redeem tax and maybe rebalance                 
        uint256 taxableAmt = (principleByAccountId[accountId].usdcP * yield_withPrecision)  / PRECISION; 
        uint256 tax = _calcTax(yield_withPrecision, taxableAmt);    // Calculate the tax on taxable amt
        uint256 redeemedUSDC;
        uint256 dFidu;

        if (vaultType == VaultType.LIQUID) {
            (redeemedUSDC, dFidu) = _redeemFiduForUsdc(accountId, position.amount, tax);       
            require(IERC20(USDC).transfer(apParams.protocolTaxCollector, redeemedUSDC));
            principleByAccountId[accountId].fiduP -= dFidu;             // Deduct fidu redemption from principle
            return;
        }

        // For locked vaults, we rebal and deposit to liquid
        IRegistrarGoldfinch.RebalanceParams memory rbParams = registrar.getRebalanceParams();
        uint256 rebalAmt = ((taxableAmt - tax) * rbParams.lockedRebalanceToLiquid) / rbParams.basis;
        
        // Unstake necessary FIDU to cover tax + rebalance to liquid 
        (redeemedUSDC, dFidu) = _redeemFiduForUsdc(                             // Redeem FIDU from underlying to USDC
            accountId, 
            position.amount, 
            (tax + rebalAmt));              
        principleByAccountId[accountId].fiduP -= dFidu;                         // Deduct fidu redemption from principle
        require(IERC20(USDC).transfer(apParams.protocolTaxCollector, tax));     // Scrape tax USDC to tax collector

        // Rebalance to sibling vault
        IRegistrarGoldfinch.StrategyParams memory stratParams = registrar.getStrategyParamsById(STRATEGY_ID);
        require(IERC20(USDC).transfer(stratParams.Liquid.vaultAddr, (redeemedUSDC - tax))); 
        IVault(stratParams.Liquid.vaultAddr).deposit(accountId, USDC, (redeemedUSDC - tax));
    }

    function _taxRedemption(
        IRegistrarGoldfinch.AngelProtocolParams memory apParams, 
        uint256 yield_withPrecision, 
        uint256 redeemedAmt) internal returns (uint256) {
        uint256 taxedAmt = _calcTax(yield_withPrecision, redeemedAmt);
        require(IERC20(USDC).transfer(apParams.protocolTaxCollector, taxedAmt));
        return redeemedAmt - taxedAmt;
    }

    function _updatePrinciples(uint32 accountId, uint256 redeemedFIDU) internal {
        uint256 percentOfPRedeemed = (redeemedFIDU * PRECISION) / (principleByAccountId[accountId].fiduP);
        uint256 redemptionLessYield = (percentOfPRedeemed*principleByAccountId[accountId].usdcP)/PRECISION;
        // update principles
        principleByAccountId[accountId].fiduP -= redeemedFIDU;
        principleByAccountId[accountId].usdcP -= redemptionLessYield;
    }

    function _getSlippageTolerance() internal view returns (uint256) {
        return registrar.getAPGoldfinchParams().crvParams.allowedSlippage;
    }

    function _calcSlippageTolernace(uint256 i, uint256 j, uint256 dx, uint256 allowedSlippage) internal view returns (uint256) {
        uint256 expectedDy = crvPool.get_dy(i, j, dx);
        return (expectedDy - (expectedDy * allowedSlippage)/100); // allowedSlippage has basis of 100
    }

    function _calcYield_withPrecision(uint32 accountId, uint256 positionAmount) internal view returns (uint256) {
        uint256 p = principleByAccountId[accountId].usdcP;
        uint256 usdcValue = crvPool.get_dy(1, 0, positionAmount);
        if(usdcValue >= p) { // check for underflow 
            return ((usdcValue - p)*PRECISION/p);
        }
        else {
            return 0;
        }
    }

    function _claimGFI(uint32 accountId) internal {
        stakingPool.getReward(tokenIdByAccountId[accountId]);
        uint256 bal = IERC20(GFI).balanceOf(address(this));
        IRegistrarGoldfinch.AngelProtocolParams memory apParams = registrar.getAngelProtocolParams();
        require(IERC20(GFI).transfer(apParams.protocolTaxCollector, bal));
    } 

    function _calcTax(uint256 yield_withPrecision, uint256 taxableAmt) internal view returns (uint256) {
        IRegistrarGoldfinch.AngelProtocolParams memory apParams = registrar.getAngelProtocolParams();
        return ((yield_withPrecision * taxableAmt * apParams.protocolTaxRate)/apParams.protocolTaxBasis)/PRECISION;
    }   

    function _redeemFiduForUsdc(uint32 accountId, uint256 positionAmount, uint256 desiredUsdc) internal returns (uint256, uint256) {
        // Determine how much FIDU is needed to achieve desired USDC output
        uint256 exRate_withPrecision =_getExchageRate_withPrecision(1, 0, positionAmount);   // get exchange rate for worst case swap
        uint256 dFidu =  (desiredUsdc * PRECISION) / exRate_withPrecision;                    // determine fidu necessary given worst case ex rate
        require(dFidu <= positionAmount, "Cannot redeem more than available"); // check to see if redemption is possible 
        uint256 minUsdcOut =  _calcSlippageTolernace(1, 0, dFidu, _getSlippageTolerance());  // determine usdc less slippage tolerance 
        uint256 redeemedUsdc = _unstakeAndSwap(accountId, dFidu, minUsdcOut);
        return (redeemedUsdc, dFidu);
    }

    

    function _unstakeAndSwap(uint32 accountId, uint256 dFidu, uint256 minUsdcOut) internal returns (uint256) {
        // Move tokens from staking pool -> crv for swap -> return usdc redeemed 
        stakingPool.unstake(tokenIdByAccountId[accountId], dFidu);  // unstake dFidu position from staking pool 
        IERC20(FIDU).approve(address(crvPool), dFidu);              // approve the CRV dex to trade the fidu for usdc
        return crvPool.exchange(1, 0, dFidu, minUsdcOut);           // return the usdc redeemed 
    }

    function _getExchageRate_withPrecision(uint256 i, uint256 j, uint256 amt) internal view returns (uint256) {
        uint256 dy = crvPool.get_dy(i, j, amt); // get current expected dy
        require(dy > 0, "Invalid exchange rate");
        return (dy  * PRECISION / amt); 
    }
}
