import AuthFooter from "../../common/auth/AuthFooter";
import Divider from "../../common/auth/Divider";
import ThirdPartyAuth from "../../common/auth/ThirdPartyAuth";
import AuthHeader from "../../components/auth/header";
import LoginForm from "../../components/auth/login/LoginForm";
import { RoutePath } from "../../routes/routePath";
const link = {
  url: RoutePath.CREATE_ACCOUNT,
  text: "sign up",
};
function Login() {
  return (
    <div className="py-6 px-5 h-svh flex-col flex justify-between">
      <div className="space-y-10">
        <AuthHeader
          title="log in to your account"
          description="Don’t have an account? "
          isLink
          link={link}
        />
        <div className="space-y-10 ">
          <LoginForm />
          <Divider />
          <ThirdPartyAuth />
        </div>
      </div>
      <AuthFooter text="Proceed" />
    </div>
  );
}

export default Login;
