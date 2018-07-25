pragma solidity ^0.4.24;

import "../crowdsale/validation/WhitelistedCrowdsale.sol";
import "../crowdsale/Crowdsale.sol";


contract WhitelistedCrowdsaleImpl is Crowdsale, WhitelistedCrowdsale {

  constructor (
    address _wallet
  )
    Crowdsale(_wallet)
    public
  {
  }
}
