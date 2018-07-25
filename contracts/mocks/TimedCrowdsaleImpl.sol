pragma solidity ^0.4.24;

import "../crowdsale/validation/TimedCrowdsale.sol";


contract TimedCrowdsaleImpl is TimedCrowdsale {

  constructor (
    uint256 _openingTime,
    uint256 _closingTime,
    address _wallet
  )
    public
    Crowdsale(_wallet)
    TimedCrowdsale(_openingTime, _closingTime)
  {
  }

}
