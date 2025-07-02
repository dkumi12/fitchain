// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title FitChainMarketplace
 * @dev Marketplace for trading FitChain NFT badges
 */
contract FitChainMarketplace {
    IERC721 public immutable fitchainNFT;
    
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }
    
    mapping(uint256 => Listing) public listings;
    uint256[] public activeListings;
    
    uint256 public constant MARKETPLACE_FEE = 25; // 2.5%
    uint256 public totalVolume;
    uint256 public totalFees;
    
    event Listed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event Sold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event Delisted(uint256 indexed tokenId);
    event PriceUpdated(uint256 indexed tokenId, uint256 newPrice);
    
    constructor(address _fitchainAddress) {
        fitchainNFT = IERC721(_fitchainAddress);
    }
    
    /**
     * @dev List a badge for sale
     */
    function listBadge(uint256 tokenId, uint256 price) external {
        require(fitchainNFT.ownerOf(tokenId) == msg.sender, "Not badge owner");
        require(price > 0, "Price must be greater than 0");
        require(!listings[tokenId].active, "Already listed");
        
        // Transfer NFT to marketplace
        fitchainNFT.transferFrom(msg.sender, address(this), tokenId);
        
        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });
        
        activeListings.push(tokenId);
        
        emit Listed(tokenId, msg.sender, price);
    }
    
    /**
     * @dev Buy a listed badge
     */
    function buyBadge(uint256 tokenId) external payable {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Calculate fees
        uint256 fee = (listing.price * MARKETPLACE_FEE) / 1000;
        uint256 sellerAmount = listing.price - fee;
        
        // Update state
        listings[tokenId].active = false;
        totalVolume += listing.price;
        totalFees += fee;
        
        // Remove from active listings
        _removeFromActiveListings(tokenId);
        
        // Transfer NFT to buyer
        fitchainNFT.transferFrom(address(this), msg.sender, tokenId);
        
        // Pay seller
        (bool success, ) = listing.seller.call{value: sellerAmount}("");
        require(success, "Payment failed");
        
        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = msg.sender.call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit Sold(tokenId, listing.seller, msg.sender, listing.price);
    }
    
    /**
     * @dev Cancel listing
     */
    function cancelListing(uint256 tokenId) external {
        require(listings[tokenId].seller == msg.sender, "Not seller");
        require(listings[tokenId].active, "Not listed");
        
        listings[tokenId].active = false;
        _removeFromActiveListings(tokenId);
        
        // Return NFT to seller
        fitchainNFT.transferFrom(address(this), msg.sender, tokenId);
        
        emit Delisted(tokenId);
    }    
    /**
     * @dev Update listing price
     */
    function updatePrice(uint256 tokenId, uint256 newPrice) external {
        require(listings[tokenId].seller == msg.sender, "Not seller");
        require(listings[tokenId].active, "Not listed");
        require(newPrice > 0, "Invalid price");
        
        listings[tokenId].price = newPrice;
        emit PriceUpdated(tokenId, newPrice);
    }
    
    /**
     * @dev Get all active listings
     */
    function getActiveListings() external view returns (uint256[] memory) {
        return activeListings;
    }
    
    /**
     * @dev Get listing details
     */
    function getListing(uint256 tokenId) external view returns (
        address seller,
        uint256 price,
        bool active
    ) {
        Listing memory listing = listings[tokenId];
        return (listing.seller, listing.price, listing.active);
    }
    
    /**
     * @dev Get marketplace statistics
     */
    function getMarketplaceStats() external view returns (
        uint256 volume,
        uint256 fees,
        uint256 activeCount
    ) {
        return (totalVolume, totalFees, activeListings.length);
    }
    
    /**
     * @dev Withdraw accumulated fees (only owner)
     */
    function withdrawFees() external {
        require(totalFees > 0, "No fees to withdraw");
        uint256 amount = totalFees;
        totalFees = 0;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @dev Remove token from active listings array
     */
    function _removeFromActiveListings(uint256 tokenId) private {
        for (uint i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == tokenId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }
    }
}