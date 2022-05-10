//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SwappiNFT is ERC721 {
    uint256 public _tokenCounter;
    uint256 public _totalSupply;
    address public _contractOwner;
    string public _tokenBaseURI;

    mapping (address => uint256) private _whiteList;

    constructor(
            string memory name,
            string memory symbol,
            uint256 totalSupply,
            string memory tokenBaseURI
        ) ERC721(name, symbol) {
            _tokenCounter = 0;
            _totalSupply = totalSupply;
            _contractOwner = msg.sender;
            _tokenBaseURI = tokenBaseURI;
        }

    function setTotalSupply(uint256 totalSupply) public {
        require(msg.sender == _contractOwner, "SwappiNFT: must be contract owner");
        _totalSupply = totalSupply;
    }

    function setContractOwner(address newContractOwner) public {
        require(msg.sender == _contractOwner, "SwappiNFT: must be contract owner");
        _contractOwner = newContractOwner;
    }

    function setWhiteList(address addr, uint256 capacity) public {
        require(msg.sender == _contractOwner, "SwappiNFT: must be contract owner");
        _whiteList[addr] = capacity;
    }

    function verifyWhiteList(address addr) public view returns(uint256){
        return _whiteList[addr];
    }

    function setTokenBaseURI(string memory tokenBaseURI) public {
        require(msg.sender == _contractOwner, "SwappiNFT: must be contract owner");
        _tokenBaseURI = tokenBaseURI;
    }

    function mint() public {
        require(_tokenCounter < _totalSupply, "SwappiNFT: exceed the total supply");
        require(_whiteList[msg.sender] > 0, "SwappiNFT: address must be in whitelist"); 
        _whiteList[msg.sender] -= 1;

        _safeMint(msg.sender, _tokenCounter);

        _tokenCounter++;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _tokenBaseURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns(string memory) {
        require(_exists(tokenId), "SwappiNFT: URI query for nonexistent token");
        return _baseURI();
    }
}
