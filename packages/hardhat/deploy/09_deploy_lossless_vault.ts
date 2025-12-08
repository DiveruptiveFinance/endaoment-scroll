import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys LosslessVault - the main donation vault
 * Deposits go to MockAavePool, yield is harvested and split 50/50
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployLosslessVault: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get contract addresses
  const mockUSDC = await hre.ethers.getContract<Contract>("MockUSDC", deployer);
  const mockAavePool = await hre.ethers.getContract<Contract>("MockAavePool", deployer);
  const yieldSplitter = await hre.ethers.getContract<Contract>("YieldSplitter", deployer);

  console.log("🏦 Deploying LosslessVault...");

  await deploy("LosslessVault", {
    from: deployer,
    args: [
      await mockUSDC.getAddress(),
      "Lossless Donation Vault",
      "LOSSVAULT",
      await mockAavePool.getAddress(),
      await yieldSplitter.getAddress(),
    ],
    log: true,
    autoMine: true,
  });

  const vault = await hre.ethers.getContract<Contract>("LosslessVault", deployer);
  const vaultAddress = await vault.getAddress();

  console.log("🏦 LosslessVault deployed to:", vaultAddress);

  console.log(`\n🏦 LosslessVault Configuration:`);
  console.log(`   Address:        ${vaultAddress}`);
  console.log(`   Asset:          ${await mockUSDC.getAddress()}`);
  console.log(`   Aave Pool:      ${await mockAavePool.getAddress()}`);
  console.log(`   Yield Splitter: ${await yieldSplitter.getAddress()}`);
  console.log(`   Model:          Lossless (Principal preserved, 100% yield donated)`);
};

export default deployLosslessVault;

deployLosslessVault.tags = ["LosslessVault"];
deployLosslessVault.dependencies = ["MockUSDC", "MockAavePool", "YieldSplitter"];
