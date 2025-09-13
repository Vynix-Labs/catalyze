import AuthFooter from "../../common/auth/AuthFooter";
import ForgetPasswordForm from "../../components/auth/forget-password/ForgetPasswordForm";
import AuthHeader from "../../components/auth/header";

function ForgetPassword() {
  return (
    <div className="py-6 px-5 h-svh flex flex-col justify-between">
      <div className="space-y-10">
        <AuthHeader
          title="forgot password"
          description="Enter the email linked to your account and we’ll send you a reset link."
          isLink={false}
        />
        <ForgetPasswordForm />
      </div>

      <AuthFooter text="Proceed" />
    </div>
  );
}
export default ForgetPassword;
