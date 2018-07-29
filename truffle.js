module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
			gas: 5600000,
			gasPrice: 10000000000,
            network_id: "*" // Match any network id
        },
		ropsten:  {
		 network_id: 3,
		 host: "localhost",
		 port:  8545,
		 gas: 4867350,
		 gasPrice: 10000000000 // 10 gwei
		},
		ganache: {
		  host: "127.0.0.1",
		  port: 8545,
		  network_id: "*" // matching any id
,
		 gas: 2000000
		}
		
    }
};
