"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { StudentCard } from "~~/components/miniapp/StudentCard";
import { PLATFORM_STATS } from "~~/data/constants";
import { STUDENTS } from "~~/data/students";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      {/* Hero Section */}
      <div className="hero min-h-[40vh] bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">Endaoment</h1>
            <p className="text-xl mb-2">Transform donations into perpetual scholarships</p>
            <p className="text-lg opacity-80 mb-6">Your donation earns DeFi yield → funds students forever</p>

            {/* Platform stats */}
            <div className="stats stats-vertical lg:stats-horizontal shadow-xl">
              <div className="stat">
                <div className="stat-title">Total Donated</div>
                <div className="stat-value text-primary">${PLATFORM_STATS.totalDonated.toLocaleString()}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Yield Generated</div>
                <div className="stat-value text-secondary">${PLATFORM_STATS.totalYieldGenerated.toLocaleString()}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Students Supported</div>
                <div className="stat-value">{PLATFORM_STATS.studentsSupported}</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center mt-8">
              {connectedAddress ? (
                <>
                  <Link href="/start">
                    <button className="btn btn-primary btn-lg">Get Started →</button>
                  </Link>
                  <Link href="/dashboard">
                    <button className="btn btn-outline btn-lg">My Dashboard</button>
                  </Link>
                </>
              ) : (
                <button className="btn btn-primary btn-lg">Connect Wallet to Start</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vault Intro Banner */}
      <div className="alert alert-success mx-4 my-4">
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>
          <strong>🚀 New: Whale Vaults!</strong> Join yield-generating vaults created by major donors, pool your
          resources, and vote together on student funding.
        </span>
        <div>
          <Link href="/start">
            <button className="btn btn-sm btn-primary">Get Started</button>
          </Link>
        </div>
      </div>

      {/* Main Content: Student Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Fund a Student</h2>
            <p className="text-base-content/70 mt-2">
              Browse students from top LATAM universities and support their education
            </p>
          </div>

          {/* Filter/Sort (future enhancement) */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-outline btn-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <a>All Students</a>
              </li>
              <li>
                <a>PhD</a>
              </li>
              <li>
                <a>Masters</a>
              </li>
              <li>
                <a>Undergraduate</a>
              </li>
              <li className="divider"></li>
              <li>
                <a>Brazil</a>
              </li>
              <li>
                <a>Mexico</a>
              </li>
              <li>
                <a>Argentina</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {STUDENTS.map(student => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>

        {/* How it Works Section */}
        <div className="divider my-16"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">How Endaoment Works</h2>
          <p className="text-base-content/70">
            A new model for educational funding inspired by Octant&apos;s allocation mechanism
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="card-title">1. Join a Vault</h3>
              <p>Explore vaults created by whale donors. Deposit as little as $10 USDC to join and earn yield.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="card-title">2. Earn Yield</h3>
              <p>
                Your funds generate yield through DeFi strategies (Aave). Whales earn 10%, retail donors earn 15%,
                students get 75%.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-4">🗳️</div>
              <h3 className="card-title">3. Vote Together</h3>
              <p>Every 30 days, allocate your vault&apos;s yield to students. Pool your voting power with others.</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="card-title">4. Fund Students</h3>
              <p>Students receive funding for research and education. Track their progress and see your impact.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-2xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-3xl mb-4">Ready to make perpetual impact?</h2>
            <p className="mb-6">
              Join {PLATFORM_STATS.activeDonors} donors supporting the next generation of LATAM leaders
            </p>
            <div className="card-actions gap-4">
              {connectedAddress ? (
                <Link href="/start">
                  <button className="btn btn-neutral btn-lg">Get Started →</button>
                </Link>
              ) : (
                <button className="btn btn-neutral btn-lg">Connect Wallet to Start</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
