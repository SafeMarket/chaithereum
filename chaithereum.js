const crypto = require('crypto')
const Q = require('q')

const Chaithereum = function (options) {

  options = options || {}

  this.gasLimit = options.gasLimit || 4000000
  this.chai = options.chai || require('chai')
  this.Web3 = options.Web3 || require('web3-q')
  this.provider = options.provider || (() => {
    const TestRPC = require('ethereumjs-testrpc')
    return TestRPC.provider({
      gasLimit: this.gasLimit
    })
  })()

  const chaithereum = this

  this.web3 = new this.Web3()
  this.web3.setProvider(this.provider)

  this.chai.use(require('chai-web3-bindings')(this.web3))
  this.chai.use(require('chai-bignumber')(this.web3.toBigNumber(0).constructor))
  this.chai.use(require('chai-as-promised'))
  this.chai.should()

  this.promise = this.web3.eth.getAccounts.q().then((_accounts) => {
    this.accounts.push.apply(this.accounts, _accounts)
    this.account = this.web3.eth.defaultAccount = _accounts[0]
  })

}

Chaithereum.prototype.accounts = []



Chaithereum.prototype.generateAddress = function generateAddress() {
  const deferred = Q.defer()

  crypto.randomBytes(20, function(err, buffer) {
    deferred.resolve('0x'+buffer.toString('hex'))
  })

  return deferred.promise
}

Chaithereum.prototype.generateAddresses = function generateAddresses(count){
  const deferred = Q.defer()
  const addresses = []
  const chaithereum = this

  this.generateAddress().then(handleGeneratedAddress)

  function handleGeneratedAddress(address){
    addresses.push(address)
    if(addresses.length === (count || 10))
      deferred.resolve(addresses)
    else
      chaithereum.generateAddress().then(handleGeneratedAddress)
  }

  return deferred.promise
}

Chaithereum.prototype.increaseTime = function increaseTime(time) {
  const deferred = Q.defer()
  this.provider.sendAsync({ method: 'evm_increaseTime', params: [time] }, () => {
    this.mineBlock().then(() => {
      deferred.resolve()
    })
  })
  return deferred.promise
}

Chaithereum.prototype.mineBlock = function mineBlock() {
  const deferred = Q.defer()
  this.provider.sendAsync({ method: 'evm_mine'}, () => {
    deferred.resolve()
  })
  return deferred.promise
}

Chaithereum.prototype.mineBlocks = function mineBlocks(_count) {
  const count = _count || 0

  if (count === 0) {
    return Q.resolve()
  }

  return this.mineBlock().then(() => {
    return this.mineBlocks(count - 1)
  })
}

Chaithereum.prototype.takeSnapshot = function takeSnapshot() {
  const deferred = Q.defer()
  this.provider.sendAsync({ method: 'evm_snapshot', params: [] }, (id) => {
    deferred.resolve(id)
  })
  return deferred.promise
}

Chaithereum.prototype.revertSnapshot = function revertSnapshot(id) {
  const deferred = Q.defer()
  this.provider.sendAsync({ method: 'evm_revert', params: [id] }, () => {
    deferred.resolve()
  })
  return deferred.promise
}

module.exports = Chaithereum
