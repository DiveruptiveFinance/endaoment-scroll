import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys MyGovernor with optimistic governance settings
 * - Voting Delay: 0 blocks (instant)
 * - Voting Period: ~5-10 minutes (for demo)
 * - Quorum: 4% (adjustable)
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMyGovernor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get contract addresses
  const studentSBT = await hre.ethers.getContract<Contract>("StudentSBT", deployer);
  const timelockController = await hre.ethers.getContract<Contract>("TimelockController", deployer);

  // Governance parameters
  const VOTING_DELAY = 0; // 0 blocks = instant
  // Voting period: ~5-10 minutes for demo
  // Scroll Sepolia: ~2 seconds per block, so 150 blocks ≈ 5 minutes
  const VOTING_PERIOD = 150; // ~5 minutes
  const QUORUM_PERCENTAGE = 4; // 4% quorum

  console.log("🗳️  Deploying MyGovernor...");
  console.log(`   Voting Delay:    ${VOTING_DELAY} blocks (instant)`);
  console.log(`   Voting Period:  ${VOTING_PERIOD} blocks (~5 minutes)`);
  console.log(`   Quorum:          ${QUORUM_PERCENTAGE}%`);

  await deploy("MyGovernor", {
    from: deployer,
    args: [
      await studentSBT.getAddress(),
      await timelockController.getAddress(),
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
    ],
    log: true,
    autoMine: true,
  });

  const governor = await hre.ethers.getContract<Contract>("MyGovernor", deployer);
  const governorAddress = await governor.getAddress();

  console.log("🗳️  MyGovernor deployed to:", governorAddress);

  // Grant PROPOSER_ROLE to Governor
  console.log("🔑 Granting PROPOSER_ROLE to Governor...");
  const PROPOSER_ROLE = await timelockController.PROPOSER_ROLE();
  const grantRoleTx = await timelockController.grantRole(PROPOSER_ROLE, governorAddress);
  await grantRoleTx.wait();
  console.log("✅ PROPOSER_ROLE granted to Governor");

  console.log(`\n🗳️  MyGovernor Configuration:`);
  console.log(`   Address:        ${governorAddress}`);
  console.log(`   Voting Token:   ${await studentSBT.getAddress()}`);
  console.log(`   Timelock:       ${await timelockController.getAddress()}`);
  console.log(`   Voting Delay:   ${VOTING_DELAY} blocks`);
  console.log(`   Voting Period:  ${VOTING_PERIOD} blocks`);
  console.log(`   Quorum:         ${QUORUM_PERCENTAGE}%`);
  console.log(`   Proposer Role:  ✅ Granted`);
};

export default deployMyGovernor;

deployMyGovernor.tags = ["MyGovernor"];
deployMyGovernor.dependencies = ["StudentSBT", "TimelockController"];
