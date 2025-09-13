import React from "react";
import type { SuccessStepProps } from "../../types/types";
import { SuccessIcon } from "../../assets/svg";

const SuccessStep: React.FC<SuccessStepProps> = ({ onDone }) => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 max-w-[269px] mx-auto">
    <div className="text-center flex justify-center flex-col items-center space-y-4">
      <span>
        <SuccessIcon className=" text-white" />
      </span>
      <div className="">
        <h2 className="text-2xl font-bold text-gray-900">
          Transfer Successful
        </h2>
        <p className="text-gray-600 text-sm">
          Your transfer has been initiated and is on its way
        </p>
      </div>
      <div className="pt-4">
        <button
          onClick={onDone}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  </div>
);

export default SuccessStep;
