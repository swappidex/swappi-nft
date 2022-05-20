const { expect } = require("chai");
const { ethers } = require("hardhat");

let PPIToken = require(`./PPIToken.sol/PPIToken.json`);

describe("Swappi NFT Smart Contract Tests", function () {
  let swappinft;
  let tokenBaseURI = "https://aliyuncs.com/0";

  let PPITokenContract;

  this.beforeEach(async function() {
    // This is executed before each test

    [owner, tokenReceiver] = await ethers.getSigners();
    console.log(`owner address ${owner.address}`);

    const factory  = new ethers.ContractFactory(PPIToken.abi, PPIToken.bytecode, owner);
    PPITokenContract = await factory.deploy();
    await PPITokenContract.deployed();

    console.log(`PPI contract address: ${PPITokenContract.address}`);

    const swappiNft = await ethers.getContractFactory("SwappiNFT");
    swappinft = await swappiNft.deploy("Swappi NFT Contract", "SwappiNFT", 1000, tokenBaseURI, PPITokenContract.address, tokenReceiver.address, 200);
  })

  it("Total supply can be set", async function() {
    expect(await swappinft._totalSupply()).to.equal(1000);

    await swappinft.setTotalSupply(10000);
    expect(await swappinft._totalSupply()).to.equal(10000);
  })

  it("Contract owner can be set", async function() {
    [account1, account2] = await ethers.getSigners();
    expect(await swappinft._contractOwner()).to.equal(account1.address);

    await expect(swappinft.connect(account2).setContractOwner(account2.address)).to.be.revertedWith('SwappiNFT: must be contract owner');

    await swappinft.setContractOwner(account2.address);
    expect(await swappinft._contractOwner()).to.equal(account2.address);
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
    
    await expect(swappinft.connect(account1).mint()).to.be.revertedWith('ERC20: transfer amount exceeds balance');
  })

  it("NFT is minted successfully", async function() {
    [owner, receiver, account1] = await ethers.getSigners();

    expect(await swappinft.balanceOf(account1.address)).to.equal(0);
    await swappinft.enableMint();

    await PPITokenContract.mint(account1.address, 200);
    await PPITokenContract.connect(account1).approve(swappinft.address, 200);
    expect(await PPITokenContract.balanceOf(account1.address)).to.equal(200);
    expect(await PPITokenContract.balanceOf(receiver.address)).to.equal(0);

    console.log(`Mint address ${account1.address}`);

    const tx = await swappinft.connect(account1).mint();

    expect(await swappinft.balanceOf(account1.address)).to.equal(1);
    expect(await PPITokenContract.balanceOf(account1.address)).to.equal(0);
    expect(await PPITokenContract.balanceOf(receiver.address)).to.equal(200);

    await expect(swappinft.connect(account1).mint()).to.be.revertedWith('SwappiNFT: mint more than once');
  })

  it("tokenURI is set sucessfully", async function() {
    [owner, receiver, account1, account2] = await ethers.getSigners();
    await swappinft.enableMint();

    await PPITokenContract.mint(account1.address, 200);
    await PPITokenContract.connect(account1).approve(swappinft.address, 200);

    await PPITokenContract.mint(account2.address, 200);
    await PPITokenContract.connect(account2).approve(swappinft.address, 200);

    expect(await PPITokenContract.balanceOf(receiver.address)).to.equal(0);

    const tx1 = await swappinft.connect(account1).mint();
    const tx2 = await swappinft.connect(account2).mint();

    expect(await swappinft.tokenURI(0)).to.equal(tokenBaseURI);
    expect(await swappinft.tokenURI(1)).to.equal(tokenBaseURI);

    expect(await PPITokenContract.balanceOf(receiver.address)).to.equal(400);
  })
});
