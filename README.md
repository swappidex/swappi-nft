# Swappi NFT Contract

Swappi NFT contract is built based on OpenZeppelin ERC721 template. 

# Compile
Compile smart contract with HardHat

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

`npx hardhat deploy --name 'Swappi NFT' --symbol SwappiNFT --supply 100  --uri uri --network network --token tokenAddress --recipient receiverAddress --price price --network testnet`

Parameters:

+ name: name of NFT token
+ symbol: symbol of NFT token
+ supply: Totol supply of NFT token
+ uri: base URI of NFT token
+ network: network of the contract to deploy
+ token: token used to pay
+ recipient: token recipient address
+ price: NFT price by token


# API
## User API
**MINT a NFT**, must be user accounts

**`mint()`**

Read NFT total supply

`_totalSupply()`

Return NFT consumed counter

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

Return whether the given address has mint NFT

`hasMinted(address addr)`

Return owner of given token

`ownerOf(uint256 tokenId)`

Return the number of tokens for a given address

`balanceOf(address owner)`

Return NFT price

`_NFTPrice()`

Return token address

`_token()`

Return token receiver

`_tokenReceiver()`

## Contract owner API

Set total supply

`setTotalSupply(uint256 totalSupply)`

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

set payable token 

`setToken(address addr)`

set token receiver

`setTokenReceiver(address addr)`

Set NFT price

`setNFTPrice(uint256 NFTPrice)`

