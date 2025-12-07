// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title YieldSplitter
 * @notice Splits yield 50/50 between University Wallet and TimelockController (DAO Treasury)
 * @dev Simple contract that receives USDC yield and splits it immediately
 */
contract YieldSplitter is Ownable, ReentrancyGuard {
    // Asset token (USDC)
    IERC20 public immutable asset;

    // University wallet (multisig for operational expenses)
    address public universityWallet;

    // TimelockController address (DAO treasury)
    address public timelockController;

    // Split ratio (50% = 5000 bps)
    uint256 public constant SPLIT_BPS = 5000; // 50%
    uint256 public constant BPS_DENOMINATOR = 10000;

    // Events
    event YieldSplit(
        uint256 totalAmount,
        uint256 universityAmount,
        uint256 daoAmount,
        address indexed universityWallet,
        address indexed timelockController
    );
    event UniversityWalletUpdated(address indexed oldWallet, address indexed newWallet);
    event TimelockControllerUpdated(address indexed oldTimelock, address indexed newTimelock);

    /**
     * @notice Initialize YieldSplitter
     * @param _asset Address of the asset token (USDC)
     * @param _universityWallet Address of university multisig wallet
     * @param _timelockController Address of TimelockController (DAO treasury)
     */
    constructor(
        address _asset,
        address _universityWallet,
        address _timelockController
    ) Ownable(msg.sender) {
        require(_asset != address(0), "Invalid asset address");
        require(_universityWallet != address(0), "Invalid university wallet");
        require(_timelockController != address(0), "Invalid timelock controller");

        asset = IERC20(_asset);
        universityWallet = _universityWallet;
        timelockController = _timelockController;
    }

    /**
     * @notice Split received yield 50/50 between University and DAO
     * @dev Can be called by anyone, but typically called by Vault after harvesting yield
     */
    function splitYield() external nonReentrant {
        uint256 balance = asset.balanceOf(address(this));
        require(balance > 0, "No yield to split");

        // Calculate 50/50 split
        uint256 universityAmount = (balance * SPLIT_BPS) / BPS_DENOMINATOR;
        uint256 daoAmount = balance - universityAmount; // Handle rounding

        // Transfer to University Wallet
        require(asset.transfer(universityWallet, universityAmount), "University transfer failed");

        // Transfer to TimelockController (DAO Treasury)
        require(asset.transfer(timelockController, daoAmount), "DAO transfer failed");

        emit YieldSplit(
            balance,
            universityAmount,
            daoAmount,
            universityWallet,
            timelockController
        );
    }

    /**
     * @notice Update university wallet address
     * @param _universityWallet New university wallet address
     */
    function setUniversityWallet(address _universityWallet) external onlyOwner {
        require(_universityWallet != address(0), "Invalid university wallet");
        address oldWallet = universityWallet;
        universityWallet = _universityWallet;
        emit UniversityWalletUpdated(oldWallet, _universityWallet);
    }

    /**
     * @notice Update TimelockController address
     * @param _timelockController New TimelockController address
     */
    function setTimelockController(address _timelockController) external onlyOwner {
        require(_timelockController != address(0), "Invalid timelock controller");
        address oldTimelock = timelockController;
        timelockController = _timelockController;
        emit TimelockControllerUpdated(oldTimelock, _timelockController);
    }

    /**
     * @notice Get current yield balance in splitter
     * @return Current balance
     */
    function getYieldBalance() external view returns (uint256) {
        return asset.balanceOf(address(this));
    }
}

