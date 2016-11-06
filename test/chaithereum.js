"use strict"

const Chaithereum = require('../chaithereum.js')
const chaithereum = new Chaithereum
const expect = chaithereum.chai.expect
const web3 = chaithereum.web3
const chai = chaithereum.chai

describe('chaithereum', () => {

  it('should have chai object', () => {
    expect(chaithereum.chai).to.be.an('object')
  })

  it('should have web3 object', () => {
    expect(web3).to.be.an('object')
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

    it('should jump into the ~future~', (done) => {
      var timeDiff = 4242;

      return web3.eth.getBlock('latest', (err, block) => {
        var oldTimestamp = block.timestamp
        chaithereum.increaseTime(timeDiff).then(() => {
          web3.eth.getBlock('latest', (err, block) => {
            chai.assert.equal(oldTimestamp+timeDiff, block.timestamp)
            done()
          })
        })
      })
    })
  })

})