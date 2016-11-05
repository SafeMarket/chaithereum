const crypto = require('crypto')
const chai = require('chai')
const Web3 = require('web3')
const TestRPC = require('ethereumjs-testrpc')
const Q = require('q')

if(typeof Function.prototype.q === 'undefined') {
  Function.prototype.q = function q(){
    const args = Array.prototype.slice.call(arguments)
    const deferred = Q.defer()
    args.push(function qCallback(err, result) {
      if (err) {
        deferred.reject(err)
      } else {
        deferred.resolve(result)
      }
    })
    this.apply(this, args)
    return deferred.promise
  }
}

const web3 = new Web3()
const provider = TestRPC.provider()
web3.setProvider(provider)

chai.use(require('./bindings.js'))
chai.use(require('chai-bignumber')(web3.toBigNumber(0).constructor))
chai.use(require('chai-as-promised'))
chai.should()

const chaithereum = {
  chai,
  web3,
  provider,
  accounts: [],
  promise: web3.eth.getAccounts.q().then((_accounts) => {
    chaithereum.accounts.push.apply(chaithereum.accounts, _accounts)
    chaithereum.account = web3.eth.defaultAccount = _accounts[0]
  }),
  generateAddress,
  generateAddresses,
  increaseTime
}

function generateAddress() {
  const deferred = Q.defer()

  crypto.randomBytes(20, function(err, buffer) {
    deferred.resolve('0x'+buffer.toString('hex'))
  })

  return deferred.promise
}

function generateAddresses(count){
  const deferred = Q.defer()
  const addresses = []

  generateAddress().then(handleGeneratedAddress)

  function handleGeneratedAddress(address){
    addresses.push(address)
    if(addresses.length === (count || 10))
    deferred.resolve(addresses)
    else
    generateAddress().then(handleGeneratedAddress)
  }

  return deferred.promise
}

function increaseTime(time) {
  const deferred = Q.defer()

  provider.sendAsync({ method: 'evm_increaseTime', params: [time] }, function() {
    provider.sendAsync({ method: 'evm_mine'}, function() {
      deferred.resolve()
    })
  })

  return deferred.promise
}

module.exports = chaithereum