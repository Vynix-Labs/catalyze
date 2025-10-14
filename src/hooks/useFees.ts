import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { endpoints } from "../api/endpoints";

export type TradingFeesResponse = {
  buyPercent?: number | string | null;
  sellPercent?: number | string | null;
};

export type TradingFees = {
  buy: number; // decimal fraction e.g. 0.01
  sell: number; // decimal fraction e.g. 0.01
};

const toNum = (v: number | string | null | undefined) =>
  typeof v === "number" ? v : Number(v ?? 0) || 0;

export const useTradingFees = () => {
  return useQuery<TradingFees>({
    queryKey: ["fees", "trading"],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.fees.trading);
      if (!res.data) throw new Error("Failed to fetch trading fees");
      const data = res.data as TradingFeesResponse;
      const buyPct = toNum(data.buyPercent);
      const sellPct = toNum(data.sellPercent);
      return {
        buy: buyPct / 100,
        sell: sellPct / 100,
      };
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 120 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
