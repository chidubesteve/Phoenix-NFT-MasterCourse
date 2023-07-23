require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://eth-sepolia";
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "Key";
const COINMARKETCAP_API = process.env.COINMARKETCAP_API || "Key";
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmations: 1,
      // forking: {
      //   url: MAINNET_RPC_URL,
      // }
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6
    },
  },
  solidity: {
    compilers: [{ version: "0.8.9", }, { version: "0.8.19" }, { version: "0.8.7" }, { version: "0.8.4", }, { version: "0.6.12" },{ version: "0.4.19" }, { version: "0.6.0", settings: {}, }],
  },


etherscan: {
  apiKey: ETHERSCAN_API_KEY,
  customChains: [],
},
gasReporter: {
  enabled: false,
  outputFile: "gas-reporter.txt",
  noColors: true,
  currency: "USD",
  coinmarketCap: COINMARKETCAP_API,
  // token: "MATIC",
},
  namedAccounts: {
    deployer: {
      default: 0,
      1:0
    },

  },
  mocha: {
    timeout: 300000, //300 secs
  }

};


