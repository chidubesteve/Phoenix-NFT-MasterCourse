const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_API_SECRET = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET)


async function storeImages(imagesFilePath) {
    const fullImagesPath = path.resolve(imagesFilePath);


    if (!fs.existsSync(fullImagesPath)) {
        console.error("Directory does not exist:", fullImagesPath);
        return;
    }

    const files = fs.readdirSync(fullImagesPath);
    let responses = []
    
    console.log("Uploading to IPFS....")
    for (file in files) {
        console.log(`Working on ${file}...`)
        const readableStreamForFile =  fs.createReadStream(`${fullImagesPath}/${files[file]}`)
        const options = {
            pinataMetadata: {
                name: files[file],
            },
        }
        try {
            const response = await pinata.pinFileToIPFS(readableStreamForFile, options)
            responses.push(response)
        } catch (error) {
            console.log(error)
        }
    }
    return {responses, files}
}

async function storeTokenUriMetadata(metadata) {
    try {
        const response = await pinata.pinJSONToIPFS(metadata)
        return response
    } catch (error) {
        console.log(error)
    }
    return null
}
module.exports = {storeImages, storeTokenUriMetadata}