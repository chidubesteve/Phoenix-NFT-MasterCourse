// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Encoding {
    function combineString() public pure returns(string memory){
        return string(abi.encodePacked("Hi {yourName}  ", "You'll get good at the blockchain stuff"));
    }
    function encodeNumber() public pure returns(bytes memory){
        bytes memory number  = abi.encode(3);
        return  number;
    }
        function encodeStrings() public pure returns(bytes memory){
        bytes memory someString  = abi.encode("Phoenix");
        return  someString;
    }
            function encodeStringPacked() public pure returns(bytes memory){
        bytes memory someString  = abi.encodePacked("Phoenix");
        return  someString;
    }
         function encodeStringBytes() public pure returns(bytes memory){
        bytes memory someString  = bytes("Phoenix");
        return  someString;
    }
        function dencodeString() public pure returns(string memory){
        string memory someString  = abi.decode(encodeStrings(), (string));
        return  someString;
    }
        function multiEncode() public pure returns(bytes memory){
        bytes memory someString  = abi.encode("Phoenix", "blah blah blah");
        return  someString;
    }
        function multiDecode() public pure returns(string memory, string memory){
        (string memory someString, string memory someOtherString)  = abi.decode(multiEncode(), (string, string));
        return  (someString, someOtherString);
    }
        function multiEncodePacked() public pure returns (bytes memory) {
        bytes memory someString = abi.encodePacked("some string", "it's bigger!");
        return someString;
    }

    // This doesn't work!
    function multiDecodePacked() public pure returns (string memory) {
        string memory someString = abi.decode(multiEncodePacked(), (string));
        return someString;
    }

    // This does!
    // Gas: 22313
    function multiStringCastPacked() public pure returns (string memory) {
        string memory someString = string(multiEncodePacked());
        return someString;
    }

}