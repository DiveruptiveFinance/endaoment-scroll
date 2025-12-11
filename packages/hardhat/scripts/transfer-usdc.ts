import { ethers } from "hardhat";

/**
 * Script para transferir 10,000,000 USDC a una billetera específica
 * 
 * Uso:
 * npx hardhat run scripts/transfer-usdc.ts --network scrollSepolia
 * 
 * O con una dirección específica:
 * TARGET_ADDRESS=0x2fa252f1b0b095e1ed6ba6dfdc40abe04d42b5d1 npx hardhat run scripts/transfer-usdc.ts --network scrollSepolia
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🔵 Transferring USDC with account:", deployer.address);

  // Dirección destino (puede ser cambiada con variable de entorno)
  const TARGET_ADDRESS = process.env.TARGET_ADDRESS || "0x2fa252f1b0b095e1ed6ba6dfdc40abe04d42b5d1";
  
  // Cantidad: 10,000,000 USDC (con 6 decimales)
  const AMOUNT = ethers.parseUnits("10000000", 6); // 10,000,000 * 10^6

  // Dirección del contrato MockUSDC en Scroll Sepolia
  const MOCK_USDC_ADDRESS = "0xaE742c7414937A43177bD1bF9cDBFCaF1a6E2Ccb";

  // Obtener contrato MockUSDC
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.attach(MOCK_USDC_ADDRESS);

  // Verificar balance del deployer
  const deployerBalance = await mockUSDC.balanceOf(deployer.address);
  console.log(`💰 Deployer balance: ${ethers.formatUnits(deployerBalance, 6)} USDC`);

  // Verificar si tiene suficiente balance
  if (deployerBalance < AMOUNT) {
    console.log("⚠️  Insufficient balance. Minting required amount...");
    
    // Verificar si el deployer es owner o tiene permisos de mint
    const owner = await mockUSDC.owner();
    const isMinter = await mockUSDC.minters(deployer.address);
    
    if (owner.toLowerCase() === deployer.address.toLowerCase() || isMinter) {
      const amountToMint = AMOUNT - deployerBalance;
      console.log(`🪙 Minting ${ethers.formatUnits(amountToMint, 6)} USDC...`);
      const mintTx = await mockUSDC.mint(deployer.address, amountToMint);
      await mintTx.wait();
      console.log("✅ Minted successfully");
    } else {
      console.error("❌ Error: Deployer is not owner or minter. Cannot mint.");
      console.log("   Owner:", owner);
      console.log("   Deployer:", deployer.address);
      process.exit(1);
    }
  }

  // Verificar balance del destino antes de transferir
  const targetBalanceBefore = await mockUSDC.balanceOf(TARGET_ADDRESS);
  console.log(`\n📊 Target address: ${TARGET_ADDRESS}`);
  console.log(`   Balance before: ${ethers.formatUnits(targetBalanceBefore, 6)} USDC`);

  // Transferir USDC
  console.log(`\n💸 Transferring ${ethers.formatUnits(AMOUNT, 6)} USDC...`);
  const transferTx = await mockUSDC.transfer(TARGET_ADDRESS, AMOUNT);
  console.log(`   Transaction hash: ${transferTx.hash}`);
  
  console.log("⏳ Waiting for confirmation...");
  const receipt = await transferTx.wait();
  console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);

  // Verificar balance después de transferir
  const targetBalanceAfter = await mockUSDC.balanceOf(TARGET_ADDRESS);
  console.log(`\n📊 Final balances:`);
  console.log(`   Target balance: ${ethers.formatUnits(targetBalanceAfter, 6)} USDC`);
  console.log(`   Deployer balance: ${ethers.formatUnits(await mockUSDC.balanceOf(deployer.address), 6)} USDC`);

  console.log("\n✅ Transfer completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

