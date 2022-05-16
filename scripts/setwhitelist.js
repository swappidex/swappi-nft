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

let whitelist = require('./whitelist-simple.json')

async function main() {
    let addresses = whitelist.addresses;

    for (const key in addresses) {
        let elem = addresses[key];
        let userAddress = '';
        let quota = 1;
        if (typeof(elem.address) == "undefined") {
            userAddress = elem;
        } else {
            userAddress = elem.address;
            quota = elem.quota;
        }

        console.log(`User address ${userAddress}, quota: ${quota}`);
        await setWhitelist(userAddress, quota);

        let q = await SwappiNFT.instance.methods.verifyWhiteList(userAddress).call();            
        if (q != quota) {
            console.log(`Set whitelist for ${userAddress} failed"`);
        }
    }
}

async function ethTransact(data, from, privateKey, to = undefined, value = 0) {
  let nonce = await w3.eth.getTransactionCount(from);
  console.log(`current nonce: ${nonce}`);

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

async function setWhitelist(userAddress, quota) {
  let data = SwappiNFT.instance.methods.setWhiteList(userAddress, quota).encodeABI();
  let receipt = await ethTransact(data, adminAddress, adminKey, contractAddress);
  return receipt;
}

main().catch(console.log)