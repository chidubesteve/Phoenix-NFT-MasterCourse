# Phoenix-NFT-MasterCourse


This repository contains three Solidity smart contracts that allow you to generate NFTs based on rarity and push them to IPFS. The contracts are designed to work with the Chainlink VRF (Verifiable Random Function) to create unique and random NFTs. Additionally, it includes a basic NFT contract for minting simple NFTs.

## Contracts

### 1. RandomIpfsNft.sol
This contract generates NFTs with varying rarities (rare, semi-rare, and common) using Chainlink VRF. Users can pay to mint an NFT, and the owner of the contract can withdraw the Ether received.

### 2. BasicNft.sol
This contract allows users to mint simple NFTs without any randomness. Each NFT will have the same URI pointing to an IPFS file.

### 3. DynamicSvgNft.sol
This contract generates dynamic SVG NFTs based on the Chainlink price feed. The NFT's appearance changes according to the latest price provided by the Chainlink node. It includes two SVG files for low and high values of the price feed.

## Getting Started

### Prerequisites
- Node.js
- npm
- Hardhat (Ethereum development environment)
- Chainlink VRF
- IPFS

### Deployment and Testing

1. Clone this repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Set up and deploy the Chainlink VRF contract on the desired network.
4. Deploy the contracts using the Hardhat deployment scripts:
   - Use the `RandomIpfsNft` constructor to pass the Chainlink VRF contract address and other required parameters.
   - For `DynamicSvgNft`, pass the Chainlink price feed address, and the base64-encoded SVG images for low and high values.
5. After deploying the contracts, test their functionalities using the provided test scripts. You can use Hardhat's testing framework or any other testing library you prefer.
6. Mock the Chainlink node to provide specific random numbers and prices for testing various scenarios.

## Manipulating Values for Testing

To mock the Chainlink node's response, you can use various testing techniques:

1. Mock Chainlink VRF:
   - Use Hardhat's mockup feature or deploy a custom mock Chainlink VRF contract to control the random number generation.

2. Mock Chainlink Price Feed:
   - Use Hardhat's mockup feature or deploy a custom mock Chainlink price feed contract to set specific price values.

3. Use Test Networks:
   - Deploy the contracts on test networks (e.g., Sepolia, Rinkeby) to interact with real Chainlink nodes and observe real-world responses.

## Disclaimer

Always exercise caution when deploying smart contracts and handling real funds. Consider security best practices and consult with blockchain experts if necessary.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
