// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import { IRegistrar } from "./interfaces/IRegistrar.sol";
import { IVault } from "./interfaces/IVault.sol";
import { RegistrarConfig } from "./lib/RegistrarConfig.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Registrar is IRegistrar, OwnableUpgradeable {
    RebalanceParams public rebalanceParams;
    SplitDetails public splitDetails;
    AngelProtocolParams public angelProtocolParams;

    mapping(bytes4 => StrategyParams) VaultsByStrategyId;
    mapping(address => bool) AcceptedTokens;

    /// @notice ProxyUpgradable comptaible initialization
    /// @dev Pattern is required in lieu of constructor when using Proxy upgradeable
    /// Will only be called once upon deployment.
    function initialize() public initializer {
        __Ownable_init_unchained();

        rebalanceParams = RebalanceParams(
            RegistrarConfig.REBALANCE_LIQUID_PROFITS,
            RegistrarConfig.LOCKED_REBALANCE_TO_LIQUID,
            RegistrarConfig.INTEREST_DISTRIBUTION,
            RegistrarConfig.LOCKED_PRINCIPLE_TO_LIQUID,
            RegistrarConfig.PRINCIPLE_DISTRIBUTION
        );

        splitDetails = SplitDetails(
            RegistrarConfig.SPLIT_MIN,
            RegistrarConfig.SPLIT_MAX,
            RegistrarConfig.SPLIT_NOMINAL
        );

        angelProtocolParams = AngelProtocolParams(
            RegistrarConfig.PROTOCOL_TAX_RATE,
            RegistrarConfig.PROTOCOL_TAX_BASIS,
            RegistrarConfig.PRIMARY_CHAIN,
            RegistrarConfig.PRIMARY_CHAIN_ROUTER_ADDRESS
        );
    }

    // Getters
    function getRebalanceParams()
        external
        view
        override
        returns (RebalanceParams memory)
    {
        return rebalanceParams;
    }

    function getSplitDetails()
        external
        view
        override
        returns (SplitDetails memory)
    {
        return splitDetails;
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

    // Config Setters

    function setRebalanceParams(RebalanceParams calldata _rebalanceParams)
        external
        override
        onlyOwner
    {
        rebalanceParams = _rebalanceParams;
        emit RebalanceParamsChanged(_rebalanceParams);
    }

    function setSplitDetails(SplitDetails calldata _splitDetails)
        external
        override
        onlyOwner
    {
        splitDetails = _splitDetails;
        emit SplitDetailsChanged(_splitDetails);
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
}
