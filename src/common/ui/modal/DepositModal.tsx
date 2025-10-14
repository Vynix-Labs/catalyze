import { useState } from "react";
import GlobalModal from "./GlobalModal";
import { CopyIcon } from "../../../assets/svg";
import type { fiatResponse } from "../../../utils/types";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amountNGN: string;
  amount: string;
  currencyType: string;
  depositData?: fiatResponse | null;
  isLoading?: boolean;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amountNGN,
  depositData,
  isLoading,
}) => {
  const bankDetails = {
    bankName: depositData?.paymentInstructions.bankName || "",
    accountNumber: depositData?.paymentInstructions.accountNumber || "",
    amount:
      depositData?.paymentInstructions.totalPayable !== undefined
        ? `₦${depositData.paymentInstructions.totalPayable}`
        : `₦${amountNGN}`,
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
          Transfer the sum{" "}
          <strong className="text-primary-100">{bankDetails.amount}</strong> to
          the checkout details below
        </p>

        {/* Loop Bank Details */}
        <div className="space-y-2">
          {(isLoading && !depositData ? [
            { label: "Bank Name", value: "Loading...", copyable: false },
            { label: "Account Number", value: "Loading...", copyable: false },
            { label: "Amount", value: `₦${amountNGN}`, copyable: false },
          ] : detailItems).map((item, index) => (
            <div key={index} className="bg-neutral-100 p-2 rounded-lg">
              <div className="text-sm text-gray-600 mb-1 ">{item.label}</div>
              <div className="flex justify-between items-center">
                <strong className="text-base">{item.value}</strong>
                {item.copyable && (
                  <button
                    onClick={() => handleCopy(bankDetails.accountNumber, "account")}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    {copiedField === "account" ? <CopyIcon className="text-gray-600" /> : <CopyIcon />}
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
