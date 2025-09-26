import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthFooter from "../../common/auth/AuthFooter";
import CreateNewPasswordForm from "../../components/auth/forget-password/CreateNewPasswordForm";
import AuthHeader from "../../components/auth/header";
import { authClient } from "../../lib/auth-client";
import { RoutePath } from "../../routes/routePath";

interface CreateNewPasswordFormData {
  password: string;
  confirmPassword: string;
}

function CreatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (data: CreateNewPasswordFormData) => {
    setIsLoading(true);
    try {
      await authClient.resetPassword({
        newPassword: data.password,
        token: new URLSearchParams(window.location.search).get("token") || "",
      });

      toast.success("Password updated successfully");
      navigate(RoutePath.SIGNIN);
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Failed to update password. Please try again.");
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
    <div className="h-svh py-6 px-5 flex-col flex justify-between">
      <div className="space-y-10">
        <AuthHeader
          title="create new password"
          isLink={false}
          description="Enter a strong new password to secure your account and keep your investments safe."
        />
        <CreateNewPasswordForm ref={formRef} onSubmit={handleFormSubmit} />
      </div>
      <AuthFooter
        text={isLoading ? "Updating..." : "Proceed"}
        handleBtnClick={handleProceed}
        disabled={isLoading}
      />
    </div>
  );
}

export default CreatePassword;
