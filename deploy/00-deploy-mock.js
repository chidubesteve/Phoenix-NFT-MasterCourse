const { network } = require("hardhat");

const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9; //this is a calculated price
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  const args = [BASE_FEE, GAS_PRICE_LINK];

  if (chainId) {
    log("Local network detected! Deploying mocks");
    // deploy a mock for vrfCoordinator
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: args,
    });
    log("Mocks deployed!");
    log("#####################################");
  }
};
module.exports.tags = ["all", "mocks"];
