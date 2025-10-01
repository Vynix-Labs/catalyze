import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { endpoints } from "../api/endpoints";

// Types
interface InitiateDepositData {
  amount: number;
  currency: string;
  paymentMethod?: string;
}

interface ConfirmDepositData {
  transactionId: string;
  paymentReference?: string;
}

interface InitiateDepositResponse {
  success: boolean;
  transactionId: string;
  paymentUrl?: string;
  message: string;
}

interface ConfirmDepositResponse {
  success: boolean;
  message: string;
  balance?: number;
}

interface FiatData {
  transactions: any[];
  balance: number;
  currency: string;
}

// Initiate Deposit Hook
export const useInitiateDeposit = () => {
  return useMutation<InitiateDepositResponse, Error, InitiateDepositData>({
    mutationFn: async (data: InitiateDepositData) => {
      const response = await axiosInstance.post(
        endpoints.fiat.initiateDeposit,
        data
      );
      return response.data;
    },
  });
};

// Confirm Deposit Hook
export const useConfirmDeposit = () => {
  return useMutation<ConfirmDepositResponse, Error, ConfirmDepositData>({
    mutationFn: async (data: ConfirmDepositData) => {
      const response = await axiosInstance.post(
        endpoints.fiat.confirmDeposit,
        data
      );
      return response.data;
    },
  });
};

// Get Fiat Data Hook
export const useFiatData = () => {
  return useQuery<FiatData, Error>({
    queryKey: ["fiat", "data"],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.fiat.fiat);
      return response.data;
    },
  });
};
