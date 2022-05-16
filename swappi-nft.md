# Swappi NFT Contracts

# Compile
Compile a smart contract with HardHat

`npx hardhat compile`

To get full code, flatten contranct

`npx hard flatten`

# Test
Run tests with HardHat

`npx hardhat test`

# Deploy
Create a new file named .env in the project root directory

Create a new entry in the .env file, called `PRIVATE_KEY`  and set it to the private key of Conflux Chain

Add the RPC url to networks section along with the private key of the account which will be used to deploy the smart contract in hardhat.config.js.
Example:
```json
  networks: {
    testnet: {
      url: "https://evmtestnet.confluxrpc.com",
      accounts: [
        process.env.PRIVATE_KEY,
      ]
    }
  }
```

Deploy contract to chain. Run the following command as an examle:

`npx hardhat deploy --name 'Swappi NFT' --symbol SwappiNFT --supply 100  --uri uri --network network`

Parameters:

+ name: name of NFT token
+ symbol: symbol of NFT token
+ supply: Totol supply of NFT token
+ uri: base URI of NFT token
+ network: network of the contract to deploy

# API
## User API
MINT a NFT

`mint()`

Read NFT total supply

`_totalSupply()`

NFT consumed

`_tokenCounter()`

Return contract Owner

`_contractOwner()`

Whether mint is enabled or not

`_mintEnabled()`

Return name of NFT

`name()`

Return symbol of NFT

`symbol()`

Return URI of a given token

`tokenURI(uint256 tokenId)`

Return NFT quota of a given address

`verifyWhiteList(address addr)`

Return owner of given token

`ownerOf(uint256 tokenId)`

Return the number of tokens for a given address

`balanceOf(address owner)`

## Contract owner API

Set total supply

`function setTotalSupply(uint256 totalSupply)`

Set contranct owner

`setContractOwner(address newContractOwner)`

Set quota for a given address in this contract 

`setWhiteList(address addr, uint256 capacity)`

> Script used to help set white list:
> ./scripts/setwhitelist.js with all accounts are formatted as json in whitelist-simple.json

Set token base URI for this contract 

`setTokenBaseURI(string memory tokenBaseURI)`

Switch to enable mint

`enableMint()`

Switch to disable mint

`disableMint()`
