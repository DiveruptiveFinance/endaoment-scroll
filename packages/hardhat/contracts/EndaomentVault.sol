// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EndaomentVault
 * @notice ERC-4626 tokenized vault with mock yield generation for student funding
 * @dev Generates 5% APY through time-based accrual, distributes to whale/retail/students
 */
contract EndaomentVault is ERC4626, Ownable {
    // Vault metadata
    address public whale; // Vault creator (whale donor)
    string public vaultName;
    uint256 public createdAt;

    // Yield tracking
    uint256 public lastYieldUpdate;
    uint256 public accumulatedYield;
    uint256 public totalYieldClaimed;

    // Participant tracking
    address[] private participants;
    mapping(address => bool) private isParticipant;

    // Constants
    uint256 public constant WHALE_SHARE_BPS = 1000; // 10%
    uint256 public constant RETAIL_SHARE_BPS = 1500; // 15%
    uint256 public constant STUDENT_SHARE_BPS = 7500; // 75%
    uint256 public constant BPS_DENOMINATOR = 10000;

    // Events
    event YieldAccrued(uint256 amount, uint256 timestamp);
    event YieldClaimed(uint256 amount, address indexed claimedBy);
    event ParticipantAdded(address indexed participant);

    /**
     * @notice Initialize EndaomentVault
     * @param asset_ Address of underlying asset (USDC)
     * @param name_ Vault name
     * @param symbol_ Vault share symbol
     * @param whale_ Address of vault creator
     */
    constructor(
        IERC20 asset_,
        string memory name_,
        string memory symbol_,
        address whale_
    ) ERC4626(asset_) ERC20(name_, symbol_) Ownable(msg.sender) {
        require(whale_ != address(0), "Invalid whale address");

        whale = whale_;
        vaultName = name_;
        createdAt = block.timestamp;
        lastYieldUpdate = block.timestamp;
    }

    /**
     * @notice Deposit assets and receive shares
     * @dev Overrides ERC4626 deposit to add participant tracking and yield update
     */
    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        _updateYield();
        _addParticipant(receiver);
        return super.deposit(assets, receiver);
    }

    /**
     * @notice Mint shares for specified assets
     * @dev Overrides ERC4626 mint to add participant tracking and yield update
     */
    function mint(uint256 shares, address receiver) public override returns (uint256) {
        _updateYield();
        _addParticipant(receiver);
        return super.mint(shares, receiver);
    }

    /**
     * @notice Calculate total assets including accrued yield
     * @dev Override ERC4626 to include mock yield generation
     * @return Total assets (principal + accrued yield - claimed yield)
     */
    function totalAssets() public view override returns (uint256) {
        uint256 accruedYield = getAccruedYield();
        uint256 principal = IERC20(asset()).balanceOf(address(this)) + totalYieldClaimed;
        return principal + accruedYield;
    }

    /**
     * @notice Get currently accrued but not yet recorded yield
     * @return Yield accrued since last update
     */
    function getAccruedYield() public view returns (uint256) {
        if (totalSupply() == 0) return 0;

        uint256 timeElapsed = block.timestamp - lastYieldUpdate;
        uint256 principal = totalSupply();

        // 5% APY: (principal * 500 * timeElapsed) / (10000 * 365 days)
        uint256 newYield = (principal * 500 * timeElapsed) / (10000 * 365 days);

        return accumulatedYield + newYield;
    }

    /**
     * @notice Get available yield for distribution
     * @return Available yield (total yield - claimed yield)
     */
    function getAvailableYield() public view returns (uint256) {
        uint256 totalYield = getAccruedYield();
        if (totalYield <= totalYieldClaimed) return 0;
        return totalYield - totalYieldClaimed;
    }

    /**
     * @notice Manually update yield calculation
     * @dev Public function to trigger yield accrual without state changes
     */
    function updateYield() external {
        _updateYield();
    }

    /**
     * @notice Simulate yield generation by minting USDC for demo purposes
     * @param months Number of months of yield to generate (1-12)
     * @dev Mints real USDC tokens based on 5% APY calculation
     */
    function simulateYield(uint256 months) external onlyOwner {
        require(months > 0 && months <= 12, "Months must be between 1 and 12");
        require(totalSupply() > 0, "No deposits yet");

        // Calculate yield: 5% APY for X months
        // Formula: (principal * 5% * months) / 12
        uint256 principal = totalSupply();
        uint256 yieldAmount = (principal * 500 * months) / 12000; // 500 bps / 10000, then / 12 months

        // Mint USDC directly to vault through MockUSDC
        // Note: MockUSDC must have granted this vault minting permission
        IERC20(asset()).approve(address(this), yieldAmount);

        // Cast to interface that has mint function
        (bool success,) = asset().call(
            abi.encodeWithSignature("mint(address,uint256)", address(this), yieldAmount)
        );
        require(success, "Mint failed - vault not authorized");

        // Update yield tracking
        _updateYield();
        accumulatedYield += yieldAmount;

        emit YieldAccrued(yieldAmount, block.timestamp);
    }

    /**
     * @notice Claim yield for distribution (only owner/AllocationManager)
     * @param amount Amount of yield to claim
     */
    function claimYield(uint256 amount) external onlyOwner {
        _updateYield();

        uint256 available = getAvailableYield();
        require(amount <= available, "Insufficient yield available");

        totalYieldClaimed += amount;

        // Transfer USDC to owner (AllocationManager will distribute)
        IERC20(asset()).transfer(owner(), amount);

        emit YieldClaimed(amount, msg.sender);
    }

    /**
     * @notice Get total number of participants
     * @return Number of unique depositors
     */
    function getParticipantCount() external view returns (uint256) {
        return participants.length;
    }

    /**
     * @notice Get all participant addresses
     * @return Array of participant addresses
     */
    function getParticipants() external view returns (address[] memory) {
        return participants;
    }

    /**
     * @notice Check if address is a participant
     * @param account Address to check
     * @return Boolean indicating if address has deposited
     */
    function isParticipantAddress(address account) external view returns (bool) {
        return isParticipant[account];
    }

    /**
     * @notice Update yield accrual
     * @dev Internal function called before state-changing operations
     */
    function _updateYield() internal {
        if (totalSupply() == 0) {
            lastYieldUpdate = block.timestamp;
            return;
        }

        uint256 timeElapsed = block.timestamp - lastYieldUpdate;
        if (timeElapsed == 0) return;

        uint256 principal = totalSupply();

        // Calculate new yield: 5% APY
        uint256 newYield = (principal * 500 * timeElapsed) / (10000 * 365 days);

        accumulatedYield += newYield;
        lastYieldUpdate = block.timestamp;

        if (newYield > 0) {
            emit YieldAccrued(newYield, block.timestamp);
        }
    }

    /**
     * @notice Add participant to tracking list
     * @param participant Address to add
     */
    function _addParticipant(address participant) internal {
        if (!isParticipant[participant] && participant != address(0)) {
            participants.push(participant);
            isParticipant[participant] = true;
            emit ParticipantAdded(participant);
        }
    }

    /**
     * @notice Get vault statistics
     * @return totalDeposits Total principal deposited
     * @return yieldGenerated Total yield generated
     * @return yieldDistributed Total yield distributed
     * @return participantCount Number of depositors
     */
    function getVaultStats()
        external
        view
        returns (uint256 totalDeposits, uint256 yieldGenerated, uint256 yieldDistributed, uint256 participantCount)
    {
        totalDeposits = totalSupply();
        yieldGenerated = getAccruedYield();
        yieldDistributed = totalYieldClaimed;
        participantCount = participants.length;
    }
}
