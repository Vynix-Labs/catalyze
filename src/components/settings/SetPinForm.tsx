import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { CheckIcon, EyeDropCloseIcon } from "../../assets/svg";

interface Props {
  newPin: number | undefined;
  setNewPin: Dispatch<SetStateAction<number | undefined>>;
  confirmPin: number | undefined;
  setConfirmPin: (pin: number) => void;
  setIsFormValid: Dispatch<SetStateAction<boolean>>;
}

function SetPinForm({
  newPin,
  confirmPin,
  setNewPin,
  setConfirmPin,
  setIsFormValid,
}: Props) {
  const [isPinVisible, setIsPinVisible] = useState(false);
  const [isConfirmPinVisible, setIsConfirmPinVisible] = useState(false);

  const pinStr = String(newPin ?? "");
  const confirmStr = String(confirmPin ?? "");

  const isMaxLength = pinStr.length === 6;
  const onlyNumbers = /^\d{6}$/.test(pinStr);
  const isRepetitive = /^(\d)\1{5}$/.test(pinStr);
  const isConfirmPinMatch = isMaxLength && pinStr === confirmStr;

  // watch the form to set validation
  useEffect(() => {
    if (isMaxLength && onlyNumbers && !isRepetitive && isConfirmPinMatch) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    isMaxLength,
    onlyNumbers,
    isRepetitive,
    isConfirmPinMatch,
    setIsFormValid,
    newPin,
    confirmPin,
  ]);

  return (
    <div className="px-4 pt-6 space-y-6.5">
      <form className="space-y-6">
        {/* New PIN */}
        <div className="w-full">
          <label htmlFor="pin">Create 6-digit PIN</label>
          <div className="relative form-control">
            <input
              type={isPinVisible ? "text" : "password"}
              inputMode="numeric"
              name="pin"
              id="pin"
              value={pinStr}
              onChange={(e) =>
                setNewPin(Number(e.target.value.replace(/\D/g, "").slice(0, 6)))
              }
              placeholder="Create PIN"
            />
            <div
              onClick={() => setIsPinVisible(!isPinVisible)}
              role="button"
              aria-roledescription="toggle pin visibility"
              className="absolute top-1/2 -translate-y-1/2 right-5"
            >
              <EyeDropCloseIcon />
            </div>
          </div>
        </div>

        {/* Confirm PIN */}
        <div className="w-full">
          <label htmlFor="confirmPin">Confirm Your PIN</label>
          <div className="relative form-control">
            <input
              type={isConfirmPinVisible ? "text" : "password"}
              inputMode="numeric"
              name="confirm-pin"
              id="confirmPin"
              value={confirmStr}
              onChange={(e) =>
                setConfirmPin(
                  Number(e.target.value.replace(/\D/g, "").slice(0, 6))
                )
              }
              placeholder="Confirm PIN"
            />
            <div
              role="button"
              aria-roledescription="toggle confirm pin visibility"
              onClick={() => setIsConfirmPinVisible(!isConfirmPinVisible)}
              className="absolute top-1/2 -translate-y-1/2 right-5"
            >
              <EyeDropCloseIcon />
            </div>
          </div>
        </div>
      </form>

      {/* PIN rules */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-700">
          Your PIN should be:
        </p>
        <ul className=" text-xs font-normal space-y-2">
          <li
            className={`${
              isMaxLength ? "text-neutral-900 " : " text-neutral-500"
            } flex items-center gap-2`}
          >
            <div className={isMaxLength ? "text-success-600" : ""}>
              <CheckIcon />
            </div>
            <p>Exactly 6 digits</p>
          </li>
          <li
            className={`${
              onlyNumbers ? "text-neutral-900 " : " text-neutral-500"
            } flex items-center gap-2`}
          >
            <div className={onlyNumbers ? "text-success-600" : ""}>
              <CheckIcon />
            </div>
            <p>Only contain numbers (0-9)</p>
          </li>
          <li
            className={`${
              !isRepetitive ? "text-neutral-900 " : " text-neutral-500"
            } flex items-center gap-2`}
          >
            <div
              className={!isRepetitive && isMaxLength ? "text-success-600" : ""}
            >
              <CheckIcon />
            </div>
            <p>Not repetitive (e.g., 111111)</p>
          </li>
          <li
            className={`${
              isConfirmPinMatch ? "text-neutral-900 " : " text-neutral-500"
            } flex items-center gap-2`}
          >
            <div className={isConfirmPinMatch ? "text-success-600" : ""}>
              <CheckIcon />
            </div>
            <p>Confirm PIN matches New PIN</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SetPinForm;
