import { useState, type Dispatch } from "react";
import { toast } from "sonner";
import OtpInput from "../../../common/auth/OtpInput";
import { useVerifyPin } from "../../../hooks";
import GlobalModal from "../../../common/ui/modal/GlobalModal";
import type { SetStateAction } from "jotai";

interface UnstakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: (params: {
    strategyId: string;
    amount: number;
    pinToken: string;
  }) => void;
  stake: {
    id: string;
    name: string;
    amount: string;
    strategyId?: string;
  };
  isLoading?: boolean;
}

const UnstakeModal = ({
  isOpen,
  onClose,
  onConfirm,
  stake,
  setIsOpen,
  isLoading = false,
}: UnstakeModalProps) => {
  const [pin, setPin] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { mutate: verifyPin } = useVerifyPin();

  const handleConfirmUnstake = () => {
    if (!pin) {
      toast.error("Please enter your PIN");
      return;
    }

    setIsVerifying(true);

    verifyPin(
      { pin, scope: "crypto_unstake" },
      {
        onSuccess: (res) => {
          console.log("✅ PIN verified for unstake:", res);

          // Extract numeric amount from string (e.g., "1.5 ETH" -> 1.5)
          const numericAmount = parseFloat(stake.amount.split(" ")[0]);

          onConfirm({
            strategyId: stake.strategyId || stake.id,
            amount: numericAmount,
            pinToken: res.token,
          });

          setPin("");
          onClose();
        },
        onError: (err) => {
          console.error("❌ PIN verification failed:", err);
          toast.error("Invalid PIN. Please try again.");
          setIsVerifying(false);
        },
      }
    );
  };

  const handleClose = () => {
    setPin("");
    setIsVerifying(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <GlobalModal
      open={isOpen}
      btnText={isVerifying || isLoading ? "Processing..." : "Confirm Unstake"}
      setOpen={setIsOpen}
      onClose={handleClose}
      handleOnBtnClick={handleConfirmUnstake}
      isProceedDisabled={!pin || isVerifying || isLoading}
      children={
        <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Confirm Unstake
            </h2>
            <p className="text-gray-600">
              You are about to unstake{" "}
              <span className="font-semibold">{stake.amount}</span> from{" "}
              <span className="font-semibold">{stake.name}</span>
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ Once you unstake, you'll stop earning rewards on this amount.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Enter your 4-digit PIN to confirm
            </label>
            <OtpInput
              onComplete={(otp) => setPin(otp)}
              showCounter={false}
              otpLength={4}
            />
          </div>
        </div>
      }
    ></GlobalModal>
  );
};

export default UnstakeModal;
