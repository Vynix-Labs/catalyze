import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/axios";
import { endpoints } from "../api/endpoints";

// Types
interface SetPinData {
  pin: string;
}

interface VerifyPinData {
  pin: string;
  scope?:string
}

interface SetPinResponse {
  success: boolean;
  message: string;
}

interface VerifyPinResponse {
  success: boolean;
  message: string;
  token: string;
  expiresIn: number;
  scope: string;
}

// Set PIN Hook
export const useSetPin = () => {
  return useMutation<SetPinResponse, Error, SetPinData>({
    mutationFn: async (data: SetPinData) => {
      const response = await axiosInstance.post(endpoints.auth.setPin, data);
      return response.data;
    },
  });
};

// Verify PIN Hook
export const useVerifyPin = () => {
  return useMutation<VerifyPinResponse, Error, VerifyPinData>({
    mutationFn: async (data: VerifyPinData) => {
      const response = await axiosInstance.post(endpoints.auth.verifyPin, data);
      console.log(response.data);

      return response.data;
    },
  });
};

// Get Auth Status Hook
export const useAuthStatus = () => {
  return useQuery({
    queryKey: ["auth", "status"],
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.auth.uth);
      return response.data;
    },
  });
};
