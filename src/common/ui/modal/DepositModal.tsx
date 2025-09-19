import React, { useState } from "react";
import GlobalModal from "./GlobalModal";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amountNGN: string;
  amount: string;
  currencyType: string;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amountNGN,
}) => {
  const bankDetails = {
    bankName: "WEMABOD Bank",
    accountNumber: "1234567890",
    amount: `₦${amountNGN}`,
  };

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);

    // Reset after 3s
    setTimeout(() => setCopiedField(null), 3000);
  };

  // Prepare details in a loopable format
  const detailItems = [
    { label: "Bank Name", value: bankDetails.bankName, copyable: false },
    {
      label: "Account Number",
      value: bankDetails.accountNumber,
      copyable: true,
    },
    { label: "Amount", value: bankDetails.amount, copyable: false },
  ];

  return (
    <GlobalModal
      onClose={onClose}
      open={isOpen}
      setOpen={(open) => !open && onClose()}
      headingText="Deposit"
      btnText="I've made the transfer"
      onProceed={onConfirm}
      isProceedDisabled={false}
    >
      <div className=" space-y-4">
        <p className="text-base text-gray-600 py-2 max-w-[22rem]">
          Transfer the sum <strong className="text-primary-100">{bankDetails.amount}</strong> to the checkout
          details below
        </p>

        {/* Loop Bank Details */}
        <div className="space-y-2">
          {detailItems.map((item, index) => (
            <div key={index} className="bg-neutral-100 p-2 rounded-lg">
              <div className="text-sm text-gray-600 mb-1 ">{item.label}</div>
              <div className="flex justify-between items-center">
                <strong className="text-base">{item.value}</strong>
                {item.copyable && (
                  <button
                    onClick={() => handleCopy("1234567890", "account")}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    {copiedField === "account" ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlobalModal>
  );
};

export default DepositModal;
