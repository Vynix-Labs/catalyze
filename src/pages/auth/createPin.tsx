import { useAtom } from "jotai";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../common/ui/button";
import AuthHeader from "../../components/auth/header";
import TransactionPinForm from "../../components/auth/signup/TransactionPinForm";
import { useSetPin } from "../../hooks/useAuth";
import { authClient } from "../../lib/auth-client";
import { RoutePath } from "../../routes/routePath";
import { authAtom, type User } from "../../store/jotai";

interface TransactionPinFormData {
  pin: string;
  confirmPin: string;
}

function CreatePin() {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { mutateAsync: setPin } = useSetPin();
  const [, setUser] = useAtom(authAtom);
  const navigate = useNavigate();
  const handleFormSubmit = async (data: TransactionPinFormData) => {
    setIsLoading(true);
    const payload = {
      pin: data.pin,
    };
    setPin(payload, {
      onSuccess: () => {
        toast.success("PIN set successfully");
        authClient.getSession(undefined, {
          onSuccess: (data) => {
            setUser(data?.data?.user as User);
          },
        });
        setIsLoading(false);
        navigate(RoutePath.DASHBOARD);
      },
      onError: (error) => {
        toast.error(error?.message ?? "Failed to set PIN");
        setIsLoading(false);
      },
    });

    setIsLoading(false);
  };

  const handleDone = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="py-6 px-5 h-svh flex-col flex justify-between">
      <div className="space-y-10">
        <AuthHeader
          title="create transaction pin"
          description="For your security, set a 4-digit PIN to authorize withdrawals and sensitive actions."
          isLink={false}
        />
        <TransactionPinForm ref={formRef} onSubmit={handleFormSubmit} />
      </div>
      <div className="flex-col flex items-center w-full">
        <Button
          variants="primary"
          handleClick={handleDone}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Done"}
        </Button>
      </div>
    </div>
  );
}
export default CreatePin;
