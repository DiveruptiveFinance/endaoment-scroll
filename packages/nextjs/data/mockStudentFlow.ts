import { FundingClaim, Proposal, StudentDocument, StudentScore, StudentVote } from "~~/types/student-flow";

// Mock data for student flow

export const MOCK_DOCUMENTS: StudentDocument[] = [
  {
    id: "doc-1",
    type: "grade",
    title: "Academic Transcript - Fall 2024",
    description: "Official transcript with GPA 3.8",
    fileUrl: "/documents/transcript-fall2024.pdf",
    uploadedAt: new Date("2024-12-01"),
    status: "approved",
    score: 85,
  },
  {
    id: "doc-2",
    type: "paper",
    title: "AI Applications in Healthcare",
    description: "Published research paper",
    fileUrl: "/documents/ai-healthcare-paper.pdf",
    uploadedAt: new Date("2024-11-15"),
    status: "approved",
    score: 92,
  },
  {
    id: "doc-3",
    type: "work",
    title: "Conference Presentation - AI4Health 2024",
    description: "Presentation slides and video",
    fileUrl: "/documents/presentation-ai4health.pdf",
    uploadedAt: new Date("2024-10-20"),
    status: "approved",
    score: 88,
  },
];

export const MOCK_STUDENT_SCORE: StudentScore = {
  totalScore: 88,
  documentsCount: 3,
  averageDocumentScore: 88.3,
  lastUpdated: new Date("2024-12-15"),
  breakdown: {
    grades: 85,
    papers: 92,
    works: 88,
  },
};

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "prop-1",
    title: "Research Equipment for AI Lab",
    description: "Requesting funding for GPU workstations to support machine learning research",
    proposer: "0x1234567890123456789012345678901234567890",
    proposerName: "AI Research Lab",
    category: "Equipment",
    requestedAmount: 15000,
    currentVotes: 450,
    totalVotingPower: 1000,
    status: "active",
    createdAt: new Date("2024-12-01"),
    deadline: new Date("2025-01-15"),
  },
  {
    id: "prop-2",
    title: "Scholarship Program for Underrepresented Students",
    description: "Funding for 10 scholarships to support underrepresented students in STEM",
    proposer: "0x2345678901234567890123456789012345678901",
    proposerName: "Diversity Initiative",
    category: "Scholarship",
    requestedAmount: 50000,
    currentVotes: 320,
    totalVotingPower: 1000,
    status: "active",
    createdAt: new Date("2024-12-05"),
    deadline: new Date("2025-01-20"),
  },
  {
    id: "prop-3",
    title: "Conference Travel Grants",
    description: "Support for students to attend international conferences",
    proposer: "0x3456789012345678901234567890123456789012",
    proposerName: "Student Council",
    category: "Travel",
    requestedAmount: 20000,
    currentVotes: 180,
    totalVotingPower: 1000,
    status: "active",
    createdAt: new Date("2024-12-10"),
    deadline: new Date("2025-01-25"),
  },
];

export const MOCK_VOTES: StudentVote[] = [
  {
    proposalId: "prop-1",
    votingPower: 50,
    timestamp: new Date("2024-12-12"),
  },
  {
    proposalId: "prop-2",
    votingPower: 30,
    timestamp: new Date("2024-12-13"),
  },
];

export const MOCK_FUNDING_CLAIM: FundingClaim = {
  id: "claim-1",
  studentId: "1",
  amount: 1200,
  token: "USDC",
  status: "approved",
  requestedAt: new Date("2024-12-10"),
  claimedAt: new Date("2024-12-12"),
  txHash: "0xabc123...",
};

// Helper functions
export function getStudentDocuments(studentId: string): StudentDocument[] {
  return MOCK_DOCUMENTS;
}

export function getStudentScore(studentId: string): StudentScore {
  return MOCK_STUDENT_SCORE;
}

export function getAllProposals(): Proposal[] {
  return MOCK_PROPOSALS;
}

export function getStudentVotes(studentId: string): StudentVote[] {
  return MOCK_VOTES;
}

export function getFundingClaim(studentId: string): FundingClaim | null {
  return MOCK_FUNDING_CLAIM;
}
