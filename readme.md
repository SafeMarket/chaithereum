#chaithereum
A tool for unit testing Ethereum (solidity/web3) contracts

##Manifesto
Unit testing is an important part of all development. This is especially true for Ethereum contracts which are difficult or impossible to upgrade. Unfortunately, web3.js has a few drawbacks which make it difficult for unit testing. Most notably web3.js uses callbacks rather than a promise oriented architecture.

##Examples

https://github.com/SafeMarket/dapp/tree/chaithereum-examples/test

##Bindings

###hex
    thing.should.be.hex
    thing.should.not.be.hex
    contract.getThing.q().should.eventually.be.hex
    contract.getThing.q().should.eventually.not.be.hex