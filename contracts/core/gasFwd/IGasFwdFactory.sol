// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ProxyContract} from "../proxy.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

interface IGasFwdFactory {
  error InvalidAddress(string param);
  event GasFwdCreated(address addr);

  function create() external returns (address);

  function updateImplementation(address _impl) external;

  function updateRegistrar(address _impl) external;
}
