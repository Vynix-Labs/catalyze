import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { endpoints } from "../api/endpoints";
import type { fiatDeposit, fiatResponse } from "../utils/types";

interface ConfirmDepositData {
  transactionId: string;
  paymentReference?: string;
}

interface ConfirmDepositResponse {
  success: boolean;
  message: string;
  balance?: number;
}

// interface FiatData {
//   transactions: any[];
//   balance: number;
//   currency: string;
// }

// Initiate Deposit Hook
export const useInitiateDeposit = () => {
  return useMutation<fiatResponse, Error, fiatDeposit>({
    mutationFn: async (data: fiatDeposit) => {
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

// Initiate Fiat Transfer Hook
type InitiateFiatTransferInput = {
  amountFiat: number;
  tokenSymbol: string;
};

export const useInitiateFiatTransfer = () => {
  return useMutation<any, Error, InitiateFiatTransferInput>({
    mutationFn: async (data: InitiateFiatTransferInput) => {
      const response = await axiosInstance.post(
        endpoints.fiat.fiatTransferInitiate,
        data
      );
      return response.data;
    },
  });
};

// Confirm Fiat Transfer Hook
type ConfirmFiatTransferInput = {
  reference: string;
  otp?: string;
};

export const useConfirmFiatTransfer = () => {
  return useMutation<any, Error, ConfirmFiatTransferInput>({
    mutationFn: async (data: ConfirmFiatTransferInput) => {
      const response = await axiosInstance.post(
        endpoints.fiat.fiatTransferConfirm,
        data
      );
      return response.data;
    },
  });
};

// Get Monnify Banks (list)
export const useMonnifyBanks = () => {
  return useQuery({
    queryKey: ["fiat", "monnify", "banks"],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.fiat.fiatMonifyBanks);
      return response.data;
    },
  });
};

// Get Monnify Disbursement by reference
export const useMonnifyDisbursement = (reference: string, enabled = true) => {
  return useQuery({
    queryKey: ["fiat", "monnify", "disbursement", reference],
    enabled: Boolean(reference) && enabled,
    queryFn: async () => {
      const path = endpoints.fiat.fiatMonifyDisbursement.replace(
        "{reference}",
        reference
      );
      const response = await axiosInstance.get(path);
      return response.data;
    },
  });
};

// Resend OTP (Monnify)
type ResendOtpInput = { reference: string };
export const useMonnifyResendOtp = () => {
  return useMutation<any, Error, ResendOtpInput>({
    mutationFn: async (data: ResendOtpInput) => {
      const response = await axiosInstance.post(
        endpoints.fiat.fiatMonifyResendOtp,
        data
      );
      return response.data;
    },
  });
};

// Validate Monnify Account
type ValidateMonnifyInput = { accountNumber: string; bankCode: string };
export const useValidateMonnifyAccount = () => {
  return useMutation<any, Error, ValidateMonnifyInput>({
    mutationFn: async (data: ValidateMonnifyInput) => {
      const response = await axiosInstance.post(
        endpoints.fiat.fiatValidateMonify,
        data
      );
      return response.data;
    },
  });
};

// Get Transfer Status by reference
export const useFiatTransferStatus = (reference: string, enabled = true) => {
  return useQuery({
    queryKey: ["fiat", "transfer", "status", reference],
    enabled: Boolean(reference) && enabled,
    queryFn: async () => {
      const path = endpoints.fiat.transferRef.replace("{reference}", reference);
      const response = await axiosInstance.get(path);
      return response.data;
    },
  });
};

// Get Fiat Data Hook
// export const useFiatData = () => {
//   return useQuery<FiatData, Error>({
//     queryKey: ["fiat", "data"],
//     queryFn: async () => {
//       const response = await axiosInstance.get(endpoints.fiat.fiat);
//       return response.data;
//     },
//   });
// };
