import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys TimelockController with proper roles for governance
 * - Proposer: Governor contract (will be set later)
 * - Executor: Address(0) - open execution
 * - Canceller: UniversityWallet (hardcoded for veto power)
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployTimelockController: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // ⚠️ IMPORTANT: Set your University Wallet address here (multisig)
  // For demo purposes, using deployer. In production, use a real multisig address
  const UNIVERSITY_WALLET = process.env.UNIVERSITY_WALLET || deployer;

  // Timelock delay: 1 hour for demo (can be adjusted)
  const TIMELOCK_DELAY = 3600; // 1 hour in seconds

  console.log("⏰ Deploying TimelockController...");
  console.log(`   University Wallet (Canceller): ${UNIVERSITY_WALLET}`);
  console.log(`   Timelock Delay: ${TIMELOCK_DELAY} seconds (1 hour)`);

  // Proposer will be set to Governor later (empty array for now)
  const proposers: string[] = [];
  // Executor is address(0) for open execution
  const executors: string[] = ["0x0000000000000000000000000000000000000000"];
  // Canceller is University Wallet (has veto power)
  const cancellers: string[] = [UNIVERSITY_WALLET];

  // Deploy using ethers directly to avoid hardhat-deploy array encoding issues
  const TimelockControllerFactory = await hre.ethers.getContractFactory("TimelockController");
  const timelockContract = await TimelockControllerFactory.deploy(TIMELOCK_DELAY, proposers, executors, cancellers);
  await timelockContract.waitForDeployment();
  const timelockAddress = await timelockContract.getAddress();

  // Save deployment info manually
  await hre.deployments.save("TimelockController", {
    address: timelockAddress,
    abi: TimelockControllerFactory.interface.format("json") as any,
  });

  console.log("⏰ TimelockController deployed to:", timelockAddress);

  const timelock = timelockContract;

  // Verify roles
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  const CANCELLER_ROLE = await timelock.CANCELLER_ROLE();

  console.log(`\n⏰ TimelockController Configuration:`);
  console.log(`   Address:     ${timelockAddress}`);
  console.log(`   Delay:       ${TIMELOCK_DELAY} seconds`);
  console.log(`   Proposers:   [] (will be set to Governor)`);
  console.log(`   Executors:   [0x0] (open execution)`);
  console.log(`   Cancellers:  [${UNIVERSITY_WALLET}] (VETO power)`);
  console.log(`\n   Roles:`);
  console.log(`   - PROPOSER_ROLE:   ${PROPOSER_ROLE}`);
  console.log(`   - EXECUTOR_ROLE:   ${EXECUTOR_ROLE}`);
  console.log(`   - CANCELLER_ROLE:  ${CANCELLER_ROLE}`);
};

export default deployTimelockController;

deployTimelockController.tags = ["TimelockController"];
