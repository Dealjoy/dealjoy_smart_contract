// enable when deploying
/*
const OwnToken = artifacts.require('./OwnToken.sol');

module.exports = function(deployer, network, accounts) {
	
	const initialAmount = new web3.BigNumber(10000000000000000000); // random number
	const name = 'Dealjoy';
	const ticker = 'DEAL';

	
	const decimals = 18;

    return deployer		
        .then(() => {
            return deployer.deploy(
                OwnToken,
				initialAmount,
				name,
				decimals,
				ticker
            );
        })
		;
	
};

*/