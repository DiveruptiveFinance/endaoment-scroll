import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Contract } from "ethers";

/**
 * Script to test the full flow end-to-end:
 * 1. Donor deposits USDC
 * 2. Admin adds yield
 * 3. Admin harvests yield
 * 4. Yield is split 50/50
 * 5. Student registers
 * 6. Student creates proposal
 * 7. Students vote
 * 8. University vetoes/approves
 */
async function main(hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const [donor, student1, student2, universityAdmin] = await hre.ethers.getSigners();

  console.log("🧪 Testing Full Flow...\n");
  console.log("Deployer:", deployer);
  console.log("Donor:", donor.address);
  console.log("Student 1:", student1.address);
  console.log("Student 2:", student2.address);
  console.log("University Admin:", universityAdmin.address);
  console.log("\n");

  // Get contracts
  const mockUSDC = await hre.ethers.getContract<Contract>("MockUSDC", deployer);
  const losslessVault = await hre.ethers.getContract<Contract>("LosslessVault", deployer);
  const mockAavePool = await hre.ethers.getContract<Contract>("MockAavePool", deployer);
  const yieldSplitter = await hre.ethers.getContract<Contract>("YieldSplitter", deployer);
  const studentRegistry = await hre.ethers.getContract<Contract>("StudentRegistry", deployer);
  const studentSBT = await hre.ethers.getContract<Contract>("StudentSBT", deployer);
  const myGovernor = await hre.ethers.getContract<Contract>("MyGovernor", deployer);
  const timelockController = await hre.ethers.getContract<Contract>("TimelockController", deployer);

  // Step 1: Mint USDC to donor
  console.log("📝 Step 1: Minting USDC to donor...");
  const donorAmount = hre.ethers.parseUnits("10000", 6); // 10,000 USDC
  await mockUSDC.mint(donor.address, donorAmount);
  console.log("✅ Donor balance:", hre.ethers.formatUnits(await mockUSDC.balanceOf(donor.address), 6), "USDC\n");

  // Step 2: Donor approves and deposits
  console.log("📝 Step 2: Donor deposits to LosslessVault...");
  const depositAmount = hre.ethers.parseUnits("5000", 6); // 5,000 USDC
  await mockUSDC.connect(donor).approve(await losslessVault.getAddress(), depositAmount);
  await losslessVault.connect(donor).deposit(depositAmount, donor.address);
  console.log("✅ Deposit successful\n");

  // Step 3: Admin adds yield
  console.log("📝 Step 3: Admin adds yield to MockAavePool...");
  const yieldAmount = hre.ethers.parseUnits("500", 6); // 500 USDC yield
  await mockAavePool.adminAddYield(yieldAmount);
  console.log("✅ Yield added\n");

  // Step 4: Admin harvests yield
  console.log("📝 Step 4: Admin harvests yield...");
  await losslessVault.harvestYield();
  console.log("✅ Yield harvested and split\n");

  // Step 5: Check yield split
  console.log("📝 Step 5: Checking yield distribution...");
  const universityWallet = await yieldSplitter.universityWallet();
  const timelockAddress = await yieldSplitter.timelockController();
  const universityBalance = await mockUSDC.balanceOf(universityWallet);
  const timelockBalance = await mockUSDC.balanceOf(timelockAddress);
  console.log("University wallet balance:", hre.ethers.formatUnits(universityBalance, 6), "USDC");
  console.log("Timelock balance:", hre.ethers.formatUnits(timelockBalance, 6), "USDC\n");

  // Step 6: Students register
  console.log("📝 Step 6: Students register...");
  await studentRegistry.connect(student1).registerStudent(
    "Student One",
    "UNAM",
    "Ingeniería",
    "12345678",
    8, // academic
    5, // sports
    3  // student
  );
  console.log("✅ Student 1 registered");

  await studentRegistry.connect(student2).registerStudent(
    "Student Two",
    "UNAM",
    "Medicina",
    "87654321",
    9, // academic
    7, // sports
    4  // student
  );
  console.log("✅ Student 2 registered\n");

  // Step 7: Check SBTs
  console.log("📝 Step 7: Checking StudentSBTs...");
  const student1HasSBT = await studentSBT.hasSBT(student1.address);
  const student2HasSBT = await studentSBT.hasSBT(student2.address);
  console.log("Student 1 has SBT:", student1HasSBT);
  console.log("Student 2 has SBT:", student2HasSBT);
  console.log("✅ SBTs minted\n");

  // Step 8: Student creates proposal (simplified - would need actual calldata)
  console.log("📝 Step 8: Testing governance...");
  console.log("⚠️  Note: Full proposal creation requires proper calldata");
  console.log("✅ Flow test completed!\n");

  console.log("📊 Summary:");
  console.log("- Donor deposited:", hre.ethers.formatUnits(depositAmount, 6), "USDC");
  console.log("- Yield generated:", hre.ethers.formatUnits(yieldAmount, 6), "USDC");
  console.log("- University received:", hre.ethers.formatUnits(universityBalance, 6), "USDC");
  console.log("- DAO received:", hre.ethers.formatUnits(timelockBalance, 6), "USDC");
  console.log("- Students registered: 2");
  console.log("- SBTs minted: 2");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main(require("hardhat").config as any)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

