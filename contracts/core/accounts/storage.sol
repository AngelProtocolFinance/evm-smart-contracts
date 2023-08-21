// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {LibAccounts} from "./lib/LibAccounts.sol";
import {LocalRegistrarLib} from "../registrar/lib/LocalRegistrarLib.sol";
import {IterableMappingAddr} from "../../lib/IterableMappingAddr.sol";
import {IVault} from "../vault/interfaces/IVault.sol";

library AccountStorage {
  struct Config {
    address owner;
    string version;
    string networkName;
    address registrarContract;
    uint32 nextAccountId;
    bool reentrancyGuardLocked;
  }

  struct Endowment {
    address owner;
    string name; // name of the Endowment
    uint256[] sdgs;
    LibAccounts.Tier tier; // SHOULD NOT be editable for now (only the Config.owner, ie via the Gov contract or AP Team Multisig can set/update)
    LibAccounts.EndowmentType endowType;
    string logo;
    string image;
    uint256 maturityTime; // datetime int of endowment maturity
    LocalRegistrarLib.RebalanceParams rebalance; // parameters to guide rebalancing & harvesting of gains from locked/liquid accounts
    uint256 proposalLink; // @dev links back the Applications Team Multisig Proposal that created an endowment (if a Charity)
    address multisig;
    address dao;
    address donationMatch; // @dev only applies to ASTs (Charity & DAF use Halo Donation Match Contract in Registrar)
    bool donationMatchActive;
    LibAccounts.FeeSetting earlyLockedWithdrawFee;
    LibAccounts.FeeSetting withdrawFee;
    LibAccounts.FeeSetting depositFee;
    LibAccounts.FeeSetting balanceFee;
    LibAccounts.SettingsController settingsController;
    uint32 parent;
    bool ignoreUserSplits;
    LibAccounts.SplitDetails splitToLiquid;
    uint256 referralId;
    address gasFwd;
  }

  struct EndowmentState {
    bool closingEndowment;
    LibAccounts.Beneficiary closingBeneficiary;
  }

  struct TokenAllowances {
    uint256 totalOutstanding;
    // spender Addr -> amount
    mapping(address => uint256) bySpender;
  }

  struct State {
    mapping(uint32 => Endowment) Endowments;
    mapping(uint32 => EndowmentState) States;
    mapping(uint32 => mapping(IVault.VaultType => mapping(address => uint256))) Balances;
    // endow ID -> token Addr -> TokenAllowances
    mapping(uint32 => mapping(address => TokenAllowances)) Allowances;
    // endow ID -> token Addr -> bool
    mapping(uint32 => mapping(address => bool)) AcceptedTokens;
    // endow ID -> token Addr -> Price Feed Addr
    mapping(uint32 => mapping(address => address)) PriceFeeds;
    // endow ID -> strategies that an Endowment is invested
    mapping(uint32 => mapping(bytes4 => bool)) ActiveStrategies;
    // Endowments that a DAF can withdraw to, managed by contract Owner
    mapping(uint32 => bool) DafApprovedEndowments;
    // Endowments AllowLists Iterable mappings
    mapping(uint32 => mapping(LibAccounts.AllowlistType => IterableMappingAddr.Map)) Allowlists;
    Config config;
  }
}

contract Storage {
  AccountStorage.State state;
}
