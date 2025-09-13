import AuthFooter from "../../common/auth/AuthFooter";
import CreateNewPasswordForm from "../../components/auth/forget-password/CreateNewPasswordForm";
import AuthHeader from "../../components/auth/header";

function CreatePassword() {
  return (
    <div className="h-svh py-6 px-5   flex-col flex justify-between">
      <div className="space-y-10">
        <AuthHeader
          title="create new password"
          isLink={false}
          description="Enter a strong new password to secure your account and keep your investments safe."
        />
        <CreateNewPasswordForm />
      </div>
      <AuthFooter text="Proceed" />
    </div>
  );
}

export default CreatePassword;
