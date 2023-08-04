const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config");
const { network, ethers } = require("hardhat");
const { Base64 } = require("js-base64");
const fs = require("fs");

// Read the nft images directly in the test script
let lowSVG = fs.readFileSync("images/dynamicNft/frown.svg", {
  encoding: "utf8",
});
let highSVG = fs.readFileSync("images/dynamicNft/happy.svg", {
  encoding: "utf8",
});
const highImageMetaData =
  "data:application/json;base64,eyJuYW1lIjoiRHluYW1pYyBTVkcgTkZUIiwgImRlc2NyaXB0aW9uIjoiQW4gTkZUIHRoYXQgY2hhbmdlcyBiYXNlZCBvbiB0aGUgY2hhaW5saW5rIGZlZWQiLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6ICJjb29sbmVzcyIsICJ2YWx1ZSI6IDEwMH1dLCAiaW1hZ2UiOiJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUIyYVdWM1FtOTRQU0l3SURBZ01qQXdJREl3TUNJZ2QybGtkR2c5SWpRd01DSWdJR2hsYVdkb2REMGlOREF3SWlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpUGdvZ0lEeGphWEpqYkdVZ1kzZzlJakV3TUNJZ1kzazlJakV3TUNJZ1ptbHNiRDBpZVdWc2JHOTNJaUJ5UFNJM09DSWdjM1J5YjJ0bFBTSmliR0ZqYXlJZ2MzUnliMnRsTFhkcFpIUm9QU0l6SWk4K0NpQWdQR2NnWTJ4aGMzTTlJbVY1WlhNaVBnb2dJQ0FnUEdOcGNtTnNaU0JqZUQwaU5qRWlJR041UFNJNE1pSWdjajBpTVRJaUx6NEtJQ0FnSUR4amFYSmpiR1VnWTNnOUlqRXlOeUlnWTNrOUlqZ3lJaUJ5UFNJeE1pSXZQZ29nSUR3dlp6NEtJQ0E4Y0dGMGFDQmtQU0p0TVRNMkxqZ3hJREV4Tmk0MU0yTXVOamtnTWpZdU1UY3ROalF1TVRFZ05ESXRPREV1TlRJdExqY3pJaUJ6ZEhsc1pUMGlabWxzYkRwdWIyNWxPeUJ6ZEhKdmEyVTZJR0pzWVdOck95QnpkSEp2YTJVdGQybGtkR2c2SURNN0lpOCtDand2YzNablBnPT0ifQ==";
  const lowImageMetaData = "data:application/json;base64,eyJuYW1lIjoiRHluYW1pYyBTVkcgTkZUIiwgImRlc2NyaXB0aW9uIjoiQW4gTkZUIHRoYXQgY2hhbmdlcyBiYXNlZCBvbiB0aGUgY2hhaW5saW5rIGZlZWQiLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6ICJjb29sbmVzcyIsICJ2YWx1ZSI6IDEwMH1dLCAiaW1hZ2UiOiJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBEOTRiV3dnZG1WeWMybHZiajBpTVM0d0lpQnpkR0Z1WkdGc2IyNWxQU0p1YnlJL1BnbzhjM1puSUhkcFpIUm9QU0l4TURJMGNIZ2lJR2hsYVdkb2REMGlNVEF5TkhCNElpQjJhV1YzUW05NFBTSXdJREFnTVRBeU5DQXhNREkwSWlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpUGdvZ0lEeHdZWFJvSUdacGJHdzlJaU16TXpNaUlHUTlJazAxTVRJZ05qUkRNalkwTGpZZ05qUWdOalFnTWpZMExqWWdOalFnTlRFeWN6SXdNQzQySURRME9DQTBORGdnTkRRNElEUTBPQzB5TURBdU5pQTBORGd0TkRRNFV6YzFPUzQwSURZMElEVXhNaUEyTkhwdE1DQTRNakJqTFRJd05TNDBJREF0TXpjeUxURTJOaTQyTFRNM01pMHpOekp6TVRZMkxqWXRNemN5SURNM01pMHpOeklnTXpjeUlERTJOaTQySURNM01pQXpOekl0TVRZMkxqWWdNemN5TFRNM01pQXpOeko2SWk4K0NpQWdQSEJoZEdnZ1ptbHNiRDBpSTBVMlJUWkZOaUlnWkQwaVRUVXhNaUF4TkRCakxUSXdOUzQwSURBdE16Y3lJREUyTmk0MkxUTTNNaUF6TnpKek1UWTJMallnTXpjeUlETTNNaUF6TnpJZ016Y3lMVEUyTmk0MklETTNNaTB6TnpJdE1UWTJMall0TXpjeUxUTTNNaTB6TnpKNlRUSTRPQ0EwTWpGaE5EZ3VNREVnTkRndU1ERWdNQ0F3SURFZ09UWWdNQ0EwT0M0d01TQTBPQzR3TVNBd0lEQWdNUzA1TmlBd2VtMHpOellnTWpjeWFDMDBPQzR4WXkwMExqSWdNQzAzTGpndE15NHlMVGd1TVMwM0xqUkROakEwSURZek5pNHhJRFUyTWk0MUlEVTVOeUExTVRJZ05UazNjeTA1TWk0eElETTVMakV0T1RVdU9DQTRPQzQyWXkwdU15QTBMakl0TXk0NUlEY3VOQzA0TGpFZ055NDBTRE0yTUdFNElEZ2dNQ0F3SURFdE9DMDRMalJqTkM0MExUZzBMak1nTnpRdU5TMHhOVEV1TmlBeE5qQXRNVFV4TGpaek1UVTFMallnTmpjdU15QXhOakFnTVRVeExqWmhPQ0E0SURBZ01DQXhMVGdnT0M0MGVtMHlOQzB5TWpSaE5EZ3VNREVnTkRndU1ERWdNQ0F3SURFZ01DMDVOaUEwT0M0d01TQTBPQzR3TVNBd0lEQWdNU0F3SURrMmVpSXZQZ29nSUR4d1lYUm9JR1pwYkd3OUlpTXpNek1pSUdROUlrMHlPRGdnTkRJeFlUUTRJRFE0SURBZ01TQXdJRGsySURBZ05EZ2dORGdnTUNBeElEQXRPVFlnTUhwdE1qSTBJREV4TW1NdE9EVXVOU0F3TFRFMU5TNDJJRFkzTGpNdE1UWXdJREUxTVM0MllUZ2dPQ0F3SURBZ01DQTRJRGd1TkdnME9DNHhZelF1TWlBd0lEY3VPQzB6TGpJZ09DNHhMVGN1TkNBekxqY3RORGt1TlNBME5TNHpMVGc0TGpZZ09UVXVPQzA0T0M0MmN6a3lJRE01TGpFZ09UVXVPQ0E0T0M0Mll5NHpJRFF1TWlBekxqa2dOeTQwSURndU1TQTNMalJJTmpZMFlUZ2dPQ0F3SURBZ01DQTRMVGd1TkVNMk5qY3VOaUEyTURBdU15QTFPVGN1TlNBMU16TWdOVEV5SURVek0zcHRNVEk0TFRFeE1tRTBPQ0EwT0NBd0lERWdNQ0E1TmlBd0lEUTRJRFE0SURBZ01TQXdMVGsySURCNklpOCtDand2YzNablBnbz0ifQ==";


