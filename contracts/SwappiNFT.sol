//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SwappiNFT is ERC721 {
    uint256 public _tokenCounter;
    uint256 public _totalSupply;
    address public _contractOwner;

    mapping (uint256 => string) private _tokenURIs;
    mapping (address => uint256) private _whiteList;

    constructor(
            string memory name,
            string memory symbol,
            uint256 totalSupply
        ) ERC721(name, symbol) {
            _tokenCounter = 0;
            _totalSupply = totalSupply;
            _contractOwner = msg.sender;
        }

    function setTotalSupply(uint256 totalSupply) public {
        require(msg.sender == _contractOwner, "Must be contract owner");
        _totalSupply = totalSupply;
    }

    function setContractOwner(address newContractOwner) public {
        require(msg.sender == _contractOwner, "Must be contract owner");
        _contractOwner = newContractOwner;
    }

    function addToWhitelist(address addr) public {
        require(msg.sender == _contractOwner, "Must be contract owner");
        _whiteList[addr] += 1;
    }

    function setWhiteList(address addr, uint256 capacity) public {
        require(msg.sender == _contractOwner, "Must be contract owner");
        _whiteList[addr] = capacity;
    }

    function verifyWhiteList(address addr) public view returns(uint256){
        return _whiteList[addr];
    }

    function mint(string memory _tokenURI) public {
        require(_tokenCounter < _totalSupply, "Exceed the total supply");

        require(_whiteList[msg.sender] > 0, "Address must be in whitelist"); 
        _whiteList[msg.sender] -= 1;

        _safeMint(msg.sender, _tokenCounter);
        _setTokenURI(_tokenCounter, _tokenURI);

        _tokenCounter++;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns(string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }
}
