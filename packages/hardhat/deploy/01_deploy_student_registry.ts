import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys StudentRegistry contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployStudentRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("StudentRegistry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const registry = await hre.ethers.getContract<Contract>("StudentRegistry", deployer);
  console.log("👩‍🎓 StudentRegistry deployed to:", await registry.getAddress());

  // Add test students
  console.log("📝 Adding test students...");

  const students = [
    {
      address: "0x1111111111111111111111111111111111111111",
      name: "Alice Chen",
      university: "MIT",
      research: "Artificial Intelligence & Robotics",
    },
    {
      address: "0x2222222222222222222222222222222222222222",
      name: "Bob Martinez",
      university: "Stanford University",
      research: "Climate Science & Sustainability",
    },
    {
      address: "0x3333333333333333333333333333333333333333",
      name: "Carol Johnson",
      university: "Harvard University",
      research: "Public Health & Epidemiology",
    },
    {
      address: "0x4444444444444444444444444444444444444444",
      name: "David Kim",
      university: "UC Berkeley",
      research: "Renewable Energy Systems",
    },
    {
      address: "0x5555555555555555555555555555555555555555",
      name: "Emma Thompson",
      university: "Oxford University",
      research: "Neuroscience & Brain Health",
    },
    {
      address: "0x6666666666666666666666666666666666666666",
      name: "Frank Rodriguez",
      university: "CalTech",
      research: "Quantum Computing",
    },
    {
      address: "0x7777777777777777777777777777777777777777",
      name: "Grace Liu",
      university: "Princeton University",
      research: "Social Justice & Education",
    },
    {
      address: "0x8888888888888888888888888888888888888888",
      name: "Henry Okonkwo",
      university: "Cambridge University",
      research: "Biotechnology & Gene Therapy",
    },
  ];

  for (const student of students) {
    try {
      const tx = await registry.addStudent(student.address, student.name, student.university, student.research);
      await tx.wait();
      console.log(`  ✅ Added: ${student.name} (${student.university})`);
    } catch (error: any) {
      if (error.message?.includes("already registered") || error.reason?.includes("already registered")) {
        console.log(`  ⏭️  Skipped: ${student.name} (already registered)`);
      } else {
        console.log(`  ⚠️  Failed to add ${student.name}: ${error.message || error}`);
      }
    }
  }

  console.log(`\n🎓 Total students registered: ${students.length}`);
};

export default deployStudentRegistry;

deployStudentRegistry.tags = ["StudentRegistry"];
deployStudentRegistry.dependencies = ["MockUSDC"];
