const { ether } = require('./helpers/ether');
const { increaseTimeTo, duration } = require('./helpers/increaseTime');
const { latestTime } = require('./helpers/latestTime');

const BigNumber = web3.BigNumber;

const Crowdsale = artifacts.require('OwnCrowdsale');

const cap = new BigNumber(ether(15));

  const minInvestment = ether(1) / 5;

contract('OwnTokenCrowdsale deployment', function ([origWallet, investor, wallet, notWhitelisted]) {
	it("Should deploy with less than 4.7 mil gas", async () => {
		this.openingTime = (await latestTime()) + duration.weeks(1);
		this.closingTime = this.openingTime + duration.weeks(20);
		this.afterClosingTime = this.closingTime + duration.seconds(1);
		  let someInstance = await Crowdsale.new(wallet, minInvestment, this.openingTime, this.closingTime, cap);
		  let receipt = await web3.eth.getTransactionReceipt(someInstance.transactionHash);
		console.log(receipt.gasUsed.toString(), "gas usage for contract creation");  
		assert.isBelow(receipt.gasUsed, 4700000);
	  
	});
});