import { useEffect, useRef, useState } from "react";
import { PinIcon } from "../../assets/svg";

function OtpInput({ onComplete }: { onComplete?: (otp: string) => void }) {
  const otpLength = 6;
  const [otp, setOtp] = useState(Array(otpLength).fill(""));
  const [mask, setMask] = useState(Array(otpLength).fill(false));
  const [countdown, setCountdown] = useState(300);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [touched, setTouched] = useState(false);

  // Resend timer
  useEffect(() => {
    const resendTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsResendDisabled(false);
          clearInterval(resendTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(resendTimer);
  }, []);

  // Handle change of single input
  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];

      if (!touched && newOtp.every((digit) => digit !== "")) {
        setTouched(true);
      }

      newOtp[index] = value;
      setOtp(newOtp);

      // Mask digit after 1s
      setTimeout(() => {
        if (value !== "") {
          setMask((prev) => {
            const newMask = [...prev];
            newMask[index] = true;
            return newMask;
          });
        }
      }, 1000);

      // Auto-focus next input
      if (value !== "" && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if OTP is complete
      if (newOtp.every((digit) => digit !== "")) {
        onComplete?.(newOtp.join(""));
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    setMask((prev) => {
      const newMask = [...prev];
      newMask[index] = false;
      return newMask;
    });

    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      setMask((prev) => {
        const newMask = [...prev];
        newMask[index] = false;
        return newMask;
      });
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    const regex = new RegExp(`^\\d{${otpLength}}$`);
    if (regex.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);

      if (!touched) {
        setTouched(true);
      }

      inputRefs.current[otpLength - 1]?.focus();
      onComplete?.(digits.join(""));
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between relative">
        {otp.map((digit, index) => (
          <div key={index} className="relative form-control">
            <input
              type="text"
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              name={`otp-${index}`}
              id={`otp-${index}`}
              aria-label={`OTP digit ${index + 1}`}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`otp-input peer dark:!bg-gray-500 ${
                mask[index] ? "filled text-transparent" : ""
              } !placeholder:font-bold !placeholder:text-5xl`}
            />
            <div
              aria-hidden="true"
              className={`${
                mask[index] ? "block" : "hidden"
              } absolute top-1/2 left-1/2 -translate-1/2`}
            >
              <PinIcon />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-center pt-4">
        <button
          type="button"
          disabled={isResendDisabled}
          className="text-sm font-bold transition duration-300 ease-in-out cursor-pointer text-primary-100  hover:text-primary-100/90 disabled:text-gray-200 dark:disabled:text-gray-300"
        >
          Resend code{" "}
          {countdown > 0 && (
            <span className="text-primary-100">
              {Math.floor(countdown / 60)}:{countdown % 60}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

export default OtpInput;
