// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "./interfaces/IRegistrar.sol";
import "./interfaces/IVault.sol";
import "./lib/RegistrarConfig.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Registrar is IRegistrar, OwnableUpgradeable {
    address public keeperAddress;
    RebalanceParams public rebalanceParams;
    SplitDetails public splitDetails;
    AngelProtocolParams public angelProtocolParams;

    mapping(bytes4 => StrategyParams) VaultsByStrategySelector;
    mapping(address => bool) AcceptedTokens;

    /// @notice ProxyUpgradable comptaible initialization
    /// @dev Pattern is required in lieu of constructor when using Proxy upgradeable
    /// Will only be called once upon deployment.
    function initialize() public initializer {
        __Ownable_init_unchained();
        keeperAddress = msg.sender;

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
            RegistrarConfig.PROTOCOL_TAX_BASIS
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

    function isTokenAccepted(address _tokenAddr) external view returns (bool) {
        return AcceptedTokens[_tokenAddr];
    }

    function isStrategyApproved(bytes4 _selector) external view returns (bool) {
        return VaultsByStrategySelector[_selector].isApproved;
    }

    // Config Setters
    function setKeeper(address _keeper) external override onlyOwner {
        keeperAddress = _keeper;
    }

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

    function setStrategyApproved(bytes4 _selector, bool _isApproved) external override onlyOwner {
        VaultsByStrategySelector[_selector].isApproved = _isApproved;

        emit StrategyApprovalChanged(
            _selector,
            _isApproved
        );
    }

    function setStrategyParams(
        bytes4 _selector,
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
        VaultsByStrategySelector[_selector] = StrategyParams(
            _isApproved,
            liquidParams,
            lockedParams
        );
        emit StrategyParamsChanged(
            _selector,
            _liqAddr,
            _lockAddr,
            _isApproved
        );
    }
}
