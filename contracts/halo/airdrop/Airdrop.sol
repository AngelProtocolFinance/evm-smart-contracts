// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AirdropMessage} from "./message.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./storage.sol";

import {ERC20Upgrade} from "../ERC20Upgrade.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

/**
 *@title Airdrop
 * @dev Airdrop contract
 * The `Airdrop` contract manages the airdrop process of a token.
 */
contract Airdrop is Storage, Initializable, ReentrancyGuard {
  event ConfigUpdated();
  event MerkleRootRegistered(uint256 stage, bytes32 merkleRoot);
  event AirdropClaimed(uint256 stage, address sender, uint256 amount);
  event AirdropInitialized(address owner, address haloToken);

  /**
   * @dev Initialize contract
   * @param details AirdropMessage.InstantiateMsg used to initialize contract
   */
  function initialize(AirdropMessage.InstantiateMsg memory details) public initializer {
    state.config = AirdropStorage.Config({owner: details.owner, haloToken: details.haloToken});
    state.latestStage = 0;
    emit AirdropInitialized(details.owner, details.haloToken);
  }

  /**
   * @dev Update config for airdrop contract
   * @param owner address
   */
  function updateConfig(address owner) public nonReentrant {
    require(state.config.owner == msg.sender, "only owner can update config");
    require(owner != address(0), "Invalid address");
    state.config.owner = owner;
    emit ConfigUpdated();
  }

  /**
   * @dev It allows the owner to register a merkle root for the airdrop. Only the owner can call this function.
   * @param merkleRoot bytes32
   */
  function registerMerkleRoot(bytes32 merkleRoot) public nonReentrant {
    require(state.config.owner == msg.sender, "only owner can register merkle root");
    state.MerkleRoots[state.latestStage] = merkleRoot;
    state.latestStage += 1;
    emit MerkleRootRegistered(state.latestStage - 1, merkleRoot);
  }

  /**
   * @dev Allows a participant to claim their airdrop. It verifies the validity of the provided merkle proof and if valid, transfers the specified amount of tokens to the participant.
   * @param amount uint256
   * @param merkleProof bytes32[]
   */
  function claim(uint256 amount, bytes32[] calldata merkleProof) public nonReentrant {
    require(!state.isClaimed[state.latestStage][msg.sender], "already claimed");
    bytes32 node = keccak256(abi.encodePacked(msg.sender, amount));
    bool isValidProof = MerkleProof.verifyCalldata(
      merkleProof,
      state.MerkleRoots[state.latestStage - 1],
      node
    );
    require(isValidProof, "Invalid proof.");

    state.isClaimed[state.latestStage][msg.sender] = true;
    state.claimed[state.latestStage].push(msg.sender);

    require(
      IERC20Upgradeable(state.config.haloToken).transfer(msg.sender, amount),
      "Transfer failed."
    );
    emit AirdropClaimed(state.latestStage, msg.sender, amount);
  }

  /**
   * @notice Query the config of airdrop
   */
  function queryConfig() public view returns (AirdropMessage.ConfigResponse memory) {
    return
      AirdropMessage.ConfigResponse({owner: state.config.owner, haloToken: state.config.haloToken});
  }

  /**
   * @notice This function returns the merkle root for the specified stage of the airdrop.
   * @param stage uint256
   */
  function queryMerkleRoot(
    uint256 stage
  ) public view returns (AirdropMessage.MerkleRootResponse memory) {
    return AirdropMessage.MerkleRootResponse({stage: stage, merkleRoot: state.MerkleRoots[stage]});
  }

  /**
   * @notice Query the latest stage of the airdrop.
   */
  function queryLatestStage() public view returns (uint256) {
    return state.latestStage;
  }

  /**
   * @notice Query a boolean indicating whether the specified address has claimed their airdrop for the specified stage.
   */
  function queryIsClaimed(uint256 stage, address addr) public view returns (bool) {
    return state.isClaimed[stage][addr];
  }
}
