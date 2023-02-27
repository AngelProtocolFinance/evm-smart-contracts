// SPDX-License-Identifier: UNLICENSED
// author: @stevieraykatz
pragma solidity >=0.8.0;

import {IVault} from "../interfaces/IVault.sol";
import {ERC4626} from "./ERC4626.sol";
import {ERC20} from "./ERC20.sol";


abstract contract APVault is IVault, ERC4626 {

  constructor(address _regsitrar, ERC20 _asset, string memory _name, string memory _symbol) 
    ERC4626(_asset, _name, _symbol)
  {

  }

  function deposit(uint256 assets, address receiver) public virtual override returns (uint256 shares) {
    shares = super.deposit(assets, receiver);
  }

  function withdraw(uint256 assets, address receiver, address owner) public virtual override returns (uint256 shares) {
    shares = super.withdraw(assets, receiver, owner);
  }

  function beforeDeposit(uint256 assets, uint256 shares) internal virtual {

  } 

  function beforeWithdraw(uint256 assets, uint256 shares) internal virtual override {

  }

  function afterDeposit(uint256 assets, uint256 shares) internal virtual override {

  }

  function afterWithdraw(uint256 assets, uint256 shares) internal virtual {
    
  }


}