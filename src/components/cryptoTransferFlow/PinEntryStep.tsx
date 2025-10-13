import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useInitiateFiatTransfer } from "../../hooks";
import { useVerifyPin } from "../../hooks/useAuth";
import type { PinEntryStepProps } from "../../types/types";
import NumberPad from "./NumberPad";

const PinEntryStep: React.FC<PinEntryStepProps> = ({
  pin,
  setPin,
  onNext,
  amountNGN,
  bankName,
  bankCode,
  accountNumber,
  tokenSymbol,
}) => {
  const { mutate: verifyPin } = useVerifyPin();
  const { mutate: initiateTransfer } = useInitiateFiatTransfer();
  const router = useNavigate();
  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleProceed = () => {
    if (pin.length === 4) {
      verifyPin(
        { pin, scope: "fiat_transfer" },
        {
          onSuccess: async (res) => {
            console.log(res);
            const payload = {
              amountFiat: parseFloat(amountNGN || "0"),
              tokenSymbol: tokenSymbol?.toUpperCase() || "",
              bankName: bankName || "",
              bankCode: bankCode || "",
              accountNumber: accountNumber || "",
              narration: "string" as const,
              pinToken: res.token,
            };
            initiateTransfer(payload, {
              onSuccess: (res) => {
                console.log(res);
                onNext();
              },
              onError: (error) => {
                toast.error(error?.message ?? "Failed to initiate transfer");
                router(-1);
                console.error(error);
              },
            });
            // onNext();
          },
          onError: (error) => {
            console.error(error);
          },
        }
      );
    }
  };

  const handleClear = () => {
    setPin("");
  };

  return (
    <div className="w-md flex flex-col h-[95%] justify-between ">
      <div className="flex flex-col w-full flex-1 p-6 space-y-4">
        {/* Header */}
        <div className="w-full">
          <h2 className="text-2xl font-black text-gray-900">
            Enter Transaction PIN
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Enter a 4-digit code to complete transfer
          </p>
        </div>

        {/* PIN Boxes */}
        <div className="flex w-full justify-center space-x-6 ">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-14 h-14 flex items-center justify-center rounded-lg border text-xl font-bold transition ${
                pin.length > index
                  ? "bg-white text-gray-900 border-gray-400"
                  : "bg-white text-gray-400 border-gray-200"
              }`}
            >
              {pin[index] ?? ""}
            </div>
          ))}
        </div>
      </div>

      {/* NumberPad */}
      <NumberPad
        onNumberPress={handleNumberPress}
        onProceed={handleProceed}
        canProceed={pin.length === 4}
        onClear={handleClear}
        showClear={pin.length > 0}
      />
    </div>
  );
};

export default PinEntryStep;
