// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import "./IVault.sol";

abstract contract IRegistrar {

    event RebalanceParamsChanged(RebalanceParams newRebalanceParams);
    event SplitDetailsChanged(SplitDetails newSplitDetails);
    event AngelProtocolParamsChanged(
        AngelProtocolParams newAngelProtocolParams
    );
    event TokenAcceptanceChanged(address indexed tokenAddr, bool isAccepted);
    event StrategyApprovalChanged(
        bytes4 indexed _strategyId,
        bool _isApproved
    );
    event StrategyParamsChanged(
        bytes4 indexed _strategyId,
        address indexed _liqAddr,
        address indexed _lockAddr,
        bool _isApproved
    );


    struct RebalanceParams {
        bool rebalanceLiquidProfits;
        bool lockedRebalanceToLiquid;
        uint32 interestDistribution;
        bool lockedPrincipleToLiquid;
        uint32 principleDistribution;
    }

    struct SplitDetails {
        uint32 min;
        uint32 max;
        uint32 nominal;
    }

    struct AngelProtocolParams {
        uint32 protocolTaxRate;
        uint32 protocolTaxBasis;
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

    // View methods for returning stored params
    function getRebalanceParams()
        external
        view
        virtual
        returns (RebalanceParams memory);

    function getSplitDetails()
        external
        view
        virtual
        returns (SplitDetails memory);

    function getAngelProtocolParams()
        external
        view
        virtual
        returns (AngelProtocolParams memory);

    // Setter meothods for granular changes to specific params
    function setKeeper(address _keeper) external virtual;

    function setRebalanceParams(RebalanceParams calldata _rebalanceParams)
        external
        virtual;

    function setSplitDetails(SplitDetails calldata _splitDetails)
        external
        virtual;

    function setAngelProtocolParams(
        AngelProtocolParams calldata _angelProtocolParams
    ) external virtual;


    /// @notice Change whether a strategy is approved 
    /// @dev Set the approval bool for a specified strategyId. 
    /// @param _strategyId a uid for each strategy set by:
    /// bytes4(keccak256("StrategyName"))
    function setStrategyApproved(bytes4 _strategyId, bool _isApproved) external virtual;

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

// Registrar config from Cosmos def/impl.

// pub struct Config {
//     pub owner: Addr,               // AP TEAM MULTISIG
//     pub applications_review: Addr, // Endowment application review team's CW3 (set as owner to start). Owner can set and change/revoke.
//     pub index_fund_contract: Option<Addr>,
//     pub accounts_contract: Option<Addr>,
//     pub treasury: Addr,
//     pub rebalance: RebalanceDetails, // parameters to guide rebalancing & harvesting of gains from locked/liquid accounts
//     pub split_to_liquid: SplitDetails, // set of max, min, and default Split paramenters to check user defined split input against
//     pub halo_token: Option<Addr>,      // TerraSwap HALO token addr
//     pub gov_contract: Option<Addr>,    // AP governance contract
//     pub charity_shares_contract: Option<Addr>, // Charity Shares staking contract
//     pub swaps_router: Option<Addr>,    // swaps router contract
//     pub cw3_code: Option<u64>,
//     pub cw4_code: Option<u64>,
//     pub accepted_tokens: AcceptedTokens, // list of approved native and CW20 coins can accept inward
// }

// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// #[serde(rename_all = "snake_case")]
// pub struct SplitDetails {
//     pub max: Decimal,
//     pub min: Decimal,
//     pub default: Decimal, // for when a split parameter is not provided
// }

// impl SplitDetails {
//     pub fn default() -> Self {
//         SplitDetails {
//             min: Decimal::zero(),
//             max: Decimal::one(),
//             default: Decimal::percent(50),
//         }
//     }
// }

// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// #[serde(rename_all = "snake_case")]
// pub struct RebalanceDetails {
//     pub rebalance_liquid_invested_profits: bool, // should invested portions of the liquid account be rebalanced?
//     pub locked_interests_to_liquid: bool, // should Locked acct interest earned be distributed to the Liquid Acct?
//     pub interest_distribution: Decimal, // % of Locked acct interest earned to be distributed to the Liquid Acct
//     pub locked_principle_to_liquid: bool, // should Locked acct principle be distributed to the Liquid Acct?
//     pub principle_distribution: Decimal, // % of Locked acct principle to be distributed to the Liquid Acct
// }

// impl RebalanceDetails {
//     pub fn default() -> Self {
//         RebalanceDetails {
//             rebalance_liquid_invested_profits: false,
//             locked_interests_to_liquid: false,
//             interest_distribution: Decimal::percent(20),
//             locked_principle_to_liquid: false,
//             principle_distribution: Decimal::zero(),
//         }
//     }
// }
