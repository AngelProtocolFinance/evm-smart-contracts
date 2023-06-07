// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//Libraries
import {AngelCoreStruct} from "../struct.sol";

interface IIndexFund {
    function queryFundDetails(
        uint256 fundId
    ) external view returns (AngelCoreStruct.IndexFund memory);

    function queryInvolvedFunds(
        uint256 endowmentId
    ) external view returns (AngelCoreStruct.IndexFund[] memory);

    function removeMember(uint256 member) external view returns (bool);
}
