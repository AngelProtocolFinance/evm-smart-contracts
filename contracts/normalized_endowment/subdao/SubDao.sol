// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {SubDaoMessages} from "./message.sol";
import {SubDaoLib} from "./SubDaoLib.sol";
import {Validator} from "../../core/validator.sol";
import {LibAccounts} from "../../core/accounts/lib/LibAccounts.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {Array} from "../../lib/array.sol";
import {ProxyContract} from "./../../core/proxy.sol";
import {IRegistrar} from "../../core/registrar/interfaces/IRegistrar.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {SubDaoTokenMessage} from "./../subdao-token/message.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ISubDaoEmitter} from "./ISubDaoEmitter.sol";
import {ISubDao} from "./ISubDao.sol";
import "./Token/ERC20.sol";
import "./storage.sol";

contract SubDao is ISubDao, Storage, ReentrancyGuard, Initializable {
  address emitterAddress;
  address accountAddress;

  /**
   * @notice function used to initialize the contract
   * @dev Initialize the contract
   * @param details The message used to initialize the contract
   * @param _emitterAddress The address of the SubDao event emitter contract
   */
  function initializeSubDao(
    SubDaoMessages.InstantiateMsg memory details,
    address _emitterAddress
  ) public initializer {
    require(Validator.addressChecker(_emitterAddress), "Invalid emitter address");
    require(Validator.addressChecker(details.registrarContract), "Invalid registrarContract");
    require(Validator.addressChecker(details.owner), "Invalid owner");

    emitterAddress = _emitterAddress;

    config = SubDaoStorage.Config({
      registrarContract: details.registrarContract,
      owner: details.owner,
      daoToken: address(0),
      veToken: address(0),
      swapFactory: address(0),
      quorum: details.quorum,
      threshold: details.threshold,
      votingPeriod: details.votingPeriod,
      timelockPeriod: details.timelockPeriod,
      expirationPeriod: details.expirationPeriod,
      proposalDeposit: details.proposalDeposit,
      snapshotPeriod: details.snapshotPeriod
    });
    accountAddress = msg.sender;

    state = SubDaoStorage.State({pollCount: 0, totalShare: 0, totalDeposit: 0});
  }

  /**
   * @notice function used to build the dao token message
   * @dev Build the dao token message
   * @param details The message used to build the dao token message
   */
  function buildDaoTokenMesage(SubDaoMessages.InstantiateMsg memory details) public {
    require(msg.sender == accountAddress, "Unauthorized");
    RegistrarStorage.Config memory registrar_config = IRegistrar(config.registrarContract)
      .queryConfig();

    if (
      details.token.token == SubDaoLib.TokenType.Existing &&
      details.endowType == LibAccounts.EndowmentType.Normal
    ) {
      require(
        IRegistrar(config.registrarContract).isTokenAccepted(details.token.data.existingData),
        "NotInApprovedCoins"
      );
      config.daoToken = details.token.data.existingData;
    } else if (
      details.token.token == SubDaoLib.TokenType.New &&
      details.endowType == LibAccounts.EndowmentType.Normal
    ) {
      bytes memory callData = abi.encodeWithSignature(
        "initErC20(string,string,address,uint256,address)",
        details.token.data.newName,
        details.token.data.newSymbol,
        details.endowOwner,
        details.token.data.newInitialSupply,
        address(0)
      );
      config.daoToken = address(
        new ProxyContract(
          registrar_config.subdaoTokenContract,
          registrar_config.proxyAdmin,
          callData
        )
      );
    } else if (
      details.token.token == SubDaoLib.TokenType.VeBonding &&
      details.endowType == LibAccounts.EndowmentType.Normal
    ) {
      SubDaoTokenMessage.InstantiateMsg memory temp = SubDaoTokenMessage.InstantiateMsg({
        name: details.token.data.veBondingName,
        symbol: details.token.data.veBondingSymbol,
        reserveDenom: details.token.data.veBondingReserveDenom,
        ve_type: details.token.data.veBondingType.ve_type,
        unbondingPeriod: details.token.data.veBondingPeriod
      });
      bytes memory callData = abi.encodeWithSignature(
        "continuosToken((string,string,address,uint8,uint256),address)",
        temp,
        emitterAddress
      );
      config.daoToken = address(
        new ProxyContract(
          registrar_config.subdaoBondingTokenContract,
          registrar_config.proxyAdmin,
          callData
        )
      );
    } else if (
      details.token.token == SubDaoLib.TokenType.VeBonding &&
      details.endowType == LibAccounts.EndowmentType.Charity
    ) {
      require(
        Validator.addressChecker(registrar_config.haloToken),
        "Registrar's HALO token address is empty"
      );

      SubDaoTokenMessage.InstantiateMsg memory temp = SubDaoTokenMessage.InstantiateMsg({
        name: details.token.data.veBondingName,
        symbol: details.token.data.veBondingSymbol,
        reserveDenom: registrar_config.haloToken,
        ve_type: details.token.data.veBondingType.ve_type,
        unbondingPeriod: 21 days
      });

      bytes memory callData = abi.encodeWithSignature(
        "continuosToken((string,string,address,uint8,uint256),address)",
        temp,
        emitterAddress
      );
      config.daoToken = address(
        new ProxyContract(
          registrar_config.subdaoBondingTokenContract,
          registrar_config.proxyAdmin,
          callData
        )
      );
    } else {
      revert("InvalidInputs");
    }

    bytes memory cw900lvData = abi.encodeWithSignature(
      "initialize(address,string,string)",
      config.daoToken,
      "LV900",
      "LV900"
    );

    config.veToken = address(
      new ProxyContract(registrar_config.cw900lvAddress, registrar_config.proxyAdmin, cw900lvData)
    );

    //TODO: handle on sub graph if there is no entry create one for the subgraph
    ISubDaoEmitter(emitterAddress).updateSubDaoConfig();
  }

  /**
   * @notice function used to register the ve bonding token and swap factory contract addresses
   * @param veToken The address of the ve bonding token contract
   * @param swapFactory The address of the swap factory contract
   */
  function registerContracts(address veToken, address swapFactory) external {
    require(config.owner == msg.sender, "Unauthorized");

    require(Validator.addressChecker(veToken), "Invalid veToken");
    require(Validator.addressChecker(swapFactory), "Invalid swapFactory");

    config.veToken = veToken;
    config.swapFactory = swapFactory;
    ISubDaoEmitter(emitterAddress).updateSubDaoConfig();
  }

  /**
   * @notice function used to update the config
   * @dev Update the config
   * @param owner The address of the owner
   * @param quorum The quorum value
   * @param threshold The threshold value
   * @param votingperiod The voting period value
   * @param timelockperiod The timelock period value
   * @param expirationperiod The expiration period value
   * @param proposaldeposit The proposal deposit value
   * @param snapshotperiod The snapshot period value
   */
  function updateConfig(
    address owner,
    uint256 quorum,
    uint256 threshold,
    uint256 votingperiod,
    uint256 timelockperiod,
    uint256 expirationperiod,
    uint256 proposaldeposit,
    uint256 snapshotperiod
  ) external {
    require(config.owner == msg.sender, "Unauthorized");

    if (Validator.addressChecker(owner)) {
      config.owner = owner;
    }

    require(SubDaoLib.validateQuorum(quorum), "InvalidQuorum");
    require(SubDaoLib.validateThreshold(threshold), "InvalidThreshold");

    config.quorum = quorum;
    config.threshold = threshold;
    config.votingPeriod = votingperiod;
    config.timelockPeriod = timelockperiod;
    config.expirationPeriod = expirationperiod;
    config.proposalDeposit = proposaldeposit;
    config.snapshotPeriod = snapshotperiod;
    ISubDaoEmitter(emitterAddress).updateSubDaoConfig();
  }

  /**
   * @notice function used to create a poll
   * @dev Create a poll
   * @param depositamount The deposit amount
   * @param title The title of the poll
   * @param description The description of the poll
   * @param link The link of the poll
   * @param executeMsgs The execute data
   */
  function createPoll(
    uint256 depositamount,
    string memory title,
    string memory description,
    string memory link,
    SubDaoStorage.ExecuteData memory executeMsgs
  ) external nonReentrant returns (uint256) {
    require(SubDaoLib.validateDescription(description));
    require(SubDaoLib.validateTitle(title));
    require(SubDaoLib.validateLink(link));

    require(depositamount >= config.proposalDeposit, "InsufficientProposalDeposit");

    if (depositamount > 0) {
      IERC20(config.daoToken).transferFrom(msg.sender, address(this), depositamount);
      ISubDaoEmitter(emitterAddress).transferSubDao(
        config.daoToken,
        msg.sender,
        address(this),
        depositamount
      );
    }

    uint256 pollId = state.pollCount + 1;

    state.pollCount += 1;
    state.totalDeposit += depositamount;

    ISubDaoEmitter(emitterAddress).updateSubDaoState();

    uint256 stakedAmount = SubDaoLib.queryTotalVotingBalanceAtBlock(config.veToken, block.number);

    SubDaoStorage.Poll memory a_poll = SubDaoStorage.Poll({
      id: pollId,
      creator: msg.sender,
      status: SubDaoStorage.PollStatus.InProgress,
      yesVotes: 0,
      noVotes: 0,
      startTime: block.timestamp,
      endHeight: block.number + config.votingPeriod,
      title: title,
      description: description,
      link: link,
      executeData: executeMsgs,
      depositAmount: depositamount,
      totalBalanceAtEndPoll: 0,
      stakedAmount: stakedAmount,
      startBlock: block.number
    });

    poll[pollId] = a_poll;
    poll_status[pollId] = SubDaoStorage.PollStatus.InProgress;
    ISubDaoEmitter(emitterAddress).updateSubDaoPollAndStatus(
      pollId,
      msg.sender,
      poll_status[pollId]
    );

    return pollId;
  }

  /**
   * @notice function used to end a poll
   * @dev End a poll
   * @param pollid The poll id
   */
  function endPoll(uint256 pollid) external nonReentrant {
    address[] memory target;
    uint256[] memory value;
    bytes[] memory callData;

    SubDaoStorage.Poll memory a_poll = poll[pollid];

    require(a_poll.status == SubDaoStorage.PollStatus.InProgress, "PollNotInProgress");

    require(a_poll.endHeight < block.number, "PollVotingPeriod");

    uint256 talliedWeight = a_poll.noVotes + a_poll.yesVotes;

    SubDaoStorage.PollStatus temp_poll_status = SubDaoStorage.PollStatus.Rejected;
    string memory rejected_reason = "";
    bool passed = false;

    uint256 stakedAmount = a_poll.stakedAmount;

    {
      uint256 quorum;
      uint256 stakedWeight;
      if (stakedAmount == 0) {
        (quorum, stakedWeight) = (0, 0);
      } else {
        (quorum, stakedWeight) = ((talliedWeight * 100) / stakedAmount, stakedAmount);
      }

      if (talliedWeight == 0 || quorum < config.quorum) {
        // Quorum: More than quorum of the total staked tokens at the end of the voting
        // period need to have participated in the vote.
        rejected_reason = "Quorum not reached";
      } else {
        if ((a_poll.yesVotes * 100) / talliedWeight > config.threshold) {
          temp_poll_status = SubDaoStorage.PollStatus.Passed;
          passed = true;
        } else {
          rejected_reason = "Threshold not reached";
        }

        if (a_poll.depositAmount != 0) {
          target = new address[](1);
          value = new uint256[](1);
          callData = new bytes[](1);

          target[0] = config.daoToken;
          value[0] = 0;
          callData[0] = abi.encodeWithSignature(
            "transfer(address,uint256)",
            a_poll.creator,
            a_poll.depositAmount
          );
          ISubDaoEmitter(emitterAddress).transferSubDao(
            config.daoToken,
            address(this),
            a_poll.creator,
            a_poll.depositAmount
          );
        }
      }
      a_poll.totalBalanceAtEndPoll = stakedWeight;
    }

    state.totalDeposit -= a_poll.depositAmount;

    poll_status[pollid] = temp_poll_status;

    a_poll.status = temp_poll_status;

    poll[pollid] = a_poll;

    _execute(target, value, callData);
    ISubDaoEmitter(emitterAddress).updateSubDaoState();
    ISubDaoEmitter(emitterAddress).updateSubDaoPollAndStatus(
      pollid,
      msg.sender,
      poll_status[pollid]
    );
  }

  //TODO: complete this function, add events
  /**
   * @notice function used to execute a poll
   * @dev Execute a poll
   * @param pollid The poll id
   */
  function executePoll(uint256 pollid) external nonReentrant {
    SubDaoStorage.Poll memory a_poll = poll[pollid];

    require(a_poll.status == SubDaoStorage.PollStatus.Passed, "PollNotPassed");

    require(a_poll.endHeight + config.timelockPeriod < block.number, "TimelockNotExpired");

    poll_status[pollid] = SubDaoStorage.PollStatus.Executed;

    a_poll.status = SubDaoStorage.PollStatus.Executed;

    poll[pollid] = a_poll;

    require(a_poll.executeData.order.length > 0, "NoExecuteData");

    uint256[] memory sortedOrder = new uint256[](a_poll.executeData.order.length);

    sortedOrder = Array.sort(a_poll.executeData.order);

    uint256 maxOrder = Array.max(a_poll.executeData.order);

    uint256[] memory orderManager = new uint256[](maxOrder + 1);

    for (uint8 i = 0; i < sortedOrder.length; i++) {
      orderManager[sortedOrder[i]] = i;
    }

    address[] memory target = new address[](a_poll.executeData.order.length);
    uint256[] memory value = new uint256[](a_poll.executeData.order.length);
    bytes[] memory callData = new bytes[](a_poll.executeData.order.length);

    for (uint256 i = 0; i < a_poll.executeData.order.length; i++) {
      uint256 position = orderManager[a_poll.executeData.order[i]];

      target[position] = a_poll.executeData.contractAddress[i];
      callData[position] = a_poll.executeData.execution_message[i];
      value[position] = 0;
    }

    _execute(target, value, callData);
  }

  /**
   * @notice function used to expire a poll
   * @dev Expire a poll
   * @param pollid The poll id
   */
  function expirePoll(uint256 pollid) external {
    SubDaoStorage.Poll memory a_poll = poll[pollid];

    require(a_poll.status == SubDaoStorage.PollStatus.Passed, "PollNotPassed");

    require(a_poll.executeData.order.length != 0, "NoExecuteData");
    require(a_poll.endHeight + config.expirationPeriod < block.number, "PollNotExpired");

    poll_status[pollid] = SubDaoStorage.PollStatus.Expired;

    a_poll.status = SubDaoStorage.PollStatus.Expired;

    poll[pollid] = a_poll;
    ISubDaoEmitter(emitterAddress).updateSubDaoPollAndStatus(
      pollid,
      msg.sender,
      poll_status[pollid]
    );
  }

  /**
   * @notice function used to cast vote
   * @dev cast vote on a poll
   * @param pollid The poll id
   */
  function castVote(uint256 pollid, SubDaoStorage.VoteOption vote) external {
    require(pollid != 0, "PollNotFound");
    require(state.pollCount >= pollid, "PollNotFound");

    SubDaoStorage.Poll memory a_poll = poll[pollid];

    require(a_poll.status == SubDaoStorage.PollStatus.InProgress, "PollNotInProgress");

    require(a_poll.endHeight >= block.number, "PollNotInProgress");

    require(!(voting_status[pollid][msg.sender].voted), "AlreadyVoted");

    uint256 amount = SubDaoLib.queryAddressVotingBalanceAtBlock(
      config.veToken,
      msg.sender,
      a_poll.startBlock
    );

    if (SubDaoStorage.VoteOption.Yes == vote) {
      a_poll.yesVotes += amount;
    } else {
      a_poll.noVotes += amount;
    }

    voting_status[pollid][msg.sender].voted = true;
    voting_status[pollid][msg.sender].balance = amount;
    voting_status[pollid][msg.sender].vote = vote;
    ISubDaoEmitter(emitterAddress).updateVotingStatus(pollid, msg.sender);

    poll[pollid] = a_poll;
    ISubDaoEmitter(emitterAddress).updateSubDaoPoll(pollid, msg.sender);
  }

  /**
   * @notice function used to query config
   * @dev query config
   */
  function queryConfig() public view returns (SubDaoMessages.QueryConfigResponse memory) {
    SubDaoMessages.QueryConfigResponse memory response = SubDaoMessages.QueryConfigResponse({
      owner: config.owner,
      daoToken: config.daoToken,
      veToken: config.veToken,
      swapFactory: config.swapFactory,
      quorum: config.quorum,
      threshold: config.threshold,
      votingPeriod: config.votingPeriod,
      timelockPeriod: config.timelockPeriod,
      expirationPeriod: config.expirationPeriod,
      proposalDeposit: config.proposalDeposit,
      snapshotPeriod: config.snapshotPeriod
    });

    return response;
  }

  /**
   * @notice function used to query state of contract
   * @dev query contract state
   */
  function queryState() public view returns (SubDaoStorage.State memory) {
    return state;
  }

  /**
   * @notice internal function used to execute external calls
   * @dev sends external calls to target addresses with values and calldata
   * @param targets target addresses
   * @param values values to be sent with call
   * @param callData calldata to be sent with call
   */
  function _execute(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory callData
  ) internal {
    string memory errorMessage = "call reverted without message";
    for (uint256 i = 0; i < targets.length; ++i) {
      (bool success, bytes memory returndata) = targets[i].call{value: values[i]}(callData[i]);
      Address.verifyCallResult(success, returndata, errorMessage);
    }
  }
}
