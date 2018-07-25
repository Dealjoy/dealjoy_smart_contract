pragma solidity ^0.4.24;

import "../crowdsale/validation/CappedCrowdsale.sol";


contract CappedCrowdsaleImpl is CappedCrowdsale {

  constructor (
    address _wallet,
    uint256 _cap
  )
    public
    Crowdsale(_wallet)
    CappedCrowdsale(_cap)
  {
  }

}
