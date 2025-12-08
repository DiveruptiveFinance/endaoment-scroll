import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import * as fs from "fs";
import * as path from "path";

/**
 * Deploys UniversityRegistry and registers all universities with their wallets
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployUniversityRegistry: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🏛️  Deploying UniversityRegistry...");

  await deploy("UniversityRegistry", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const registry = await hre.ethers.getContract<Contract>("UniversityRegistry", deployer);
  const registryAddress = await registry.getAddress();

  console.log("🏛️  UniversityRegistry deployed to:", registryAddress);

  // Load university wallets from generated file
  const walletsPath = path.join(__dirname, "../.university-wallets.json");
  if (!fs.existsSync(walletsPath)) {
    console.log("⚠️  Warning: .university-wallets.json not found. Run generate-university-wallets.ts first.");
    return;
  }

  const wallets = JSON.parse(fs.readFileSync(walletsPath, "utf-8"));

  const universities = [
    { id: "unam", name: "Universidad Nacional Autónoma de México" },
    { id: "ibero", name: "Universidad Iberoamericana" },
    { id: "buap", name: "Benemérita Universidad Autónoma de Puebla" },
    { id: "udlap", name: "Universidad de las Américas Puebla" },
    { id: "anahuac", name: "Universidad Anáhuac" },
    { id: "tec", name: "Tecnológico de Monterrey" },
  ];

  console.log("\n🏛️  Registering universities...");

  for (const uni of universities) {
    const wallet = wallets.find((w: any) => w.id === uni.id);
    if (!wallet) {
      console.log(`⚠️  Warning: Wallet not found for ${uni.name}`);
      continue;
    }

    console.log(`   Registering ${uni.name}...`);
    const tx = await registry.registerUniversity(uni.id, uni.name, wallet.address);
    await tx.wait();

    // Lock wallet for MVP
    console.log(`   Locking wallet for MVP...`);
    const lockTx = await registry.lockUniversityWallet(uni.id);
    await lockTx.wait();

    console.log(`   ✅ ${uni.name} registered and locked`);
    console.log(`      ID: ${uni.id}`);
    console.log(`      Wallet: ${wallet.address}\n`);
  }

  console.log(`\n🏛️  UniversityRegistry Configuration:`);
  console.log(`   Address: ${registryAddress}`);
  console.log(`   Universities registered: ${universities.length}`);
  console.log(`   All wallets locked for MVP`);
};

export default deployUniversityRegistry;

deployUniversityRegistry.tags = ["UniversityRegistry"];

