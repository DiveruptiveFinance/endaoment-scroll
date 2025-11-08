import { expect } from "chai";
import { ethers } from "hardhat";
import { StudentRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("StudentRegistry", function () {
  let registry: StudentRegistry;
  let owner: SignerWithAddress;
  let allocationManager: SignerWithAddress;
  let student1: SignerWithAddress;
  let student2: SignerWithAddress;
  let nonOwner: SignerWithAddress;

  beforeEach(async function () {
    [owner, allocationManager, student1, student2, nonOwner] = await ethers.getSigners();

    const StudentRegistryFactory = await ethers.getContractFactory("StudentRegistry");
    registry = await StudentRegistryFactory.deploy();
    await registry.waitForDeployment();

    // Set allocation manager
    await registry.setAllocationManager(allocationManager.address);
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("Should allow owner to set allocation manager", async function () {
      expect(await registry.allocationManager()).to.equal(allocationManager.address);
    });

    it("Should not allow non-owner to set allocation manager", async function () {
      await expect(registry.connect(nonOwner).setAllocationManager(nonOwner.address)).to.be.reverted;
    });

    it("Should not allow zero address as allocation manager", async function () {
      await expect(registry.setAllocationManager(ethers.ZeroAddress)).to.be.revertedWith(
        "Invalid allocation manager address",
      );
    });
  });

  describe("Adding Students", function () {
    it("Should allow owner to add a student", async function () {
      await expect(registry.addStudent(student1.address, "Alice Chen", "MIT", "Artificial Intelligence")).to.emit(
        registry,
        "StudentAdded",
      );

      const student = await registry.getStudent(student1.address);
      expect(student.wallet).to.equal(student1.address);
      expect(student.name).to.equal("Alice Chen");
      expect(student.university).to.equal("MIT");
      expect(student.researchArea).to.equal("Artificial Intelligence");
      expect(student.isActive).to.equal(true);
      expect(student.totalReceived).to.equal(0);
    });

    it("Should not allow non-owner to add students", async function () {
      await expect(registry.connect(nonOwner).addStudent(student1.address, "Alice", "MIT", "AI")).to.be.reverted;
    });

    it("Should not allow adding duplicate students", async function () {
      await registry.addStudent(student1.address, "Alice", "MIT", "AI");
      await expect(registry.addStudent(student1.address, "Alice", "MIT", "AI")).to.be.revertedWith(
        "Student already registered",
      );
    });

    it("Should not allow invalid student address", async function () {
      await expect(registry.addStudent(ethers.ZeroAddress, "Alice", "MIT", "AI")).to.be.revertedWith(
        "Invalid student address",
      );
    });

    it("Should not allow empty name", async function () {
      await expect(registry.addStudent(student1.address, "", "MIT", "AI")).to.be.revertedWith("Name cannot be empty");
    });

    it("Should not allow empty university", async function () {
      await expect(registry.addStudent(student1.address, "Alice", "", "AI")).to.be.revertedWith(
        "University cannot be empty",
      );
    });

    it("Should not allow empty research area", async function () {
      await expect(registry.addStudent(student1.address, "Alice", "MIT", "")).to.be.revertedWith(
        "Research area cannot be empty",
      );
    });
  });

  describe("Retrieving Students", function () {
    beforeEach(async function () {
      await registry.addStudent(student1.address, "Alice Chen", "MIT", "AI");
      await registry.addStudent(student2.address, "Bob Smith", "Stanford", "Climate Science");
    });

    it("Should retrieve student by address", async function () {
      const student = await registry.getStudent(student1.address);
      expect(student.name).to.equal("Alice Chen");
      expect(student.university).to.equal("MIT");
    });

    it("Should return all students", async function () {
      const allStudents = await registry.getAllStudents();
      expect(allStudents.length).to.equal(2);
      expect(allStudents[0]).to.equal(student1.address);
      expect(allStudents[1]).to.equal(student2.address);
    });

    it("Should return all active students", async function () {
      const activeStudents = await registry.getActiveStudents();
      expect(activeStudents.length).to.equal(2);
    });

    it("Should return correct student count", async function () {
      expect(await registry.getStudentCount()).to.equal(2);
    });

    it("Should revert when getting non-existent student", async function () {
      await expect(registry.getStudent(nonOwner.address)).to.be.revertedWith("Student not found");
    });
  });

  describe("Deactivating Students", function () {
    beforeEach(async function () {
      await registry.addStudent(student1.address, "Alice", "MIT", "AI");
    });

    it("Should allow owner to deactivate student", async function () {
      await expect(registry.deactivateStudent(student1.address)).to.emit(registry, "StudentDeactivated");

      const student = await registry.getStudent(student1.address);
      expect(student.isActive).to.equal(false);
    });

    it("Should not allow non-owner to deactivate", async function () {
      await expect(registry.connect(nonOwner).deactivateStudent(student1.address)).to.be.reverted;
    });

    it("Should not allow deactivating non-existent student", async function () {
      await expect(registry.deactivateStudent(nonOwner.address)).to.be.revertedWith("Student not found");
    });

    it("Should not allow deactivating already inactive student", async function () {
      await registry.deactivateStudent(student1.address);
      await expect(registry.deactivateStudent(student1.address)).to.be.revertedWith("Student already inactive");
    });

    it("Should exclude deactivated students from active list", async function () {
      await registry.addStudent(student2.address, "Bob", "Stanford", "CS");
      await registry.deactivateStudent(student1.address);

      const activeStudents = await registry.getActiveStudents();
      expect(activeStudents.length).to.equal(1);
      expect(activeStudents[0]).to.equal(student2.address);
    });

    it("Should still include deactivated in all students", async function () {
      await registry.deactivateStudent(student1.address);

      const allStudents = await registry.getAllStudents();
      expect(allStudents.length).to.equal(1);
    });
  });

  describe("Reactivating Students", function () {
    beforeEach(async function () {
      await registry.addStudent(student1.address, "Alice", "MIT", "AI");
      await registry.deactivateStudent(student1.address);
    });

    it("Should allow owner to reactivate student", async function () {
      await expect(registry.reactivateStudent(student1.address)).to.emit(registry, "StudentReactivated");

      const student = await registry.getStudent(student1.address);
      expect(student.isActive).to.equal(true);
    });

    it("Should not allow non-owner to reactivate", async function () {
      await expect(registry.connect(nonOwner).reactivateStudent(student1.address)).to.be.reverted;
    });

    it("Should not allow reactivating non-existent student", async function () {
      await expect(registry.reactivateStudent(nonOwner.address)).to.be.revertedWith("Student not found");
    });

    it("Should not allow reactivating already active student", async function () {
      await registry.reactivateStudent(student1.address);
      await expect(registry.reactivateStudent(student1.address)).to.be.revertedWith("Student already active");
    });
  });

  describe("Recording Funding", function () {
    beforeEach(async function () {
      await registry.addStudent(student1.address, "Alice", "MIT", "AI");
    });

    it("Should allow allocation manager to record funding", async function () {
      const amount = ethers.parseUnits("1000", 6);
      await expect(registry.connect(allocationManager).recordFunding(student1.address, amount))
        .to.emit(registry, "FundingRecorded")
        .withArgs(student1.address, amount);

      const student = await registry.getStudent(student1.address);
      expect(student.totalReceived).to.equal(amount);
    });

    it("Should accumulate funding across multiple records", async function () {
      const amount1 = ethers.parseUnits("1000", 6);
      const amount2 = ethers.parseUnits("500", 6);

      await registry.connect(allocationManager).recordFunding(student1.address, amount1);
      await registry.connect(allocationManager).recordFunding(student1.address, amount2);

      const student = await registry.getStudent(student1.address);
      expect(student.totalReceived).to.equal(amount1 + amount2);
    });

    it("Should not allow non-allocation-manager to record funding", async function () {
      await expect(registry.connect(owner).recordFunding(student1.address, 1000)).to.be.revertedWith(
        "Only AllocationManager can record funding",
      );
    });

    it("Should not allow recording funding for non-existent student", async function () {
      await expect(registry.connect(allocationManager).recordFunding(nonOwner.address, 1000)).to.be.revertedWith(
        "Student not found",
      );
    });
  });

  describe("Student Status Check", function () {
    beforeEach(async function () {
      await registry.addStudent(student1.address, "Alice", "MIT", "AI");
    });

    it("Should return true for active student", async function () {
      expect(await registry.isStudentActive(student1.address)).to.equal(true);
    });

    it("Should return false for inactive student", async function () {
      await registry.deactivateStudent(student1.address);
      expect(await registry.isStudentActive(student1.address)).to.equal(false);
    });

    it("Should return false for non-existent student", async function () {
      expect(await registry.isStudentActive(nonOwner.address)).to.equal(false);
    });
  });
});
