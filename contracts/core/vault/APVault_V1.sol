// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IVault} from "./interfaces/IVault.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {ERC4626AP} from "./ERC4626AP.sol";
import {IStrategy} from "../strategy/IStrategy.sol";
import {IRegistrar} from "../registrar/interfaces/IRegistrar.sol";
import {LocalRegistrarLib} from "../registrar/lib/LocalRegistrarLib.sol";

contract APVault_V1 is IVault, ERC4626AP {

  VaultConfig vaultConfig;
  mapping(uint32 => Principle) principleByAccountId;

  constructor(
    VaultConfig memory _config
  ) ERC4626AP(IERC20Metadata(_config.yieldAsset), _config.apTokenName, _config.apTokenSymbol) {
    vaultConfig = _config;
  }

  /*//////////////////////////////////////////////////////////////
                                MODIFIERS
  //////////////////////////////////////////////////////////////*/

  modifier onlyAdmin() {
    require(_msgSender() == config.admin);
    _;
  }

  modifier onlyApprovedRouter() {
    require(_isApprovedRouter(), "Only approved Router");
    _;
  }

  modifier onlyApproved() {
    require(_isApprovedRouter() || _isSiblingVault() || _isOperator(), "Only approved contracts");
    _;
  }

  modifier onlyFromToken(address _token) {
    require(_isFromToken(_token), "Wrong token");
    _;
  }

  modifier notPaused() {
    require(!IStrategy(vaultConfig.strategy).isPaused(), "Strategy Paused");
    _;
  }

  /*//////////////////////////////////////////////////////////////
                                CONFIG
  //////////////////////////////////////////////////////////////*/

  function setVaultConfig(VaultConfig memory _newConfig) external virtual onlyAdmin {
    vaultConfig = _newConfig;
  }

  function getVaultConfig() external view virtual override returns (VaultConfig memory) {
    return vaultConfig;
  }

  /*//////////////////////////////////////////////////////////////
                              IMPLEMENTATION
  //////////////////////////////////////////////////////////////*/

  function deposit(
    uint32 accountId,
    address token,
    uint256 amt
  ) 
  public payable virtual override 
  onlyApproved notPaused onlyFromToken(token) {

    require(IERC20Metadata(token).approve(strategy, amt), "Approve failed");
    yieldAmt = IStrategy(vaultConfig.strategy).deposit(amt);

    principleByAccountId[accountId].baseToken += amt;
    principleByAccountId[accountId].yieldToken += yieldAmt;

    super.deposit(yieldAmt, accountId);
  }

  function redeem(
    uint32 accountId,
    uint256 amt
  ) 
  public payable override 
  notPaused 
  returns (RedemptionResponse memory) {
    
    uint256 yieldBal = getBalanceOfAccount(accountId);                                    // get balance for acct
    uint256 maxRedemptionAmt = IStrategy(vaultConfig.strategy).previewWithdraw(yieldBal); // determine balance of fromToken if exited
    uint256 redemptionAmt;

    if (maxRedemptionAmt < amt) {                                                         // check against requested amt
       return redeemAll(accountId);                                                       // redeemAll if less
    }
    else {
      yieldTokenAmt = super.redeem(amt, vaultConfig.strategy, accountId);                 // redeem shares for yieldToken -> approve strategy 
      redemptionAmt = IStrategy(vaultConfig.strategy)                                     // withdraw amt based on ad-hoc conversion rate  
                      .withdraw(
                        yieldTokenAmt.mulDivDown(
                          _getExchangeRate_withPrecision(yieldBal, expectedAmt),          // use worst-case ex. rate
                          AngelCoreStruct.FEE_BASIS
                        )                            
                      );
      redemptionAmt -= _taxIfNecessary(accountId, positionAmount);                        // determine yield and tax if necessary  
      
      _updatePrinciples(redemptionAmt);                                                   // update principles 
      
      require(IERC20Metadata(vaultConfig.baseAsset)
        .approve(_msgSender(), redemptionAmt), 
        "Approve failed");
      
      return RedemptionResponse({
        amount: redemptionAmt,
        status: VaultActionStatus.SUCCESS
      });
    }
  }

  function redeemAll(
    uint32 accountId
  ) 
  public payable virtual override 
  notPaused returns (RedemptionResponse memory) {

    yieldTokenAmt = super.redeem(                                                       // redeem shares for yieldToken -> approve strategy 
                      getBalanceOfAccount(accountId), 
                      vaultConfig.strategy, 
                      accountId);

    redemptionAmt = IStrategy(vaultConfig.strategy)                                     // withdraw amt based on ad-hoc conversion rate  
                    .withdraw(
                      yieldTokenAmt.mulDivDown(
                        _getExchangeRate_withPrecision(yieldBal, expectedAmt),          // use worst-case ex. rate
                        AngelCoreStruct.FEE_BASIS)
                    );

    redemptionAmt -= _taxIfNecessary(accountId, positionAmount);                        // determine yield and tax if necessary  
    
    principleByAccountId[accountId].yieldToken = 0;                                     // zero out principles 
    principleByAccountId[accountId].baseToken = 0;                     
    
    require(IERC20Metadata(vaultConfig.baseAsset)
      .approve(_msgSender(), redemptionAmt), 
      "Approve failed");
    
    return RedemptionResponse({
      amount: redemptionAmt,
      status: VaultActionStatus.POSITION_EXITED});
  }

  function harvest(uint32[] calldata accountIds) public virtual override notPaused {}

  /*//////////////////////////////////////////////////////////////
                        ACCOUNTING
  //////////////////////////////////////////////////////////////*/

  function getBalanceOfAccount(uint32 accountId) public view returns (uint256) {
    return convertToAssets(balanceOf(accountId));
  }

  // Returns an exchange rate with precision that can be multiplied against from to get to
  function _getExchangeRate_withPrecision(uint256 from, uint256 to) internal pure returns (uint256) {
    return to.mulDivDown(AngelCoreStruct.FEE_BASIS, from);
  }

  function _taxIfNecessary(accountId, uint256 positionAmount) internal view returns (uint256) {
    uint256 yield = _calcYield_withPrecision(accountId, redemptionAmt); 
  }

  function _calcYield_withPrecision(uint32 accountId, uint256 positionAmount) internal view returns (uint256) {

  }

  function _updatePrinciples(uint32 accountId, uint256 redemption) internal {
    uint256 percentOfPRedeemed_withPrecision = redemption.mulDivDown(
                                  AngelCoreStruct.FEE_BASIS,
                                  principleByAccountId[accountId].yieldToken);

    uint256 redemptionLessYield = percentOfPRedeemed_withPrecision.mulDivDown(
                                  principleByAccountId[accountId].baseToken, 
                                  AngelCoreStruct.FEE_BASIS);
    // update principles
    principleByAccountId[accountId].yieldToken -= redemption;
    principleByAccountId[accountId].baseToken -= redemptionLessYield;
  } 

  /*//////////////////////////////////////////////////////////////
                        ACCESS CONTROL
  //////////////////////////////////////////////////////////////*/

  function _isOperator(address _operator) internal view override returns (bool) {
    return IRegistrar(vaultConfig.registrar).getVaultOperatorApproved(_operator);
  }

  function _isApprovedRouter() internal view override returns (bool) {
    LocalRegistrarLib.AngelProtocolParams memory apParams = IRegistrar(vaultConfig.registrar)
      .getAngelProtocolParams();
    return (_msgSender() == apParams.routerAddr);
  }

  function _isSiblingVault() internal view override returns (bool) {
    LocalRegistrarLib.StrategyParams memory stratParams = IRegistrar(vaultConfig.registrar)
      .getStrategyParamsById(vaultConfig.strategySelector);

    return (
      vaultConfig.vaultType == VaultType.LOCKED
        ? (_msgSender() == stratParams.Liquid.vaultAddr)
        : (_msgSender() == stratParams.Locked.vaultAddr)
    );
  }

  function _isFromToken(address _token) internal view returns (bool) {
    IStrategy.StrategyConfig memory stratConfig = IStrategy(VaultConfig.strategy)
        .getStrategyConfig();
    return (_token == stratConfig.fromToken);
  } 
}