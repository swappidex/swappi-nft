const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Swappi NFT Smart Contract Tests", function () {
  let swappinft;

  this.beforeEach(async function() {
    // This is executed before each test
    const swappiNft = await ethers.getContractFactory("SwappiNFT");
    swappinft = await swappiNft.deploy("Swappi NFT Contract", "SwappiNFT", 1000);
  })

  it("Total supply can be set", async function() {
    expect(await swappinft._totalSupply()).to.equal(1000);

    await swappinft.setTotalSupply(10000);
    expect(await swappinft._totalSupply()).to.equal(10000);
  })

  it("Contract owner can be set", async function() {
    [account1, account2] = await ethers.getSigners();
    expect(await swappinft._contractOwner()).to.equal(account1.address);

    await swappinft.setContractOwner(account2.address);
    expect(await swappinft._contractOwner()).to.equal(account2.address);
  })

  it("Whitelist can be set", async function() {
    [account1] = await ethers.getSigners();
    expect(await swappinft.verifyWhiteList(account1.address)).to.equal(0);

    await swappinft.addToWhitelist(account1.address);
    expect(await swappinft.verifyWhiteList(account1.address)).to.equal(1);

    await swappinft.addToWhitelist(account1.address);
    expect(await swappinft.verifyWhiteList(account1.address)).to.equal(2);

    await swappinft.setWhiteList(account1.address, 5);
    expect(await swappinft.verifyWhiteList(account1.address)).to.equal(5);
  })

  it("NFT is minted reverted", async function() {
    [account1] = await ethers.getSigners();

    expect(await swappinft.balanceOf(account1.address)).to.equal(0);
    
    const tokenURI = "https://opensea-creatures-api.herokuapp.com/api/creature/1"
    await expect(swappinft.connect(account1).mint(tokenURI)).to.be.revertedWith('Address must be in whitelist');
  })

  it("NFT is minted successfully", async function() {
    [account1] = await ethers.getSigners();

    expect(await swappinft.balanceOf(account1.address)).to.equal(0);

    await swappinft.addToWhitelist(account1.address);
    
    const tokenURI = "https://opensea-creatures-api.herokuapp.com/api/creature/1"
    const tx = await swappinft.connect(account1).mint(tokenURI);

    expect(await swappinft.balanceOf(account1.address)).to.equal(1);
  })

  it("tokenURI is set sucessfully", async function() {
    [account1, account2] = await ethers.getSigners();

    const tokenURI_1 = "https://opensea-creatures-api.herokuapp.com/api/creature/1"
    const tokenURI_2 = "https://opensea-creatures-api.herokuapp.com/api/creature/2"

    await swappinft.addToWhitelist(account1.address);
    await swappinft.addToWhitelist(account2.address);

    const tx1 = await swappinft.connect(account1).mint(tokenURI_1);
    const tx2 = await swappinft.connect(account2).mint(tokenURI_2);

    expect(await swappinft.tokenURI(0)).to.equal(tokenURI_1);
    expect(await swappinft.tokenURI(1)).to.equal(tokenURI_2);
  })
});
