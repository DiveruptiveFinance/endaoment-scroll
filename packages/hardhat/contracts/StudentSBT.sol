// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/governance/utils/IVotes.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

/**
 * @title StudentSBT
 * @notice Soulbound Token (SBT) for student governance participation
 * @dev Non-transferable ERC721 - students use this to vote in the DAO
 * @dev Implements IVotes for OpenZeppelin Governor compatibility
 */
contract StudentSBT is ERC721, Ownable, ReentrancyGuard, IVotes {
    // Checkpoint struct for voting power tracking
    struct Checkpoint {
        uint32 fromBlock;
        uint224 votes;
    }

    // Token counter
    uint256 private _tokenIdCounter;

    // Registry of authorized minters (only admin can mint)
    mapping(address => bool) public authorizedMinters;

    // Mapping: student address => tokenId
    mapping(address => uint256) public studentToTokenId;

    // Mapping: tokenId => student address
    mapping(uint256 => address) public tokenIdToStudent;

    // IVotes: Checkpoints for voting power (1 token = 1 vote)
    mapping(address => Checkpoint[]) private _checkpoints;
    Checkpoint[] private _totalSupplyCheckpoints;

    // Events
    event AuthorizedMinterAdded(address indexed minter);
    event AuthorizedMinterRemoved(address indexed minter);
    event StudentRegistered(address indexed student, uint256 indexed tokenId);

    modifier onlyAuthorizedMinter() {
        require(
            authorizedMinters[msg.sender] || msg.sender == owner(),
            "Not authorized to mint"
        );
        _;
    }

    /**
     * @notice Initialize StudentSBT
     * @param name Token name
     * @param symbol Token symbol
     */
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start from token ID 1
    }

    /**
     * @notice Add an authorized minter (e.g., StudentRegistry)
     * @param minter Address to grant minting permission
     */
    function addAuthorizedMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        authorizedMinters[minter] = true;
        emit AuthorizedMinterAdded(minter);
    }

    /**
     * @notice Remove minting permission
     * @param minter Address to revoke minting permission
     */
    function removeAuthorizedMinter(address minter) external onlyOwner {
        authorizedMinters[minter] = false;
        emit AuthorizedMinterRemoved(minter);
    }

    /**
     * @notice Mint SBT to a student (only authorized minters)
     * @param student Address of the student
     * @return tokenId The minted token ID
     */
    function mint(address student) external onlyAuthorizedMinter nonReentrant returns (uint256) {
        require(student != address(0), "Invalid student address");
        require(studentToTokenId[student] == 0, "Student already has SBT");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(student, tokenId);

        studentToTokenId[student] = tokenId;
        tokenIdToStudent[tokenId] = student;

        // Update voting power checkpoint (1 SBT = 1 vote)
        _writeCheckpoint(_checkpoints[student], _add, 1);
        _writeCheckpoint(_totalSupplyCheckpoints, _add, 1);

        emit StudentRegistered(student, tokenId);

        return tokenId;
    }

    /**
     * @notice Get token ID for a student address
     * @param student Student address
     * @return tokenId The student's token ID (0 if not minted)
     */
    function getTokenId(address student) external view returns (uint256) {
        return studentToTokenId[student];
    }

    /**
     * @notice Check if an address has an SBT
     * @param student Address to check
     * @return True if student has an SBT
     */
    function hasSBT(address student) external view returns (bool) {
        return studentToTokenId[student] != 0 && _ownerOf(studentToTokenId[student]) == student;
    }

    /**
     * @notice Get total number of minted SBTs
     * @return Total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    /**
     * @notice Override transfer functions to make token Soulbound (non-transferable)
     * @dev All transfer functions revert to enforce Soulbound nature
     */
    function transferFrom(address, address, uint256) public pure override {
        revert("SBT: Token is non-transferable");
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert("SBT: Token is non-transferable");
    }

    function approve(address, uint256) public pure override {
        revert("SBT: Token is non-transferable");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("SBT: Token is non-transferable");
    }

    function getApproved(uint256) public pure override returns (address) {
        return address(0);
    }

    function isApprovedForAll(address, address) public pure override returns (bool) {
        return false;
    }

    // ============ IVotes Implementation ============

    /**
     * @notice Get voting power for an account at current block
     * @param account Account to check
     * @return Voting power (1 if has SBT, 0 otherwise)
     */
    function getVotes(address account) public view override returns (uint256) {
        return (studentToTokenId[account] != 0 && _ownerOf(studentToTokenId[account]) == account) ? 1 : 0;
    }

    /**
     * @notice Get voting power for an account at a specific block
     * @param account Account to check
     * @param blockNumber Block number to check
     * @return Voting power
     */
    function getPastVotes(address account, uint256 blockNumber) public view override returns (uint256) {
        require(blockNumber < block.number, "SBT: block not yet mined");
        return _checkpointsLookup(_checkpoints[account], blockNumber);
    }

    /**
     * @notice Get total voting power at current block
     * @return Total voting power
     */
    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    /**
     * @notice Get total voting power at a specific block
     * @param blockNumber Block number to check
     * @return Total voting power
     */
    function getPastTotalSupply(uint256 blockNumber) public view override returns (uint256) {
        require(blockNumber < block.number, "SBT: block not yet mined");
        return _checkpointsLookup(_totalSupplyCheckpoints, blockNumber);
    }

    /**
     * @notice Delegate voting power (not used for SBT, but required by IVotes)
     */
    function delegates(address) public pure override returns (address) {
        return address(0); // SBT doesn't support delegation
    }

    /**
     * @notice Delegate votes (not used for SBT)
     */
    function delegate(address) public pure override {
        revert("SBT: Delegation not supported");
    }

    /**
     * @notice Delegate votes by signature (not used for SBT)
     */
    function delegateBySig(address, uint256, uint256, uint8, bytes32, bytes32) public pure override {
        revert("SBT: Delegation not supported");
    }

    // ============ Internal Checkpoint Functions ============

    function _writeCheckpoint(
        Checkpoint[] storage ckpts,
        function(uint256, uint256) view returns (uint256) op,
        uint256 delta
    ) private returns (uint256 oldWeight, uint256 newWeight) {
        uint256 pos = ckpts.length;
        oldWeight = pos == 0 ? 0 : ckpts[pos - 1].votes;
        newWeight = op(oldWeight, delta);

        if (pos > 0 && ckpts[pos - 1].fromBlock == block.number) {
            ckpts[pos - 1].votes = SafeCast.toUint224(newWeight);
        } else {
            ckpts.push(Checkpoint({fromBlock: SafeCast.toUint32(block.number), votes: SafeCast.toUint224(newWeight)}));
        }
    }

    function _add(uint256 a, uint256 b) private pure returns (uint256) {
        return a + b;
    }

    function _subtract(uint256 a, uint256 b) private pure returns (uint256) {
        return a - b;
    }

    function _checkpointsLookup(Checkpoint[] storage ckpts, uint256 blockNumber) private view returns (uint256) {
        // We run a binary search to look for the earliest checkpoint taken after `blockNumber`.
        //
        // During the loop, the index of the wanted checkpoint remains in the range [low-1, high).
        // With each iteration, either `low` or `high` is moved towards the middle of the range to maintain the invariant.
        // - If the middle checkpoint is after `blockNumber`, we look in [low, mid)
        // - If the middle checkpoint is before or equal to `blockNumber`, we look in [mid+1, high)
        // Once we reach a single value (when low == high), we've found the right checkpoint at the index high-1, if not
        // out of bounds.
        uint256 high = ckpts.length;
        uint256 low = 0;
        while (low < high) {
            uint256 mid = Math.average(low, high);
            if (ckpts[mid].fromBlock > blockNumber) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }

        return high == 0 ? 0 : ckpts[high - 1].votes;
    }
}

