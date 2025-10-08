export type RatePrices = {
  base: number;
  buy: number;
  sell: number;
  source: string | null;
  updatedAt: string | null;
};

export type RateListResponse = {
  items: {
    tokenSymbol: string;
    price: RatePrices;
  }[];
};

type RawRateRow = {
  tokenSymbol: string;
  priceNgnBase?: string | number | null;
  priceNgnBuy?: string | number | null;
  priceNgnSell?: string | number | null;
  source?: string | null;
  updatedAt?: string | null;
};

const normalizeNumeric = (value: string | number | null | undefined) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const serializeRate = (row: RawRateRow) => ({
  tokenSymbol: row.tokenSymbol,
  price: {
    base: normalizeNumeric(row.priceNgnBase),
    buy: normalizeNumeric(row.priceNgnBuy),
    sell: normalizeNumeric(row.priceNgnSell),
    source: row.source ?? null,
    updatedAt: row.updatedAt ?? null,
  },
});

export async function fetchAllRates(): Promise<RateListResponse> {
  const response = await fetch(`/api/rates`);
  if (!response.ok) {
    throw new Error("Failed to fetch rates");
  }

  const data = await response.json();
  return {
    items: Array.isArray(data.items) ? data.items.map(serializeRate) : [],
  };
}

export async function fetchTokenRates(tokenSymbol: string): Promise<RatePrices> {
  const symbol = tokenSymbol.toUpperCase();
  const response = await fetch(`/api/rates/${symbol}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch rates for ${symbol}`);
  }

  const data = await response.json();
  return serializeRate(data).price;
}
