// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/governance/GovernorUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorSettingsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorCountingSimpleUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorVotesQuorumFractionUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/governance/extensions/GovernorTimelockControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/**
 *@title Gov
 * @dev Gov contract
 * The `Gov` contract allows for proposals to be made, executed, or cancelled with certain quorum requirements, voting periods, and a timelock mechanism to enforce the execution or cancellation of proposals.
 */
contract Gov is
  Initializable,
  GovernorUpgradeable,
  GovernorSettingsUpgradeable,
  GovernorCountingSimpleUpgradeable,
  GovernorVotesUpgradeable,
  GovernorVotesQuorumFractionUpgradeable,
  GovernorTimelockControlUpgradeable
{
  /// @custom:oz-upgrades-unsafe-allow constructor

  // bool initialized = false;
  function initialize(
    IVotesUpgradeable token,
    TimelockControllerUpgradeable timelock,
    uint256 initialVotingDelay,
    uint256 initialVotingPeriod,
    uint256 initialProposalThreshold,
    uint256 quorumNumeratorValue
  ) public initializer {
    // require(!initialized, "alreadyInitialized");
    // initialized = true;
    __Governor_init("HaloDAO");
    __GovernorSettings_init(initialVotingDelay, initialVotingPeriod, initialProposalThreshold);
    __GovernorCountingSimple_init();
    __GovernorVotes_init(token);
    __GovernorVotesQuorumFraction_init(quorumNumeratorValue); // this is the % of people's approval required to pass the proposal
    __GovernorTimelockControl_init(timelock);
  }

  // The following functions are overrides required by Solidity.

  function votingDelay()
    public
    view
    override(IGovernorUpgradeable, GovernorSettingsUpgradeable)
    returns (uint256)
  {
    return super.votingDelay();
  }

  function votingPeriod()
    public
    view
    override(IGovernorUpgradeable, GovernorSettingsUpgradeable)
    returns (uint256)
  {
    return super.votingPeriod();
  }

  function quorum(
    uint256 blockNumber
  )
    public
    view
    override(IGovernorUpgradeable, GovernorVotesQuorumFractionUpgradeable)
    returns (uint256)
  {
    return super.quorum(blockNumber);
  }

  function state(
    uint256 proposalId
  )
    public
    view
    override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    returns (ProposalState)
  {
    return super.state(proposalId);
  }

  function propose(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    string memory description
  ) public override(GovernorUpgradeable, IGovernorUpgradeable) returns (uint256) {
    return super.propose(targets, values, calldatas, description);
  }

  function proposalThreshold()
    public
    view
    override(GovernorUpgradeable, GovernorSettingsUpgradeable)
    returns (uint256)
  {
    return super.proposalThreshold();
  }

  function _execute(
    uint256 proposalId,
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) {
    super._execute(proposalId, targets, values, calldatas, descriptionHash);
  }

  function _cancel(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
  ) internal override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (uint256) {
    return super._cancel(targets, values, calldatas, descriptionHash);
  }

  function _executor()
    internal
    view
    override(GovernorUpgradeable, GovernorTimelockControlUpgradeable)
    returns (address)
  {
    return super._executor();
  }

  function supportsInterface(
    bytes4 interfaceId
  ) public view override(GovernorUpgradeable, GovernorTimelockControlUpgradeable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
