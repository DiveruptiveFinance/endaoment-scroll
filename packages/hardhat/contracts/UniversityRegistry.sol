// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title UniversityRegistry
 * @notice Manages university registrations and wallet addresses
 * @dev Wallets can be locked for MVP to prevent changes
 */
contract UniversityRegistry is Ownable {
    struct University {
        string name;
        address wallet;
        bool isActive;
        bool isLocked; // For MVP: once locked, cannot be changed
        uint256 registeredAt;
    }

    // Mapping: university ID => University struct
    mapping(string => University) public universities;

    // Mapping: wallet address => university ID
    mapping(address => string) public walletToUniversityId;

    // Array of all university IDs
    string[] public universityIds;

    // Events
    event UniversityRegistered(
        string indexed universityId,
        string name,
        address indexed wallet,
        uint256 timestamp
    );

    event UniversityWalletUpdated(
        string indexed universityId,
        address indexed oldWallet,
        address indexed newWallet
    );

    event UniversityLocked(string indexed universityId, address indexed wallet);
    event UniversityActivated(string indexed universityId);
    event UniversityDeactivated(string indexed universityId);

    modifier onlyUnlocked(string memory universityId) {
        require(!universities[universityId].isLocked, "University wallet is locked for MVP");
        _;
    }

    /**
     * @notice Initialize UniversityRegistry
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Register a new university
     * @param universityId Unique identifier (e.g., "unam", "ibero")
     * @param name Full name of the university
     * @param wallet Wallet address to receive yield
     */
    function registerUniversity(
        string memory universityId,
        string memory name,
        address wallet
    ) external onlyOwner {
        require(bytes(universityId).length > 0, "University ID cannot be empty");
        require(bytes(name).length > 0, "University name cannot be empty");
        require(wallet != address(0), "Invalid wallet address");
        require(bytes(universities[universityId].name).length == 0, "University already registered");
        require(bytes(walletToUniversityId[wallet]).length == 0, "Wallet already registered");

        universities[universityId] = University({
            name: name,
            wallet: wallet,
            isActive: true,
            isLocked: false,
            registeredAt: block.timestamp
        });

        walletToUniversityId[wallet] = universityId;
        universityIds.push(universityId);

        emit UniversityRegistered(universityId, name, wallet, block.timestamp);
    }

    /**
     * @notice Update university wallet (only if not locked)
     * @param universityId University identifier
     * @param newWallet New wallet address
     */
    function updateUniversityWallet(
        string memory universityId,
        address newWallet
    ) external onlyOwner onlyUnlocked(universityId) {
        require(bytes(universities[universityId].name).length > 0, "University not found");
        require(newWallet != address(0), "Invalid wallet address");
        require(bytes(walletToUniversityId[newWallet]).length == 0, "Wallet already registered");

        address oldWallet = universities[universityId].wallet;
        delete walletToUniversityId[oldWallet];
        walletToUniversityId[newWallet] = universityId;
        universities[universityId].wallet = newWallet;

        emit UniversityWalletUpdated(universityId, oldWallet, newWallet);
    }

    /**
     * @notice Lock university wallet (for MVP - prevents changes)
     * @param universityId University identifier
     */
    function lockUniversityWallet(string memory universityId) external onlyOwner {
        require(bytes(universities[universityId].name).length > 0, "University not found");
        require(!universities[universityId].isLocked, "University already locked");

        universities[universityId].isLocked = true;

        emit UniversityLocked(universityId, universities[universityId].wallet);
    }

    /**
     * @notice Activate a university
     * @param universityId University identifier
     */
    function activateUniversity(string memory universityId) external onlyOwner {
        require(bytes(universities[universityId].name).length > 0, "University not found");
        require(!universities[universityId].isActive, "University already active");

        universities[universityId].isActive = true;

        emit UniversityActivated(universityId);
    }

    /**
     * @notice Deactivate a university
     * @param universityId University identifier
     */
    function deactivateUniversity(string memory universityId) external onlyOwner {
        require(bytes(universities[universityId].name).length > 0, "University not found");
        require(universities[universityId].isActive, "University already inactive");

        universities[universityId].isActive = false;

        emit UniversityDeactivated(universityId);
    }

    /**
     * @notice Get university by ID
     * @param universityId University identifier
     * @return University struct
     */
    function getUniversity(string memory universityId) external view returns (University memory) {
        require(bytes(universities[universityId].name).length > 0, "University not found");
        return universities[universityId];
    }

    /**
     * @notice Get university ID by wallet address
     * @param wallet Wallet address
     * @return University ID
     */
    function getUniversityIdByWallet(address wallet) external view returns (string memory) {
        require(bytes(walletToUniversityId[wallet]).length > 0, "Wallet not registered");
        return walletToUniversityId[wallet];
    }

    /**
     * @notice Get all university IDs
     * @return Array of university IDs
     */
    function getAllUniversityIds() external view returns (string[] memory) {
        return universityIds;
    }

    /**
     * @notice Get all active university IDs
     * @return Array of active university IDs
     */
    function getActiveUniversityIds() external view returns (string[] memory) {
        uint256 activeCount = 0;

        // Count active universities
        for (uint256 i = 0; i < universityIds.length; i++) {
            if (universities[universityIds[i]].isActive) {
                activeCount++;
            }
        }

        // Build array
        string[] memory activeIds = new string[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < universityIds.length; i++) {
            if (universities[universityIds[i]].isActive) {
                activeIds[currentIndex] = universityIds[i];
                currentIndex++;
            }
        }

        return activeIds;
    }
}

