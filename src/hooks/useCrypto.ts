import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { endpoints } from "../api/endpoints";

export type CryptoAddress = {
  address: string;
  network: string;
};

export const useCryptoAddress = () => {
  return useQuery<{ address: string; network: string }, Error>({
    queryKey: ["crypto", "address"],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoints.default.cryptoAddress);
      if (!res.data) throw new Error("Failed to fetch crypto address");
      return res.data as CryptoAddress;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 120 * 60 * 1000, // 120 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
