// SPDX-License-Identifier: MIT
// author: @stevieraykatz
pragma solidity >=0.8.0;

library APGoldfinchConfigLib {

    uint256 constant DEFAULT_SLIPPAGE = 1; // 1%

    struct APGoldfinchConfig {
        CRVParams crvParams;
    }

    struct CRVParams {
        uint256 allowedSlippage; // as a percentage of the total USDC being claimed
    }

    /*////////////////////////////////////////////////
                        STORAGE MGMT
    */////////////////////////////////////////////////
    bytes32 constant GOLDFINCH_STORAGE_POSITION =
        keccak256("goldfinch.registrar.storage");

    function goldfinchRegistrarStorage()
        internal
        pure
        returns (APGoldfinchConfig storage grs)
    {
        bytes32 position = GOLDFINCH_STORAGE_POSITION;
        assembly {
            grs.slot := position
        }
    }
}