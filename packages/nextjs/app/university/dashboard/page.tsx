"use client";

import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { formatUSDCWithCommas } from "~~/utils/format";
import { getUniversityByWallet } from "~~/data/universities";

export default function UniversityDashboardPage() {
  const { address } = useAccount();

  // Get university by wallet address
  const university = address ? getUniversityByWallet(address) : null;

  // Read total donations from DonationTracker
  const { data: totalDonations } = useScaffoldReadContract({
    contractName: "DonationTracker",
    functionName: "getTotalDonations",
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Read total yield distributed
  const { data: totalYield } = useScaffoldReadContract({
    contractName: "DonationTracker",
    functionName: "getTotalYieldDistributed",
    args: address ? [address as `0x${string}`] : undefined,
  });

  // Read current USDC balance
  const { data: walletBalance } = useScaffoldReadContract({
    contractName: "MockUSDC",
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
  });

  if (!address) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">University Dashboard</h2>
            <p className="text-[16px] text-[#1A1A1A]/70">Please connect your wallet to view your university stats</p>
          </div>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">University Not Registered</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
              This wallet is not registered as a university. Please register first.
            </p>
            <a href="/university/register" className="text-[#0052FF] hover:underline">
              Go to Registration
            </a>
          </div>
        </div>
      </div>
    );
  }

  const capitalRaised = totalDonations ? Number(formatUSDCWithCommas(totalDonations).replace(/,/g, "")) : 0;
  const yieldReceived = totalYield ? Number(formatUSDCWithCommas(totalYield).replace(/,/g, "")) : 0;
  const currentBalance = walletBalance ? Number(formatUSDCWithCommas(walletBalance).replace(/,/g, "")) : 0;
  const capitalProgress = (capitalRaised / university.capitalGoal) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-2">{university.shortName} Dashboard</h1>
          <p className="text-[16px] text-[#1A1A1A]/70">{university.name}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Capital Raised */}
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Capital Recaudado</div>
            <div className="text-[28px] font-bold text-[#0052FF] mb-2">
              ${formatUSDCWithCommas(totalDonations || 0n)}
            </div>
            <div className="text-[12px] text-[#1A1A1A]/60">
              Meta: ${university.capitalGoal.toLocaleString()}
            </div>
            <div className="w-full bg-[#F2F4F7] rounded-full h-2 mt-3">
              <div
                className="h-2 rounded-full bg-[#0052FF] transition-all duration-500"
                style={{ width: `${Math.min(capitalProgress, 100)}%` }}
              />
            </div>
            <div className="text-[12px] text-[#1A1A1A]/60 mt-1">{capitalProgress.toFixed(1)}% de la meta</div>
          </div>

          {/* Yield Received */}
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Yield Recibido</div>
            <div className="text-[28px] font-bold text-[#5CE27F]">
              ${formatUSDCWithCommas(totalYield || 0n)}
            </div>
            <div className="text-[12px] text-[#1A1A1A]/60 mt-2">
              Fondos disponibles para operaciones
            </div>
          </div>

          {/* Current Balance */}
          <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
            <div className="text-[14px] text-[#1A1A1A]/70 mb-2">Balance Actual</div>
            <div className="text-[28px] font-bold text-[#0A0F1C]">
              ${formatUSDCWithCommas(walletBalance || 0n)}
            </div>
            <div className="text-[12px] text-[#1A1A1A]/60 mt-2">
              USDC en tu wallet
            </div>
          </div>
        </div>

        {/* Distribution Info */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
          <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-4">Distribución de Yield</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F8FAFC] rounded-[6px] p-4">
              <div className="text-[16px] font-semibold text-[#0A0F1C] mb-2">70% Operaciones</div>
              <div className="text-[14px] text-[#1A1A1A]/70">
                ${((yieldReceived * 0.7).toFixed(2))} USDC para gastos operativos
              </div>
            </div>
            <div className="bg-[#F8FAFC] rounded-[6px] p-4">
              <div className="text-[16px] font-semibold text-[#0A0F1C] mb-2">30% Estudiantes</div>
              <div className="text-[14px] text-[#1A1A1A]/70">
                ${((yieldReceived * 0.3).toFixed(2))} USDC distribuido a estudiantes
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] mt-6">
          <h2 className="text-[20px] font-bold text-[#0A0F1C] mb-4">Información de Wallet</h2>
          <div className="text-[14px] text-[#1A1A1A]/70">
            <p className="mb-2">
              <strong>Address:</strong> <code className="bg-[#F8FAFC] px-2 py-1 rounded">{address}</code>
            </p>
            <p className="text-[12px] text-[#1A1A1A]/60 mt-4">
              Esta wallet recibe el 50% del yield generado por las donaciones a {university.shortName}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

