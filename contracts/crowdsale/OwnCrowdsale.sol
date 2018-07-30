pragma solidity ^0.4.24;

import "./validation/WhitelistedCrowdsale.sol";
import "./validation/TimedCrowdsale.sol";
import "./validation/CappedCrowdsale.sol";
import "../lifecycle/Pausable.sol";
import "./Crowdsale.sol";

contract OwnCrowdsale is WhitelistedCrowdsale, TimedCrowdsale, CappedCrowdsale, Pausable {

	// Minimum investment for this sale period, in weis
	uint256 public minInvestment;

  constructor(
	address _wallet, 
	uint256 _minInvestment,
	uint256 _openingTime,
	uint256 _closingTime,
	uint256 _cap
	)
  Crowdsale(_wallet)
  TimedCrowdsale(_openingTime, _closingTime)
  CappedCrowdsale(_cap)
  public {
	minInvestment = _minInvestment;
  }
  
  /**
   * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use `super` in contracts that inherit from Crowdsale to extend their validations.
   * Example from CappedCrowdsale.sol's _preValidatePurchase method: 
   *   super._preValidatePurchase(_beneficiary, _weiAmount);
   *   require(weiRaised.add(_weiAmount) <= cap);
   * @param _beneficiary Address performing the token purchase
   * @param _weiAmount Value in wei involved in the purchase
   */
  function _preValidatePurchase(
    address _beneficiary,
    uint256 _weiAmount
  )
    whenNotPaused
    internal
  {
    super._preValidatePurchase(_beneficiary, _weiAmount);
	require(_weiAmount >= minInvestment, "Sorry, minimum investment not met");
  }

	function sendEther() payable {
		invest(msg.sender);
	}
}
