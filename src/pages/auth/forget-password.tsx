import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthFooter from "../../common/auth/AuthFooter";
import ForgetPasswordForm from "../../components/auth/forget-password/ForgetPasswordForm";
import AuthHeader from "../../components/auth/header";
import { authClient } from "../../lib/auth-client";
import { RoutePath } from "../../routes/routePath";

interface ForgetPasswordFormData {
  email: string;
}

function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (data: ForgetPasswordFormData) => {
    setIsLoading(true);
    try {
      await authClient.forgetPassword({
        email: data.email,
        redirectTo: RoutePath.RESET_OTP.replace(":email", encodeURIComponent(data.email)),
      });
      toast.success("Password reset link sent to your email");
      navigate(RoutePath.RESET_OTP.replace(":email", encodeURIComponent(data.email)));
    } catch (error) {
      toast.error(
        (error as Error)?.message ??
          "Failed to send reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="py-6 px-5 h-svh flex flex-col justify-between">
      <div className="space-y-10">
        <AuthHeader
          title="forgot password"
          description="Enter the email linked to your account and we'll send you a reset link."
          isLink={false}
        />
        <ForgetPasswordForm ref={formRef} onSubmit={handleFormSubmit} />
      </div>

      <AuthFooter
        text={isLoading ? "Sending..." : "Proceed"}
        handleBtnClick={handleProceed}
        disabled={isLoading}
      />
    </div>
  );
}
export default ForgetPassword;
