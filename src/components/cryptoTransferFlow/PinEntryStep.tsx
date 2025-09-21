import NumberPad from "./NumberPad";
import type { PinEntryStepProps } from "../../types/types";

const PinEntryStep: React.FC<PinEntryStepProps> = ({ pin, setPin, onNext  }) => {
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
    <div className=" flex flex-col">
      <div className="flex flex-col flex-1 p-6 space-y-4">
        {/* Header */}
        <div className="">
          <h2 className="text-2xl font-black text-gray-900">
            Enter Transaction PIN
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Enter a 4-digit code to complete transfer
          </p>
        </div>

        {/* PIN Boxes */}
        <div className="flex justify-center space-x-6 ">
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
