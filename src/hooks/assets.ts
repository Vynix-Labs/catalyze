import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { endpoints } from "../api/endpoints";
import type { assets } from "../utils/types";

export const useAssets = () => {
  return useQuery<assets, Error>({
    queryKey: ["assets", "all"],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.assets.all);
      return response.data;
    },
    enabled: true,
    refetchOnWindowFocus: "always",
  });
};
