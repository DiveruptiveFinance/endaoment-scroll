// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IStudentRegistry.sol";

/**
 * @title StudentRegistry
 * @notice Manages verified student profiles for the Endaoment platform
 * @dev Only owner (admin) can add/deactivate students, AllocationManager records funding
 */
contract StudentRegistry is IStudentRegistry, Ownable {
    // Student data mapping
    mapping(address => Student) private students;

    // Array of all student addresses for enumeration
    address[] private studentAddresses;

    // Mapping to check if address is registered
    mapping(address => bool) private isRegistered;

    // AllocationManager address (can record funding)
    address public allocationManager;

    // StudentSBT contract address (for auto-minting)
    address public studentSBT;

    /**
     * @notice Initialize StudentRegistry
     */
    constructor() Ownable(msg.sender) {}

    /**
     * @notice Set the AllocationManager contract address
     * @param _allocationManager Address of AllocationManager contract
     */
    function setAllocationManager(address _allocationManager) external onlyOwner {
        require(_allocationManager != address(0), "Invalid allocation manager address");
        allocationManager = _allocationManager;
    }

    /**
     * @notice Set the StudentSBT contract address
     * @param _studentSBT Address of StudentSBT contract
     */
    function setStudentSBT(address _studentSBT) external onlyOwner {
        require(_studentSBT != address(0), "Invalid StudentSBT address");
        studentSBT = _studentSBT;
    }

    /**
     * @notice Add a new student to the registry
     * @param studentAddress Student's wallet address
     * @param name Student's full name
     * @param university University or institution
     * @param researchArea Field of research
     */
    function addStudent(
        address studentAddress,
        string calldata name,
        string calldata university,
        string calldata researchArea
    ) external onlyOwner {
        require(studentAddress != address(0), "Invalid student address");
        require(!isRegistered[studentAddress], "Student already registered");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(university).length > 0, "University cannot be empty");
        require(bytes(researchArea).length > 0, "Research area cannot be empty");

        students[studentAddress] = Student({
            wallet: studentAddress,
            name: name,
            university: university,
            researchArea: researchArea,
            isActive: true,
            totalReceived: 0,
            addedAt: block.timestamp
        });

        studentAddresses.push(studentAddress);
        isRegistered[studentAddress] = true;

        emit StudentAdded(studentAddress, name, university);
    }

    /**
     * @notice Get student profile by address
     * @param studentAddress Student's wallet address
     * @return Student struct with all profile data
     */
    function getStudent(address studentAddress) external view returns (Student memory) {
        require(isRegistered[studentAddress], "Student not found");
        return students[studentAddress];
    }

    /**
     * @notice Get all registered student addresses
     * @return Array of all student addresses
     */
    function getAllStudents() external view returns (address[] memory) {
        return studentAddresses;
    }

    /**
     * @notice Get all active student addresses
     * @return Array of active student addresses
     */
    function getActiveStudents() external view returns (address[] memory) {
        uint256 activeCount = 0;

        // Count active students
        for (uint256 i = 0; i < studentAddresses.length; i++) {
            if (students[studentAddresses[i]].isActive) {
                activeCount++;
            }
        }

        // Build array of active students
        address[] memory activeStudents = new address[](activeCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < studentAddresses.length; i++) {
            if (students[studentAddresses[i]].isActive) {
                activeStudents[currentIndex] = studentAddresses[i];
                currentIndex++;
            }
        }

        return activeStudents;
    }

    /**
     * @notice Deactivate a student (stop accepting funding)
     * @param studentAddress Student's wallet address
     */
    function deactivateStudent(address studentAddress) external onlyOwner {
        require(isRegistered[studentAddress], "Student not found");
        require(students[studentAddress].isActive, "Student already inactive");

        students[studentAddress].isActive = false;

        emit StudentDeactivated(studentAddress);
    }

    /**
     * @notice Reactivate a deactivated student
     * @param studentAddress Student's wallet address
     */
    function reactivateStudent(address studentAddress) external onlyOwner {
        require(isRegistered[studentAddress], "Student not found");
        require(!students[studentAddress].isActive, "Student already active");

        students[studentAddress].isActive = true;

        emit StudentReactivated(studentAddress);
    }

    /**
     * @notice Record funding received by a student
     * @dev Can only be called by AllocationManager during distribution
     * @param studentAddress Student's wallet address
     * @param amount Amount of USDC received
     */
    function recordFunding(address studentAddress, uint256 amount) external {
        require(msg.sender == allocationManager, "Only AllocationManager can record funding");
        require(isRegistered[studentAddress], "Student not found");

        students[studentAddress].totalReceived += amount;

        emit FundingRecorded(studentAddress, amount);
    }

    /**
     * @notice Check if a student is active
     * @param studentAddress Student's wallet address
     * @return Boolean indicating if student is active
     */
    function isStudentActive(address studentAddress) external view returns (bool) {
        if (!isRegistered[studentAddress]) {
            return false;
        }
        return students[studentAddress].isActive;
    }

    /**
     * @notice Get total number of registered students
     * @return Number of students
     */
    function getStudentCount() external view returns (uint256) {
        return studentAddresses.length;
    }

    /**
     * @notice Public function for students to register themselves
     * @param name Student's full name
     * @param university University or institution
     * @param researchArea Field of research (can be faculty/career)
     * @param studentId Student ID or enrollment number
     * @param academicAchievements Number of academic achievements (0-10)
     * @param sportsAchievements Number of sports achievements (0-10)
     * @param studentAchievements Number of student achievements (0-10)
     */
    function registerStudent(
        string calldata name,
        string calldata university,
        string calldata researchArea,
        string calldata studentId,
        uint256 academicAchievements,
        uint256 sportsAchievements,
        uint256 studentAchievements
    ) external {
        address studentAddress = msg.sender;
        require(!isRegistered[studentAddress], "Student already registered");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(university).length > 0, "University cannot be empty");
        require(bytes(researchArea).length > 0, "Research area cannot be empty");
        require(bytes(studentId).length > 0, "Student ID cannot be empty");
        require(academicAchievements <= 10, "Academic achievements max 10");
        require(sportsAchievements <= 10, "Sports achievements max 10");
        require(studentAchievements <= 10, "Student achievements max 10");

        students[studentAddress] = Student({
            wallet: studentAddress,
            name: name,
            university: university,
            researchArea: researchArea,
            isActive: true,
            totalReceived: 0,
            addedAt: block.timestamp
        });

        studentAddresses.push(studentAddress);
        isRegistered[studentAddress] = true;

        emit StudentAdded(studentAddress, name, university);

        // Auto-mint StudentSBT if contract is set
        if (studentSBT != address(0)) {
            // Call StudentSBT.mint() - this will revert if student already has SBT
            (bool success, ) = studentSBT.call(
                abi.encodeWithSignature("mint(address)", studentAddress)
            );
            // Don't revert if mint fails - student is still registered
            if (!success) {
                // Log but continue
            }
        }
    }
}
