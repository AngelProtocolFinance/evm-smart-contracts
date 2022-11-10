// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

abstract contract Registrar {

    address keeperAddress;

    struct RebalanceParams {
        uint256 splitToLocked;
        uint256 splitToLiquid;
    }

    mapping(address => bool) ApprovedVaults;

    struct AngelProtocolParams {
        uint256 protocolTaxRate;
        uint256 protocolTaxBasis;
    }

} 

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