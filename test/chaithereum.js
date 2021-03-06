"use strict"

const Chaithereum = require('../chaithereum.js')
const chaithereum = new Chaithereum
const expect = chaithereum.chai.expect
const web3 = chaithereum.web3
const chai = chaithereum.chai
const solc = require('solc')
const Q = require('q')

describe('chaithereum', () => {

  it('should have chai object', () => {
    expect(chaithereum.chai).to.be.an('object')
  })

  it('should have web3 object', () => {
    expect(chaithereum.web3).to.be.an('object')
  })

  it('should have provider object', () => {
    expect(chaithereum.provider).to.be.an('object')
  })

  it('should have a promise fulfilled', () => {
    return chaithereum.promise.should.be.fulfilled
  })

  it('should have an array of 10 accounts', () => {
    expect(chaithereum.accounts).to.be.an('array')
    expect(chaithereum.accounts).to.have.length(10)
  })

  it('should have a default account', () => {
    expect(chaithereum.account).to.be.a('string')
    expect(chaithereum.account).to.be.address
    expect(chaithereum.account).to.not.be.zeros
  })

  it('should set web3.eth.defaultAccount to default account', () => {
    expect(chaithereum.account).to.equal(web3.eth.defaultAccount)
  })

  it('should be able to send 1 wei to af', () => {
    return web3.eth.sendTransaction.q({ to: '0x00000000000000000000000000000000000000af', value: 1 }).should.be.fulfilled
  })

  it('af should have balance of 1 wei', () => {
    return web3.eth.getBalance.q('0x00000000000000000000000000000000000000af').should.eventually.be.bignumber.equal(1)
  })

  describe('address generation', () => {
    it('should generate a single address', () => {
      return chaithereum.generateAddress().should.eventually.be.address
    })

    let addresses

    it('should generate addresses array', () => {
      return chaithereum.generateAddresses().then((_addresses) => {
        addresses = _addresses
      }).should.be.fulfilled
    })

    it('should have a length of 10', () => {
      expect(addresses).to.have.length(10)
    })

    it('should have an address as each member of the array', (done) => {
      addresses.forEach((address) => {
        try {
          expect(address).to.be.an.address
        } catch(err) {
          done(err)
        }
      })
      done()
    })
  })

  describe('time/block skipping', () => {

    let block
    let block0
    let snapshotId

    it('should get current block', () => {
      return web3.eth.getBlock.q('latest').then((_block) => {
        block = block0 = _block
      }).should.be.fulfilled
    })

    it('should get take snapshot', () => {
      return chaithereum.takeSnapshot().then((_snapshotId) => {
        snapshotId = _snapshotId
      }).should.be.fulfilled
    })

    it('should increaseTime(4242)', () => {
      const timeDiff = 4242;
      return chaithereum.increaseTime(timeDiff).then(() => {
        return web3.eth.getBlock.q('latest').then((_block) => {
          _block.timestamp.should.equal(block.timestamp + timeDiff)
          block = _block
        })
      }).should.be.fulfilled
    })

    it('should mineBlock()', () => {
      return chaithereum.mineBlock().then(() => {
        return web3.eth.getBlock.q('latest').then((_block) => {
          _block.number.should.equal(block.number + 1)
          block = _block
        })
      }).should.be.fulfilled
    })

    it('should mineBlocks(10)', () => {
      return chaithereum.mineBlocks(10).then(() => {
        return web3.eth.getBlock.q('latest').then((_block) => {
          _block.number.should.equal(block.number + 10)
          block = _block
        }).should.be.fulfilled
      })
    })

    it('should revert snapshot', () => {
      return chaithereum.revertSnapshot(snapshotId).then(() => {
        return web3.eth.getBlock.q('latest').then((_block) => {
          _block.should.deep.equal(block0)
        })
      }).should.be.fulfilled
    })

  })

  describe('TestContract', () => {

    const testContractSol =
      `pragma solidity ^0.4.4;
      contract TestContract {
        address public owner; bytes32 public greeting = "hello";
        function TestContract(){ owner = msg.sender; }
      }`
    let solcOutput
    let testContract

    it ('should compile with solc', () => {
      solcOutput = solc.compile(testContractSol)
      if(solcOutput.errors && solcOutput.errors.length > 0) {
        throw new Error(solcOutput.errors[0])
      }
    })

    it('should deploy', () => {
      return chaithereum.web3.eth.contract(JSON.parse(solcOutput.contracts.TestContract.interface)).new.q({
        data: solcOutput.contracts.TestContract.bytecode, gas: chaithereum.gasLimit
      }).should.eventually.be.a.contract.then((_testContract) => {
        testContract = _testContract
      })
    })

    it('should have correct owner', () => {
      return web3.Q.all([
        testContract.owner.q().should.eventually.be.an.address,
        testContract.owner.q().should.eventually.equal(chaithereum.account)
      ]).should.eventually.be.fulfilled
    })

  })



})
