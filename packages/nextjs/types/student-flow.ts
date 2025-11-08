// Student Flow Types

export interface StudentDocument {
  id: string;
  type: "grade" | "paper" | "work" | "certificate" | "other";
  title: string;
  description?: string;
  fileUrl: string;
  uploadedAt: Date;
  status: "pending" | "reviewed" | "approved" | "rejected";
  score?: number; // Score assigned after review (0-100)
}

export interface StudentScore {
  totalScore: number; // Total voting power score (0-100)
  documentsCount: number;
  averageDocumentScore: number;
  lastUpdated: Date;
  breakdown: {
    grades: number; // Average score from grade documents
    papers: number; // Average score from papers
    works: number; // Average score from works
  };
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string; // Student or organization address
  proposerName?: string;
  category: string;
  requestedAmount: number;
  currentVotes: number;
  totalVotingPower: number;
  status: "active" | "approved" | "rejected" | "completed";
  createdAt: Date;
  deadline?: Date;
}

export interface StudentVote {
  proposalId: string;
  votingPower: number; // Amount of voting power used
  timestamp: Date;
}

export interface FundingClaim {
  id: string;
  studentId: string;
  amount: number;
  token: string;
  status: "pending" | "approved" | "claimed" | "rejected";
  requestedAt: Date;
  claimedAt?: Date;
  txHash?: string;
}
