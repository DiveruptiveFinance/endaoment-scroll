"use client";

import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Path</h1>
        <p className="text-lg text-base-content/70">Select how you want to participate in Endaoment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Whale Donor */}
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border-2 border-primary">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">🐋</div>
            <h2 className="card-title text-2xl mb-2">Whale Donor</h2>
            <p className="text-base-content/70 mb-4">
              Deposit $1,000+ USDC and create your own vault with a DeFi strategy
            </p>

            <div className="divider">Benefits</div>

            <ul className="text-sm text-left space-y-2 mb-6">
              <li>✅ Create custom vaults</li>
              <li>✅ Choose yield strategies</li>
              <li>✅ Earn 10% of yield</li>
              <li>✅ Lead retail donors</li>
              <li>✅ Impact NFT rewards</li>
            </ul>

            <button className="btn btn-primary btn-block" onClick={() => router.push("/vault/create")}>
              Create Vault →
            </button>
          </div>
        </div>

        {/* Retail Donor */}
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border-2 border-secondary">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="card-title text-2xl mb-2">Retail Donor</h2>
            <p className="text-base-content/70 mb-4">Join existing vaults with as little as $10 USDC</p>

            <div className="divider">Benefits</div>

            <ul className="text-sm text-left space-y-2 mb-6">
              <li>✅ Low barrier to entry ($10)</li>
              <li>✅ Join proven strategies</li>
              <li>✅ Earn 15% of yield</li>
              <li>✅ Pool voting power</li>
              <li>✅ Support students together</li>
            </ul>

            <button className="btn btn-secondary btn-block" onClick={() => router.push("/vaults")}>
              Explore Vaults →
            </button>
          </div>
        </div>

        {/* Student */}
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow border-2 border-accent">
          <div className="card-body items-center text-center">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="card-title text-2xl mb-2">Student</h2>
            <p className="text-base-content/70 mb-4">Create your profile and receive funding from donors</p>

            <div className="divider">Benefits</div>

            <ul className="text-sm text-left space-y-2 mb-6">
              <li>✅ Receive 75% of yield</li>
              <li>✅ No repayment required</li>
              <li>✅ Showcase your research</li>
              <li>✅ Build your profile</li>
              <li>✅ Connect with donors</li>
            </ul>

            <button className="btn btn-accent btn-block" onClick={() => router.push("/")}>
              Browse Students →
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="alert alert-info mt-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 className="font-bold">How Yield Distribution Works</h3>
          <div className="text-sm">
            All deposits generate yield through DeFi strategies (Aave). The yield is split: 10% to whale donors, 15% to
            retail donors, and 75% to students based on community voting.
          </div>
        </div>
      </div>
    </div>
  );
}
