import React from "react";
import GlobalModal from "./GlobalModal";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  amountNGN: string;
  currencyType: string;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
//   amount,
  amountNGN,
//   currencyType,
}) => {
  // Bank details for deposit
  const bankDetails = {
    bankName: "WEMABOD Bank",
    accountNumber: "1234567890",
    accountName: "Your Company Name",
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
    alert("Copied to clipboard!");
  };

  return (
    <GlobalModal
      onClose={onClose}
      open={isOpen}
      setOpen={(open) => !open && onClose()}
      headingText="Deposit Instructions"
      btnText="I've made the transfer"
      onProceed={onConfirm}
      isProceedDisabled={false}
    >
      <div className="py-6">
        {/* Instruction Text */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Transfer the sum <strong>₦{amountNGN}</strong> to the checkout
            details below
          </p>
        </div>

        {/* Bank Details */}
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <div className="text-sm text-gray-600 mb-1">Bank Name</div>
            <div className="flex justify-between items-center">
              <strong className="text-base">{bankDetails.bankName}</strong>
              <button
                onClick={() => handleCopy(bankDetails.bankName)}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Account Number</div>
            <div className="flex justify-between items-center">
              <strong className="text-base">{bankDetails.accountNumber}</strong>
              <button
                onClick={() => handleCopy(bankDetails.accountNumber)}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Account Name</div>
            <div className="flex justify-between items-center">
              <strong className="text-base">{bankDetails.accountName}</strong>
              <button
                onClick={() => handleCopy(bankDetails.accountName)}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-1">Amount</div>
            <div className="flex justify-between items-center">
              <strong className="text-base">₦{amountNGN}</strong>
              <button
                onClick={() => handleCopy(amountNGN)}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Additional Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            Please include your username as the transfer reference
          </p>
        </div>
      </div>
    </GlobalModal>
  );
};

export default DepositModal;
