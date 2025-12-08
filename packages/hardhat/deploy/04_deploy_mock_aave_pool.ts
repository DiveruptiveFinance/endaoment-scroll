import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys MockAavePool for yield generation simulation
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMockAavePool: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Get MockUSDC address
  const mockUSDC = await hre.ethers.getContract<Contract>("MockUSDC", deployer);

  console.log("🏦 Deploying MockAavePool...");

  await deploy("MockAavePool", {
    from: deployer,
    args: [await mockUSDC.getAddress()],
    log: true,
    autoMine: true,
  });

  const aavePool = await hre.ethers.getContract<Contract>("MockAavePool", deployer);
  const aavePoolAddress = await aavePool.getAddress();

  console.log("🏦 MockAavePool deployed to:", aavePoolAddress);

  // Grant minting permission to MockAavePool for yield simulation
  console.log("🪙 Granting MockAavePool minting permission for yield simulation...");
  const addMinterTx = await mockUSDC.addMinter(aavePoolAddress);
  await addMinterTx.wait();
  console.log("✅ MockAavePool can now mint USDC for yield simulation");

  console.log(`\n🏦 MockAavePool Configuration:`);
  console.log(`   Address: ${aavePoolAddress}`);
  console.log(`   Asset:   ${await mockUSDC.getAddress()}`);
  console.log(`   Minter:  ✅ Can mint USDC`);
};

export default deployMockAavePool;

deployMockAavePool.tags = ["MockAavePool"];
deployMockAavePool.dependencies = ["MockUSDC"];
