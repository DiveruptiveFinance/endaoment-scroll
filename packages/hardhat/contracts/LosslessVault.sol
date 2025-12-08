// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MockAavePool.sol";
import "./YieldSplitter.sol";

/**
 * @title LosslessVault
 * @notice ERC-4626 vault that generates yield via MockAavePool - donors keep principal, donate 100% yield
 * @dev Deposits go to MockAavePool, yield is harvested and sent to YieldSplitter
 */
contract LosslessVault is ERC4626, Ownable {
    // MockAavePool for yield generation
    MockAavePool public immutable aavePool;

    // YieldSplitter for yield distribution
    YieldSplitter public immutable yieldSplitter;

    // Events
    event YieldHarvested(uint256 amount, address indexed to);
    event PrincipalDepositedToPool(uint256 amount);
    event PrincipalWithdrawnFromPool(uint256 amount);

    /**
     * @notice Initialize LosslessVault
     * @param asset_ Address of underlying asset (USDC)
     * @param name_ Vault name
     * @param symbol_ Vault share symbol
     * @param _aavePool Address of MockAavePool
     * @param _yieldSplitter Address of YieldSplitter
     */
    constructor(
        IERC20 asset_,
        string memory name_,
        string memory symbol_,
        address _aavePool,
        address _yieldSplitter
    ) ERC4626(asset_) ERC20(name_, symbol_) Ownable(msg.sender) {
        require(_aavePool != address(0), "Invalid aave pool address");
        require(_yieldSplitter != address(0), "Invalid yield splitter address");

        aavePool = MockAavePool(_aavePool);
        yieldSplitter = YieldSplitter(_yieldSplitter);
    }

    /**
     * @notice Deposit assets and receive shares
     * @dev Overrides ERC4626 to deposit principal to MockAavePool
     */
    function deposit(uint256 assets, address receiver) public override returns (uint256) {
        uint256 shares = super.deposit(assets, receiver);

        // Deposit principal to MockAavePool
        IERC20(asset()).approve(address(aavePool), assets);
        aavePool.supply(assets, address(this));

        emit PrincipalDepositedToPool(assets);

        return shares;
    }

    /**
     * @notice Mint shares for specified assets
     * @dev Overrides ERC4626 to deposit principal to MockAavePool
     */
    function mint(uint256 shares, address receiver) public override returns (uint256) {
        uint256 assets = super.mint(shares, receiver);

        // Deposit principal to MockAavePool
        IERC20(asset()).approve(address(aavePool), assets);
        aavePool.supply(assets, address(this));

        emit PrincipalDepositedToPool(assets);

        return assets;
    }

    /**
     * @notice Withdraw assets and burn shares
     * @dev Overrides ERC4626 to withdraw principal from MockAavePool
     */
    function withdraw(uint256 assets, address receiver, address owner) public override returns (uint256) {
        uint256 shares = super.withdraw(assets, receiver, owner);

        // Withdraw principal from MockAavePool
        aavePool.withdraw(assets, address(this));

        emit PrincipalWithdrawnFromPool(assets);

        return shares;
    }

    /**
     * @notice Redeem shares for assets
     * @dev Overrides ERC4626 to withdraw principal from MockAavePool
     */
    function redeem(uint256 shares, address receiver, address owner) public override returns (uint256) {
        uint256 assets = super.redeem(shares, receiver, owner);

        // Withdraw principal from MockAavePool
        aavePool.withdraw(assets, address(this));

        emit PrincipalWithdrawnFromPool(assets);

        return assets;
    }

    /**
     * @notice Calculate total assets (principal in pool + any yield)
     * @dev Returns the balance in MockAavePool
     */
    function totalAssets() public view override returns (uint256) {
        return aavePool.getUserSupply(address(this));
    }

    /**
     * @notice Harvest yield from MockAavePool and send to YieldSplitter
     * @dev Only owner can call this (typically called by admin or keeper)
     */
    function harvestYield() external onlyOwner {
        // Harvest yield from MockAavePool
        uint256 yieldAmount = aavePool.harvestYield(address(yieldSplitter));

        require(yieldAmount > 0, "No yield to harvest");

        // Split yield 50/50 via YieldSplitter
        yieldSplitter.splitYield();

        emit YieldHarvested(yieldAmount, address(yieldSplitter));
    }

    /**
     * @notice Get available yield in MockAavePool
     * @return Available yield amount
     */
    function getAvailableYield() external view returns (uint256) {
        return aavePool.getAvailableYield();
    }

    /**
     * @notice Get total assets in MockAavePool (principal + yield)
     * @return Total assets
     */
    function getTotalPoolAssets() external view returns (uint256) {
        return aavePool.getTotalAssets();
    }
}
