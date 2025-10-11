import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthFooter from "../../common/auth/AuthFooter";
import Divider from "../../common/auth/Divider";
import ThirdPartyAuth from "../../common/auth/ThirdPartyAuth";
import AuthHeader from "../../components/auth/header";
import LoginForm from "../../components/auth/login/LoginForm";
import { useAuthState } from "../../hooks/useAuthState";
import { authClient } from "../../lib/auth-client";
import { RoutePath } from "../../routes/routePath";
import { AuthLoader } from "../../common/ui/Loader";

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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef<HTMLFormElement>(null);
  const { login, isAuthenticated, initializeAuth } = useAuthState();

  // Get the return URL from location state
  const from = location.state?.from || RoutePath.DASHBOARD;

  useEffect(() => {
    const checkAuth = async () => {
      await initializeAuth();
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
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
          await authClient.getSession(undefined, {
            onSuccess: (data) => {
              // Login user and store token
              login(data?.data?.user, data?.data?.session?.token);
              navigate(from, { replace: true });
            },
          });
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

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return <AuthLoader />;
  }

  return (
    <div className="py-6 px-5 flex flex-col justify-between h-svh   max-w-md w-full  w-screen ">
      <div className="space-y-10 w-full ">
        <AuthHeader
          title="log in to your account"
          description="Don't have an account? "
          isLink
          link={link}
        />
        <div className="space-y-10 w-full">
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
