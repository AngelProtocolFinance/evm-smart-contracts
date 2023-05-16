// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {subDaoMessage} from "./message.sol";
import {subDaoStorage} from "./storage.sol";

contract SubdaoEmitter {
    bool initialized = false;
    address accountsContract;

    function initEmitter(address curAccountscontract) public {
        require(
            curAccountscontract != address(0),
            "Invalid accounts contract address"
        );
        require(!initialized, "Already Initialized");
        initialized = true;
        accountsContract = curAccountscontract;
    }

    mapping(address => bool) isSubdao;
    modifier isOwner() {
        require(msg.sender == accountsContract, "Unauthorized");
        _;
    }
    modifier isEmitter() {
        require(isSubdao[msg.sender], "Unauthorized");
        _;
    }
    event SubdaoInitialized(
        address subdao,
        subDaoMessage.InstantiateMsg instantiateMsg
    );
    event SubdaoUpdateConfig(address subdao, subDaoStorage.Config config);
    event SubdaoTransferFrom(
        address subdao,
        address tokenAddress,
        address from,
        address to,
        uint256 amount
    );
    event SubdaoUpdateState(address subdao, subDaoStorage.State state);
    event SubdaoUpdatePoll(address subdao, uint256 id, subDaoStorage.Poll poll);
    event SubdaoUpdatePollStatus(
        address subdao,
        uint256 id,
        subDaoStorage.PollStatus pollStatus
    );
    event SubdaoTransfer(
        address subdao,
        address tokenAddress,
        address recipient,
        uint amount
    );
    event SubdapUpdateVotingStatus(
        address subdao,
        uint256 pollId,
        address voter,
        subDaoStorage.VoterInfo voterInfo
    );

    function initializeSubdao(
        address subdao,
        subDaoMessage.InstantiateMsg memory instantiateMsg
    ) public isOwner {
        isSubdao[subdao] = true;
        emit SubdaoInitialized(msg.sender, instantiateMsg);
    }

    function updateSubdaoConfig(
        subDaoStorage.Config memory config
    ) public isEmitter {
        emit SubdaoUpdateConfig(msg.sender, config);
    }

    function transferFromSubdao(
        address tokenAddress,
        address from,
        address to,
        uint256 amount
    ) public isEmitter {
        emit SubdaoTransferFrom(msg.sender, tokenAddress, from, to, amount);
    }

    function updateSubdaoState(
        subDaoStorage.State memory state
    ) public isEmitter {
        emit SubdaoUpdateState(msg.sender, state);
    }

    function updateSubdaoPoll(
        uint256 id,
        subDaoStorage.Poll memory poll
    ) public isEmitter {
        emit SubdaoUpdatePoll(msg.sender, id, poll);
    }

    function transferSubdao(
        address tokenAddress,
        address recipient,
        uint amount
    ) public isEmitter {
        emit SubdaoTransfer(msg.sender, tokenAddress, recipient, amount);
    }

    function updateVotingStatus(
        uint256 pollId,
        address voter,
        subDaoStorage.VoterInfo memory voterInfo
    ) public isEmitter {
        emit SubdapUpdateVotingStatus(msg.sender, pollId, voter, voterInfo);
    }

    function updateSubdaoPollAndStatus(
        uint256 id,
        subDaoStorage.Poll memory poll,
        subDaoStorage.PollStatus pollStatus
    ) public isEmitter {
        emit SubdaoUpdatePoll(msg.sender, id, poll);
        emit SubdaoUpdatePollStatus(msg.sender, id, pollStatus);
    }
}
