const { ether } = require('../helpers/ether');
const { advanceBlock } = require('../helpers/advanceToBlock');
const { increaseTimeTo, duration } = require('../helpers/increaseTime');
const { latestTime } = require('../helpers/latestTime');
const { EVMRevert } = require('../helpers/EVMRevert');

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Crowdsale = artifacts.require('OwnCrowdsale');

contract('OwnTokenCrowdsale', function ([origWallet, investor, wallet, purchaser]) {

  const value = new BigNumber(ether(2));
  const cap = new BigNumber(ether(15));

  const minInvestment = ether(1) / 5;
  
  function getTokenAmount(perRate, origTokens) {
	  return (origTokens * perRate);
  }
  
  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by ganache
    await advanceBlock();
  });
  
  beforeEach(async function () {

	this.openingTime = (await latestTime()) + duration.weeks(1);
    this.closingTime = this.openingTime + duration.weeks(20);
    this.afterClosingTime = this.closingTime + duration.seconds(1);
    this.crowdsale = await Crowdsale.new(wallet, minInvestment, this.openingTime, this.closingTime, cap);

	await this.crowdsale.addAddressesToWhitelist([ origWallet, investor, wallet, purchaser ]);
	
	// start from the beginning of sales phases
	await increaseTimeTo(this.openingTime);
  });
 
 
  describe('when paused', function () {
    it('should not accept payments', async function () {
	  await this.crowdsale.pause();
      await this.crowdsale.sendTransaction({ value: value }).should.be.rejectedWith(EVMRevert);
    });
    it('should be unpausable only by the owner', async function () {
	  await this.crowdsale.pause();
	  await this.crowdsale.unpause({ from: investor }).should.be.rejectedWith(EVMRevert);
      await this.crowdsale.sendTransaction({ value: value }).should.be.rejectedWith(EVMRevert);
	  await this.crowdsale.unpause({ from: origWallet }).should.be.fulfilled;
      await this.crowdsale.sendTransaction({ value: value }).should.be.fulfilled;
    });
  });

  
  describe('with minimum investment', function () {
    it('should require minimum purchase amount', async function () {
	  const minInv = await this.crowdsale.minInvestment();
	  const lessThanMin = minInv.minus(1);
      await this.crowdsale.sendTransaction({ value: lessThanMin, from: investor }).should.be.rejectedWith(EVMRevert);
    });
	
	it('should allow with minimum purchase amount', async function () {
	  const minInv = await this.crowdsale.minInvestment();
      await this.crowdsale.sendTransaction({ value: minInv, from: investor }).should.be.fulfilled;
    });
	
	it('should allow with new minimum purchase amount', async function () {
	  const oldMinInv = await this.crowdsale.minInvestment();
	  const moreThanMin = oldMinInv.add(2);
	  
	  // recreate crowdsale to reset minimum investment
	  this.openingTime = (await latestTime()) + duration.weeks(1);
	  this.crowdsale = await Crowdsale.new(wallet, moreThanMin, this.openingTime, this.closingTime, cap);
		
	  await this.crowdsale.addAddressesToWhitelist([ origWallet, investor, wallet, purchaser ]);
	
	  // start from the beginning of sales phases
	  await increaseTimeTo(this.openingTime);
	  
	  // end of recreation
	  
	  const newMinInv = await this.crowdsale.minInvestment();
	  newMinInv.should.be.bignumber.equal(moreThanMin);
	  
      await this.crowdsale.sendTransaction({ value: oldMinInv, from: investor }).should.be.rejectedWith(EVMRevert);
	  await this.crowdsale.sendTransaction({ value: moreThanMin, from: investor }).should.be.fulfilled;
	  
	  
    });
  });

  describe('with all settings', function () {
    it('purchasing should fail until all conditions met', async function () {

	  const oldMinInv = await this.crowdsale.minInvestment();
	  const moreThanMin = oldMinInv.add(2);
	  const moreThanNewMin = moreThanMin.add(3);

	  const openingTime = (await latestTime()) + duration.weeks(1);
      const closingTime = this.openingTime + duration.weeks(20);
      const afterClosingTime = this.closingTime + duration.seconds(1);
	  
	  // recreate crowdsale to reset minimum investment
	  this.openingTime = (await latestTime()) + duration.weeks(1);
	  this.crowdsale = await Crowdsale.new(wallet, moreThanMin, openingTime, closingTime, cap);

	  // not added to whitelist and the crowdsale hasn't started
	  await this.crowdsale.sendTransaction({ value: moreThanNewMin, from: investor }).should.be.rejectedWith(EVMRevert);
		
	  await this.crowdsale.addAddressesToWhitelist([ origWallet, investor, wallet, purchaser ]);
	  
	  // The crowdsale hasn't started
	  await this.crowdsale.sendTransaction({ value: moreThanNewMin, from: investor }).should.be.rejectedWith(EVMRevert);
	
	  // start from the beginning of sales phases
	  await increaseTimeTo(openingTime);

	  
	  // end of recreation
	  
	  const newMinInv = await this.crowdsale.minInvestment();
	  newMinInv.should.be.bignumber.equal(moreThanMin);
	  
      await this.crowdsale.sendTransaction({ value: moreThanMin, from: investor }).should.be.fulfilled;
	  await this.crowdsale.sendTransaction({ value: moreThanNewMin, from: investor }).should.be.fulfilled;
	  
	  
    });
  });
  
});
