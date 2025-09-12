import { AppleIcon, GoogleIcon } from "../../assets/svg";
import Button from "../ui/button";

function ThirdPartyAuth() {
  return (
    <div className="gap-y-2 flex flex-col items-center w-full">
      <Button variants="secondary">
        <AppleIcon />
        <span>continue with apple</span>
      </Button>
      <Button variants="secondary">
        <GoogleIcon />
        <span>continue with google</span>
      </Button>
    </div>
  );
}
export default ThirdPartyAuth;
