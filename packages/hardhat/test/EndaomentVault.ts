import { expect } from "chai";
import { ethers } from "hardhat";
import { EndaomentVault, MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("EndaomentVault", function () {
  let vault: EndaomentVault;
  let usdc: MockUSDC;
  let owner: SignerWithAddress;
  let whale: SignerWithAddress;
  let retail1: SignerWithAddress;
  let retail2: SignerWithAddress;

  const INITIAL_DEPOSIT = ethers.parseUnits("10000", 6); // 10,000 USDC
  const RETAIL_DEPOSIT = ethers.parseUnits("100", 6); // 100 USDC

  beforeEach(async function () {
    [owner, whale, retail1, retail2] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDCFactory.deploy();
    await usdc.waitForDeployment();

    // Deploy EndaomentVault
    const VaultFactory = await ethers.getContractFactory("EndaomentVault");
    vault = await VaultFactory.deploy(await usdc.getAddress(), "Education Vault", "edVAULT", whale.address);
    await vault.waitForDeployment();

    // Give USDC to participants
    await usdc.mint(whale.address, INITIAL_DEPOSIT);
    await usdc.mint(retail1.address, RETAIL_DEPOSIT);
    await usdc.mint(retail2.address, RETAIL_DEPOSIT);
  });

  describe("Deployment", function () {
    it("Should set correct vault metadata", async function () {
      expect(await vault.vaultName()).to.equal("Education Vault");
      expect(await vault.whale()).to.equal(whale.address);
      expect(await vault.owner()).to.equal(owner.address);
    });

    it("Should set correct ERC20 details", async function () {
      expect(await vault.name()).to.equal("Education Vault");
      expect(await vault.symbol()).to.equal("edVAULT");
    });

    it("Should initialize with zero assets and shares", async function () {
      expect(await vault.totalAssets()).to.equal(0);
      expect(await vault.totalSupply()).to.equal(0);
    });

    it("Should set correct underlying asset", async function () {
      expect(await vault.asset()).to.equal(await usdc.getAddress());
    });
  });

  describe("Deposits", function () {
    it("Should allow whale to deposit", async function () {
      await usdc.connect(whale).approve(await vault.getAddress(), INITIAL_DEPOSIT);
      await vault.connect(whale).deposit(INITIAL_DEPOSIT, whale.address);

      expect(await vault.balanceOf(whale.address)).to.equal(INITIAL_DEPOSIT);
      expect(await vault.totalSupply()).to.equal(INITIAL_DEPOSIT);
    });

    it("Should allow retail to deposit", async function () {
      await usdc.connect(retail1).approve(await vault.getAddress(), RETAIL_DEPOSIT);
      await vault.connect(retail1).deposit(RETAIL_DEPOSIT, retail1.address);

      expect(await vault.balanceOf(retail1.address)).to.equal(RETAIL_DEPOSIT);
    });

    it("Should track participants", async function () {
      await usdc.connect(whale).approve(await vault.getAddress(), INITIAL_DEPOSIT);
      await vault.connect(whale).deposit(INITIAL_DEPOSIT, whale.address);

      expect(await vault.getParticipantCount()).to.equal(1);
      expect(await vault.isParticipantAddress(whale.address)).to.equal(true);
    });

    it("Should not duplicate participants", async function () {
      await usdc.connect(whale).approve(await vault.getAddress(), INITIAL_DEPOSIT);
      await vault.connect(whale).deposit(INITIAL_DEPOSIT / 2n, whale.address);
      await vault.connect(whale).deposit(INITIAL_DEPOSIT / 2n, whale.address);

      expect(await vault.getParticipantCount()).to.equal(1);
    });

    it("Should emit ParticipantAdded event", async function () {
      await usdc.connect(whale).approve(await vault.getAddress(), INITIAL_DEPOSIT);

      await expect(vault.connect(whale).deposit(INITIAL_DEPOSIT, whale.address))
        .to.emit(vault, "ParticipantAdded")
        .withArgs(whale.address);
    });
  });

  describe("Mock Yield Generation", function () {
    beforeEach(async function () {
      // Whale deposits 10,000 USDC
      await usdc.connect(whale).approve(await vault.getAddress(), INITIAL_DEPOSIT);
      await vault.connect(whale).deposit(INITIAL_DEPOSIT, whale.address);
    });

    it("Should accrue no yield immediately after deposit", async function () {
      const yieldAmount = await vault.getAccruedYield();
      expect(yieldAmount).to.equal(0);
    });

    it("Should accrue yield over time (5% APY)", async function () {
      // Advance 365 days
      await time.increase(365 * 24 * 60 * 60);

      const accruedYield = await vault.getAccruedYield();
      const expected = (INITIAL_DEPOSIT * 5n) / 100n; // 5% of 10,000 = 500 USDC

      // Allow 1% margin for rounding
      const margin = expected / 100n;
      expect(accruedYield).to.be.closeTo(expected, margin);
    });

    it("Should accrue proportional yield for shorter periods", async function () {
      // Advance 30 days (1 month)
      await time.increase(30 * 24 * 60 * 60);

      const accruedYield = await vault.getAccruedYield();
      // 5% APY for 30 days = (10000 * 0.05 * 30/365) ≈ 41 USDC
      const expected = (INITIAL_DEPOSIT * 5n * 30n) / (100n * 365n);

      const margin = expected / 10n;
      expect(accruedYield).to.be.closeTo(expected, margin);
    });

    it("Should update accumulatedYield on subsequent deposits", async function () {
      // Advance time
      await time.increase(30 * 24 * 60 * 60);

      // Make another deposit to trigger yield update
      await usdc.connect(retail1).approve(await vault.getAddress(), RETAIL_DEPOSIT);
      await vault.connect(retail1).deposit(RETAIL_DEPOSIT, retail1.address);

      // accumulatedYield should now be recorded
      const stats = await vault.getVaultStats();
      expect(stats.yieldGenerated).to.be.gt(0);
    });

    it("Should emit YieldAccrued event", async function () {
      // Advance time
      await time.increase(30 * 24 * 60 * 60);

      // Trigger yield update with new deposit
      await usdc.connect(retail1).approve(await vault.getAddress(), RETAIL_DEPOSIT);

      await expect(vault.connect(retail1).deposit(RETAIL_DEPOSIT, retail1.address)).to.emit(vault, "YieldAccrued");
    });
  });

  describe("Yield Claiming", function () {
    beforeEach(async function () {
      // Whale deposits
      await usdc.connect(whale).approve(await vault.getAddress(), INITIAL_DEPOSIT);
      await vault.connect(whale).deposit(INITIAL_DEPOSIT, whale.address);

      // Generate yield
      await time.increase(365 * 24 * 60 * 60);
    });

    it("Should allow owner to claim available yield", async function () {
      const availableYield = await vault.getAvailableYield();
      expect(availableYield).to.be.gt(0);

      // Need to mint yield to vault first (simulate yield being "real")
      await usdc.mint(await vault.getAddress(), availableYield);

      await vault.connect(owner).claimYield(availableYield);

      expect(await vault.totalYieldClaimed()).to.equal(availableYield);
    });

    it("Should not allow claiming more than available", async function () {
      // beforeEach already deposited and advanced time
      const availableYield = await vault.getAvailableYield();

      // Mint enough USDC for the claim attempt
      await usdc.mint(await vault.getAddress(), availableYield * 10n);

      // Try to claim much more than available (10x) to ensure it fails
      const excessiveAmount = availableYield * 10n;
      await expect(vault.connect(owner).claimYield(excessiveAmount)).to.be.revertedWith("Insufficient yield available");
    });

    it("Should not allow non-owner to claim yield", async function () {
      const availableYield = await vault.getAvailableYield();
      await usdc.mint(await vault.getAddress(), availableYield);

      await expect(vault.connect(whale).claimYield(availableYield)).to.be.reverted;
    });

    it("Should emit YieldClaimed event", async function () {
      const availableYield = await vault.getAvailableYield();
      await usdc.mint(await vault.getAddress(), availableYield);

      await expect(vault.connect(owner).claimYield(availableYield))
        .to.emit(vault, "YieldClaimed")
        .withArgs(availableYield, owner.address);
    });

    it("Should update available yield after claim", async function () {
      const availableYield = await vault.getAvailableYield();
      await usdc.mint(await vault.getAddress(), availableYield);

      await vault.connect(owner).claimYield(availableYield / 2n);

      const remainingYield = await vault.getAvailableYield();
      expect(remainingYield).to.be.closeTo(availableYield / 2n, ethers.parseUnits("1", 6));
    });
  });

  describe("ERC-4626 Compliance", function () {
    beforeEach(async function () {
      await usdc.connect(whale).approve(await vault.getAddress(), INITIAL_DEPOSIT);
      await vault.connect(whale).deposit(INITIAL_DEPOSIT, whale.address);
    });

    it("Should convert assets to shares correctly", async function () {
      const shares = await vault.convertToShares(ethers.parseUnits("100", 6));
      // Initially 1:1 ratio
      expect(shares).to.equal(ethers.parseUnits("100", 6));
    });

    it("Should convert shares to assets correctly", async function () {
      const assets = await vault.convertToAssets(ethers.parseUnits("100", 6));
      expect(assets).to.equal(ethers.parseUnits("100", 6));
    });

    it("Should preview deposit correctly", async function () {
      const shares = await vault.previewDeposit(RETAIL_DEPOSIT);
      expect(shares).to.be.gt(0);
    });

    it("Should preview mint correctly", async function () {
      const assets = await vault.previewMint(RETAIL_DEPOSIT);
      expect(assets).to.be.gt(0);
    });
  });

  describe("Vault Statistics", function () {
    it("Should return correct vault stats", async function () {
      // Initial deposit
      await usdc.connect(whale).approve(await vault.getAddress(), INITIAL_DEPOSIT);
      await vault.connect(whale).deposit(INITIAL_DEPOSIT, whale.address);

      // Add retail
      await usdc.connect(retail1).approve(await vault.getAddress(), RETAIL_DEPOSIT);
      await vault.connect(retail1).deposit(RETAIL_DEPOSIT, retail1.address);

      // Generate yield
      await time.increase(30 * 24 * 60 * 60);

      const stats = await vault.getVaultStats();

      const totalDeposits = INITIAL_DEPOSIT + RETAIL_DEPOSIT;
      // Allow for 1 wei rounding error due to ERC-4626 precision
      expect(stats.totalDeposits).to.be.closeTo(totalDeposits, 1n);
      expect(stats.yieldGenerated).to.be.gt(0);
      expect(stats.yieldDistributed).to.equal(0);
      expect(stats.participantCount).to.equal(2);
    });

    it("Should track all participants", async function () {
      await usdc.connect(whale).approve(await vault.getAddress(), INITIAL_DEPOSIT);
      await vault.connect(whale).deposit(INITIAL_DEPOSIT, whale.address);

      await usdc.connect(retail1).approve(await vault.getAddress(), RETAIL_DEPOSIT);
      await vault.connect(retail1).deposit(RETAIL_DEPOSIT, retail1.address);

      await usdc.connect(retail2).approve(await vault.getAddress(), RETAIL_DEPOSIT);
      await vault.connect(retail2).deposit(RETAIL_DEPOSIT, retail2.address);

      const participants = await vault.getParticipants();
      expect(participants.length).to.equal(3);
      expect(participants).to.include(whale.address);
      expect(participants).to.include(retail1.address);
      expect(participants).to.include(retail2.address);
    });
  });
});
