const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
  VERIFICATION_BLOCK_CONFIRMATIONS,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {storeImages} = require("../utils/uploadToPinata")

const imageLocation = "../images/randomNft";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Address, subscriptionId;
  let tokenUris

  // we need to get the IPFS hashes of our images
  if(process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris()
  }


  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );

    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    console.log(`Address ${vrfCoordinatorV2Address}`);
    const txResponse = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await txResponse.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }
  log("########################################");
  await storeImages(imageLocation)
  // const args = [
  //   vrfCoordinatorV2Address,
  //   subscriptionId,
  //   networkConfig[chainId].gasLane,
  //   networkConfig[chainId].callBackGasLimit,
  //   //   tokenUri
  //   networkConfig[chainId].mintFee,
  // ];
};

async function handleTokenUris() {
  tokenUris = [];
  // we need to save the image to ipfs
  // then we need to save the metadata to ipfs

  return tokenUris;
}
module.exports.tags = ["all", "randomipfs", "main"]