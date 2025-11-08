// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @notice Test USDC token for Endaoment platform testing
 * @dev Mimics USDC with 6 decimals and allows free minting for testing
 */
contract MockUSDC is ERC20, Ownable {
    /**
     * @notice Initialize MockUSDC with 1M initial supply
     * @dev Mints 1,000,000 USDC (with 6 decimals) to deployer
     */
    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {
        // Mint 1M USDC to deployer (1_000_000 * 10^6)
        _mint(msg.sender, 1_000_000 * 10**6);
    }

    /**
     * @notice Returns 6 decimals to match real USDC
     * @return Number of decimals (6)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Mint new tokens to any address for testing
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint (in 6 decimal format)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice Faucet function for testing - mint 1000 USDC to caller
     * @dev Anyone can call this for testing purposes
     */
    function faucet() external {
        _mint(msg.sender, 1000 * 10**6); // 1000 USDC
    }
}
