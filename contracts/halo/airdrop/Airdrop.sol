// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {AirdropMessage} from "./message.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./storage.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 *@title Airdrop
 * @dev Airdrop contract
 * The `Airdrop` contract manages the airdrop process of a token.
 */
contract Airdrop is Storage, Initializable, ReentrancyGuard, Ownable {
  using SafeERC20 for IERC20;

  event AirdropClaimed(uint256 stage, address sender, uint256 amount);
  event AirdropInitialized(address haloToken);
  event MerkleRootRegistered(uint256 stage, bytes32 merkleRoot);

  /**
   * @dev Initialize contract
   * @param details AirdropMessage.InstantiateMsg used to initialize contract
   */
  function initialize(AirdropMessage.InstantiateMsg memory details) public initializer {
    require(details.haloToken != address(0), "Zero address passed");
    state.haloToken = details.haloToken;
    state.latestStage = 0;
    emit AirdropInitialized(details.haloToken);
  }

  /**
   * @dev It allows the owner to register a merkle root for the airdrop. Only the owner can call this function.
   * @param merkleRoot bytes32
   */
  function registerMerkleRoot(bytes32 merkleRoot) public nonReentrant onlyOwner {
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
    require(!state.Claims[state.latestStage][msg.sender], "already claimed");
    bytes32 node = keccak256(abi.encodePacked(msg.sender, amount));
    bool isValidProof = MerkleProof.verifyCalldata(
      merkleProof,
      state.MerkleRoots[state.latestStage - 1],
      node
    );
    require(isValidProof, "Invalid proof.");

    IERC20(state.haloToken).safeTransfer(msg.sender, amount);
    state.Claims[state.latestStage][msg.sender] = true;
    emit AirdropClaimed(state.latestStage, msg.sender, amount);
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
    return state.Claims[stage][addr];
  }
}
