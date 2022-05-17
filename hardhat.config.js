require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("deploy", "Deploy the smart contracts")
  .addParam("name", "The NFT name")
  .addParam("symbol", "The NFT symbol")
  .addParam("supply", "The total supply of NFT", 1000, types.int)
  .addParam("uri", "The base URI of NFT")
  .setAction(async (taskArgs, hre) => {
    const Artwork = await hre.ethers.getContractFactory("SwappiNFT");
    const artwork = await Artwork.deploy(taskArgs.name, taskArgs.symbol, taskArgs.supply, taskArgs.uri);
  
    await artwork.deployed();

    // await hre.run("verify:verify", {
    //   address: artwork.address,
    //   constructorArguments: [
    //     "Swappi NFT Contract", "SwappiNFT", 1000, "https://metadata.conflux.fun/images/dahan/18/verse.svg"
    //   ]
    // })
})

let privateKey = process.env.PRIVATE_KEY;
if (typeof(privateKey) == "undefined") {
  privateKey = "0x1234567890123456789012345678901234567890123456789012345678901234";
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    testnet: {
      url: "https://evmtestnet.confluxrpc.com",
      accounts: [
        privateKey
      ]
    }
  }
};
