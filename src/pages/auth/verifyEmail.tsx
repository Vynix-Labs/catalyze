import OtpInput from "../../common/auth/OtpInput";
import Button from "../../common/ui/button";
import AuthHeader from "../../components/auth/header";

function VerifyEmail() {
  return (
    <div className="py-6 h-svh flex-col flex justify-between px-5">
      <div className="space-y-10">
        <AuthHeader
          title="verify email address"
          description="Enter the 6-digit code we just sent to your email to verify your account."
          isLink={false}
        />
        <OtpInput />
      </div>
      <div>
        <div className="flex-col flex items-center w-full">
          <Button variants="primary">proceed</Button>
        </div>
      </div>
    </div>
  );
}
export default VerifyEmail;
