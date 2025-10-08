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

export interface Strategy {
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

import { apiCache } from "../../utils/cache";

async function fetchAndFilterStrategies(): Promise<Strategy[]> {
  const response = await fetch('https://app.troves.fi/api/strategies');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json() as StrategiesResponse;
  return data.status ? data.strategies.filter((strategy) =>
    strategy.id.toLowerCase().includes('evergreen') ||
    strategy.id.toLowerCase().includes('vesu_fusion')
  ) : [];
}

export async function getStrategies(): Promise<Strategy[]> {
  // Cache filtered ERC4626 strategies for 15 minutes to reduce API load
  return apiCache.getOrSet<Strategy[]>(
    "troves:strategies:erc4626",
    fetchAndFilterStrategies,
    { ttl: 15 * 60 }
  );
}

export async function refreshStrategiesCache(): Promise<void> {
  const items = await fetchAndFilterStrategies();
  await apiCache.set("troves:strategies:erc4626", items, { ttl: 15 * 60 });
}