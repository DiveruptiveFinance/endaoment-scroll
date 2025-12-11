// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DonationTracker
 * @notice Tracks donations and yield distribution with structured events
 * @dev Emits events that frontend can easily read and display
 */
contract DonationTracker is Ownable {
    // Events for structured data
    event DonationMade(
        address indexed donor,
        address indexed university,
        uint256 amount,
        uint256 timestamp,
        string universityName
    );

    event YieldDistributed(
        address indexed university,
        uint256 operationalAmount, // 50% to university wallet
        uint256 daoAmount, // 50% to TimelockController
        uint256 timestamp,
        string universityName
    );

    event UniversityRegistered(address indexed universityWallet, string universityName, uint256 timestamp);

    // Mapping: university wallet => university name
    mapping(address => string) public universityNames;

    // Mapping: university wallet => total donations received
    mapping(address => uint256) public totalDonations;

    // Mapping: university wallet => total yield distributed
    mapping(address => uint256) public totalYieldDistributed;

    // Total donations across all universities
    uint256 public totalDonationsAll;

    // Total yield distributed across all universities
    uint256 public totalYieldDistributedAll;

    /**
     * @notice Initialize DonationTracker
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Register a university
     * @param universityWallet Wallet address of the university
     * @param universityName Name of the university
     */
    function registerUniversity(address universityWallet, string calldata universityName) external onlyOwner {
        require(universityWallet != address(0), "Invalid university wallet");
        require(bytes(universityName).length > 0, "University name cannot be empty");
        require(bytes(universityNames[universityWallet]).length == 0, "University already registered");

        universityNames[universityWallet] = universityName;

        emit UniversityRegistered(universityWallet, universityName, block.timestamp);
    }

    /**
     * @notice Track a donation (called by LosslessVault or other contracts)
     * @param donor Address of the donor
     * @param university Wallet address of the university
     * @param amount Amount donated
     */
    function trackDonation(address donor, address university, uint256 amount) external onlyOwner {
        require(donor != address(0), "Invalid donor address");
        require(university != address(0), "Invalid university address");
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(universityNames[university]).length > 0, "University not registered");

        totalDonations[university] += amount;
        totalDonationsAll += amount;

        emit DonationMade(donor, university, amount, block.timestamp, universityNames[university]);
    }

    /**
     * @notice Track yield distribution (called by YieldSplitter)
     * @param university Wallet address of the university
     * @param operationalAmount Amount sent to university wallet (50%)
     * @param daoAmount Amount sent to TimelockController (50%)
     */
    function trackYieldDistribution(
        address university,
        uint256 operationalAmount,
        uint256 daoAmount
    ) external onlyOwner {
        require(university != address(0), "Invalid university address");
        require(bytes(universityNames[university]).length > 0, "University not registered");
        require(operationalAmount > 0 || daoAmount > 0, "Amounts must be greater than 0");

        totalYieldDistributed[university] += (operationalAmount + daoAmount);
        totalYieldDistributedAll += (operationalAmount + daoAmount);

        emit YieldDistributed(university, operationalAmount, daoAmount, block.timestamp, universityNames[university]);
    }

    /**
     * @notice Get university name by wallet address
     * @param universityWallet Wallet address of the university
     * @return University name
     */
    function getUniversityName(address universityWallet) external view returns (string memory) {
        return universityNames[universityWallet];
    }

    /**
     * @notice Get total donations for a university
     * @param university Wallet address of the university
     * @return Total donations
     */
    function getTotalDonations(address university) external view returns (uint256) {
        return totalDonations[university];
    }

    /**
     * @notice Get total yield distributed for a university
     * @param university Wallet address of the university
     * @return Total yield distributed
     */
    function getTotalYieldDistributed(address university) external view returns (uint256) {
        return totalYieldDistributed[university];
    }
}


