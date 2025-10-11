import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { endpoints } from "../api/endpoints";

export type Rate = {
  tokenSymbol: string;
  priceNgnBase?: string | number | null;
  priceNgnBuy?: string | number | null;
  priceNgnSell?: string | number | null;
  source?: string | null;
  updatedAt?: string | null;
};

export type RateList = {
  items: Rate[];
};

export const useRates = () => {
  return useQuery({
    queryKey: ["rates"],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.rates.all);
      if (!res.data) throw new Error("Failed to fetch rates");
      const data = res.data;
      return data;
    },
  });
};

export const useTokenRate = (tokenSymbol: string) => {
  return useQuery({
    queryKey: ["rates", tokenSymbol],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.rates.single(tokenSymbol));
      if (!res.data)
        throw new Error(`Failed to fetch rates for ${tokenSymbol}`);
      const data = res.data as Rate;
      const toNum = (v: string | number | null | undefined) =>
        typeof v === "number" ? v : Number(v) || 0;
      return {
        base: toNum(data.priceNgnBase),
        buy: toNum(data.priceNgnBuy),
        sell: toNum(data.priceNgnSell),
      };
    },
  });
};
