import { Eye } from "lucide-react";
import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { EyeDropCloseIcon } from "../../../assets/svg";

interface TransactionPinFormData {
  pin: string;
  confirmPin: string;
}

interface TransactionPinFormProps {
  onSubmit: (data: TransactionPinFormData) => void;
}

const TransactionPinForm = forwardRef<HTMLFormElement, TransactionPinFormProps>(
  ({ onSubmit }, ref) => {
    const [showPin, setShowPin] = useState(false);
    const [showConfirmPin, setShowConfirmPin] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors },
      watch,
    } = useForm<TransactionPinFormData>({
      defaultValues: {
        pin: "",
        confirmPin: "",
      },
    });

    const pin = watch("pin");

    return (
      <div>
        <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full">
            <label htmlFor="pin">Pin</label>
            <div className="relative form-control">
              <input
                type={showPin ? "text" : "password"}
                inputMode="numeric"
                id="pin"
                placeholder="Create pin"
                maxLength={4}
                className={`input input-bordered w-full ${
                  errors.pin ? "input-error" : ""
                }`}
                {...register("pin", {
                  required: "PIN is required",
                  minLength: {
                    value: 4,
                    message: "PIN must be exactly 4 digits",
                  },
                  maxLength: {
                    value: 4,
                    message: "PIN must be exactly 4 digits",
                  },
                  pattern: {
                    value: /^\d{4}$/,
                    message: "PIN must contain only numbers",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute top-1/2 -translate-y-1/2 right-5 focus:outline-none"
                aria-label={showPin ? "Hide PIN" : "Show PIN"}
              >
                {showPin ? <Eye /> : <EyeDropCloseIcon />}
              </button>
            </div>
            {errors.pin && (
              <p className="text-error text-xs text-red-500 mt-1">
                {errors.pin.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="confirmPin">Confirm Pin</label>
            <div className="relative form-control">
              <input
                type={showConfirmPin ? "text" : "password"}
                inputMode="numeric"
                id="confirmPin"
                placeholder="Re-enter pin"
                maxLength={4}
                className={`input input-bordered w-full ${
                  errors.confirmPin ? "input-error" : ""
                }`}
                {...register("confirmPin", {
                  required: "Please confirm your PIN",
                  validate: (value) => value === pin || "PINs do not match",
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="absolute top-1/2 -translate-y-1/2 right-5 focus:outline-none"
                aria-label={showConfirmPin ? "Hide PIN" : "Show PIN"}
              >
                {showConfirmPin ? <Eye /> : <EyeDropCloseIcon />}
              </button>
            </div>
            {errors.confirmPin && (
              <p className="text-error text-xs text-red-500 mt-1">
                {errors.confirmPin.message}
              </p>
            )}
          </div>
        </form>
      </div>
    );
  }
);

TransactionPinForm.displayName = "TransactionPinForm";

export default TransactionPinForm;
