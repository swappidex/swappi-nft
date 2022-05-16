const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Swappi NFT Smart Contract Tests", function () {
  let swappinft;
  let tokenBaseURI = "https://aliyuncs.com/0";

  this.beforeEach(async function() {
    // This is executed before each test
    const swappiNft = await ethers.getContractFactory("SwappiNFT");
    swappinft = await swappiNft.deploy("Swappi NFT Contract", "SwappiNFT", 1000, tokenBaseURI);
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

    await swappinft.setWhiteList(account1.address, 5);
    expect(await swappinft.verifyWhiteList(account1.address)).to.equal(5);
  })

  it("Token Base URI can be set", async function() {
    [account1] = await ethers.getSigners();
    await swappinft.setTokenBaseURI("https://aliyuncs.com/1");
    expect(await swappinft._tokenBaseURI()).to.equal("https://aliyuncs.com/1");
  })

  it("Mint switch can be set", async function() {
    [account1, account2] = await ethers.getSigners();
    expect(await swappinft._mintEnabled()).to.equal(false);

    await swappinft.enableMint();
    expect(await swappinft._mintEnabled()).to.equal(true);

    await swappinft.disableMint();
    expect(await swappinft._mintEnabled()).to.equal(false);
  })

  it("NFT is minted reverted", async function() {
    [account1] = await ethers.getSigners();
    await swappinft.enableMint();

    expect(await swappinft.balanceOf(account1.address)).to.equal(0);
    
    await expect(swappinft.connect(account1).mint()).to.be.revertedWith('SwappiNFT: address must be in whitelist');
  })

  it("NFT is minted successfully", async function() {
    [account1] = await ethers.getSigners();

    expect(await swappinft.balanceOf(account1.address)).to.equal(0);

    await swappinft.setWhiteList(account1.address, 1);
    await swappinft.enableMint();
    
    const tx = await swappinft.connect(account1).mint();

    expect(await swappinft.balanceOf(account1.address)).to.equal(1);
  })

  it("tokenURI is set sucessfully", async function() {
    [account1, account2] = await ethers.getSigners();

    await swappinft.setWhiteList(account1.address, 1);
    await swappinft.setWhiteList(account2.address, 1);
    await swappinft.enableMint();

    const tx1 = await swappinft.connect(account1).mint();
    const tx2 = await swappinft.connect(account2).mint();

    expect(await swappinft.tokenURI(0)).to.equal(tokenBaseURI);
    expect(await swappinft.tokenURI(1)).to.equal(tokenBaseURI);
  })
});
