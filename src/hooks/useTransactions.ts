import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { endpoints } from "../api/endpoints";
import type { balances, transactions } from "../utils/types";
import { useAuthState } from "./useAuthState";
import { authClient } from "../lib/auth-client";

/**
 * Hook to fetch all transactions for the authenticated user
 * @param options - Query options for pagination and filtering
 */
export const useTransactions = (options?: {
  page?: number;
  limit?: number;
  type?: "deposit" | "withdraw" | "transfer" | "stake" | "unstake" | "claim";
  subtype?: "fiat" | "crypto";
  status?: "pending" | "processing" | "completed" | "failed";
  tokenSymbol?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "createdAt" | "amountFiat" | "amountToken";
  sortDir?: "asc" | "desc";
}) => {
  const { logout } = useAuthState();

  return useQuery<transactions, Error>({
    queryKey: ["transactions", "all", options],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (options?.page) params.append("page", options.page.toString());
      if (options?.limit) params.append("limit", options.limit.toString());
      if (options?.type) params.append("type", options.type);
      if (options?.subtype) params.append("subtype", options.subtype);
      if (options?.status) params.append("status", options.status);
      if (options?.tokenSymbol) params.append("tokenSymbol", options.tokenSymbol);
      if (options?.dateFrom) params.append("dateFrom", options.dateFrom);
      if (options?.dateTo) params.append("dateTo", options.dateTo);
      if (options?.sortBy) params.append("sortBy", options.sortBy);
      if (options?.sortDir) params.append("sortDir", options.sortDir);

      const queryString = params.toString();
      const url = queryString
        ? `${endpoints.transactions.all}?${queryString}`
        : endpoints.transactions.all;

      try {
        const response = await axiosInstance.get(url);
        return response.data;
      } catch (error: unknown) {
        // Handle 401 errors by checking if session is still valid
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            console.log(
              "Transactions API returned 401, checking session validity..."
            );
            // Try to refresh the session first
            try {
              const session = await authClient.getSession();
              if (!session?.data?.user) {
                console.log("Session is invalid, logging out...");
                logout();
              }
            } catch {
              console.log("Session check failed, logging out...");
              logout();
            }
          }
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};

/**
 * Hook to fetch a single transaction by ID
 * @param transactionId - The ID of the transaction to fetch
 */
export const useTransaction = (transactionId: string) => {
  return useQuery<transactions["items"][0], Error>({
    queryKey: ["transactions", "single", transactionId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        endpoints.transactions.singleTransaction(transactionId)
      );
      return response.data;
    },
    enabled: !!transactionId,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to fetch user balances
 */
export const useBalances = () => {
  const { logout } = useAuthState();

  return useQuery<balances, Error>({
    queryKey: ["transactions", "balances"],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          endpoints.transactions.balance
        );
        return response.data;
      } catch (error: unknown) {
        // Handle 401 errors by checking if session is still valid
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            console.log(
              "Balances API returned 401, checking session validity..."
            );
            try {
              const { authClient } = await import("../lib/auth-client");
              const session = await authClient.getSession();
              if (!session?.data?.user) {
                console.log("Session is invalid, logging out...");
                logout();
              }
            } catch {
              console.log("Session check failed, logging out...");
              logout();
            }
          }
        }
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
      return failureCount < 3;
    },
  });
};

/**
 * Hook to fetch balance for a specific token
 * @param tokenSymbol - The token symbol to fetch balance for
 */
export const useTokenBalance = (tokenSymbol: string) => {
  return useQuery<balances["items"][0], Error>({
    queryKey: ["transactions", "balance", tokenSymbol],
    queryFn: async () => {
      const response = await axiosInstance.get(
        endpoints.transactions.balanceWithToken(tokenSymbol)
      );
      return response.data;
    },
    enabled: !!tokenSymbol,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook to fetch admin transactions (if user has admin privileges)
 * @param transactionId - Optional transaction ID for specific admin transaction
 */
export const useAdminTransactions = (options?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}) => {
  return useQuery<transactions, Error>({
    queryKey: ["transactions", "admin", options],
    queryFn: async () => {
      const response = await axiosInstance.get(
        endpoints.transactions.adminTransactions,
        {
          params: options,
        }
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
