import Button from "../../common/ui/button";
import AuthHeader from "../../components/auth/header";
import TransactionPinForm from "../../components/auth/signup/TransactionPinForm";

function CreatePin() {
  return (
    <div className="py-6 px-5 h-svh flex-col flex justify-between">
      <div className="space-y-10">
        <AuthHeader
          title="create transaction pin"
          description="For your security, set a 4-digit PIN to authorize withdrawals and sensitive actions."
          isLink={false}
        />
        <TransactionPinForm />
      </div>
      <div className="flex-col flex items-center w-full">
        <Button variants="primary">Done</Button>
      </div>
    </div>
  );
}
export default CreatePin;
