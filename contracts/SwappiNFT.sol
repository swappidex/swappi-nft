//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SwappiNFT is ERC721 {
    uint256 public _tokenCounter;
    uint256 public _totalSupply;
    address public _contractOwner;
    string public _tokenBaseURI;
    bool public _mintEnabled;

    address public _token;
    address public _tokenReceiver;
    uint256 public _NFTPrice;

    mapping (address => bool) private _minted;

    modifier onlyOwner {
        require(msg.sender == _contractOwner, "SwappiNFT: must be contract owner");
        _;
    }

    constructor(
            string memory name,
            string memory symbol,
            uint256 totalSupply,
            string memory tokenBaseURI,
            address token,
            address tokenReceiver,
            uint256 NFTPrice
        ) ERC721(name, symbol) {
            require(token != address(0), "SwappiNFT: token address is zero");
            require(tokenReceiver != address(0), "SwappiNFT: transfer to the zero address");

            _tokenCounter = 0;
            _totalSupply = totalSupply;
            _contractOwner = msg.sender;
            _tokenBaseURI = tokenBaseURI;
            _mintEnabled = false;
            _token = token;
            _tokenReceiver = tokenReceiver;
            _NFTPrice = NFTPrice;
        }

    function setTotalSupply(uint256 totalSupply) public onlyOwner {
        _totalSupply = totalSupply;
    }

    function setContractOwner(address newContractOwner) public onlyOwner {
        _contractOwner = newContractOwner;
    }

    function hasMinted(address addr) public view returns(bool){
        return _minted[addr];
    }

    function setTokenBaseURI(string memory tokenBaseURI) public onlyOwner {
        _tokenBaseURI = tokenBaseURI;
    }

    function enableMint() public onlyOwner {
        _mintEnabled = true;
    }

    function disableMint() public onlyOwner {
        _mintEnabled = false;
    }

    function setToken(address addr) public onlyOwner {
        require(addr != address(0), "SwappiNFT: token address is zero");
        _token = addr;
    }

    function setTokenReceiver(address addr) public onlyOwner {
        require(addr != address(0), "SwappiNFT: transfer to the zero address");
        _tokenReceiver = addr;
    }

    function setNFTPrice(uint256 NFTPrice) public onlyOwner {
        _NFTPrice = NFTPrice;
    }

    function mint() public {
        require(_mintEnabled, "SwappiNFT: mint is not enabled");
        require(_tokenCounter < _totalSupply, "SwappiNFT: exceed the total supply");
        require(_minted[msg.sender] == false, "SwappiNFT: mint more than once");
        require(tx.origin == msg.sender, "SwappiNFT: this is a contract account");
        _minted[msg.sender] = true;

        SafeERC20.safeTransferFrom(IERC20(_token), msg.sender, address(this), _NFTPrice);

        _safeMint(msg.sender, _tokenCounter);

        SafeERC20.safeTransfer(IERC20(_token), _tokenReceiver, _NFTPrice);

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
