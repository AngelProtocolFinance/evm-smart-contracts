// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
// import {Cw3EndowmentMessages,CW3Endowment} from "./../../../normalized_endowment/cw3-endowment/CW3Endowment.sol";
import {SubDao, subDaoMessage} from "./../../../normalized_endowment/subdao/subdao.sol";

interface IAccountDeployContract {
    // function createCW3endowment(Cw3EndowmentMessages.EndowmentInstantiateMsg memory curCw3createendowmentmessage) external returns(address CW3EndowmentAddress);

    function createDaoContract(
        subDaoMessage.InstantiateMsg memory curCreatedaomessage
    ) external returns (address daoAddress);
}
