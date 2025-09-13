import React from "react";
import Header from "./Header";
import NumberPad from "./NumberPad";
import type { PinEntryStepProps } from "../../types/types";

const PinEntryStep: React.FC<PinEntryStepProps> = ({
  pin,
  setPin,
  onNext,
  onBack,
}) => {
  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const handleProceed = () => {
    if (pin.length === 4) {
      onNext();
    }
  };

  const handleClear = () => {
    setPin("");
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <Header title="" onBack={onBack} />

      <div className="flex-1 flex flex-col justify- p-4">
        <div className="mb-12">
          <h2 className="text-2xl font-black">Enter Transaction Pin</h2>
          <p className="text-gray-600 text-sm">
            Enter a 4-digit transaction code to complete transfer
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-12">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 text-lg font-semibold ${
                pin.length > index
                  ? "bg-white text-black"
                  : "border-neutral-100 bg-white"
              }`}
            >
              {pin[index] ?? ""}
            </div>
          ))}
        </div>

        <NumberPad
          onNumberPress={handleNumberPress}
          onProceed={handleProceed}
          canProceed={pin.length === 4}
          onClear={handleClear}
          showClear={pin.length > 0}
        />
      </div>
    </div>
  );
};

export default PinEntryStep;
