const { ether } = require('../helpers/ether');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .should();

const WhitelistedCrowdsale = artifacts.require('WhitelistedCrowdsaleImpl');

contract('WhitelistedCrowdsale', function ([_, wallet, authorized, unauthorized, anotherAuthorized]) {
  const value = ether(2);

  describe('single user whitelisting', function () {
    beforeEach(async function () {
      this.crowdsale = await WhitelistedCrowdsale.new(wallet);
      await this.crowdsale.addAddressToWhitelist(authorized);
    });

    describe('accepting payments', function () {
      it('should accept payments to whitelisted (from whichever buyers)', async function () {
        await this.crowdsale.sendTransaction({ value, from: authorized }).should.be.fulfilled;
        await this.crowdsale.invest(authorized, { value: value, from: authorized }).should.be.fulfilled;
        await this.crowdsale.invest(authorized, { value: value, from: unauthorized }).should.be.fulfilled;
      });

      it('should reject payments to not whitelisted (from whichever buyers)', async function () {
        await this.crowdsale.sendTransaction({ value, from: unauthorized }).should.be.rejected;
        await this.crowdsale.invest(unauthorized, { value: value, from: unauthorized }).should.be.rejected;
        await this.crowdsale.invest(unauthorized, { value: value, from: authorized }).should.be.rejected;
      });

      it('should reject payments to addresses removed from whitelist', async function () {
        await this.crowdsale.removeAddressFromWhitelist(authorized);
        await this.crowdsale.invest(authorized, { value: value, from: authorized }).should.be.rejected;
      });
    });

    describe('reporting whitelisted', function () {
      it('should correctly report whitelisted addresses', async function () {
        let isAuthorized = await this.crowdsale.whitelist(authorized);
        isAuthorized.should.equal(true);
        let isntAuthorized = await this.crowdsale.whitelist(unauthorized);
        isntAuthorized.should.equal(false);
      });
    });
  });

  describe('many user whitelisting', function () {
    beforeEach(async function () {
      this.crowdsale = await WhitelistedCrowdsale.new(wallet);
      await this.crowdsale.addAddressesToWhitelist([authorized, anotherAuthorized]);
    });

    describe('accepting payments', function () {
      it('should accept payments to whitelisted (from whichever buyers)', async function () {
        await this.crowdsale.invest(authorized, { value: value, from: authorized }).should.be.fulfilled;
        await this.crowdsale.invest(authorized, { value: value, from: unauthorized }).should.be.fulfilled;
        await this.crowdsale.invest(anotherAuthorized, { value: value, from: authorized }).should.be.fulfilled;
        await this.crowdsale.invest(anotherAuthorized, { value: value, from: unauthorized }).should.be.fulfilled;
      });

      it('should reject payments to not whitelisted (with whichever buyers)', async function () {
        await this.crowdsale.send(value).should.be.rejected;
        await this.crowdsale.invest(unauthorized, { value: value, from: unauthorized }).should.be.rejected;
        await this.crowdsale.invest(unauthorized, { value: value, from: authorized }).should.be.rejected;
      });

      it('should reject payments to addresses removed from whitelist', async function () {
        await this.crowdsale.removeAddressFromWhitelist(anotherAuthorized);
        await this.crowdsale.invest(authorized, { value: value, from: authorized }).should.be.fulfilled;
        await this.crowdsale.invest(anotherAuthorized, { value: value, from: authorized }).should.be.rejected;
      });
    });

    describe('reporting whitelisted', function () {
      it('should correctly report whitelisted addresses', async function () {
        let isAuthorized = await this.crowdsale.whitelist(authorized);
        isAuthorized.should.equal(true);
        let isAnotherAuthorized = await this.crowdsale.whitelist(anotherAuthorized);
        isAnotherAuthorized.should.equal(true);
        let isntAuthorized = await this.crowdsale.whitelist(unauthorized);
        isntAuthorized.should.equal(false);
      });
    });
  });
});
