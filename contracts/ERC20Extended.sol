pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/ERC20Basic.sol';

contract ERC20Extended is ERC20Basic {
  function unvestedBalanceOf(address who) public view returns (uint256);
}
