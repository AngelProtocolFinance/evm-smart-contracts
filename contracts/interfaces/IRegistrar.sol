// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import { IVault } from "./IVault.sol";

abstract contract IRegistrar {

    /*////////////////////////////////////////////////
                        AXELAR IMPL.
    */////////////////////////////////////////////////
    event RebalanceParamsChanged(RebalanceParams newRebalanceParams);
    event AngelProtocolParamsChanged(
        AngelProtocolParams newAngelProtocolParams
    );
    event TokenAcceptanceChanged(address indexed tokenAddr, bool isAccepted);
    event StrategyApprovalChanged(bytes4 indexed _strategyId, bool _isApproved);
    event StrategyParamsChanged(
        bytes4 indexed _strategyId,
        address indexed _liqAddr,
        address indexed _lockAddr,
        bool _isApproved
    );


    /*////////////////////////////////////////////////
                        CUSTOM TYPES
    */////////////////////////////////////////////////
    struct RebalanceParams {
        bool rebalanceLiquidProfits;
        bool lockedRebalanceToLiquid;
        uint32 interestDistribution;
        bool lockedPrincipleToLiquid;
        uint32 principleDistribution;
    }

    struct AngelProtocolParams {
        uint32 protocolTaxRate;
        uint32 protocolTaxBasis;
        string primaryChain;
        string primaryChainRouter;
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
        virtual
        returns (RebalanceParams memory);

    function getAngelProtocolParams()
        external
        view
        virtual
        returns (AngelProtocolParams memory);

    function getStrategyParamsById(bytes4 _strategyId)
        external
        view
        virtual
        returns (StrategyParams memory);

    function isTokenAccepted(address _tokenAddr) external view virtual returns (bool);

    function isStrategyApproved(bytes4 _strategyId)
        external
        view
        virtual
        returns (bool);
    
    // Setter meothods for granular changes to specific params
    function setRebalanceParams(RebalanceParams calldata _rebalanceParams)
        external
        virtual;

    function setAngelProtocolParams(
        AngelProtocolParams calldata _angelProtocolParams
    ) external virtual;

    /// @notice Change whether a strategy is approved
    /// @dev Set the approval bool for a specified strategyId.
    /// @param _strategyId a uid for each strategy set by:
    /// bytes4(keccak256("StrategyName"))
    function setStrategyApproved(bytes4 _strategyId, bool _isApproved)
        external
        virtual;

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
    ) external virtual;
}