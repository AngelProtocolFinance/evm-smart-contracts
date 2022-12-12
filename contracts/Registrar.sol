// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import { IRegistrar } from "./interfaces/IRegistrar.sol";
import { IVault } from "./interfaces/IVault.sol";
import { RegistrarConfig } from "./lib/RegistrarConfig.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// Import integrations here
import {APGoldfinchConfigLib} from "./integrations/goldfinch/APGoldfinchConfig.sol";

contract Registrar is IRegistrar, OwnableUpgradeable {

    /*////////////////////////////////////////////////
                    STORAGE INIT
    */////////////////////////////////////////////////
    RebalanceParams public rebalanceParams;
    AngelProtocolParams public angelProtocolParams;

    mapping(bytes4 => StrategyParams) VaultsByStrategyId;
    mapping(address => bool) AcceptedTokens;
    mapping(address=> uint256) GasFeeByToken;

    // @dev !!! IMPORTANT !!!
    // Integrations storage declarations must be added here to the bottom
    // If not, they will overshadow the storage slots that are already in use
    APGoldfinchConfigLib.APGoldfinchConfig public apGoldfinch;

    /*////////////////////////////////////////////////
                    PROXY INIT
    */////////////////////////////////////////////////

    function initialize() public initializer {
        __Ownable_init_unchained();

        rebalanceParams = RebalanceParams(
            RegistrarConfig.REBALANCE_LIQUID_PROFITS,
            RegistrarConfig.LOCKED_REBALANCE_TO_LIQUID,
            RegistrarConfig.INTEREST_DISTRIBUTION,
            RegistrarConfig.LOCKED_PRINCIPLE_TO_LIQUID,
            RegistrarConfig.PRINCIPLE_DISTRIBUTION
        );

        angelProtocolParams = AngelProtocolParams(
            RegistrarConfig.PROTOCOL_TAX_RATE,
            RegistrarConfig.PROTOCOL_TAX_BASIS,
            RegistrarConfig.PROTOCOL_TAX_COLLECTOR,
            RegistrarConfig.PRIMARY_CHAIN,
            RegistrarConfig.PRIMARY_CHAIN_ROUTER_ADDRESS,
            RegistrarConfig.ROUTER_ADDRESS
        );
    }

    /*////////////////////////////////////////////////
                    GETTER VIEW METHODS
    */////////////////////////////////////////////////
    function getRebalanceParams()
        external
        view
        override
        returns (RebalanceParams memory)
    {
        return rebalanceParams;
    }

    function getAngelProtocolParams()
        external
        view
        override
        returns (AngelProtocolParams memory)
    {
        return angelProtocolParams;
    }

    function getStrategyParamsById(bytes4 _strategyId)
        external
        view
        override
        returns (StrategyParams memory)
    {
        return VaultsByStrategyId[_strategyId];
    }

    function isTokenAccepted(address _tokenAddr) external view override returns (bool) {
        return AcceptedTokens[_tokenAddr];
    }

    function isStrategyApproved(bytes4 _strategyId)
        external
        view
        override
        returns (bool)
    {
        return VaultsByStrategyId[_strategyId].isApproved;
    }

    function getGasByToken(address _tokenAddr) external view override returns (uint256) {
        return GasFeeByToken[_tokenAddr];
    }

    /*////////////////////////////////////////////////
                    RESTRICTED SETTERS
    */////////////////////////////////////////////////
    function setRebalanceParams(RebalanceParams calldata _rebalanceParams)
        external
        override
        onlyOwner
    {
        rebalanceParams = _rebalanceParams;
        emit RebalanceParamsChanged(_rebalanceParams);
    }

    function setAngelProtocolParams(
        AngelProtocolParams calldata _angelProtocolParams
    ) external override onlyOwner {
        angelProtocolParams = _angelProtocolParams;
        emit AngelProtocolParamsChanged(_angelProtocolParams);
    }

    function setTokenAccepted(address _tokenAddr, bool _isAccepted)
        external
        onlyOwner
    {
        AcceptedTokens[_tokenAddr] = _isAccepted;
        emit TokenAcceptanceChanged(_tokenAddr, _isAccepted);
    }

    function setGasByToken(address _tokenAddr, uint256 _gasFee) external onlyOwner {
        GasFeeByToken[_tokenAddr] = _gasFee;
        emit GasFeeUpdated(_tokenAddr, _gasFee);
    }

    function setStrategyApproved(bytes4 _strategyId, bool _isApproved)
        external
        override
        onlyOwner
    {
        VaultsByStrategyId[_strategyId].isApproved = _isApproved;

        emit StrategyApprovalChanged(_strategyId, _isApproved);
    }

    function setStrategyParams(
        bytes4 _strategyId,
        address _liqAddr,
        address _lockAddr,
        bool _isApproved
    ) external override onlyOwner {
        VaultParams memory liquidParams = VaultParams(
            IVault.VaultType.LIQUID,
            _liqAddr
        );
        VaultParams memory lockedParams = VaultParams(
            IVault.VaultType.LOCKED,
            _lockAddr
        );
        VaultsByStrategyId[_strategyId] = StrategyParams(
            _isApproved,
            liquidParams,
            lockedParams
        );
        emit StrategyParamsChanged(
            _strategyId,
            _liqAddr,
            _lockAddr,
            _isApproved
        );
    }

    // Add integration helper methods here

    /*////////////////////////////////////////////////
                        GOLDFINCH
    */////////////////////////////////////////////////
    function getAPGoldfinchParams() external view returns (APGoldfinchConfigLib.APGoldfinchConfig memory) {
        return apGoldfinch;
    }

    function setAPGoldfinchParams(APGoldfinchConfigLib.APGoldfinchConfig calldata _apGoldfinch) public {
        apGoldfinch = _apGoldfinch;
    }
}
