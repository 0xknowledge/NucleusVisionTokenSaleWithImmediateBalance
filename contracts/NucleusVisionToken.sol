pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/MintableToken.sol";
import "zeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./ERC20Extended.sol";

/**
 * @title NucleusVisionToken
 * @dev NucleusVisionToken (ERC20) contract defining basic parameters of a ERC20 Token
 */

contract NucleusVisionToken is MintableToken, ERC20Extended {
  string public constant name = "NucleusVision";
  string public constant symbol = "nCash";
  uint8 public constant decimals = 18;

  // Total supply of nCash tokens is 10 Billion
  uint256 public constant MAX_SUPPLY = 10 * 1000 * 1000 * 1000 * (10 ** uint256(decimals));
  // Bit that controls whether the token can be transferred / traded
  bool public unlocked = false;

  // Maps of TokenVesting contracts holding the unvested balances and viceversa
  // Used to override balanceOf
  mapping (address => address) public user_to_vesting;
  mapping (address => address) public vesting_to_user;

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

  function balanceOf(address _owner) public view returns (uint256 balance) {
    // the vesting contracts holding the balance should never get actual balance
    if (vesting_to_user[_owner] != 0x0) {
        return 0;
    }

    if (user_to_vesting[_owner] != 0x0) {
      return balances[_owner] + balances[user_to_vesting[_owner]];
    }

    return balances[_owner];
  }

  function unvestedBalanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
  }

  function updateVestingMap(address user, address vesting) onlyOwner public returns (bool) {
    address previous_vesting = user_to_vesting[user];
    address previous_user = vesting_to_user[vesting];

    if (previous_user == 0x0 && previous_vesting == 0x0) {
      user_to_vesting[user] = vesting;
      vesting_to_user[vesting] = user;
      return true;
    }

    return false;
  }

}
