const { network, getNamedAccounts, deployments } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await  getNamedAccounts()

    log("#########################################")
    const args = []
        const basicNft = await deploy("BasicNft", {
            from: deployer,
            log: true,
            args: args,
            waitConfirmations: network.config.blockConfirmations || 1,
        })

        if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
            log("verifying.....")
            await verify(basicNft.address, args)
            log("verified!")

            log("#########################################")
        }

 
}
module.exports.tags = ["main", "basicnft"]