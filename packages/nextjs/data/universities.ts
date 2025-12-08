/**
 * University data for the platform
 * Matches the wallets generated in packages/hardhat/.university-wallets.json
 */

export interface University {
  id: string;
  name: string;
  shortName: string;
  wallet: string;
  logo: string;
  description: string;
  capitalRaised: number; // Will be read from contract
  yieldGenerated: number; // Will be read from contract
  capitalGoal: number;
  isActive: boolean;
}

export const UNIVERSITIES: University[] = [
  {
    id: "unam",
    name: "Universidad Nacional Autónoma de México",
    shortName: "UNAM",
    wallet: "0x791DC44d843870dEE8832bF9801F0DCbdb1D0618",
    logo: "/universities/unam.png",
    description: "La máxima casa de estudios de México",
    capitalRaised: 0,
    yieldGenerated: 0,
    capitalGoal: 1000000, // $1M goal
    isActive: true,
  },
  {
    id: "ibero",
    name: "Universidad Iberoamericana",
    shortName: "IBERO",
    wallet: "0x904A9868954044925758D4a483Ae126BE884e934",
    logo: "/universities/ibero.png",
    description: "Comprometida con la excelencia académica",
    capitalRaised: 0,
    yieldGenerated: 0,
    capitalGoal: 500000, // $500k goal
    isActive: true,
  },
  {
    id: "buap",
    name: "Benemérita Universidad Autónoma de Puebla",
    shortName: "BUAP",
    wallet: "0x6c40b6c7835401BA249b36e4F0eFb62B8ABfc310",
    logo: "/universities/buap.png",
    description: "Tradición y excelencia desde 1578",
    capitalRaised: 0,
    yieldGenerated: 0,
    capitalGoal: 750000,
    isActive: true,
  },
  {
    id: "udlap",
    name: "Universidad de las Américas Puebla",
    shortName: "UDLAP",
    wallet: "0x0699A33d04D1400a1922Ae80D6e3306E4932063b",
    logo: "/universities/udlap.png",
    description: "Innovación y liderazgo educativo",
    capitalRaised: 0,
    yieldGenerated: 0,
    capitalGoal: 600000,
    isActive: true,
  },
  {
    id: "anahuac",
    name: "Universidad Anáhuac",
    shortName: "ANAHUAC",
    wallet: "0x5B2cE48D1d74E6d2040b40246501B9d601fb4b82",
    logo: "/universities/anahuac.png",
    description: "Formando líderes de acción positiva",
    capitalRaised: 0,
    yieldGenerated: 0,
    capitalGoal: 800000,
    isActive: true,
  },
  {
    id: "tec",
    name: "Tecnológico de Monterrey",
    shortName: "TEC",
    wallet: "0x357B924B9f549B4C6a9DB212a24E615d175E336D",
    logo: "/universities/tec.png",
    description: "Líder en innovación educativa",
    capitalRaised: 0,
    yieldGenerated: 0,
    capitalGoal: 1200000, // $1.2M goal
    isActive: true,
  },
];

export function getUniversityById(id: string): University | undefined {
  return UNIVERSITIES.find((uni) => uni.id === id);
}

export function getUniversityByWallet(wallet: string): University | undefined {
  return UNIVERSITIES.find((uni) => uni.wallet.toLowerCase() === wallet.toLowerCase());
}

export function getAllActiveUniversities(): University[] {
  return UNIVERSITIES.filter((uni) => uni.isActive);
}

