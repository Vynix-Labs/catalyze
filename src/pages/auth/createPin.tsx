import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../common/ui/button";
import AuthHeader from "../../components/auth/header";
import TransactionPinForm from "../../components/auth/signup/TransactionPinForm";

interface TransactionPinFormData {
  pin: string;
  confirmPin: string;
}

function CreatePin() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (data: TransactionPinFormData) => {
    setIsLoading(true);
    const payload = {
      pin: data.pin,
    };
    console.log(payload);
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
