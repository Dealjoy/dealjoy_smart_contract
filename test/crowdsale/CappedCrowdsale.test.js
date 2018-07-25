const { ether } = require('../helpers/ether');
const { EVMRevert } = require('../helpers/EVMRevert');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const CappedCrowdsale = artifacts.require('CappedCrowdsaleImpl');

contract('CappedCrowdsale', function ([_, wallet]) {
  const cap = ether(4);
  const lessThanCap = ether(3);
  const tokenSupply = new BigNumber('1e22');

  beforeEach(async function () {
    this.crowdsale = await CappedCrowdsale.new(wallet, cap);
  });

  describe('creating a valid crowdsale', function () {
    it('should fail with zero cap', async function () {
      await CappedCrowdsale.new(wallet, 0).should.be.rejectedWith(EVMRevert);
    });
  });

  describe('accepting payments', function () {
    it('should accept payments within cap', async function () {
      await this.crowdsale.send(cap.minus(lessThanCap)).should.be.fulfilled;
      await this.crowdsale.send(lessThanCap).should.be.fulfilled;
    });

    it('should reject payments outside cap', async function () {
      await this.crowdsale.send(cap);
      await this.crowdsale.send(1).should.be.rejectedWith(EVMRevert);
    });

    it('should reject payments that exceed cap', async function () {
      await this.crowdsale.send(cap.plus(1)).should.be.rejectedWith(EVMRevert);
    });
  });

  describe('ending', function () {
    it('should not reach cap if sent under cap', async function () {
      let capReached = await this.crowdsale.capReached();
      capReached.should.equal(false);
      await this.crowdsale.send(lessThanCap);
      capReached = await this.crowdsale.capReached();
      capReached.should.equal(false);
    });

    it('should not reach cap if sent just under cap', async function () {
      await this.crowdsale.send(cap.minus(1));
      let capReached = await this.crowdsale.capReached();
      capReached.should.equal(false);
    });

    it('should reach cap if cap sent', async function () {
      await this.crowdsale.send(cap);
      let capReached = await this.crowdsale.capReached();
      capReached.should.equal(true);
    });
  });
});
