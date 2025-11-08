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
    // Authorized minters (for yield simulation)
    mapping(address => bool) public minters;

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    modifier onlyMinter() {
        require(msg.sender == owner() || minters[msg.sender], "Not authorized to mint");
        _;
    }

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
     * @notice Add an address as authorized minter
     * @param minter Address to grant minting permission
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @notice Remove minting permission from an address
     * @param minter Address to revoke minting permission
     */
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @notice Mint new tokens to any address for testing
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint (in 6 decimal format)
     */
    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }

    /**
     * @notice Faucet function for testing - mint 10000 USDC to caller
     * @dev Anyone can call this for testing purposes
     */
    function faucet() external {
        _mint(msg.sender, 10_000 * 10**6); // 10000 USDC
    }
}
