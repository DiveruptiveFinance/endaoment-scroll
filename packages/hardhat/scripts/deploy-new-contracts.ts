import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Get existing contracts
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.attach("0xaE742c7414937A43177bD1bF9cDBFCaF1a6E2Ccb");

  // 4. Deploy UniversityRegistry
  console.log("\n🏛️  Deploying UniversityRegistry...");
  const UniversityRegistry = await ethers.getContractFactory("UniversityRegistry");
  const universityRegistry = await UniversityRegistry.deploy();
  await universityRegistry.waitForDeployment();
  const universityRegistryAddress = await universityRegistry.getAddress();
  console.log("✅ UniversityRegistry deployed to:", universityRegistryAddress);

  // 5. Deploy DonationTracker (using placeholder for LosslessVault for now)
  console.log("\n📊 Deploying DonationTracker...");
  const DonationTracker = await ethers.getContractFactory("DonationTracker");
  const losslessVaultPlaceholder = "0x0000000000000000000000000000000000000000";
  const donationTracker = await DonationTracker.deploy(
    await mockUSDC.getAddress(),
    losslessVaultPlaceholder,
    universityRegistryAddress
  );
  await donationTracker.waitForDeployment();
  const donationTrackerAddress = await donationTracker.getAddress();
  console.log("✅ DonationTracker deployed to:", donationTrackerAddress);

  console.log("\n📋 Summary:");
  console.log("UniversityRegistry:", universityRegistryAddress);
  console.log("DonationTracker:", donationTrackerAddress);
  console.log("\n⚠️  Note: TimelockController, YieldSplitter, and LosslessVault need to be deployed separately using the deploy scripts.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
