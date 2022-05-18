//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SwappiNFT is ERC721 {
    uint256 public _tokenCounter;
    uint256 public _totalSupply;
    address public _contractOwner;
    string public _tokenBaseURI;
    bool public _mintEnabled;

    address public _token;
    address public _tokenRecevier;
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
            _tokenRecevier = tokenReceiver;
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
        _tokenRecevier = addr;
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

        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = _token.call(abi.encodeWithSelector(0x23b872dd, msg.sender, address(this), _NFTPrice));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'SwappiNFT: TRANSFER_FROM_FAILED');

        _safeMint(msg.sender, _tokenCounter);

        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (success, data) = _token.call(abi.encodeWithSelector(0xa9059cbb, _tokenRecevier, _NFTPrice));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'SwappiNFT: TRANSFER_FAILED');

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
