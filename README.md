# Dealjoy Smart Contract
This repository contains codes to conduct an Initial Coin Offering for Dealjoy

The solution uses the following building blocks:
- Ethereum Solidity for writing the crowdsale (ICO) smart contracts
- Truffle for unit tests, migrations and deployment
- OpenZeppelin smart contracts for basis of functionality

## Installation
Windows installation instructions. Tested for:
* Truffle v4.1.13 (core: 4.1.13)
* Solidity v0.4.24 (solc-js)

Instructions:
1. Install Geth
1. Install Node
1. Install Git
1. install npm:
	1. npm install
1. Install ganache-cli and truffle with Node:
	1. npm install -g ganache-cli
	1. npm install -g truffle
1. Setup git:
	1. git config --global user.name "Firstname Lastname"
	1. git config --global user.email "your_email@youremail.com"
1. Clone Git repository: git clone https://github.com/Dealjoy/dealjoy_smart_contract.git

To run tests:
1. Run in a separate cmd window: ganache-cli
1. If needed, install also the following packages:
	1. Install chai locally: npm install --save-dev chai
	1. Also: npm i chai-as-promised
	1. Also: npm i chai-bignumber
1. Run in the 'dealjoy_smart_contract' folder: truffle.cmd test

## Implemented functionality
The following functionality is implemented with these contracts (also noted with which contract this is implemented):

### Functionality for crowdsale

* The basic crowdsale has stripped crowdsale functionality. This functionality is limited to:
	* Sending Ethers to the crowdsale
	* Validations for the Ether transfer
	* Forwarding of received funds to an external wallet
	* This functionality is implemented in contract *Crowdsale*
* A minimum investment amount is required in order to participate in the crowdsale
	* Implemented with contract *OwnCrowdsale*
* Only whitelisted accounts can participate in the crowdsale
	* Implemented with contract *WhitelistedCrowdsale*
* Crowdsale is active only within a certain time frame and nobody can participate outside the active time
	* Implemented with contract *TimedCrowdsale*
* Crowdsale does not allow investments if the sale period's hard cap is exceeded
	* Implemented with contract *CappedCrowdsale*
* It is possible for the contract owner to pause (and unpause) the crowdsale
	* Implemented with contract *Pausable*
* The *Pausable* contract is owned by its creator. The creator is the only one with access to pause / unpause the crowdsale
	* Implemented with contract *Ownable* which is inherited by *Pausable*

### Functionality for tokens

The token is an ERC20 compliant ( https://theethereum.wiki/w/index.php/ERC20_Token_Standard ) token with the default details added (name, ticker, decimals). No other extra functionality is implemented.

## Implementation notes
This crowdsale does not handle tokens. This crowdsale is only used to gather Ether investments from whitelisted investors.
Further backend processing is used to afterwards deliver the actual tokens.

Most of the smart contracts are taken from OpenZeppelin's GitHub (https://github.com/OpenZeppelin/openzeppelin-solidity) because they are battle-tested and well documented.
The OpenZeppelin contracts are not modified with the following exceptions:
- Removed all functionality concerning tokens
- renamed *buyTokens* function to be *invest*

## Smart contract inheritance architecture
The smart contracts are layered with inheritance to add functionality in a structured way. Inheritance of different smart contracts is implemented in the following order.

### Token contracts
* ERC20Basic
	* ERC20
		* BasicToken
			* StandardToken
				* DetailedERC20
					* OwnToken

### Crowdsale contracts
* RBAC, Ownable
	* Whitelist, Crowdsale
		* WhitelistedCrowdsale
* Crowdsale
	* TimedCrowdsale
* Crowdsale
	* CappedCrowdsale
* Ownable
	* Pausable
* WhitelistedCrowdsale, TimedCrowdsale, CappedCrowdsale, Pausable
	* OwnCrowdsale

## Unit testing
OpenZeppelin contracts include sufficient unit tests. These unit tests are included as-is with the following exceptions:
- Taken only unit tests for the contracts which we use (and their dependencies)
- Removed/reworked all tests concerning tokens
- Added tests for own functionality

## Disclaimer
Use at your own risk. No support is promised but it can be requested.
