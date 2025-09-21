import type { SuccessStepProps } from "../../types/types";
import { SuccessIcon } from "../../assets/svg";

const SuccessStep: React.FC<SuccessStepProps> = ({
  onDone,
  flowType: transferType,
  amount,
  amountNGN,
  currencyType,
}) => {
  // Determine the success message based on transfer type
  const getSuccessContent = () => {
    if (transferType === "deposit") {
      return {
        title: "Deposit Initiated",
        message: `Your ${currencyType} deposit of ${amount} ${currencyType} (≈₦${amountNGN}) has been initiated. Please send the exact amount to the provided account details.`,
        buttonText: "Done",
      };
    } else {
      return {
        title: "Transfer Successful",
        message: `Your transfer of ${amount} ${currencyType} (≈₦${amountNGN}) has been completed successfully.`,
        buttonText: "Done",
      };
    }
  };

  const { title, message, buttonText } = getSuccessContent();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 bg-neutral-50">
      {/* Icon */}
      <div className="mb-6">
        <SuccessIcon className="w-20 h-20 text-white" />
      </div>

      {/* Title + Message */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 text-sm max-w-sm">{message}</p>
      </div>

      {/* Additional info for deposit */}
      {transferType === "deposit" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-sm">
          <div className="flex items-start space-x-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">ℹ</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Next Steps:</p>
              <p>
                Your deposit will be credited to your account once the
                transaction is confirmed on the blockchain.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Button */}
      <button
        onClick={onDone}
        className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default SuccessStep;
