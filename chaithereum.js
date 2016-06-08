const chai = require('chai')
const Web3 = require('web3')
const TestRPC = require('ethereumjs-testrpc')

const web3 = new Web3()
web3.setProvider(TestRPC.provider())

chai.use(require('./bindings.js'))
chai.use(require('chai-bignumber')(web3.toBigNumber(0).constructor))
chai.use(require('chai-as-promised'))
chai.should()

const chaithereum = {
  chai,
  web3,
  accounts: [],
  promise: web3.eth.getAccounts.q().then((_accounts) => {
    chaithereum.accounts.push.apply(chaithereum.accounts, _accounts)
    chaithereum.account = web3.eth.defaultAccount = _accounts[0]
  })
}

module.exports = chaithereum