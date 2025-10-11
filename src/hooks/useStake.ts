import { useMutation, useQuery } from "@tanstack/react-query";
import type { strategies, stake } from "../utils/types";
import { axiosInstance } from "../api/axios";
import { endpoints } from "../api/endpoints";
import { useAuthState } from "./useAuthState";

export const useStrategies = () => {
  const { logout } = useAuthState();
  return useQuery<strategies, Error>({
    queryKey: ["strategies", "all"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(endpoints.staking.strategies);
        return response.data; // ✅ return the data itself
      } catch (error) {
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };

          if (axiosError.response?.status === 401) {
            // e.g., redirect to login or clear tokens
            console.warn("Unauthorized. You may need to log in again.");
            logout();
          }
        }

        // rethrow so React Query marks it as an error
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });
};
export const useStake = () => {
  return useMutation<
    stake,
    Error,
    { strategyId: string; amount: number; pinToken: string }
  >({
    mutationKey: ["stake"],
    mutationFn: async ({ strategyId, amount, pinToken }) => {
      try {
        const response = await axiosInstance.post(endpoints.staking.stake, {
          strategyId,
          amount,
          pinToken,
        });
        return response.data;
      } catch (error) {
        console.error("Stake request failed:", error);
        throw error;
      }
    },
  });
};
export const useUnstake = () => {
  return useMutation<
    stake,
    Error,
    { strategyId: string; amount: number; pinToken: string }
  >({
    mutationKey: ["unstake"],
    mutationFn: async ({ strategyId, amount, pinToken }) => {
      try {
        const response = await axiosInstance.post(endpoints.staking.unstake, {
          strategyId,
          amount,
          pinToken,
        });
        return response.data;
      } catch (error) {
        console.error("Unstake request failed:", error);
        throw error;
      }
    },
  });
};
