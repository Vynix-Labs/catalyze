import { useState } from "react";
import { axiosInstance } from "../api/axios";
import { endpoints } from "../api/endpoints";
import { toast } from "sonner";

export const useWaitlist = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleJoinWaitlist = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post(endpoints.waitlist.join, {
        email,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setEmail("");
        setShowInput(false);
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to join waitlist");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    isLoading,
    showInput,
    setShowInput,
    handleJoinWaitlist,
  };
};
