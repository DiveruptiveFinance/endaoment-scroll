import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import * as fs from "fs";
import * as path from "path";

/**
 * Deploys DonationTracker and registers all universities
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployDonationTracker: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("📊 Deploying DonationTracker...");

  await deploy("DonationTracker", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  const tracker = await hre.ethers.getContract<Contract>("DonationTracker", deployer);
  const trackerAddress = await tracker.getAddress();

  console.log("📊 DonationTracker deployed to:", trackerAddress);

  // Load university wallets
  const walletsPath = path.join(__dirname, "../.university-wallets.json");
  if (!fs.existsSync(walletsPath)) {
    console.log("⚠️  Warning: .university-wallets.json not found.");
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

  console.log("\n📊 Registering universities in DonationTracker...");

  for (const uni of universities) {
    const wallet = wallets.find((w: any) => w.id === uni.id);
    if (!wallet) continue;

    const tx = await tracker.registerUniversity(wallet.address, uni.name);
    await tx.wait();
    console.log(`   ✅ ${uni.name} registered`);
  }

  console.log(`\n📊 DonationTracker Configuration:`);
  console.log(`   Address: ${trackerAddress}`);
  console.log(`   Universities registered: ${universities.length}`);
};

export default deployDonationTracker;

deployDonationTracker.tags = ["DonationTracker"];
deployDonationTracker.dependencies = ["UniversityRegistry"];

