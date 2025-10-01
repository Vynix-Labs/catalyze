import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import OtpInput, { type OtpInputRef } from "../../common/auth/OtpInput";
import Button from "../../common/ui/button";
import AuthHeader from "../../components/auth/header";
import { authClient } from "../../lib/auth-client";
import { RoutePath } from "../../routes/routePath";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { email } = useParams<{ email: string }>();
  const otpInputRef = useRef<OtpInputRef>(null);
  const canSubmit = otp.length === 6;

  const handleProceed = () => {
    if (!canSubmit) return;

    authClient.verifyEmail(
      { query: { token: otp, callbackURL: RoutePath.DASHBOARD } },
      {
        onSuccess: () => {
          toast.success("Email verified successfully");
          navigate(RoutePath.DASHBOARD);
        },
        onError: (error) => {
          toast.error((error?.error?.message as string) ?? "Invalid OTP");
        },
      }
    );
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await authClient.sendVerificationEmail({
        email: decodeURIComponent(email),
      });
      toast.success("Verification email sent");
      // Reset the countdown timer
      otpInputRef.current?.resetCountdown();
    } catch {
      toast.error("Failed to resend verification email");
    }
  };

  return (
    <div className="py-6 h-svh flex-col flex justify-between px-5">
      <div className="space-y-10">
        <AuthHeader
          title="verify email address"
          description={`Enter the 6-digit code we just sent to ${
            email ? decodeURIComponent(email) : "your email"
          } to verify your account.`}
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
