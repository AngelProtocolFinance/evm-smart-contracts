// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IVault} from "../../vault/interfaces/IVault.sol";
import {LocalRegistrarLib} from "../lib/LocalRegistrarLib.sol";
 
interface ILocalRegistrar {

    /*////////////////////////////////////////////////
                        EVENTS
    */////////////////////////////////////////////////
    event RebalanceParamsChanged(LocalRegistrarLib.RebalanceParams newRebalanceParams);
    event AngelProtocolParamsChanged(LocalRegistrarLib.AngelProtocolParams newAngelProtocolParams);
    event AccountsContractStorageChanged(
        string indexed chainName,
        string indexed accountsContractAddress
    );
    event TokenAcceptanceChanged(address indexed tokenAddr, bool isAccepted);
    event StrategyApprovalChanged(bytes4 indexed _strategyId, LocalRegistrarLib.StrategyApprovalState _approvalState);
    event StrategyParamsChanged(
        bytes4 indexed _strategyId,
        address indexed _lockAddr,
        address indexed _liqAddr,
        LocalRegistrarLib.StrategyApprovalState _approvalState
    );
    event GasFeeUpdated(address indexed _tokenAddr, uint256 _gasFee); 

    /*////////////////////////////////////////////////
                    EXTERNAL METHODS
    */////////////////////////////////////////////////

    // View methods for returning stored params
    function getRebalanceParams()
        external
        view
        returns (LocalRegistrarLib.RebalanceParams memory);

    function getAngelProtocolParams()
        external
        view
        returns (LocalRegistrarLib.AngelProtocolParams memory);

    function getAccountsContractAddressByChain(string calldata _targetChain) 
        external 
        view
        returns (string memory);

    function getStrategyParamsById(bytes4 _strategyId)
        external
        view
        returns (LocalRegistrarLib.StrategyParams memory);

    function isTokenAccepted(address _tokenAddr) external view returns (bool);

    function getGasByToken(address _tokenAddr) external view returns (uint256);

    function getStrategyApprovalState(bytes4 _strategyId)
        external
        view
        returns (LocalRegistrarLib.StrategyApprovalState);
    
    function getVaultOperatorApproved(address _operator) external view returns (bool);
    
    // Setter meothods for granular changes to specific params
    function setRebalanceParams(LocalRegistrarLib.RebalanceParams calldata _rebalanceParams)
        external;

    function setAngelProtocolParams(
        LocalRegistrarLib.AngelProtocolParams calldata _angelProtocolParams
    ) external;

    function setAccountsContractAddressByChain(
        string memory _chainName,
        string memory _accountsContractAddress
    ) external;

    /// @notice Change whether a strategy is approved
    /// @dev Set the approval bool for a specified strategyId.
    /// @param _strategyId a uid for each strategy set by:
    /// bytes4(keccak256("StrategyName"))
    function setStrategyApprovalState(bytes4 _strategyId, LocalRegistrarLib.StrategyApprovalState _approvalState)
        external;

    /// @notice Change which pair of vault addresses a strategy points to
    /// @dev Set the approval bool and both locked/liq vault addrs for a specified strategyId.
    /// @param _strategyId a uid for each strategy set by:
    /// bytes4(keccak256("StrategyName"))
    /// @param _liqAddr address to a comptaible Liquid type Vault
    /// @param _lockAddr address to a compatible Locked type Vault
    function setStrategyParams(
        bytes4 _strategyId,
        address _liqAddr,
        address _lockAddr,
        LocalRegistrarLib.StrategyApprovalState _approvalState
    ) external;

    function setTokenAccepted(address _tokenAddr, bool _isAccepted) external;

    function setGasByToken(address _tokenAddr, uint256 _gasFee) external;

    function setVaultOperatorApproved(address _operator, bool _isApproved) external;
}