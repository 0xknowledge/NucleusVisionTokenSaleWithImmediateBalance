pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/MintableToken.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title NucleusVisionToken
 * @dev NucleusVisionToken (ERC20) contract defining basic parameters of a ERC20 Token
 */

contract NucleusVisionToken is MintableToken {
  string public constant name = "NucleusVision";
  string public constant symbol = "nCash";
  uint8 public constant decimals = 18;

  // Total supply of nCash tokens is 10 Billion
  uint256 public constant MAX_SUPPLY = 10 * 1000 * 1000 * 1000 * (10 ** uint256(decimals));
  // Bit that controls whether the token can be transferred / traded
  bool public unlocked = false;

  event NucleusVisionTokenUnlocked();

  /**
   * @dev totalSupply is set via the minting process
   */
  function NucleusVisionToken() public {
  }

  function mint(address to, uint256 amount) onlyOwner public returns (bool) {
    require(totalSupply + amount <= MAX_SUPPLY);
    return super.mint(to, amount);
  }

  function unlockToken() onlyOwner public {
    require (!unlocked);
    unlocked = true;
    NucleusVisionTokenUnlocked();
  }

  // Overriding basic ERC-20 specification that lets people transfer/approve tokens.
  function transfer(address to, uint256 value) public returns (bool) {
    require(unlocked);
    return super.transfer(to, value);
  }

  function transferFrom(address from, address to, uint256 value) public returns (bool) {
    require(unlocked);
    return super.transferFrom(from, to, value);
  }

  function approve(address spender, uint256 value) public returns (bool) {
    require(unlocked);
    return super.approve(spender, value);
  }

  // Overriding StandardToken functions that lets people transfer/approve tokens.
  function increaseApproval(address spender, uint addedValue) public returns (bool) {
    require(unlocked);
    return super.increaseApproval(spender, addedValue);
  }

  function decreaseApproval(address spender, uint subtractedValue) public returns (bool) {
    require(unlocked);
    return super.decreaseApproval(spender, subtractedValue);
  }

}
