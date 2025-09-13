import AuthFooter from "../../common/auth/AuthFooter";
import Divider from "../../common/auth/Divider";
import ThirdPartyAuth from "../../common/auth/ThirdPartyAuth";
import AuthHeader from "../../components/auth/header";
import SignUpForm from "../../components/auth/signup/form";
import { RoutePath } from "../../routes/routePath";
const link = {
  url: RoutePath.SIGNIN,
  text: "Log In",
};
function SignUp() {
  return (
    <div className="py-6 px-5 flex flex-col justify-between h-svh">
      <div className="space-y-10">
        <AuthHeader
          title="Create an account easily"
          description="Already have an account? "
          isLink
          link={link}
        />

        <SignUpForm />
        <Divider />
        <ThirdPartyAuth />
      </div>
      <div className="space-y-8">
        <div className="flex gap-3 items-center">
          <input type="checkbox" name="" id="" />
          <p className="text-sm font-semibold leading-6">
            By registering, you accept our{" "}
            <span className="text-primary-100 font-black">Terms of Use </span>{" "}
            and{" "}
            <span className="text-primary-100 font-black">
              Privacy Policies
            </span>
          </p>
        </div>
        <AuthFooter text="Proceed" />
      </div>
    </div>
  );
}
export default SignUp;
