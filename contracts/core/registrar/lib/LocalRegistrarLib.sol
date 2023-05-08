// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import { IVault } from "../../../interfaces/IVault.sol";

library LocalRegistrarLib {

  /*////////////////////////////////////////////////
                      DEPLOYMENT DEFAULTS
  */////////////////////////////////////////////////
    bool constant REBALANCE_LIQUID_PROFITS = false;
    uint32 constant LOCKED_REBALANCE_TO_LIQUID = 75; // 75%
    uint32 constant INTEREST_DISTRIBUTION = 20;      // 20%
    bool constant LOCKED_PRINCIPLE_TO_LIQUID = false;
    uint32 constant PRINCIPLE_DISTRIBUTION = 0;
    uint32 constant BASIS = 100;

    // DEFAULT ANGEL PROTOCOL PARAMS
    uint32 constant PROTOCOL_TAX_RATE = 2;
    uint32 constant PROTOCOL_TAX_BASIS = 100;
    address constant PROTOCOL_TAX_COLLECTOR = address(0);
    address constant ROUTER_ADDRESS = address(0);
    address constant REFUND_ADDRESS = address(0);

  /*////////////////////////////////////////////////
                      CUSTOM TYPES
  */////////////////////////////////////////////////
    struct RebalanceParams { 
        bool rebalanceLiquidProfits;
        uint32 lockedRebalanceToLiquid;
        uint32 interestDistribution;
        bool lockedPrincipleToLiquid;
        uint32 principleDistribution;
        uint32 basis;
    }

    struct AngelProtocolParams { 
        uint32 protocolTaxRate;
        uint32 protocolTaxBasis;
        address protocolTaxCollector;
        address routerAddr;
        address refundAddr;
    }

    enum StrategyApprovalState {
        NOT_APPROVED,
        APPROVED,
        WITHDRAW_ONLY,
        DEPRECATED
    }

    struct StrategyParams {
        StrategyApprovalState approvalState;
        VaultParams Locked;
        VaultParams Liquid;
    }

    struct VaultParams {
        IVault.VaultType Type;
        address vaultAddr;
    }

    struct LocalRegistrarStorage {
      RebalanceParams rebalanceParams;
      AngelProtocolParams angelProtocolParams;
      mapping(bytes32 => string) accountsContractByChain;
      mapping(bytes4 => StrategyParams) VaultsByStrategyId;
      mapping(address => bool) AcceptedTokens;
      mapping(address=> uint256) GasFeeByToken;
    }

    /*////////////////////////////////////////////////
                        STORAGE MGMT
    */////////////////////////////////////////////////
    bytes32 constant LOCAL_REGISTRAR_STORAGE_POSITION =
        keccak256("local.registrar.storage");

    function localRegistrarStorage()
        internal
        pure
        returns (LocalRegistrarStorage storage lrs)
    {
        bytes32 position = LOCAL_REGISTRAR_STORAGE_POSITION;
        assembly {
            lrs.slot := position
        }
    }
}
