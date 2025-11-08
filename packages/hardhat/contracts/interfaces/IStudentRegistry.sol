// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IStudentRegistry
 * @notice Interface for the StudentRegistry contract
 */
interface IStudentRegistry {
    /**
     * @notice Student profile struct
     * @param wallet Student's wallet address
     * @param name Student's full name
     * @param university University or institution name
     * @param researchArea Field of research
     * @param isActive Whether student is actively accepting funding
     * @param totalReceived Total USDC received across all distributions
     * @param addedAt Timestamp when student was added
     */
    struct Student {
        address wallet;
        string name;
        string university;
        string researchArea;
        bool isActive;
        uint256 totalReceived;
        uint256 addedAt;
    }

    // Events
    event StudentAdded(address indexed studentAddress, string name, string university);
    event StudentDeactivated(address indexed studentAddress);
    event StudentReactivated(address indexed studentAddress);
    event FundingRecorded(address indexed studentAddress, uint256 amount);

    // Functions
    function addStudent(
        address studentAddress,
        string calldata name,
        string calldata university,
        string calldata researchArea
    ) external;

    function getStudent(address studentAddress) external view returns (Student memory);

    function getAllStudents() external view returns (address[] memory);

    function getActiveStudents() external view returns (address[] memory);

    function deactivateStudent(address studentAddress) external;

    function reactivateStudent(address studentAddress) external;

    function recordFunding(address studentAddress, uint256 amount) external;

    function isStudentActive(address studentAddress) external view returns (bool);
}
