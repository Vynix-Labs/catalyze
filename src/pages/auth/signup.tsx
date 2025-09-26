import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthFooter from "../../common/auth/AuthFooter";
import Divider from "../../common/auth/Divider";
import ThirdPartyAuth from "../../common/auth/ThirdPartyAuth";
import AuthHeader from "../../components/auth/header";
import SignUpForm from "../../components/auth/signup/form";
import { authClient } from "../../lib/auth-client";
import { RoutePath } from "../../routes/routePath";

interface SignUpFormData {
  email: string;
  password: string;
}

const link = {
  url: RoutePath.SIGNIN,
  text: "Log In",
};

function SignUp() {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const handleFormSubmit = async (data: SignUpFormData) => {
    if (!isTermsAccepted) {
      alert("Please accept the Terms of Use and Privacy Policies to continue.");
      return;
    }

    const payload = {
      name: data.email.split("@")[0],
      email: data.email,
      password: data.password,
    };
    setIsLoading(true);
    authClient.signUp.email(payload, {
      onSuccess: async () => {
        setIsLoading(false);
        await authClient.sendVerificationEmail({ email: payload.email });
        toast.success("Verification email sent");
        navigate(
          RoutePath.RESET_OTP.replace(
            ":email",
            encodeURIComponent(payload.email)
          )
        );
      },
      onError: (error) => {
        toast.error(error.error?.message ?? "Invalid credentials");
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
    <div className="py-6 px-5 flex flex-col justify-between h-svh">
      <div className="space-y-10">
        <AuthHeader
          title="Create an account easily"
          description="Already have an account? "
          isLink
          link={link}
        />

        <SignUpForm ref={formRef} onSubmit={handleFormSubmit} />
        <Divider />
        <ThirdPartyAuth />
      </div>
      <div className="space-y-8">
        <div className="flex gap-3 items-center">
          <input
            type="checkbox"
            name="terms"
            id="terms"
            checked={isTermsAccepted}
            onChange={(e) => setIsTermsAccepted(e.target.checked)}
            className="checkbox checkbox-primary"
          />
          <p className="text-sm font-semibold leading-6">
            By registering, you accept our{" "}
            <span className="text-primary-100 font-black">Terms of Use </span>{" "}
            and{" "}
            <span className="text-primary-100 font-black">
              Privacy Policies
            </span>
          </p>
        </div>
        <AuthFooter
          text={isLoading ? "Creating Account..." : "Proceed"}
          handleBtnClick={handleProceed}
          disabled={isLoading || !isTermsAccepted}
        />
      </div>
    </div>
  );
}
export default SignUp;