const expectedBase64Image = "data:image/svg+xml;base64,";
// Manually convert SVGs to Image URIs using the same method as in the contract
const expectedHighImageUri = expectedBase64Image + Base64.encode(highSVG);
const expectedLowImageUri = expectedBase64Image + Base64.encode(lowSVG);

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Dynamic Svg Nft unit test", () => {
      let dynamicSvgNft, MockV3Aggregator, deployer;
      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["mocks", "dynamicsvg"]);
        dynamicSvgNft = await ethers.getContract("DynamicSvgNft");
        MockV3Aggregator = await ethers.getContract("MockV3Aggregator");
      });
      describe("Constructor", () => {
        it("sets the initial values correctly", async () => {
          const highSVG1 = await dynamicSvgNft.getHighSVG();
          const lowSVG1 = await dynamicSvgNft.getLowSVG();
          const tokenCounter = await dynamicSvgNft.getTokenCounter();
          const priceFeed = await dynamicSvgNft.getPriceFeed();

          assert.equal(highSVG1, expectedHighImageUri);
          assert.equal(lowSVG1, expectedLowImageUri);
          assert.equal(tokenCounter.toString(), "0");
          assert.equal(priceFeed, MockV3Aggregator.address);
        });
      });

      describe("Mint Nft", () => {
        it("creates a nft, emits an event when a nft is minted and, set the token counter", async () => {
          const highValue = ethers.utils.parseEther("1");
          //mocking getLatestRoundData function of mock v3 aggregator to return value of 1 dollar
          await expect(dynamicSvgNft.mintNft(highValue)).to.emit(
            dynamicSvgNft,
            "CreatedNft"
          );

          const tokenCounter = await dynamicSvgNft.getTokenCounter();
          assert.equal(tokenCounter.toString(), "1");
          const tokenUri = await dynamicSvgNft.tokenURI(0);
          assert.equal(tokenUri, highImageMetaData);
        });
        it("shifts the token uri to lower when the price doesn't surpass the highvalue", async function () {
          const highValue = ethers.utils.parseEther("100000000"); 
          const txResponse = await dynamicSvgNft.mintNft(highValue);
          await txResponse.wait(1);
          const tokenURI = await dynamicSvgNft.tokenURI(0);
          expect(tokenURI).to.equal(lowImageMetaData); // If price feed value is low
        });
        it("shifts the token uri to higher when the price surpasses the highvalue", async function () {
          const highValue = ethers.utils.parseEther("100"); 
          const txResponse = await dynamicSvgNft.mintNft(highValue);
          await txResponse.wait(1);
          const tokenURI = await dynamicSvgNft.tokenURI(0);
          expect(tokenURI).to.equal(highImageMetaData); // If price feed value is high
        });
      });
      describe("svgToImageUri", () => {
        it("should convert SVG to Image URI correctly", async () => {
          const lowImageURI = await dynamicSvgNft.svgToImageUri(lowSVG);
          const highImageURI = await dynamicSvgNft.svgToImageUri(highSVG);

          assert.equal(lowImageURI, expectedLowImageUri);
          assert.equal(highImageURI, expectedHighImageUri);
        });
      });
    });
