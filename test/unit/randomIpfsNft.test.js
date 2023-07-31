const { assert, expect } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const {
  developmentChains
} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("RandomIpfs Unit Tests", () => {
      let randomIpfsNft, vrfCoordinatorV2Mock, deployer;
      const chainId = network.config.chainId;
      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "randomipfsnft"]);
        randomIpfsNft = await ethers.getContract("RandomIpfsNft");
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
      });
      describe("Constructor", () => {
        it("initializes the randomIpfsNft contract correctly", async () => {
          const dogTokenUriZero = await randomIpfsNft.getDogTokenUris(0);
          const isInitialized = await randomIpfsNft.getInitialized();
          assert(dogTokenUriZero.includes("ipfs://"));
          assert.equal(isInitialized, true);
        });
      });
      describe("requestNft", () => {
        // verify the mint fee value
        it("fails if payment isn't sent with the request", async () => {
          await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
            "RandomIpfsNft__NeedMoreETHSent"
          );
        });

        it("reverts if payment amount is less than the mint fee", async function () {
            const fee = await randomIpfsNft.getMintFee()
            await expect(
                randomIpfsNft.requestNft({
                    value: fee.sub(ethers.utils.parseEther("0.001")),
                })
            ).to.be.revertedWith("RandomIpfsNft__NeedMoreETHSent")
        })
        it("emits an event and kicks off a random word request", async function () {
            const fee = await randomIpfsNft.getMintFee()
            await expect(randomIpfsNft.requestNft({ value: fee.toString() })).to.emit(
                randomIpfsNft,
                "NftRequested"
            )
        })
    })
    describe("fulfillRandomWords", () => {
        it("mints NFT after random number is returned", async function () {
            await new Promise(async (resolve, reject) => {
                randomIpfsNft.once("NftMinted", async () => {
                    try {
                        const tokenUri = await randomIpfsNft.tokenURI("0")
                        const tokenCounter = await randomIpfsNft.getTokenCounter()
                        assert.equal(tokenUri.toString().includes("ipfs://"), true)
                        assert.equal(tokenCounter.toString(), "1")
                        resolve()
                    } catch (e) {
                        console.log(e)
                        reject(e)
                    }
                })
                try {
                    const fee = await randomIpfsNft.getMintFee()
                    const requestNftResponse = await randomIpfsNft.requestNft({
                        value: fee.toString(),
                    })
                    const requestNftReceipt = await requestNftResponse.wait(1)
                    await vrfCoordinatorV2Mock.fulfillRandomWords(
                        requestNftReceipt.events[1].args.requestId,
                        randomIpfsNft.address
                    )
                } catch (e) {
                    console.log(e)
                    reject(e)
                }
            })
        })
    })
    describe("getBreedFromModdedRng", () => {
        it("should return pug if moddedRng < 10", async function () {
            const expectedValue = await randomIpfsNft.getBreedFromModdedRng(7)
            assert.equal(0, expectedValue)
        })
        it("should return shiba-inu if moddedRng is between 10 - 39", async function () {
            const expectedValue = await randomIpfsNft.getBreedFromModdedRng(21)
            assert.equal(1, expectedValue)
        })
        it("should return st. bernard if moddedRng is between 40 - 99", async function () {
            const expectedValue = await randomIpfsNft.getBreedFromModdedRng(77)
            assert.equal(2, expectedValue)
        })
        it("should revert if moddedRng > 99", async function () {
            await expect(randomIpfsNft.getBreedFromModdedRng(100)).to.be.revertedWith(
                "RandomIpfsNft__RangeOutOfBounds"
            )
        })

      });
    });
