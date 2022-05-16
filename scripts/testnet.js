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

let adminKey = chainInfo.adminKey;
let adminAddress = chainInfo.adminAddress;

let userAddress = '';
let userKey = '';

async function main() {
  let availableTokens = await SwappiNFT.instance.methods.verifyWhiteList(userAddress).call();
  console.log(`Account available tokens: ${availableTokens}`);

  let totalSupply = await SwappiNFT.instance.methods._totalSupply().call();
  console.log(`Total supply: ${totalSupply}`);
  
  // await setWhitelist(userAddress);
  // await enableMint();
  await mint(userAddress, userKey);
}

async function ethTransact(data, from, privateKey, to = undefined, value = 0) {
  let nonce = await w3.eth.getTransactionCount(from);
  console.log(`nonce: ${nonce}`);

  let gasPrice = new BigNumber(await w3.eth.getGasPrice());
  gasPrice = gasPrice.multipliedBy(1.1).integerValue().toString(10);

  let txParams = {
    from: from,
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

async function enableMint() {
  let data = SwappiNFT.instance.methods.enableMint().encodeABI();
  let receipt = await ethTransact(data, adminAddress, adminKey, contractAddress);
  return receipt;
}

async function setWhitelist(userAddress) {
  let data = SwappiNFT.instance.methods.setWhiteList(userAddress, 1).encodeABI();
  let receipt = await ethTransact(data, adminAddress, adminKey, contractAddress);
  return receipt;
}

async function setbaseuri() {
  let data = SwappiNFT.instance.methods.setTokenBaseURI("https://metadata.conflux.fun/dahan/1/meta.json").encodeABI();
  let receipt = await ethTransact(data, adminAddress, adminKey, contractAddress);
  return receipt;
}

main().catch(console.log)