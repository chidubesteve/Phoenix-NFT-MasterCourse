const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {storeImages, storeTokenUriMetadata} = require("../utils/uploadToPinata")



const FUND_AMOUNT = "1000000000000000000000";
const imageLocation = "images/randomNft/";

let tokenUris = [
  'ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo',      
  'ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d',      
  'ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm'       
]

  const metadataTemplate = {
    name: "",
    description: "",
    image: "", // //ipfs//${imagehash}
    attributes: [
      {
        trait_type: "Cuteness",
        value: 100,
      },
    ]
  }

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Address, subscriptionId;
  let vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")


  // we need to get the IPFS hashes of our images
  if(process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris()
  }


  if (developmentChains.includes(network.name)) {
     await vrfCoordinatorV2Mock 


    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    console.log(`Address ${vrfCoordinatorV2Address}`);
    const txResponse = await vrfCoordinatorV2Mock.createSubscription();
    const txReceipt = await txResponse.wait(1);
    subscriptionId = txReceipt.events[0].args.subId;

    await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }
  log("########################################");

  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId]["gasLane"],
    networkConfig[chainId]["callbackGasLimit"],
    tokenUris,
    networkConfig[chainId]["mintFee"]
  ];


console.log("After args")
    const randomIpfsNft = await deploy("RandomIpfsNft", {
      from: deployer,
      args: args,
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1
    })
    // adding a consumer
    if (developmentChains.includes(network.name)) {
      await vrfCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address)
  }
  // verifying the deployments
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      log("verifying.....")
      await verify(randomIpfsNft.address, args)
      log("verified!")

}

}
async function handleTokenUris() {
  tokenUris = [];
  // we need to save the image to ipfs
  // then we need to save the metadata to ipfs
  const {responses: imageUploadResponses, files} = await storeImages(imageLocation)
  for (const imageUploadResponseIndex in imageUploadResponses) {
    // create metadata & upload metadata
    let tokenUriMetadata = {...metadataTemplate}
      tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
      tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
      tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
      console.log(`Uploading ${tokenUriMetadata.name} to ipfs...`)

      // store the metadata to ipfs/pinata
      const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
      tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token Uris uploaded, They are:")
    console.log(tokenUris)

    return tokenUris;

  }

module.exports.tags = ["all", "randomipfs", "main"]
