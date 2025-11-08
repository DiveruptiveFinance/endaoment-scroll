"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, CheckCircle2, Clock, TrendingUp, Vote } from "lucide-react";
import { useAccount } from "wagmi";
import { PrimaryButton } from "~~/components/ui/PrimaryButton";
import { getAllProposals, getStudentScore, getStudentVotes } from "~~/data/mockStudentFlow";
import { Proposal, StudentVote } from "~~/types/student-flow";

export default function ProposalsPage() {
  const { address } = useAccount();
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [votingPower, setVotingPower] = useState<number>(50);

  const proposals = address ? getAllProposals() : [];
  const studentVotes = address ? getStudentVotes("1") : [];
  const studentScore = address ? getStudentScore("1") : null;

  if (!address) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="bg-white rounded-[6px] p-8 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">Connect Your Wallet</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
              Please connect your wallet to view and vote on proposals
            </p>
            <PrimaryButton size="lg">Connect Wallet</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  if (!studentScore || studentScore.totalScore === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Link
            href="/student/dashboard"
            className="inline-block mb-6 text-[#0052FF] hover:text-[#0040CC] transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <div className="bg-white rounded-[6px] p-12 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <Award className="w-16 h-16 text-[#1A1A1A]/30 mx-auto mb-4" strokeWidth={2} />
            <h2 className="text-[28px] font-bold text-[#0A0F1C] mb-4">No Voting Power Yet</h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
              Upload documents to earn voting power and participate in proposals
            </p>
            <Link href="/student/documents/upload">
              <PrimaryButton size="lg">Upload Documents</PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasVoted = (proposalId: string) => {
    return studentVotes.some(vote => vote.proposalId === proposalId);
  };

  const getVoteForProposal = (proposalId: string): StudentVote | undefined => {
    return studentVotes.find(vote => vote.proposalId === proposalId);
  };

  const handleVote = (proposalId: string) => {
    // Mock: In real app, this would call the contract
    console.log(`Voting ${votingPower} power for proposal ${proposalId}`);
    setSelectedProposal(null);
    // Refresh votes (in real app, this would update from contract)
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Link
          href="/student/dashboard"
          className="inline-block mb-6 text-[#0052FF] hover:text-[#0040CC] transition-colors"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[36px] font-bold text-[#0A0F1C] mb-2">Proposals</h1>
            <p className="text-[16px] text-[#1A1A1A]/70">
              Use your voting power to support proposals that matter to you
            </p>
          </div>
          {studentScore && (
            <div className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
              <div className="text-[32px] font-bold text-[#0052FF] mb-1">{studentScore.totalScore}</div>
              <div className="text-[14px] text-[#1A1A1A]/70">Voting Power</div>
            </div>
          )}
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
          {proposals.map(proposal => {
            const voted = hasVoted(proposal.id);
            const vote = getVoteForProposal(proposal.id);
            const votePercentage =
              proposal.totalVotingPower > 0 ? (proposal.currentVotes / proposal.totalVotingPower) * 100 : 0;

            return (
              <div
                key={proposal.id}
                className="bg-white rounded-[6px] p-6 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] hover:border-[#0052FF] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-[24px] font-bold text-[#0A0F1C]">{proposal.title}</h2>
                      {voted && <CheckCircle2 className="w-5 h-5 text-[#5CE27F]" strokeWidth={2} />}
                    </div>
                    <p className="text-[16px] text-[#1A1A1A]/70 mb-4">{proposal.description}</p>
                    <div className="flex items-center gap-4 text-[14px] text-[#1A1A1A]/60 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#0052FF] font-semibold">
                        {proposal.category}
                      </span>
                      <span>•</span>
                      <span>${proposal.requestedAmount.toLocaleString()}</span>
                      {proposal.deadline && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" strokeWidth={2} />
                            <span>Deadline: {proposal.deadline.toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Voting Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[14px] font-semibold text-[#0A0F1C]">Voting Progress</span>
                    <span className="text-[16px] font-bold text-[#0052FF]">
                      {proposal.currentVotes} / {proposal.totalVotingPower}
                    </span>
                  </div>
                  <div className="w-full bg-[#F2F4F7] rounded-full h-3">
                    <div
                      className="h-3 rounded-full bg-[#0052FF] transition-all duration-500"
                      style={{ width: `${Math.min(votePercentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-[13px] text-[#1A1A1A]/70 mt-1">
                    {votePercentage.toFixed(1)}% of total voting power
                  </div>
                </div>

                {/* Vote Section */}
                {voted ? (
                  <div className="bg-[#5CE27F]/10 rounded-[6px] p-4 border border-[#5CE27F]/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#5CE27F]" strokeWidth={2} />
                        <span className="text-[16px] font-semibold text-[#0A0F1C]">
                          You voted {vote?.votingPower} voting power
                        </span>
                      </div>
                      <span className="text-[14px] text-[#1A1A1A]/70">{vote?.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    {selectedProposal === proposal.id ? (
                      <div className="flex-1 flex items-center gap-4">
                        <div className="flex-1">
                          <label className="block text-[14px] font-semibold text-[#0A0F1C] mb-2">
                            Voting Power to Use
                          </label>
                          <input
                            type="range"
                            min="1"
                            max={studentScore?.totalScore || 100}
                            value={votingPower}
                            onChange={e => setVotingPower(Number(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-[13px] text-[#1A1A1A]/70 mt-1">
                            <span>1</span>
                            <span className="font-semibold text-[#0052FF]">{votingPower}</span>
                            <span>{studentScore?.totalScore || 100}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <PrimaryButton size="md" onClick={() => handleVote(proposal.id)}>
                            Confirm Vote
                          </PrimaryButton>
                          <PrimaryButton variant="secondary" size="md" onClick={() => setSelectedProposal(null)}>
                            Cancel
                          </PrimaryButton>
                        </div>
                      </div>
                    ) : (
                      <PrimaryButton
                        size="md"
                        onClick={() => setSelectedProposal(proposal.id)}
                        className="flex items-center gap-2"
                      >
                        <Vote className="w-4 h-4" strokeWidth={2} />
                        Vote on This Proposal
                      </PrimaryButton>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {proposals.length === 0 && (
          <div className="bg-white rounded-[6px] p-12 border border-[#F2F4F7] shadow-[0_2px_6px_rgba(0,0,0,0.05)] text-center">
            <TrendingUp className="w-16 h-16 text-[#1A1A1A]/30 mx-auto mb-4" strokeWidth={2} />
            <h3 className="text-[24px] font-bold text-[#0A0F1C] mb-2">No Proposals Available</h3>
            <p className="text-[16px] text-[#1A1A1A]/70">Check back later for new proposals to vote on</p>
          </div>
        )}
      </div>
    </div>
  );
}
