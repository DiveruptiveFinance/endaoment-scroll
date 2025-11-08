import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys AllocationManager contract and configures integration
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployAllocationManager: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get StudentRegistry address
  const studentRegistry = await hre.ethers.getContract<Contract>("StudentRegistry", deployer);
  const studentRegistryAddress = await studentRegistry.getAddress();

  console.log("📊 Deploying AllocationManager...");

  await deploy("AllocationManager", {
    from: deployer,
    args: [studentRegistryAddress],
    log: true,
    autoMine: true,
  });

  const allocationManager = await hre.ethers.getContract<Contract>("AllocationManager", deployer);
  console.log("📊 AllocationManager deployed to:", await allocationManager.getAddress());

  // Set AllocationManager address in StudentRegistry
  console.log("🔗 Configuring StudentRegistry...");
  const tx = await studentRegistry.setAllocationManager(await allocationManager.getAddress());
  await tx.wait();
  console.log("✅ StudentRegistry configured with AllocationManager address");

  // Display epoch info
  const currentEpoch = await allocationManager.getCurrentEpoch();
  const epochDuration = await allocationManager.EPOCH_DURATION();
  console.log(`\n⏰ Current Epoch ID: ${currentEpoch.id}`);
  console.log(`⏰ Epoch Duration: ${epochDuration} seconds (${Number(epochDuration) / 86400} days)`);
  console.log(`⏰ Epoch Start: ${new Date(Number(currentEpoch.startTime) * 1000).toISOString()}`);
  console.log(`⏰ Epoch End: ${new Date(Number(currentEpoch.endTime) * 1000).toISOString()}`);

  // Display yield split constants
  const whaleShare = await allocationManager.WHALE_SHARE_BPS();
  const retailShare = await allocationManager.RETAIL_SHARE_BPS();
  const studentShare = await allocationManager.STUDENT_SHARE_BPS();
  console.log(`\n💰 Yield Split Configuration:`);
  console.log(`   Whale:    ${whaleShare / 100n}%`);
  console.log(`   Retail:   ${retailShare / 100n}%`);
  console.log(`   Students: ${studentShare / 100n}%`);
};

export default deployAllocationManager;

deployAllocationManager.tags = ["AllocationManager"];
deployAllocationManager.dependencies = ["StudentRegistry"];
