pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/MintableToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title NucleusVisionCoreToken
 * @dev NucleusVisionCoreToken (ERC20) contract defining basic parameters of a ERC20 Token
 */

contract NucleusVisionCoreToken is MintableToken {
  string public constant name = "NucleusVisionCore";
  string public constant symbol = "nCore";
  uint8 public constant decimals = 0;

  /**
   * @dev totalSupply is not set as we don't know how many investors will get the core token
   */
  function NucleusVisionCoreToken() public {
  }

  /**
   * @dev Function to mint tokens
   * @param recipients The list of addresses eligible to get a NucleusVisionCoreToken
   */
  function mintCoreToken(address[] recipients) onlyOwner public {
    for( uint i = 0 ; i < recipients.length ; i++ ){
      address recipient = recipients[i];
      if(balances[recipient] == 0 ){
        super.mint(recipient, 1);
      }
    }
  }

  // nCore tokens are not transferrable
  function transfer(address, uint) public returns (bool){ revert(); }
  function transferFrom(address, address, uint) public returns (bool){ revert(); }
  function approve(address, uint) public returns (bool){ revert(); }
  function allowance(address, address) constant public returns (uint){ return 0; }

}
