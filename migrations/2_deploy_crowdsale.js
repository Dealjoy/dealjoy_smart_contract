const OwnCrowdsale = artifacts.require('./OwnCrowdsale.sol');

module.exports = function(deployer, network, accounts) {
	
	////////////////////// crowdsale parameters
	const wallet = accounts[0];
	const hardCap = new web3.BigNumber(10000000000000000000); // 10 Eth
	
	// https://www.unixtimestamp.com/index.php
    const openingTime = new web3.BigNumber(1532908800); // 07/30/2018 @ 12:00am (UTC)
	const closingTime = openingTime + 86400 * 28; // 28 days;	
	
	const minInvestment = new web3.BigNumber(200000000000000000); // 0.2 Eth

	// 1000000000000000000 = 1 Eth

	/*
			address _wallet,
		OwnToken _token,
		uint256 _hardCap,
		uint256 _softCap,
		uint256 _openingTime,
		uint256 _closingTime,
		uint256 _minInvestment,
		uint256 _p1End, uint256 _p1Rate,
		uint256 _p2End, uint256 _p2Rate
	*/

    return deployer		
		// Deploy crowdsale
        .then(() => {
            return deployer.deploy(
                OwnCrowdsale,
				wallet,
				minInvestment,
				openingTime,
				closingTime,
				hardCap,
//{ gas: 1000000 }
            );
        })
		;
	
};