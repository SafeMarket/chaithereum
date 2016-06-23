#chaithereum
A tool for unit testing Ethereum (solidity/web3) contracts

`npm install chaithereum`

##Reasoning
Unit testing is an important part of all development. This is especially true for Ethereum contracts which are difficult or impossible to upgrade. Unfortunately, web3.js has a few drawbacks which make it difficult for unit testing. Chaithereum includes a forked version of web3 and chai-bignumber which makes unit testing much easier.

<!-- ####Q
Chaithereum uses a branch of web3 with Q promises. Instead of calling web3 with a callback, simply add a `q` to the end. For example, instead of `web3.eth.getBalance(function(){ ... })`, you would use `web3.eth.getBalance.q().then(function(){ ... })`. For contract functions, you can use `contract.func.q().then(function(){ ... })`

####BigNumber
Web3 uses a forked version of BigNumber.js. We use this forked version of BigNumber so that you can correctly test web3 BigNumber instances.
 -->
##Examples
https://github.com/SafeMarket/dapp/tree/chaithereum-examples/test

##Interface

###chaithereum.chai
A custom chai instance

###chaithereum.web3
A custom web3 instance suited for unit testing

###chaithereum.provider
The provider used to instantiate web3

###chaithereum.promise
A Q promise that will be fulfilled when chaithereum is ready. Typically you would start a test waiting for the chaitheruem promise.

    before(() => { return chaithereum.promise })

###chaithereum.accounts
A list of 10 accounts 

###chaithereum.account
The first account, set as web3.eth.defaultAccount

###chaithereum.generateAddress() returns promise of an address
Generate an address asynchronously. `chaithereum.generateAddress().then((address) => { ... }))`

###chaithereum.generateAddresses(count) returns promise of addresses
Generate an addresses asynchronously. `chaithereum.generateAddresses(5).then((addresses[5]) => { ... }))`

##Bindings

###hex
Ensures a thing is a hex string

    thing.should.be.hex
    thing.should.not.be.hex
    contract.getThing.q().should.eventually.be.hex
    contract.getThing.q().should.eventually.not.be.hex

###address
Ensures a thing is a valid Ethereum address

    thing.should.be.address
    thing.should.not.be.address
    contract.getThing.q().should.eventually.be.address
    contract.getThing.q().should.eventually.not.be.address

###zeros
Ensures a thing is a hex string of zeros

    thing.should.be.zeros
    thing.should.not.be.zeros
    contract.getThing.q().should.eventually.be.zeros
    contract.getThing.q().should.eventually.not.be.zeros

###contract
Ensures a thing is a web3.contract instance

    thing.should.be.address
    thing.should.not.be.address
    contract.getThing.q().should.eventually.be.address
    contract.getThing.q().should.eventually.not.be.address

###ascii(str)
Ensures a thing is the null-escaped ascii equvalent. `test`, `0x74657374`, and `0x007465737400` are all ascii equivalent of `test`.

    thing.should.be.ascii(str)
    thing.should.not.be.ascii(str)
    contract.getThing.q().should.eventually.be.ascii(str)
    contract.getThing.q().should.eventually.not.be.ascii(str)

###bignumber
For a full list of bignumber bindings, check out [chai-bignumber](https://github.com/safemarket/chai-bignumber/tree/custom-bignumber).

	thing.should.be.bignumber.equal(0)
    thing.should.not.be.bignumber.equal(0)
    contract.getThing.q().should.eventually.bignumber.equal(0)
    contract.getThing.q().should.eventually.bignumber.equal(0)
