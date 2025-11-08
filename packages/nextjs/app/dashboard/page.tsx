"use client";

import Link from "next/link";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldEventHistory, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function DashboardPage() {
  const { address } = useAccount();

  // Read user's vault shares and value
  const { data: userShares } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: userAssets } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "convertToAssets",
    args: [userShares || 0n],
  });

  const { data: userYield } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "getAccruedYield",
  });

  const { data: vaultName } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "vaultName",
  });

  const { data: totalShares } = useScaffoldReadContract({
    contractName: "EndaomentVault",
    functionName: "totalSupply",
  });

  // Read deposit events for transaction history
  const { data: depositEvents, isLoading: eventsLoading } = useScaffoldEventHistory({
    contractName: "EndaomentVault",
    eventName: "Deposit",
    fromBlock: 0n,
  });

  // Calculate user stats
  const formattedShares = userShares ? Number(formatUnits(userShares, 18)) : 0;
  const formattedAssets = userAssets ? Number(formatUnits(userAssets, 6)) : 0;
  const formattedYield = userYield ? Number(formatUnits(userYield, 6)) : 0;
  const votingPower =
    userShares && totalShares && Number(totalShares) > 0 ? (Number(userShares) / Number(totalShares)) * 100 : 0;

  const userStats = {
    totalDonated: formattedAssets,
    yieldGenerated: formattedYield,
    studentsSupported: 0, // TODO: Read from allocations
    lastEpochYield: formattedYield,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">My Dashboard</h1>

      {!address && (
        <div className="alert alert-warning mb-8">
          <span>Please connect your wallet to view your dashboard</span>
        </div>
      )}

      {address && formattedShares === 0 && (
        <div className="alert alert-info mb-8">
          <div>
            <p className="font-semibold">You haven&apos;t joined a vault yet!</p>
            <p className="text-sm">Deposit to a vault to start earning yield and supporting students.</p>
          </div>
          <div>
            <Link href="/">
              <button className="btn btn-sm btn-primary">Explore Vaults</button>
            </Link>
          </div>
        </div>
      )}

      {address && formattedShares > 0 && (
        <>
          {/* Vault Membership */}
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title">💼 Your Vault</h2>
              <div className="stats stats-vertical lg:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-title">Vault</div>
                  <div className="stat-value text-lg">{vaultName || "EndaomentVault"}</div>
                  <div className="stat-desc">Aave USDC Strategy</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Your Position</div>
                  <div className="stat-value text-primary">${formattedAssets.toFixed(2)}</div>
                  <div className="stat-desc">
                    {formattedShares.toFixed(2)} shares ({votingPower.toFixed(2)}%)
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">Yield Earned</div>
                  <div className="stat-value text-secondary">${formattedYield.toFixed(2)}</div>
                  <div className="stat-desc">From DeFi strategies</div>
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                <Link href="/allocate">
                  <button className="btn btn-primary btn-sm">Allocate Yield →</button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow mb-8 w-full">
        <div className="stat">
          <div className="stat-title">Total Donated</div>
          <div className="stat-value text-primary">${userStats.totalDonated}</div>
          <div className="stat-desc">Principal deposited to vault</div>
        </div>
        <div className="stat">
          <div className="stat-title">Yield Generated</div>
          <div className="stat-value text-secondary">${userStats.yieldGenerated}</div>
          <div className="stat-desc">From DeFi strategies</div>
        </div>
        <div className="stat">
          <div className="stat-title">Students Supported</div>
          <div className="stat-value">{userStats.studentsSupported}</div>
          <div className="stat-desc">Via your allocations</div>
        </div>
      </div>

      {/* Transaction History */}
      {address && depositEvents && depositEvents.length > 0 && (
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Block</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Shares</th>
                    <th>Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {depositEvents.map((event, idx) => {
                    const amount = Number(formatUnits(event.args.assets || 0n, 6));
                    const shares = Number(formatUnits(event.args.shares || 0n, 18));
                    return (
                      <tr key={`${event.transactionHash}-${idx}`}>
                        <td>{event.blockNumber?.toString()}</td>
                        <td>Deposit</td>
                        <td>${amount.toFixed(2)}</td>
                        <td>{shares.toFixed(2)}</td>
                        <td>
                          <a
                            href={`https://etherscan.io/tx/${event.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link link-primary text-xs"
                          >
                            {event.transactionHash.slice(0, 10)}...
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {address && (!depositEvents || depositEvents.length === 0) && !eventsLoading && formattedShares > 0 && (
        <div className="alert alert-info mb-8">
          <span>No transaction history found. Your deposits may be from a previous session.</span>
        </div>
      )}

      {/* CTAs */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/">
          <button className="btn btn-primary btn-block">Fund More Students</button>
        </Link>
        <Link href="/allocate">
          <button className="btn btn-secondary btn-block">Allocate Yield</button>
        </Link>
      </div>
    </div>
  );
}
