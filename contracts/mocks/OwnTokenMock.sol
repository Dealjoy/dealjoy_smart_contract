pragma solidity ^0.4.24;

import "../token/ERC20/OwnToken.sol";


contract OwnTokenMock is OwnToken {
	
	
  string public constant name = "SimpleToken"; // solium-disable-line uppercase
  string public constant symbol = "SIM"; // solium-disable-line uppercase
  uint8 public constant decimals = 18; // solium-disable-line uppercase

  uint256 public constant INITIAL_SUPPLY = (10 ** 8) * (10 ** uint256(decimals));
  
  constructor() 
  OwnToken(INITIAL_SUPPLY, name, decimals, symbol)
  public {

      totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    emit Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }
 

}