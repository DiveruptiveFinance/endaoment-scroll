import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const UNIVERSITY_WALLET = process.env.UNIVERSITY_WALLET || deployer.address;

  // Get existing contracts
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.attach("0xaE742c7414937A43177bD1bF9cDBFCaF1a6E2Ccb");

  const MockAavePool = await ethers.getContractFactory("MockAavePool");
  const mockAavePool = await MockAavePool.attach("0x72b012CacAa2Efd546c445A4F183EF2acaCf9B68");

  // 1. Skip TimelockController for now - use deploy script instead
  // We'll deploy it using the deploy script which handles arrays correctly
  console.log("\n⏰ Skipping TimelockController - use deploy script");
  const timelockAddress = "0x0000000000000000000000000000000000000000"; // Placeholder

  // 2. Skip YieldSplitter for now (needs TimelockController)
  console.log("\n💰 Skipping YieldSplitter - needs TimelockController");
  let yieldSplitterAddress = "0x0000000000000000000000000000000000000000"; // Placeholder
  await yieldSplitter.waitForDeployment();
  const yieldSplitterAddress = await yieldSplitter.getAddress();
  console.log("✅ YieldSplitter deployed to:", yieldSplitterAddress);

  // 3. Skip LosslessVault for now (needs YieldSplitter)
  console.log("\n🏦 Skipping LosslessVault - needs YieldSplitter");
  let losslessVaultAddress = "0x0000000000000000000000000000000000000000"; // Placeholder
  await losslessVault.waitForDeployment();
  const losslessVaultAddress = await losslessVault.getAddress();
  console.log("✅ LosslessVault deployed to:", losslessVaultAddress);

  // 4. Deploy UniversityRegistry
  console.log("\n🏛️  Deploying UniversityRegistry...");
  const UniversityRegistry = await ethers.getContractFactory("UniversityRegistry");
  const universityRegistry = await UniversityRegistry.deploy();
  await universityRegistry.waitForDeployment();
  const universityRegistryAddress = await universityRegistry.getAddress();
  console.log("✅ UniversityRegistry deployed to:", universityRegistryAddress);

  // 5. Deploy DonationTracker
  console.log("\n📊 Deploying DonationTracker...");
  const DonationTracker = await ethers.getContractFactory("DonationTracker");
  const donationTracker = await DonationTracker.deploy(
    await mockUSDC.getAddress(),
    losslessVaultAddress,
    universityRegistryAddress
  );
  await donationTracker.waitForDeployment();
  const donationTrackerAddress = await donationTracker.getAddress();
  console.log("✅ DonationTracker deployed to:", donationTrackerAddress);

  console.log("\n📋 Summary:");
  console.log("TimelockController:", timelockAddress);
  console.log("YieldSplitter:", yieldSplitterAddress);
  console.log("LosslessVault:", losslessVaultAddress);
  console.log("UniversityRegistry:", universityRegistryAddress);
  console.log("DonationTracker:", donationTrackerAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

