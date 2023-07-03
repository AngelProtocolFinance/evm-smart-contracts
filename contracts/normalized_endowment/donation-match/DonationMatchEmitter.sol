// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {DonationMatchStorage} from "./storage.sol";
import {IDonationMatchEmitter} from "./IDonationMatchEmitter.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DonationMatchEmitter is Initializable, IDonationMatchEmitter {
  event DonationMatchInitialized(
    uint32 endowmentId,
    address donationMatch,
    DonationMatchStorage.Config config
  );
  event Approval(uint32 endowmentId, address tokenAddress, address spender, uint amount);
  event Transfer(uint32 endowmentId, address tokenAddress, address recipient, uint amount);
  event Burn(uint32 endowmentId, address tokenAddress, uint amount);
  event DonationMatchExecuted(
    address donationMatch,
    address tokenAddress,
    uint amount,
    address accountsContract,
    uint32 endowmentId,
    address donor
  );

  address accountsContract;
  mapping(address => bool) public isDonationMatch;

  function initDonationMatchEmiiter(address _accountsContract) public initializer {
    require(_accountsContract != address(0), "Invalid accounts contract address");
    accountsContract = _accountsContract;
  }

  modifier isOwner() {
    require(msg.sender == accountsContract, "Unauthorized");
    _;
  }
  modifier isEmitter() {
    require(isDonationMatch[msg.sender], "Unauthorized");
    _;
  }

  function initializeDonationMatch(
    uint32 endowmentId,
    address donationMatch,
    DonationMatchStorage.Config memory config
  ) public isOwner {
    isDonationMatch[donationMatch] = true;
    emit DonationMatchInitialized(endowmentId, donationMatch, config);
  }

  function giveApprovalErc20(
    uint32 endowmentId,
    address tokenAddress,
    address recipient,
    uint amount
  ) public isEmitter {
    emit Approval(endowmentId, tokenAddress, recipient, amount);
  }

  function transferErc20(
    uint32 endowmentId,
    address tokenAddress,
    address recipient,
    uint amount
  ) public isEmitter {
    emit Transfer(endowmentId, tokenAddress, recipient, amount);
  }

  function burnErc20(uint32 endowmentId, address tokenAddress, uint amount) public isEmitter {
    emit Burn(endowmentId, tokenAddress, amount);
  }

  function executeDonorMatch(
    address tokenAddress,
    uint256 amount,
    address _accountsContract,
    uint32 endowmentId,
    address donor
  ) public isEmitter {
    emit DonationMatchExecuted(
      msg.sender,
      tokenAddress,
      amount,
      _accountsContract,
      endowmentId,
      donor
    );
  }
}
