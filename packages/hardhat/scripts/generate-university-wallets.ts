import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Script to generate wallets for universities
 * WARNING: These wallets contain private keys. DO NOT commit to git!
 */
async function main() {
  const universities = [
    { name: "UNAM", id: "unam" },
    { name: "IBERO", id: "ibero" },
    { name: "BUAP", id: "buap" },
    { name: "UDLAP", id: "udlap" },
    { name: "ANAHUAC", id: "anahuac" },
    { name: "TEC", id: "tec" },
  ];

  const wallets: Array<{
    name: string;
    id: string;
    address: string;
    privateKey: string;
  }> = [];

  console.log("🏛️  Generating University Wallets...\n");

  for (const uni of universities) {
    const wallet = ethers.Wallet.createRandom();
    wallets.push({
      name: uni.name,
      id: uni.id,
      address: wallet.address,
      privateKey: wallet.privateKey,
    });

    console.log(`✅ ${uni.name}:`);
    console.log(`   Address:    ${wallet.address}`);
    console.log(`   PrivateKey: ${wallet.privateKey}\n`);
  }

  // Guardar en archivo JSON (NO COMMITEAR A GIT)
  const outputDir = path.join(__dirname, "..");
  const outputPath = path.join(outputDir, ".university-wallets.json");
  fs.writeFileSync(outputPath, JSON.stringify(wallets, null, 2));
  console.log(`\n💾 Wallets saved to: ${outputPath}`);
  console.log("⚠️  WARNING: This file contains private keys. DO NOT commit to git!");

  // También crear archivo de ejemplo sin private keys (para commitear)
  const publicWallets = wallets.map(({ name, id, address }) => ({
    name,
    id,
    address,
  }));
  const publicPath = path.join(outputDir, "university-wallets-public.json");
  fs.writeFileSync(publicPath, JSON.stringify(publicWallets, null, 2));
  console.log(`📋 Public addresses saved to: ${publicPath}`);
  console.log("✅ This file is safe to commit (no private keys)");

  // Crear archivo .gitignore si no existe
  const gitignorePath = path.join(outputDir, ".gitignore");
  let gitignoreContent = "";
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
  }
  if (!gitignoreContent.includes(".university-wallets.json")) {
    gitignoreContent += "\n# University wallets (contains private keys)\n.university-wallets.json\n";
    fs.writeFileSync(gitignorePath, gitignoreContent);
    console.log("✅ Added .university-wallets.json to .gitignore");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
