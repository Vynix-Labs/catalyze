import { useAtom } from "jotai";
import { useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import OtpInput, { type OtpInputRef } from "../../common/auth/OtpInput";
import Button from "../../common/ui/button";
import AuthHeader from "../../components/auth/header";
import { authClient } from "../../lib/auth-client";
import { RoutePath } from "../../routes/routePath";
import { otpAtom } from "../../store/jotai";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { email } = useParams<{ email: string }>();
  const [searchParams] = useSearchParams();
  const otpInputRef = useRef<OtpInputRef>(null);
  const canSubmit = otp.length === 6;
  const [, setOtpAtom] = useAtom(otpAtom);

  // Check if this is a reset password flow
  const urlType = searchParams.get("type");
  const isResetPassword = urlType === "reset-password";

  // Handle regular email verification (signup flow)
  const handleEmailVerification = () => {
    authClient.emailOtp.verifyEmail(
      {
        email: decodeURIComponent(email || ""),
        otp,
      },
      {
        onSuccess: () => {
          toast.success("Email verified successfully");
          setOtpAtom(otp);
          navigate(
            RoutePath.CREATE_TRANSACTION_PIN.replace(
              ":email",
              encodeURIComponent(email || "")
            )
          );
        },
        onError: (error) => {
          toast.error((error?.error?.message as string) ?? "Invalid OTP");
        },
      }
    );
  };

  // Handle reset password OTP verification
  const handleResetPasswordVerification = () => {
    authClient.emailOtp.checkVerificationOtp(
      {
        email: decodeURIComponent(email || ""),
        otp,
        type: "forget-password",
      },
      {
        onSuccess: () => {
          toast.success("OTP verified successfully");
          // Navigate to reset password page instead of create password
          navigate(
            `${RoutePath.CREATE_PASSWORD}?email=${encodeURIComponent(
              email || ""
            )}`
          );
        },
        onError: (error) => {
          toast.error((error?.error?.message as string) ?? "Invalid OTP");
        },
      }
    );
  };

  const handleProceed = () => {
    if (!canSubmit) return;

    // Split the function based on URL parameter
    if (isResetPassword) {
      handleResetPasswordVerification();
    } else {
      handleEmailVerification();
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      if (isResetPassword) {
        // Resend reset password OTP
        await authClient.emailOtp.sendVerificationOtp({
          email: decodeURIComponent(email),
          type: "forget-password",
        });
        toast.success("Reset code sent");
      } else {
        // Resend regular verification email
        await authClient.sendVerificationEmail({
          email: decodeURIComponent(email),
        });
        toast.success("Verification email sent");
      }
      // Reset the countdown timer
      otpInputRef.current?.resetCountdown();
    } catch {
      toast.error(
        isResetPassword
          ? "Failed to resend reset code"
          : "Failed to resend verification email"
      );
    }
  };

  return (
    <div className="py-6 h-svh flex-col max-w-md mx-auto flex justify-between px-5">
      <div className="space-y-10">
        <AuthHeader
          title={isResetPassword ? "verify reset code" : "verify email address"}
          description={
            isResetPassword
              ? `Enter the 6-digit code we just sent to ${
                  email ? decodeURIComponent(email) : "your email"
                } to reset your password.`
              : `Enter the 6-digit code we just sent to ${
                  email ? decodeURIComponent(email) : "your email"
                } to verify your account.`
          }
          isLink={false}
        />
        <OtpInput
          ref={otpInputRef}
          onComplete={setOtp}
          onResend={handleResend}
        />
      </div>
      <div>
        <div className="flex-col flex items-center w-full">
          <Button
            variants="primary"
            handleClick={handleProceed}
            disabled={!canSubmit}
          >
            proceed
          </Button>
        </div>
      </div>
    </div>
  );
}
export default VerifyEmail;
