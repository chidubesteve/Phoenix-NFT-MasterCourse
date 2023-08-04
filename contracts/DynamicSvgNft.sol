// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
error ERC721Metadata__URI_QueryFor_NonExistentToken();

contract DynamicSvgNft is ERC721, Ownable {
    uint256 private s_tokenCounter;
    string private s_lowImageURI;
    string private s_highImageURI;
    AggregatorV3Interface internal immutable i_priceFeed;

    mapping (uint256 => int256) private s_tokenToHighValue;

    event CreatedNft(uint256 indexed tokenId, int256 highValue);

    constructor(address priceFeedAddress, string memory lowSvg, string memory highSvg) ERC721("Dynamic SVG NFT", "DSN") {
        s_tokenCounter = 0;
        i_priceFeed = AggregatorV3Interface(priceFeedAddress);
        s_lowImageURI = svgToImageUri(lowSvg);
        s_highImageURI = svgToImageUri(highSvg);

    }

    // functionalities
    
    function mintNft(int256 highValue) public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenToHighValue[s_tokenCounter] = highValue;
         s_tokenCounter = s_tokenCounter + 1;
        emit CreatedNft(s_tokenCounter, highValue);
    }

    function svgToImageUri(string memory svg) public pure returns (string memory) {
        // convert the svgs to image uris and store them in variables for later use
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }


    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if(!_exists(tokenId)) {
            revert ERC721Metadata__URI_QueryFor_NonExistentToken();
        } 

        (, int256 price, , , ) = i_priceFeed.latestRoundData();

        string memory imageURI = s_lowImageURI;
        if (price >= s_tokenToHighValue[tokenId]) {
              imageURI = s_highImageURI;
        } 
         return
            string(
            abi.encodePacked(
                _baseURI(),
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            name(),
                            '", "description":"An NFT that changes based on the chainlink feed",',
                            '"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
                            imageURI,
                            '"}'
                        )
                    )
                )
            )
            );
    }
    function getLowSVG()  public view returns (string memory) {
        return s_lowImageURI;
    }
      function getHighSVG()  public view returns (string memory) {
        return s_highImageURI;
    }
    function getTokenCounter() public view returns (uint256 ) {
        return s_tokenCounter;
    }
    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return i_priceFeed;
    }
}
