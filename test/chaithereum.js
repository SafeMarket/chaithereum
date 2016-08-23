"use strict"

const chaithereum = require('../chaithereum.js')
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

  describe('bindings', () => {

    it('should have bignumber', () => {
      expect(10).to.be.bignumber.equal(10)
      expect(web3.toBigNumber(10)).to.be.bignumber.equal(10)
      expect(5).to.not.be.bignumber.equal(10)
      expect(web3.toBigNumber(5)).to.not.be.bignumber.equal(10)
    })

    it('should have hex property', () => {
      expect('0x').to.be.hex
      expect('0xa1').to.be.hex
      expect('0xa1ff').to.be.hex
      expect('0xA1').to.be.hex
      expect('0').to.not.be.hex
      expect('').to.not.be.hex
    })

    it('should have address property', () => {
      expect('0x0000000000000000000000000000000000000000').to.be.address
      expect('0x00000000000000000000000000000000000000af').to.be.address
      expect('0x00000000000000000000000000000000000000Af').to.be.address
      expect('0x00000000000000000000000000000000000000').to.not.be.address
      expect('0x').to.not.be.address
      expect('').to.not.be.address
    })

    it('should have zeros property', () => {
      expect('0x00').to.be.zeros
      expect('0x').to.be.zeros
      expect('').to.not.be.zeros
      expect('00').to.not.be.zeros
    })

    it('should have contract property', () => {
      expect({ address: '0x00000000000000000000000000000000000000af'}).to.be.contract
      expect({}).to.not.be.contract
      expect({ address: '0x0000000000000000000000000000000000000000'}).to.not.be.contract
    })

    it('should have ascii method', () => {
      expect('test').to.be.ascii('test')
      expect('0x74657374').to.be.ascii('test')
      expect('0x0000746573740000').to.be.ascii('test')
      expect('nottest').to.not.be.ascii('test')
      expect('0x74657375').to.not.be.ascii('test')
      expect('0x007465737500').to.not.be.ascii('test')
    })

  })

})