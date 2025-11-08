import { expect } from "chai";
import { ethers } from "hardhat";
import { MockUSDC } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("MockUSDC", function () {
  let mockUSDC: MockUSDC;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDCFactory.deploy();
    await mockUSDC.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await mockUSDC.name()).to.equal("Mock USDC");
      expect(await mockUSDC.symbol()).to.equal("USDC");
    });

    it("Should have 6 decimals like real USDC", async function () {
      expect(await mockUSDC.decimals()).to.equal(6);
    });

    it("Should mint 1M USDC to deployer", async function () {
      const balance = await mockUSDC.balanceOf(owner.address);
      expect(balance).to.equal(ethers.parseUnits("1000000", 6));
    });

    it("Should set deployer as owner", async function () {
      expect(await mockUSDC.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should allow owner to mint tokens", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      await mockUSDC.mint(addr1.address, mintAmount);

      expect(await mockUSDC.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should not allow non-owner to mint tokens", async function () {
      const mintAmount = ethers.parseUnits("1000", 6);
      await expect(mockUSDC.connect(addr1).mint(addr2.address, mintAmount)).to.be.reverted;
    });

    it("Should update total supply when minting", async function () {
      const initialSupply = await mockUSDC.totalSupply();
      const mintAmount = ethers.parseUnits("1000", 6);

      await mockUSDC.mint(addr1.address, mintAmount);

      expect(await mockUSDC.totalSupply()).to.equal(initialSupply + mintAmount);
    });
  });

  describe("Faucet", function () {
    it("Should allow anyone to call faucet and receive 1000 USDC", async function () {
      await mockUSDC.connect(addr1).faucet();

      expect(await mockUSDC.balanceOf(addr1.address)).to.equal(ethers.parseUnits("1000", 6));
    });

    it("Should allow multiple faucet calls", async function () {
      await mockUSDC.connect(addr1).faucet();
      await mockUSDC.connect(addr1).faucet();

      expect(await mockUSDC.balanceOf(addr1.address)).to.equal(ethers.parseUnits("2000", 6));
    });

    it("Should update total supply when using faucet", async function () {
      const initialSupply = await mockUSDC.totalSupply();

      await mockUSDC.connect(addr1).faucet();
      await mockUSDC.connect(addr2).faucet();

      expect(await mockUSDC.totalSupply()).to.equal(initialSupply + ethers.parseUnits("2000", 6));
    });
  });

  describe("ERC20 Transfers", function () {
    beforeEach(async function () {
      // Give addr1 some tokens
      await mockUSDC.mint(addr1.address, ethers.parseUnits("10000", 6));
    });

    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseUnits("100", 6);
      await mockUSDC.connect(addr1).transfer(addr2.address, transferAmount);

      expect(await mockUSDC.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await mockUSDC.balanceOf(addr1.address)).to.equal(ethers.parseUnits("9900", 6));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialAddr2Balance = await mockUSDC.balanceOf(addr2.address);
      await expect(mockUSDC.connect(addr2).transfer(addr1.address, ethers.parseUnits("100", 6))).to.be.reverted;

      expect(await mockUSDC.balanceOf(addr2.address)).to.equal(initialAddr2Balance);
    });

    it("Should update balances after transfers", async function () {
      const initialAddr1Balance = await mockUSDC.balanceOf(addr1.address);
      const transferAmount = ethers.parseUnits("100", 6);

      await mockUSDC.connect(addr1).transfer(addr2.address, transferAmount);

      expect(await mockUSDC.balanceOf(addr1.address)).to.equal(initialAddr1Balance - transferAmount);
      expect(await mockUSDC.balanceOf(addr2.address)).to.equal(transferAmount);
    });
  });

  describe("Approval and TransferFrom", function () {
    beforeEach(async function () {
      await mockUSDC.mint(addr1.address, ethers.parseUnits("10000", 6));
    });

    it("Should approve tokens for spending", async function () {
      const approveAmount = ethers.parseUnits("1000", 6);
      await mockUSDC.connect(addr1).approve(addr2.address, approveAmount);

      expect(await mockUSDC.allowance(addr1.address, addr2.address)).to.equal(approveAmount);
    });

    it("Should transfer tokens using transferFrom after approval", async function () {
      const approveAmount = ethers.parseUnits("1000", 6);
      await mockUSDC.connect(addr1).approve(addr2.address, approveAmount);

      const transferAmount = ethers.parseUnits("500", 6);
      await mockUSDC.connect(addr2).transferFrom(addr1.address, addr2.address, transferAmount);

      expect(await mockUSDC.balanceOf(addr2.address)).to.equal(transferAmount);
      expect(await mockUSDC.allowance(addr1.address, addr2.address)).to.equal(approveAmount - transferAmount);
    });

    it("Should fail transferFrom without approval", async function () {
      const transferAmount = ethers.parseUnits("500", 6);
      await expect(mockUSDC.connect(addr2).transferFrom(addr1.address, addr2.address, transferAmount)).to.be.reverted;
    });
  });
});
