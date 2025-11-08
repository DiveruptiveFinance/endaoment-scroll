import { Student } from "../types/student";

// Seed data: Student beneficiaries for MVP demo
// These represent real use cases from LATAM universities based on your research docs

export const STUDENTS: Student[] = [
  {
    id: "1",
    name: "Maria Silva",
    university: "Universidade de São Paulo (USP)",
    universityLogo: "/universities/usp.jpg",
    field: "Computer Science PhD",
    country: "Brazil",
    bio: "Researching AI applications for healthcare diagnostics in underserved communities. My work focuses on developing low-cost ML models that can run on mobile devices for remote areas.",
    fundingGoal: "$5,000/year",
    fundingGoalUsd: 5000,
    currentFunding: 1200,
    walletAddress: "0x1234567890123456789012345678901234567890",
    impactMetrics: [
      {
        type: "publication",
        title: "AI-Powered Diagnosis for Rural Healthcare",
        description: "Published in Brazilian Journal of Medical AI",
        date: "2024-09",
        url: "https://example.com/paper1",
      },
      {
        type: "presentation",
        title: "Conference presentation at AI4Health 2024",
        date: "2024-10",
      },
      {
        type: "equipment",
        title: "GPU workstation for model training",
        description: "Enabled local training instead of cloud costs",
      },
    ],
    avatarUrl: "/avatars/maria.jpg",
    category: "phd",
    tags: ["AI", "Healthcare", "Machine Learning"],
    isVerified: true,
  },
  {
    id: "2",
    name: "João Ferreira",
    university: "Universidade Federal do Rio de Janeiro (UFRJ)",
    universityLogo: "/universities/ufrj.png",
    field: "Mechanical Engineering Masters",
    country: "Brazil",
    bio: "Developing sustainable energy solutions for favelas. My thesis focuses on low-cost solar installations adapted to informal housing structures.",
    fundingGoal: "$3,500/year",
    fundingGoalUsd: 3500,
    currentFunding: 800,
    walletAddress: "0x2345678901234567890123456789012345678901",
    impactMetrics: [
      {
        type: "research",
        title: "Pilot solar installation in Rocinha",
        description: "Providing power to 5 households",
      },
      {
        type: "course",
        title: "Completed Advanced Photovoltaics course",
        date: "2024-08",
      },
    ],
    avatarUrl: "/avatars/joao.jpg",
    category: "masters",
    tags: ["Renewable Energy", "Social Impact", "Engineering"],
    isVerified: true,
  },
  {
    id: "3",
    name: "Ana Rodríguez",
    university: "Universidad Nacional Autónoma de México (UNAM)",
    universityLogo: "/universities/unam.jpg",
    field: "Biology PhD",
    country: "Mexico",
    bio: "Studying biodiversity conservation in Mexican forests. My research documents endangered species and develops community-based conservation strategies.",
    fundingGoal: "$4,200/year",
    fundingGoalUsd: 4200,
    currentFunding: 2100,
    walletAddress: "0x3456789012345678901234567890123456789012",
    impactMetrics: [
      {
        type: "research",
        title: "Cataloged 47 new plant species in Chiapas",
        date: "2024-07",
      },
      {
        type: "publication",
        title: "Community Conservation in Indigenous Territories",
        description: "Published in Latin American Ecology Journal",
        date: "2024-11",
      },
      {
        type: "other",
        title: "Trained 15 local guides in biodiversity monitoring",
      },
    ],
    avatarUrl: "/avatars/ana.jpg",
    category: "phd",
    tags: ["Ecology", "Conservation", "Indigenous Knowledge"],
    isVerified: true,
  },
  {
    id: "4",
    name: "Carlos Mendoza",
    university: "Tecnológico de Monterrey",
    universityLogo: "/universities/tec.png",
    field: "Data Science Undergraduate",
    country: "Mexico",
    bio: "Building open-source tools for education access. As a first-generation college student, I'm creating platforms to help students from low-income backgrounds navigate university applications.",
    fundingGoal: "$2,800/year",
    fundingGoalUsd: 2800,
    currentFunding: 1500,
    walletAddress: "0x4567890123456789012345678901234567890123",
    impactMetrics: [
      {
        type: "other",
        title: "Developed scholarship matching platform",
        description: "Helped 200+ students find funding opportunities",
      },
      {
        type: "course",
        title: "Full-stack development bootcamp",
        date: "2024-06",
      },
    ],
    avatarUrl: "/avatars/carlos.jpg",
    category: "undergraduate",
    tags: ["Education Access", "Open Source", "Web Development"],
    isVerified: true,
  },
  {
    id: "5",
    name: "Lucia Santos",
    university: "Pontifícia Universidade Católica do Rio de Janeiro (PUC-Rio)",
    universityLogo: "/universities/puc-rio.png",
    field: "Economics Masters",
    country: "Brazil",
    bio: "Researching microfinance and economic empowerment in Brazilian communities. My work combines economic theory with on-the-ground fieldwork in Rio's favelas.",
    fundingGoal: "$3,000/year",
    fundingGoalUsd: 3000,
    currentFunding: 450,
    walletAddress: "0x5678901234567890123456789012345678901234",
    impactMetrics: [
      {
        type: "research",
        title: "Field study with 50 micro-entrepreneurs",
        description: "Documenting impact of community lending circles",
      },
      {
        type: "presentation",
        title: "Presented at Brazilian Economic Forum 2024",
        date: "2024-09",
      },
    ],
    avatarUrl: "/avatars/lucia.jpg",
    category: "masters",
    tags: ["Microfinance", "Economic Development", "Social Research"],
    isVerified: true,
  },
  {
    id: "6",
    name: "Diego Torres",
    university: "Universidad de Buenos Aires (UBA)",
    universityLogo: "/universities/uba.png",
    field: "Physics PhD",
    country: "Argentina",
    bio: "Researching quantum computing applications for cryptography. My goal is to make Argentina a hub for quantum research in Latin America.",
    fundingGoal: "$6,000/year",
    fundingGoalUsd: 6000,
    currentFunding: 0,
    walletAddress: "0x6789012345678901234567890123456789012345",
    impactMetrics: [
      {
        type: "publication",
        title: "Quantum Key Distribution in Noisy Environments",
        description: "Accepted to Physical Review Letters",
        date: "2024-12",
      },
      {
        type: "course",
        title: "Advanced Quantum Information Theory",
        date: "2024-05",
      },
    ],
    avatarUrl: "/avatars/diego.jpg",
    category: "phd",
    tags: ["Quantum Computing", "Cryptography", "Physics"],
    isVerified: true,
  },
  {
    id: "7",
    name: "Isabella Vargas",
    university: "Universidad de los Andes",
    universityLogo: "/universities/uniandes.png",
    field: "Social Psychology Masters",
    country: "Colombia",
    bio: "Studying the psychological impact of displacement and migration in Colombia. My research aims to inform trauma-informed support programs for displaced communities.",
    fundingGoal: "$3,200/year",
    fundingGoalUsd: 3200,
    currentFunding: 900,
    walletAddress: "0x7890123456789012345678901234567890123456",
    impactMetrics: [
      {
        type: "research",
        title: "Interviewed 80 displaced families",
        description: "Building comprehensive trauma assessment framework",
      },
      {
        type: "other",
        title: "Training workshops for 30 social workers",
      },
    ],
    avatarUrl: "/avatars/isabella.jpg",
    category: "masters",
    tags: ["Psychology", "Migration", "Trauma", "Social Work"],
    isVerified: true,
  },
  {
    id: "8",
    name: "Miguel Ángel",
    university: "Instituto Politécnico Nacional (IPN)",
    universityLogo: "/universities/ipn.png",
    field: "Robotics Engineering Undergraduate",
    country: "Mexico",
    bio: "Building affordable assistive robotics for people with disabilities. I'm creating low-cost robotic arms using open-source hardware and 3D printing.",
    fundingGoal: "$2,500/year",
    fundingGoalUsd: 2500,
    currentFunding: 1100,
    walletAddress: "0x8901234567890123456789012345678901234567",
    impactMetrics: [
      {
        type: "other",
        title: "Built 3 prototype robotic arms",
        description: "Total cost under $200 per unit",
      },
      {
        type: "presentation",
        title: "Won 2nd place at National Robotics Competition",
        date: "2024-10",
      },
    ],
    avatarUrl: "/avatars/miguel.jpg",
    category: "undergraduate",
    tags: ["Robotics", "Accessibility", "3D Printing", "Open Hardware"],
    isVerified: true,
  },
];

// Helper functions for frontend
export function getStudentById(id: string): Student | undefined {
  return STUDENTS.find(s => s.id === id);
}

export function getStudentsByCategory(category: string): Student[] {
  return STUDENTS.filter(s => s.category === category);
}

export function getStudentsByCountry(country: string): Student[] {
  return STUDENTS.filter(s => s.country === country);
}

export function calculateTotalFundingNeeded(): number {
  return STUDENTS.reduce((sum, s) => sum + s.fundingGoalUsd, 0);
}

export function calculateTotalCurrentFunding(): number {
  return STUDENTS.reduce((sum, s) => sum + s.currentFunding, 0);
}

export function getFundingProgress(student: Student): number {
  return Math.min((student.currentFunding / student.fundingGoalUsd) * 100, 100);
}
