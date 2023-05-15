// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;
import {IRouter} from "./IRouter.sol";

library RouterLib {

    /*////////////////////////////////////////////////
                        METHODS
    */////////////////////////////////////////////////

    // Data packing methods
    function unpackCalldata(bytes memory _calldata)
        public pure
        returns (IRouter.VaultActionData memory)
    {
        (
            string memory destinationChain,
            bytes4 strategyId,
            bytes4 selector,
            uint32[] memory accountIds,
            address token,
            uint256 lockAmt,
            uint256 liqAmt,
            IRouter.VaultActionStatus status
        ) = abi.decode(
                _calldata,
                (string, bytes4, bytes4, uint32[], address, uint256, uint256, IRouter.VaultActionStatus)
            );

        return
            IRouter.VaultActionData(
                destinationChain,
                strategyId,
                selector,
                accountIds,
                token,
                lockAmt,
                liqAmt,
                status
            );
    }

    function packCallData(IRouter.VaultActionData memory _calldata)
        public pure
        returns (bytes memory)
    {
        return
            abi.encode(
                _calldata.destinationChain,
                _calldata.strategyId,
                _calldata.selector,
                _calldata.accountIds,
                _calldata.token,
                _calldata.lockAmt,
                _calldata.liqAmt,
                _calldata.status
            );
    }
}