// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ERC721Demo is ERC721 {
    using Counters for Counters.Counter;
    
    address public contractOwner;
    address public minter;
    string private baseURI;
    Counters.Counter private tokenIdCounter;

    constructor() ERC721("Slash NFT Demo", "SNFTD") {
        contractOwner = msg.sender;
    }

    function updateMinter(address _minter) external {
        require(msg.sender == contractOwner, "you don't have a permission");
        minter = _minter;
    }

    function updateBaseURI(string memory uri) external {
        require(msg.sender == contractOwner, "you don't have a permission");
        baseURI = uri;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function mint(address to) public returns (uint256) {
        require(
            minter == address(0) || msg.sender == minter,
            "Minting can only be performed by minter"
        );
        tokenIdCounter.increment();
        _safeMint(to, tokenIdCounter.current());

        return tokenIdCounter.current();
    }
}