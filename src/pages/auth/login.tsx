import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthFooter from "../../common/auth/AuthFooter";
import Divider from "../../common/auth/Divider";
import ThirdPartyAuth from "../../common/auth/ThirdPartyAuth";
import AuthHeader from "../../components/auth/header";
import LoginForm from "../../components/auth/login/LoginForm";
import { authClient } from "../../lib/auth-client";
import { RoutePath } from "../../routes/routePath";

interface LoginFormData {
  email: string;
  password: string;
}

const link = {
  url: RoutePath.CREATE_ACCOUNT,
  text: "sign up",
};

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    const payload = {
      email: data.email,
      password: data.password,
    };

    authClient.signIn.email(payload, {
      onSuccess: async () => {
        setIsLoading(false);
        // check if email is verified
        const data = await authClient.getSession();
        const isVerified = data?.data?.user?.emailVerified;
        if (!isVerified) {
          await authClient.sendVerificationEmail({ email: payload.email });
          toast.success("Verification email sent");
          navigate(
            RoutePath.RESET_OTP.replace(
              ":email",
              encodeURIComponent(payload.email)
            )
          );
        } else {
          navigate(RoutePath.DASHBOARD);
        }
      },
      onError: (error) => {
        toast.error((error?.error?.message as string) ?? "Invalid credentials");
        setIsLoading(false);
      },
    });
  };

  const handleProceed = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="py-6 px-5 h-svh flex-col flex justify-between">
      <div className="space-y-10">
        <AuthHeader
          title="log in to your account"
          description="Don't have an account? "
          isLink
          link={link}
        />
        <div className="space-y-10 ">
          <LoginForm ref={formRef} onSubmit={handleFormSubmit} />
          <Divider />
          <ThirdPartyAuth />
        </div>
      </div>
      <AuthFooter
        text={isLoading ? "Signing In..." : "Proceed"}
        handleBtnClick={handleProceed}
        disabled={isLoading}
      />
    </div>
  );
}

export default Login;
