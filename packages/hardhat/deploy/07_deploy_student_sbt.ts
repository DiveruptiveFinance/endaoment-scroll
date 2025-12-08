import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys StudentSBT (Soulbound Token) for governance voting
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployStudentSBT: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🎓 Deploying StudentSBT...");

  await deploy("StudentSBT", {
    from: deployer,
    args: ["Student DAO Token", "SBT"],
    log: true,
    autoMine: true,
  });

  const sbt = await hre.ethers.getContract<Contract>("StudentSBT", deployer);
  const sbtAddress = await sbt.getAddress();

  console.log("🎓 StudentSBT deployed to:", sbtAddress);

  console.log(`\n🎓 StudentSBT Configuration:`);
  console.log(`   Address: ${sbtAddress}`);
  console.log(`   Name:    Student DAO Token`);
  console.log(`   Symbol:  SBT`);
  console.log(`   Type:    Soulbound (Non-transferable)`);
  console.log(`   Owner:   ${deployer} (can add authorized minters)`);

  // Grant StudentRegistry as authorized minter (will be set after StudentRegistry is deployed)
  console.log(`\n⚠️  Note: Set StudentRegistry as authorized minter after deployment`);
};

export default deployStudentSBT;

deployStudentSBT.tags = ["StudentSBT"];
