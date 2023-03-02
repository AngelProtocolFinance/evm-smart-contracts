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

    mapping(string => string) accountsContractByChain;
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
            RegistrarConfig.PRINCIPLE_DISTRIBUTION,
            RegistrarConfig.BASIS
        );

        angelProtocolParams = AngelProtocolParams(
            RegistrarConfig.PROTOCOL_TAX_RATE,
            RegistrarConfig.PROTOCOL_TAX_BASIS,
            RegistrarConfig.PROTOCOL_TAX_COLLECTOR,
            RegistrarConfig.ROUTER_ADDRESS,
            RegistrarConfig.REFUND_ADDRESS
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

    function getAccountsContractAddressByChain(string calldata _targetChain) 
        external 
        view
        returns (string memory) 
    {
        return accountsContractByChain[_targetChain];
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

    function getStrategyApprovalState(bytes4 _strategyId)
        external
        view
        override
        returns (StrategyApprovalState)
    {
        return VaultsByStrategyId[_strategyId].approvalState;
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

    function setAccountsContractAddressByChain(
        string memory _chainName,
        string memory _accountsContractAddress
    ) external onlyOwner {
        accountsContractByChain[_chainName] = _accountsContractAddress;
        emit AccountsContractStorageChanged(_chainName, _accountsContractAddress);
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

    function setStrategyApprovalState(bytes4 _strategyId, StrategyApprovalState _approvalState)
        external
        override
        onlyOwner
    {
        VaultsByStrategyId[_strategyId].approvalState = _approvalState;

        emit StrategyApprovalChanged(_strategyId, _approvalState);
    }

    function setStrategyParams(
        bytes4 _strategyId,
        address _lockAddr,
        address _liqAddr,
        StrategyApprovalState _approvalState
    ) external override onlyOwner {
        VaultParams memory lockedParams = VaultParams(
            IVault.VaultType.LOCKED,
            _lockAddr
        );
        VaultParams memory liquidParams = VaultParams(
            IVault.VaultType.LIQUID,
            _liqAddr
        );
        VaultsByStrategyId[_strategyId] = StrategyParams(
            _approvalState,
            lockedParams,
            liquidParams
        );
        emit StrategyParamsChanged(
            _strategyId,
            _lockAddr,
            _liqAddr,
            _approvalState
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
