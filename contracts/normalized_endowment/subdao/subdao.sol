// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {subDaoMessage} from "./message.sol";
import {AngelCoreStruct} from "../../core/struct.sol";
import {RegistrarStorage} from "../../core/registrar/storage.sol";
import {Array} from "../../lib/array.sol";
import {ProxyContract} from "./../../core/proxy.sol";
import {IRegistrar} from "../../core/registrar/interfaces/IRegistrar.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {SubDaoTokenMessage} from "./../subdao-token/subdao-token.sol";
import {QueryIIncentivisedVotingLockup} from "./../incentivised-voting/interfaces/QueryIIncentivisedVotingLockup.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {ISubdaoEmitter} from "./ISubdaoEmitter.sol";
import "./Token/ERC20.sol";
import "./storage.sol";

// >> SHOULD BE MOVED INTO SEPARATE FILE?
library SubDaoLib {
  uint256 constant MIN_TITLE_LENGTH = 4;
  uint256 constant MAX_TITLE_LENGTH = 64;
  uint256 constant MIN_DESC_LENGTH = 4;
  uint256 constant MAX_DESC_LENGTH = 1024;
  uint256 constant MIN_LINK_LENGTH = 12;
  uint256 constant MAX_LINK_LENGTH = 128;

  /**
   * @dev internal function returns length of utf string
   * @param str string to be checked
   */
  function utfStringLength(string memory str) public pure returns (uint256 length) {
    uint256 i = 0;
    bytes memory string_rep = bytes(str);

    while (i < string_rep.length) {
      if (string_rep[i] >> 7 == 0) i += 1;
      else if (string_rep[i] >> 5 == bytes1(uint8(0x6))) i += 2;
      else if (string_rep[i] >> 4 == bytes1(uint8(0xE))) i += 3;
      else if (string_rep[i] >> 3 == bytes1(uint8(0x1E))) i += 4;
      else i += 1;

      length++;
    }
  }

  /**
   * @notice function used to validate title
   * @dev validate title
   * @param title title to be validated
   */
  function validateTitle(string memory title) public pure returns (bool) {
    require(utfStringLength(title) > MIN_TITLE_LENGTH, "Title too short");

    require(utfStringLength(title) < MAX_TITLE_LENGTH, "Title too long");

    return true;
  }

  /**
   * @notice function used to validate description
   * @dev validate description
   * @param description description to be validated
   */
  function validateDescription(string memory description) public pure returns (bool) {
    require(utfStringLength(description) > MIN_DESC_LENGTH, "Description too short");

    require(utfStringLength(description) < MAX_DESC_LENGTH, "Description too long");

    return true;
  }

  /**
   * @notice function used to validate link
   * @dev validate link
   * @param link link to be validated
   */

  function validateLink(string memory link) public pure returns (bool) {
    require(utfStringLength(link) > MIN_LINK_LENGTH, "Link too short");

    require(utfStringLength(link) < MAX_LINK_LENGTH, "Link too long");

    return true;
  }

  /**
   * @notice function used to validate quorum
   * @dev validate quorum
   * @param quorum quorum to be validated
   */
  function validateQuorum(uint256 quorum) public pure returns (bool) {
    require(quorum < 100, "quorum must be 0 to 100");

    return true;
  }

  /**
   * @notice function used to validate threshold
   * @dev validate threshold
   * @param threshold threshold to be validated
   */
  function validateThreshold(uint256 threshold) public pure returns (bool) {
    require(threshold < 100, "threshold must be 0 to 100");

    return true;
  }

  /**
   * @notice function used to query voting balance of an address
   * @dev query voting balance of an address
   * @param veAddr ve address
   * @param targetAddr address to be queried
   * @param blocknumber block number to be queried
   */
  function queryAddressVotingBalanceAtBlock(
    address veAddr,
    address targetAddr,
    uint256 blocknumber
  ) public view returns (uint256) {
    // return IERC20(veaddr).balanceOf(addr);
    return QueryIIncentivisedVotingLockup(veAddr).balanceOfAt(targetAddr, blocknumber);
  }

  /**
   * @notice function used to query total voting balance
   * @dev query total voting balance
   * @param veaddr ve address
   * @param blocknumber block number to be queried
   */
  function queryTotalVotingBalanceAtBlock(
    address veaddr,
    uint256 blocknumber
  ) public view returns (uint256) {
    return QueryIIncentivisedVotingLockup(veaddr).totalSupplyAt(blocknumber);
  }

  /**
   * @notice function used to build the dao token deployment message
   * @dev Build the dao token deployment message
   * @param token The token used to build the dao token
   * @param endowType The endowment type used to build the dao token
   * @param endowowner The endowment owner used to build the dao token
   */
  function buildDaoTokenMesage(
    AngelCoreStruct.DaoToken memory token,
    AngelCoreStruct.EndowmentType endowType,
    address endowowner,
    subDaoStorage.Config storage config,
    address emitterAddress
  ) public {
    RegistrarStorage.Config memory registrar_config = IRegistrar(config.registrarContract)
      .queryConfig();

    if (
      token.token == AngelCoreStruct.TokenType.Existing &&
      endowType == AngelCoreStruct.EndowmentType.Normal
    ) {
      require(
        IRegistrar(config.registrarContract).isTokenAccepted(token.data.existingData),
        "NotInApprovedCoins"
      );
      config.daoToken = token.data.existingData;
    } else if (
      token.token == AngelCoreStruct.TokenType.New &&
      endowType == AngelCoreStruct.EndowmentType.Normal
    ) {
      bytes memory callData = abi.encodeWithSignature(
        "initErC20(string,string,address,uint256,address)",
        token.data.newName,
        token.data.newSymbol,
        endowowner,
        token.data.newInitialSupply,
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
      token.token == AngelCoreStruct.TokenType.VeBonding &&
      endowType == AngelCoreStruct.EndowmentType.Normal
    ) {
      SubDaoTokenMessage.InstantiateMsg memory temp = SubDaoTokenMessage.InstantiateMsg({
        name: token.data.veBondingName,
        symbol: token.data.veBondingSymbol,
        reserveDenom: token.data.veBondingReserveDenom,
        ve_type: token.data.veBondingType.ve_type,
        unbondingPeriod: token.data.veBondingPeriod
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
      token.token == AngelCoreStruct.TokenType.VeBonding &&
      endowType == AngelCoreStruct.EndowmentType.Charity
    ) {
      require(registrar_config.haloToken != address(0), "Registrar's HALO token address is empty");

      SubDaoTokenMessage.InstantiateMsg memory temp = SubDaoTokenMessage.InstantiateMsg({
        name: token.data.veBondingName,
        symbol: token.data.veBondingSymbol,
        reserveDenom: registrar_config.haloToken,
        ve_type: token.data.veBondingType.ve_type,
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
    ISubdaoEmitter(emitterAddress).updateSubdaoConfig();
  }
}

contract SubDao is Storage, ReentrancyGuard {
  // using SafeMath for uint256;

  bool private initFlag = false;
  address emitterAddress;
  address accountAddress;

  // >> SHOULD INHERIT `Initializable`?
  /**
   * @notice function used to initialize the contract
   * @dev Initialize the contract
   * @param details The message used to initialize the contract
   */
  function initializeSubDao(
    subDaoMessage.InstantiateMsg memory details,
    address emitteraddress
  ) public {
    require(emitteraddress != address(0), "InvalidEmitterAddress");
    require(!initFlag, "Already initialised");
    initFlag = true;

    emitterAddress = emitteraddress;

    config = subDaoStorage.Config({
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

    state = subDaoStorage.State({pollCount: 0, totalShare: 0, totalDeposit: 0});
  }

  /**
   * @notice function used to build the dao token message
   * @dev Build the dao token message
   * @param details The message used to build the dao token message
   */
  function buildDaoTokenMesage(subDaoMessage.InstantiateMsg memory details) public {
    require(msg.sender == accountAddress, "Unauthorized");

    SubDaoLib.buildDaoTokenMesage(
      details.token,
      details.endowType,
      details.endowOwner,
      config,
      emitterAddress
    );
  }

  /**
   * @notice function used to register the contract address
   * @dev Register the contract address
   * @param vetoken The address of the ve token contract
   * @param swapfactory The address of the swap factory contract
   */
  function registerContract(address vetoken, address swapfactory) external {
    require(config.owner == msg.sender, "Unauthorized");

    require(vetoken != address(0), "Invalid input");
    require(swapfactory != address(0), "Invalid input");

    config.veToken = vetoken;
    config.swapFactory = swapfactory;
    ISubdaoEmitter(emitterAddress).updateSubdaoConfig();
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

    if (owner != address(0)) {
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
    ISubdaoEmitter(emitterAddress).updateSubdaoConfig();
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
    subDaoStorage.ExecuteData memory executeMsgs
  ) external nonReentrant returns (uint256) {
    require(SubDaoLib.validateDescription(description));
    require(SubDaoLib.validateTitle(title));
    require(SubDaoLib.validateLink(link));

    require(depositamount >= config.proposalDeposit, "InsufficientProposalDeposit");

    if (depositamount > 0) {
      IERC20(config.daoToken).transferFrom(msg.sender, address(this), depositamount);
      ISubdaoEmitter(emitterAddress).transferSubdao(
        config.daoToken,
        msg.sender,
        address(this),
        depositamount
      );
    }

    uint256 pollId = state.pollCount + 1;

    state.pollCount += 1;
    state.totalDeposit += depositamount;

    ISubdaoEmitter(emitterAddress).updateSubdaoState();

    uint256 stakedAmount = SubDaoLib.queryTotalVotingBalanceAtBlock(config.veToken, block.number);

    subDaoStorage.Poll memory a_poll = subDaoStorage.Poll({
      id: pollId,
      creator: msg.sender,
      status: subDaoStorage.PollStatus.InProgress,
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
    poll_status[pollId] = subDaoStorage.PollStatus.InProgress;
    ISubdaoEmitter(emitterAddress).updateSubdaoPollAndStatus(
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

    subDaoStorage.Poll memory a_poll = poll[pollid];

    require(a_poll.status == subDaoStorage.PollStatus.InProgress, "PollNotInProgress");

    require(a_poll.endHeight < block.number, "PollVotingPeriod");

    uint256 talliedWeight = a_poll.noVotes + a_poll.yesVotes;

    subDaoStorage.PollStatus temp_poll_status = subDaoStorage.PollStatus.Rejected;
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
          temp_poll_status = subDaoStorage.PollStatus.Passed;
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
          ISubdaoEmitter(emitterAddress).transferSubdao(
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
    ISubdaoEmitter(emitterAddress).updateSubdaoState();
    ISubdaoEmitter(emitterAddress).updateSubdaoPollAndStatus(
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
    subDaoStorage.Poll memory a_poll = poll[pollid];

    require(a_poll.status == subDaoStorage.PollStatus.Passed, "PollNotPassed");

    require(a_poll.endHeight + config.timelockPeriod < block.number, "TimelockNotExpired");

    poll_status[pollid] = subDaoStorage.PollStatus.Executed;

    a_poll.status = subDaoStorage.PollStatus.Executed;

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
    subDaoStorage.Poll memory a_poll = poll[pollid];

    require(a_poll.status == subDaoStorage.PollStatus.Passed, "PollNotPassed");

    require(a_poll.executeData.order.length != 0, "NoExecuteData");
    require(a_poll.endHeight + config.expirationPeriod < block.number, "PollNotExpired");

    poll_status[pollid] = subDaoStorage.PollStatus.Expired;

    a_poll.status = subDaoStorage.PollStatus.Expired;

    poll[pollid] = a_poll;
    ISubdaoEmitter(emitterAddress).updateSubdaoPollAndStatus(
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
  function castVote(uint256 pollid, subDaoStorage.VoteOption vote) external {
    require(pollid != 0, "PollNotFound");
    require(state.pollCount >= pollid, "PollNotFound");

    subDaoStorage.Poll memory a_poll = poll[pollid];

    require(a_poll.status == subDaoStorage.PollStatus.InProgress, "PollNotInProgress");

    require(a_poll.endHeight >= block.number, "PollNotInProgress");

    require(!(voting_status[pollid][msg.sender].voted), "AlreadyVoted");

    uint256 amount = SubDaoLib.queryAddressVotingBalanceAtBlock(
      config.veToken,
      msg.sender,
      a_poll.startBlock
    );

    if (subDaoStorage.VoteOption.Yes == vote) {
      a_poll.yesVotes += amount;
    } else {
      a_poll.noVotes += amount;
    }

    voting_status[pollid][msg.sender].voted = true;
    voting_status[pollid][msg.sender].balance = amount;
    voting_status[pollid][msg.sender].vote = vote;
    ISubdaoEmitter(emitterAddress).updateVotingStatus(pollid, msg.sender);

    poll[pollid] = a_poll;
    ISubdaoEmitter(emitterAddress).updateSubdaoPoll(pollid, msg.sender);
  }

  /**
   * @notice function used to query config
   * @dev query config
   */
  function queryConfig() public view returns (subDaoMessage.QueryConfigResponse memory) {
    subDaoMessage.QueryConfigResponse memory response = subDaoMessage.QueryConfigResponse({
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
  function queryState() public view returns (subDaoStorage.State memory) {
    return state;
  }

  /**
   * @notice internal function used to execute external calls
   * @dev sends external calls to target addresses with values and calldatas
   * @param targets target addresses
   * @param values values to be sent with call
   * @param calldatas calldatas to be sent with call
   */
  function _execute(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas
  ) internal {
    string memory errorMessage = "call reverted without message";
    for (uint256 i = 0; i < targets.length; ++i) {
      (bool success, bytes memory returndata) = targets[i].call{value: values[i]}(calldatas[i]);
      Address.verifyCallResult(success, returndata, errorMessage);
    }
  }
}
