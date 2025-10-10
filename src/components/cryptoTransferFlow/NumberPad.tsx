import { FaceIcon } from "../../assets/svg";
import type { NumberPadProps } from "../../types/types";

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberPress,
  onProceed,
  canProceed,
  onClear,
  showClear,
}) => (
  <div className="grid grid-cols-3 gap-4   max-w-md w-full w-full mx-auto absolute bottom-10 right-0 left-0">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
      <button
        key={num}
        onClick={() => onNumberPress(num.toString())}
        className="flex items-center justify-center w-12 h-12 mx-auto text-2xl font-black rounded-full transition-colors"
      >
        {num}
      </button>
    ))}

    <div></div>

    <button
      onClick={() => onNumberPress("0")}
      className="flex items-center justify-center w-12 h-12 mx-auto text-2xl font-black rounded-full transition-colors"
    >
      0
    </button>

    <button
      onClick={onProceed}
      disabled={!canProceed}
      className={`flex items-center justify-center mx-auto w-12 h-12 rounded-full transition-colors ${
        canProceed
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
    >
      <FaceIcon />
    </button>

    {showClear && (
      <div className="col-span-3 text-center mt-4">
        <button
          onClick={onClear}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          Clear
        </button>
      </div>
    )}
  </div>
);

export default NumberPad;
