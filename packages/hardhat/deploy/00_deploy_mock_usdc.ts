import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys MockUSDC test token
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMockUSDC: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("MockUSDC", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying
  const mockUSDC = await hre.ethers.getContract<Contract>("MockUSDC", deployer);
  console.log("👋 MockUSDC deployed to:", await mockUSDC.getAddress());

  // Log initial supply
  const balance = await mockUSDC.balanceOf(deployer);
  console.log("💰 Deployer initial balance:", hre.ethers.formatUnits(balance, 6), "USDC");
};

export default deployMockUSDC;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags MockUSDC
deployMockUSDC.tags = ["MockUSDC"];
