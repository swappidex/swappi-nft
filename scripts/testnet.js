const Web3 = require('web3');
const BigNumber = require('bignumber.js');

const config = require('./config.js');
const chainInfo = config.evmChain;
const w3 = new Web3(chainInfo.nodeUrl);

let path = __dirname + '/../artifacts/contracts/SwappiNFT.sol';
let SwappiNFT = require(`${path}/SwappiNFT.json`);

SwappiNFT.instance = new w3.eth.Contract(SwappiNFT.abi);

// contract addresses
let contractAddress = chainInfo.contractAddress;
SwappiNFT.instance.options.address = contractAddress;

let account1 = '0x55c1883eDe3692641B03B77722a64B39cAe1De4D';

async function main() {
  let availableTokens = await SwappiNFT.instance.methods.verifyWhiteList(account1).call();
  console.log(`Account available tokens: ${availableTokens}`);

  let totalSupply = await SwappiNFT.instance.methods._totalSupply().call();
  console.log(`Total supply: ${totalSupply}`);
}

async function ethTransact(data, from, privateKey, to = undefined, value = 0) {
  let nonce = await w3.eth.getTransactionCount(from);
  console.log(`nonce: ${nonce}`);

  let gasPrice = new BigNumber(await w3.eth.getGasPrice());
  gasPrice = gasPrice.multipliedBy(1.1).integerValue().toString(10);

  let txParams = {
    from: admin,
    to: to,
    nonce: w3.utils.toHex(nonce),
    value: w3.utils.toHex(value),
    gasPrice: gasPrice,
    data: data,
  };

  txParams.gas = '15000000';
  let encodedTransaction = await w3.eth.accounts.signTransaction(
    txParams,
    privateKey,
  );

  let rawTransaction = encodedTransaction.rawTransaction;
  let receipt = await w3.eth.sendSignedTransaction(rawTransaction);
  if (!receipt.status) throw new Error(`transaction failed`);
  return receipt;
}

async function mint(account, privateKey) {
  let data = SwappiNFT.instance.methods.mint().encodeABI();
  let receipt = await ethTransact(data, account, privateKey, contractAddress);
  return receipt;
}

async function setWhitelist(adminAddress, userAddress) {
  let data = SwappiNFT.instance.methods.setWhiteList(userAddress, 1).encodeABI();
  let receipt = await ethTransact(data, adminAddress, config.adminKey, contractAddress);
  return receipt;
}

async function setbaseuri(adminAddress) {
  let data = SwappiNFT.instance.methods.setTokenBaseURI("https://metadata.conflux.fun/dahan/1/meta.json").encodeABI();
  let receipt = await ethTransact(data, adminAddress, config.adminKey, contractAddress);
  return receipt;
}

main().catch(console.log)