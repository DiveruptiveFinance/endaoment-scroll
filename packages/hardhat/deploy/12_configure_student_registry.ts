import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Configures StudentRegistry to work with StudentSBT
 * Sets StudentSBT address and grants minter role
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const configureStudentRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  const studentRegistry = await hre.ethers.getContract<Contract>("StudentRegistry", deployer);
  const studentSBT = await hre.ethers.getContract<Contract>("StudentSBT", deployer);

  console.log("🔗 Configuring StudentRegistry...");

  // Set StudentSBT address in StudentRegistry
  console.log("   Setting StudentSBT address...");
  const setSBTTx = await studentRegistry.setStudentSBT(await studentSBT.getAddress());
  await setSBTTx.wait();
  console.log("   ✅ StudentSBT address set");

  // Grant StudentRegistry as authorized minter in StudentSBT
  console.log("   Granting minter role to StudentRegistry...");
  const grantMinterTx = await studentSBT.addAuthorizedMinter(await studentRegistry.getAddress());
  await grantMinterTx.wait();
  console.log("   ✅ Minter role granted");

  console.log(`\n🔗 StudentRegistry Configuration:`);
  console.log(`   StudentSBT: ${await studentSBT.getAddress()}`);
  console.log(`   Auto-mint:  Enabled (students get SBT on registration)`);
};

export default configureStudentRegistry;

configureStudentRegistry.tags = ["ConfigureStudentRegistry"];
configureStudentRegistry.dependencies = ["StudentRegistry", "StudentSBT"];


