interface DepositToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

interface Contract {
  name: string;
  address: string;
}

interface Status {
  number: number;
  value: string;
}

interface SubItem {
  key: string;
  value: string;
}

interface LinkedFlow {
  title: string;
  subItems: SubItem[];
  linkedFlows: LinkedFlow[];
  style?: { backgroundColor?: string; color?: string };
}

interface InvestmentFlow {
  title: string;
  subItems: SubItem[];
  linkedFlows: LinkedFlow[];
  style?: { backgroundColor?: string; color?: string };
}

interface Strategy {
  name: string;
  id: string;
  apy: number;
  apySplit: { baseApy: number; rewardsApy: number };
  apyMethodology: string;
  depositToken: DepositToken[];
  leverage: number;
  contract: Contract[];
  tvlUsd: number;
  status: Status;
  riskFactor: number;
  logos: string[];
  isAudited: boolean;
  auditUrl?: string;
  actions: unknown[];
  investmentFlows: InvestmentFlow[];
}

interface StrategiesResponse {
  status: boolean;
  strategies: Strategy[];
  lastUpdated: string;
}

export async function getStrategies(): Promise<Strategy[]> {
  const response = await fetch('https://app.troves.fi/api/strategies');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json() as StrategiesResponse;
  return data.strategies.filter(strategy =>
    strategy.name.toLowerCase().includes('evergreen') ||
    strategy.name.toLowerCase().includes('vesu fusion')
  );
}