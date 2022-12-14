// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import { IVault } from "./IVault.sol";
 
interface IRegistrar {

    /*////////////////////////////////////////////////
                        EVENTS
    */////////////////////////////////////////////////
    event RebalanceParamsChanged(RebalanceParams newRebalanceParams);
    event AngelProtocolParamsChanged(
        AngelProtocolParams newAngelProtocolParams
    );
    event TokenAcceptanceChanged(address indexed tokenAddr, bool isAccepted);
    event StrategyApprovalChanged(bytes4 indexed _strategyId, bool _isApproved);
    event StrategyParamsChanged(
        bytes4 indexed _strategyId,
        address indexed _lockAddr,
        address indexed _liqAddr,
        bool _isApproved
    );
    event GasFeeUpdated(address indexed _tokenAddr, uint256 _gasFee); 


    /*////////////////////////////////////////////////
                        CUSTOM TYPES
    */////////////////////////////////////////////////
    struct RebalanceParams {
        bool rebalanceLiquidProfits;
        uint32 lockedRebalanceToLiquid;
        uint32 interestDistribution;
        bool lockedPrincipleToLiquid;
        uint32 principleDistribution;
    }

    struct AngelProtocolParams {
        uint32 protocolTaxRate;
        uint32 protocolTaxBasis;
        address protocolTaxCollector;
        string primaryChain;
        string primaryChainRouter;
        address routerAddr;
    }

    struct StrategyParams {
        bool isApproved;
        VaultParams Locked;
        VaultParams Liquid;
    }

    struct VaultParams {
        IVault.VaultType Type;
        address vaultAddr;
    }

    /*////////////////////////////////////////////////
                    EXTERNAL METHODS
    */////////////////////////////////////////////////

    // View methods for returning stored params
    function getRebalanceParams()
        external
        view
        returns (RebalanceParams memory);

    function getAngelProtocolParams()
        external
        view
        returns (AngelProtocolParams memory);

    function getStrategyParamsById(bytes4 _strategyId)
        external
        view
        returns (StrategyParams memory);

    function isTokenAccepted(address _tokenAddr) external view returns (bool);

    function getGasByToken(address _tokenAddr) external view returns (uint256);

    function isStrategyApproved(bytes4 _strategyId)
        external
        view
        returns (bool);
    
    // Setter meothods for granular changes to specific params
    function setRebalanceParams(RebalanceParams calldata _rebalanceParams)
        external;

    function setAngelProtocolParams(
        AngelProtocolParams calldata _angelProtocolParams
    ) external;

    /// @notice Change whether a strategy is approved
    /// @dev Set the approval bool for a specified strategyId.
    /// @param _strategyId a uid for each strategy set by:
    /// bytes4(keccak256("StrategyName"))
    function setStrategyApproved(bytes4 _strategyId, bool _isApproved)
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
        bool _isApproved
    ) external;

    function setTokenAccepted(address _tokenAddr, bool _isAccepted) external;

    function setGasByToken(address _tokenAddr, uint256 _gasFee) external;
}