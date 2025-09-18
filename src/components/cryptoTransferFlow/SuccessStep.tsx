import React from "react";
import type { SuccessStepProps } from "../../types/types";
import { SuccessIcon } from "../../assets/svg";

const SuccessStep: React.FC<SuccessStepProps> = ({ onDone }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 bg-neutral-100">
      {/* Icon */}
      <div className="mb-6">
        <SuccessIcon className="w-20 h-20 text-white" />
      </div>
      {/* Title + Message */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Transfer Successful
        </h2>
        <p className="text-gray-600 text-sm">
          Your transfer has been initiated and is on its way
        </p>
      </div>
      {/* Button */}
      <button
        onClick={onDone}
        className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
      >
        Done
      </button>
    </div>
  );
};

export default SuccessStep;
