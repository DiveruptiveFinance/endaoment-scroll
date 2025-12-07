import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys YieldSplitter that splits yield 50/50 between University and DAO Treasury
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYieldSplitter: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get contract addresses
  const mockUSDC = await hre.ethers.getContract<Contract>("MockUSDC", deployer);
  const timelockController = await hre.ethers.getContract<Contract>("TimelockController", deployer);

  // ⚠️ IMPORTANT: Set your University Wallet address here (multisig)
  // For demo purposes, using deployer. In production, use a real multisig address
  const UNIVERSITY_WALLET = process.env.UNIVERSITY_WALLET || deployer;

  console.log("💰 Deploying YieldSplitter...");
  console.log(`   University Wallet: ${UNIVERSITY_WALLET}`);
  console.log(`   DAO Treasury (Timelock): ${await timelockController.getAddress()}`);

  await deploy("YieldSplitter", {
    from: deployer,
    args: [
      await mockUSDC.getAddress(),
      UNIVERSITY_WALLET,
      await timelockController.getAddress(),
    ],
    log: true,
    autoMine: true,
  });

  const splitter = await hre.ethers.getContract<Contract>("YieldSplitter", deployer);
  const splitterAddress = await splitter.getAddress();

  console.log("💰 YieldSplitter deployed to:", splitterAddress);

  console.log(`\n💰 YieldSplitter Configuration:`);
  console.log(`   Address:            ${splitterAddress}`);
  console.log(`   Asset:              ${await mockUSDC.getAddress()}`);
  console.log(`   University Wallet:  ${UNIVERSITY_WALLET} (50%)`);
  console.log(`   DAO Treasury:      ${await timelockController.getAddress()} (50%)`);
  console.log(`   Split Ratio:        50/50`);
};

export default deployYieldSplitter;

deployYieldSplitter.tags = ["YieldSplitter"];
deployYieldSplitter.dependencies = ["MockUSDC", "TimelockController"];

