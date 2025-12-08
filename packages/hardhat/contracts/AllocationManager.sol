// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./EndaomentVault.sol";
import "./StudentRegistry.sol";

/**
 * @title AllocationManager
 * @notice Manages epochs, voting, and yield distribution for Endaoment vaults
 * @dev Handles 30-day epochs, vote allocation, and 10/15/75 yield split
 */
contract AllocationManager is Ownable {
    // Epoch structure
    struct Epoch {
        uint256 id;
        uint256 startTime;
        uint256 endTime;
        bool isFinalized;
    }

    // Vote allocation per user per vault per epoch
    mapping(uint256 => mapping(address => mapping(address => mapping(address => uint256)))) public votes;
    // epochId => vault => student => totalVotes

    // Total votes per student per vault per epoch
    mapping(uint256 => mapping(address => mapping(address => uint256))) public studentTotalVotes;
    // epochId => vault => student => votes

    // Total votes cast per vault per epoch
    mapping(uint256 => mapping(address => uint256)) public vaultTotalVotes;

    // Epochs
    Epoch[] public epochs;
    uint256 public currentEpochId;

    // Registered vaults
    mapping(address => bool) public isVaultRegistered;
    address[] public registeredVaults;

    // Student registry
    StudentRegistry public studentRegistry;

    // Constants
    uint256 public constant EPOCH_DURATION = 30 days;
    uint256 public constant WHALE_SHARE_BPS = 1000; // 10%
    uint256 public constant RETAIL_SHARE_BPS = 1500; // 15%
    uint256 public constant STUDENT_SHARE_BPS = 7500; // 75%
    uint256 public constant BPS_DENOMINATOR = 10000;

    // Events
    event EpochCreated(uint256 indexed epochId, uint256 startTime, uint256 endTime);
    event EpochFinalized(uint256 indexed epochId);
    event VotesAllocated(
        uint256 indexed epochId,
        address indexed vault,
        address indexed voter,
        address[] students,
        uint256[] votes
    );
    event YieldDistributed(uint256 indexed epochId, address indexed vault, uint256 totalYield, uint256 studentShare);
    event VaultRegistered(address indexed vault);

    /**
     * @notice Initialize AllocationManager
     * @param _studentRegistry Address of StudentRegistry contract
     */
    constructor(address _studentRegistry) Ownable(msg.sender) {
        require(_studentRegistry != address(0), "Invalid student registry");
        studentRegistry = StudentRegistry(_studentRegistry);

        // Create first epoch
        _createEpoch();
    }

    /**
     * @notice Register a vault for allocation management
     * @param vault Address of EndaomentVault
     */
    function registerVault(address vault) external onlyOwner {
        require(!isVaultRegistered[vault], "Vault already registered");
        require(vault != address(0), "Invalid vault address");

        isVaultRegistered[vault] = true;
        registeredVaults.push(vault);

        emit VaultRegistered(vault);
    }

    /**
     * @notice Allocate votes to students for current epoch
     * @param vault Address of vault
     * @param students Array of student addresses
     * @param voteAmounts Array of vote amounts (must match user's shares)
     */
    function allocateVotes(address vault, address[] calldata students, uint256[] calldata voteAmounts) external {
        require(isVaultRegistered[vault], "Vault not registered");
        require(students.length == voteAmounts.length, "Array length mismatch");
        require(students.length > 0, "Must allocate to at least one student");
        require(!epochs[currentEpochId].isFinalized, "Epoch is finalized");

        EndaomentVault vaultContract = EndaomentVault(vault);
        uint256 userShares = vaultContract.balanceOf(msg.sender);
        require(userShares > 0, "No shares in vault");

        // Calculate total votes being allocated
        uint256 totalVotes = 0;
        for (uint256 i = 0; i < voteAmounts.length; i++) {
            totalVotes += voteAmounts[i];
        }
        require(totalVotes == userShares, "Vote total must equal shares");

        // Clear previous votes for this user/vault/epoch
        _clearUserVotes(currentEpochId, vault, msg.sender);

        // Allocate new votes
        for (uint256 i = 0; i < students.length; i++) {
            require(studentRegistry.isStudentActive(students[i]), "Student not active");
            require(voteAmounts[i] > 0, "Vote amount must be positive");

            votes[currentEpochId][vault][msg.sender][students[i]] = voteAmounts[i];
            studentTotalVotes[currentEpochId][vault][students[i]] += voteAmounts[i];
        }

        vaultTotalVotes[currentEpochId][vault] += userShares;

        emit VotesAllocated(currentEpochId, vault, msg.sender, students, voteAmounts);
    }

    /**
     * @notice Finalize current epoch and create next one
     */
    function finalizeEpoch() external onlyOwner {
        require(!epochs[currentEpochId].isFinalized, "Epoch already finalized");
        require(block.timestamp >= epochs[currentEpochId].endTime, "Epoch not ended");

        epochs[currentEpochId].isFinalized = true;
        emit EpochFinalized(currentEpochId);

        // Create next epoch
        currentEpochId++;
        _createEpoch();
    }

    /**
     * @notice Distribute yield for a vault in a specific epoch
     * @param epochId Epoch to distribute for
     * @param vault Vault to distribute from
     */
    function distributeYield(uint256 epochId, address vault) external onlyOwner {
        require(epochs[epochId].isFinalized, "Epoch not finalized");
        require(isVaultRegistered[vault], "Vault not registered");

        EndaomentVault vaultContract = EndaomentVault(vault);
        uint256 availableYield = vaultContract.getAvailableYield();
        require(availableYield > 0, "No yield available");

        // Calculate shares
        uint256 whaleShare = (availableYield * WHALE_SHARE_BPS) / BPS_DENOMINATOR;
        uint256 retailShare = (availableYield * RETAIL_SHARE_BPS) / BPS_DENOMINATOR;
        uint256 studentShare = (availableYield * STUDENT_SHARE_BPS) / BPS_DENOMINATOR;

        // Claim yield from vault
        vaultContract.claimYield(availableYield);

        // Get USDC
        IERC20 usdc = IERC20(vaultContract.asset());

        // Distribute to whale (vault creator)
        address whale = vaultContract.whale();
        if (whale != address(0) && whaleShare > 0) {
            usdc.transfer(whale, whaleShare);
        }

        // Distribute to retail donors (proportionally by shares)
        if (retailShare > 0) {
            _distributeToRetail(vault, retailShare, vaultContract);
        }

        // Distribute to students based on votes
        if (studentShare > 0) {
            _distributeToStudents(epochId, vault, studentShare);
        }

        emit YieldDistributed(epochId, vault, availableYield, studentShare);
    }

    /**
     * @notice Get current epoch info
     * @return Epoch struct for current epoch
     */
    function getCurrentEpoch() external view returns (Epoch memory) {
        return epochs[currentEpochId];
    }

    /**
     * @notice Get total votes for a student in a vault for an epoch
     * @param epochId Epoch ID
     * @param vault Vault address
     * @param student Student address
     * @return Total votes
     */
    function getStudentVotes(uint256 epochId, address vault, address student) external view returns (uint256) {
        return studentTotalVotes[epochId][vault][student];
    }

    /**
     * @notice Get all registered vaults
     * @return Array of vault addresses
     */
    function getRegisteredVaults() external view returns (address[] memory) {
        return registeredVaults;
    }

    /**
     * @notice Get total number of epochs
     * @return Number of epochs created
     */
    function getEpochCount() external view returns (uint256) {
        return epochs.length;
    }

    /**
     * @notice Create a new epoch
     */
    function _createEpoch() internal {
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + EPOCH_DURATION;

        epochs.push(Epoch({ id: currentEpochId, startTime: startTime, endTime: endTime, isFinalized: false }));

        emit EpochCreated(currentEpochId, startTime, endTime);
    }

    /**
     * @notice Clear user's previous votes for a vault in an epoch
     * @param epochId Epoch ID
     * @param vault Vault address
     * @param user User address
     */
    function _clearUserVotes(uint256 epochId, address vault, address user) internal {
        address[] memory students = studentRegistry.getAllStudents();

        for (uint256 i = 0; i < students.length; i++) {
            uint256 previousVotes = votes[epochId][vault][user][students[i]];
            if (previousVotes > 0) {
                studentTotalVotes[epochId][vault][students[i]] -= previousVotes;
                votes[epochId][vault][user][students[i]] = 0;
            }
        }
    }

    /**
     * @notice Distribute retail share proportionally to donors
     * @param vault Vault address
     * @param retailShare Total amount for retail
     * @param vaultContract Vault contract instance
     */
    function _distributeToRetail(address vault, uint256 retailShare, EndaomentVault vaultContract) internal {
        IERC20 usdc = IERC20(vaultContract.asset());
        address[] memory participants = vaultContract.getParticipants();
        uint256 totalShares = vaultContract.totalSupply();

        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            if (participant == vaultContract.whale()) continue; // Skip whale

            uint256 participantShares = vaultContract.balanceOf(participant);
            if (participantShares > 0) {
                uint256 participantAmount = (retailShare * participantShares) / totalShares;
                if (participantAmount > 0) {
                    usdc.transfer(participant, participantAmount);
                }
            }
        }
    }

    /**
     * @notice Distribute student share based on votes
     * @param epochId Epoch ID
     * @param vault Vault address
     * @param studentShare Total amount for students
     */
    function _distributeToStudents(uint256 epochId, address vault, uint256 studentShare) internal {
        EndaomentVault vaultContract = EndaomentVault(vault);
        IERC20 usdc = IERC20(vaultContract.asset());

        address[] memory students = studentRegistry.getActiveStudents();
        uint256 totalVotes = vaultTotalVotes[epochId][vault];

        if (totalVotes == 0) return; // No votes cast

        for (uint256 i = 0; i < students.length; i++) {
            address student = students[i];
            uint256 studentVotes = studentTotalVotes[epochId][vault][student];

            if (studentVotes > 0) {
                uint256 studentAmount = (studentShare * studentVotes) / totalVotes;
                if (studentAmount > 0) {
                    usdc.transfer(student, studentAmount);
                    studentRegistry.recordFunding(student, studentAmount);
                }
            }
        }
    }
}
