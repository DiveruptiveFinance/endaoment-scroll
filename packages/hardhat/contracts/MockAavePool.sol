// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockAavePool
 * @notice Mock Aave Pool for hackathon demo - simulates Aave V3 supply/withdraw functionality
 * @dev Allows instant yield generation via adminAddYield for demo purposes
 */
contract MockAavePool is Ownable {
    // Asset token (USDC)
    IERC20 public immutable asset;

    // User balances: user => balance
    mapping(address => uint256) public userSupplies;

    // Total supply in the pool
    uint256 public totalSupply;

    // Accumulated yield (for demo purposes)
    uint256 public accumulatedYield;

    // Events
    event Supply(address indexed user, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed user, uint256 amount, uint256 timestamp);
    event YieldAdded(uint256 amount, uint256 timestamp);

    /**
     * @notice Initialize MockAavePool
     * @param _asset Address of the asset token (USDC)
     */
    constructor(address _asset) Ownable(msg.sender) {
        require(_asset != address(0), "Invalid asset address");
        asset = IERC20(_asset);
    }

    /**
     * @notice Supply assets to the pool (simulates Aave supply)
     * @param amount Amount of assets to supply
     * @param onBehalfOf Address to credit the supply to
     */
    function supply(uint256 amount, address onBehalfOf) external {
        require(amount > 0, "Amount must be greater than 0");
        require(onBehalfOf != address(0), "Invalid onBehalfOf address");

        // Transfer assets from caller to pool
        require(asset.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        // Update balances
        userSupplies[onBehalfOf] += amount;
        totalSupply += amount;

        emit Supply(onBehalfOf, amount, block.timestamp);
    }

    /**
     * @notice Withdraw assets from the pool (simulates Aave withdraw)
     * @param amount Amount of assets to withdraw
     * @param to Address to send the assets to
     * @return Amount actually withdrawn
     */
    function withdraw(uint256 amount, address to) external returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(to != address(0), "Invalid to address");
        require(userSupplies[msg.sender] >= amount, "Insufficient balance");

        // Update balances
        userSupplies[msg.sender] -= amount;
        totalSupply -= amount;

        // Transfer assets
        require(asset.transfer(to, amount), "Transfer failed");

        emit Withdraw(msg.sender, amount, block.timestamp);
        return amount;
    }

    /**
     * @notice Get user's supply balance
     * @param user Address to check
     * @return User's supply balance
     */
    function getUserSupply(address user) external view returns (uint256) {
        return userSupplies[user];
    }

    /**
     * @notice Admin function to add yield instantly (for demo purposes)
     * @dev Mints new tokens to simulate yield generation
     * @param amount Amount of yield to add
     */
    function adminAddYield(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply > 0, "No supply to generate yield on");

        // For demo: we'll need the asset to have a mint function
        // This assumes MockUSDC or similar has mint capability
        // In production, this would come from actual Aave yield

        // Try to mint to this contract
        // Note: This requires the asset to have a mint function
        // We'll handle this in the deployment script by granting mint permissions
        (bool success, ) = address(asset).call(abi.encodeWithSignature("mint(address,uint256)", address(this), amount));
        require(success, "Yield mint failed - check asset mint permissions");

        accumulatedYield += amount;

        emit YieldAdded(amount, block.timestamp);
    }

    /**
     * @notice Get available yield (total yield minus principal)
     * @return Available yield amount
     */
    function getAvailableYield() external view returns (uint256) {
        uint256 totalAssets = asset.balanceOf(address(this));
        if (totalAssets <= totalSupply) {
            return 0;
        }
        return totalAssets - totalSupply;
    }

    /**
     * @notice Harvest yield (withdraw only the yield, keep principal)
     * @param to Address to send yield to
     * @return Yield amount harvested
     */
    function harvestYield(address to) external onlyOwner returns (uint256) {
        uint256 availableYield = this.getAvailableYield();
        require(availableYield > 0, "No yield available");
        require(to != address(0), "Invalid to address");

        // Transfer only the yield, keep principal in pool
        require(asset.transfer(to, availableYield), "Yield transfer failed");

        return availableYield;
    }

    /**
     * @notice Get total assets in pool (principal + yield)
     * @return Total assets
     */
    function getTotalAssets() external view returns (uint256) {
        return asset.balanceOf(address(this));
    }
}
