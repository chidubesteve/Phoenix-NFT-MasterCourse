const { network,  deployments, ethers } = require("hardhat");
const {
  developmentChains
} = require("../../helper-hardhat-config");
const { assert } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT test", () => {
      let basicNft, deployer, accounts;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = await accounts[0];
        await deployments.fixture(["basicnft"]);
        basicNft = await ethers.getContract("BasicNft");
      });
      describe("constructor", () => {
        it("initializes the NFT correctly", async () => {
          const name = await basicNft.name();
          const symbol = await basicNft.symbol();
          const tokenCounter = await basicNft.getTokenCounter();
          assert.equal(name, "Dogie");
          assert.equal(symbol, "DOG");
          assert.equal(tokenCounter.toString(), "0");
        });
      });
      //  test 02
      describe("Mint NFT", () => {
        beforeEach(async () => {
          txResponse = await basicNft.mintNft();
          txResponse.wait(1);
        });
        it("allows the contract caller to mint NFT", async () => {
          const tokenURI = await basicNft.tokenURI(0);
          const tokenCounter = await basicNft.getTokenCounter();

          assert.equal(tokenCounter.toString(), "1");
          assert.equal(tokenURI, await basicNft.TOKEN_URI());
        });
        it("Show the correct balance and owner of an NFT", async function () {
          const deployerAddress = deployer.address;
          const deployerBalance = await basicNft.balanceOf(deployerAddress);
          const owner = await basicNft.ownerOf("0");

          assert.equal(deployerBalance.toString(), "1");
          assert.equal(owner, deployerAddress);
        });
      });
    });
