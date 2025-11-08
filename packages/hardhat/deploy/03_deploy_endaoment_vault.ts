import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys EndaomentVault and registers it with AllocationManager
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployEndaomentVault: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get contract addresses
  const mockUSDC = await hre.ethers.getContract<Contract>("MockUSDC", deployer);
  const allocationManager = await hre.ethers.getContract<Contract>("AllocationManager", deployer);

  console.log("🏦 Deploying EndaomentVault...");

  // Deploy vault with deployer as whale (can be changed later)
  await deploy("EndaomentVault", {
    from: deployer,
    args: [
      await mockUSDC.getAddress(),
      "Endaoment Education Vault",
      "EDVAULT",
      deployer, // whale address (deployer for now)
    ],
    log: true,
    autoMine: true,
  });

  const vault = await hre.ethers.getContract<Contract>("EndaomentVault", deployer);
  const vaultAddress = await vault.getAddress();
  console.log("🏦 EndaomentVault deployed to:", vaultAddress);

  // Transfer vault ownership to AllocationManager so it can claim yield
  console.log("🔑 Transferring vault ownership to AllocationManager...");
  const transferTx = await vault.transferOwnership(await allocationManager.getAddress());
  await transferTx.wait();
  console.log("✅ Vault ownership transferred");

  // Register vault with AllocationManager
  console.log("📋 Registering vault with AllocationManager...");
  const registerTx = await allocationManager.registerVault(vaultAddress);
  await registerTx.wait();
  console.log("✅ Vault registered");

  // Grant vault permission to mint USDC (for yield simulation)
  console.log("🪙 Granting vault minting permission for yield simulation...");
  const addMinterTx = await mockUSDC.addMinter(vaultAddress);
  await addMinterTx.wait();
  console.log("✅ Vault can now mint USDC for yield simulation");

  // Display vault info
  const whale = await vault.whale();
  const asset = await vault.asset();
  const name = await vault.name();
  const symbol = await vault.symbol();

  console.log(`\n🏦 Vault Configuration:`);
  console.log(`   Name:   ${name}`);
  console.log(`   Symbol: ${symbol}`);
  console.log(`   Asset:  ${asset}`);
  console.log(`   Whale:  ${whale}`);
  console.log(`   Owner:  ${await allocationManager.getAddress()}`);
  console.log(`   Minter: ✅ Can mint USDC`);
};

export default deployEndaomentVault;

deployEndaomentVault.tags = ["EndaomentVault"];
deployEndaomentVault.dependencies = ["MockUSDC", "AllocationManager"];
