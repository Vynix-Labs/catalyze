import {
  // AppleIcon,
  GoogleIcon,
} from "../../assets/svg";
import Button from "../ui/button";
import { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { RoutePath } from "../../routes/routePath";

function ThirdPartyAuth() {
  const [isLoading, setIsLoading] = useState<null | "google" | "apple">(null);

  const handleGoogle = async () => {
    if (isLoading) return;
    setIsLoading("google");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}${RoutePath.SIGNIN}`,
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="gap-y-2 flex flex-col items-center w-full">
      {/* <Button variants="secondary">
        <AppleIcon />
        <span>continue with apple</span>
      </Button> */}
      <Button
        variants="secondary"
        handleClick={handleGoogle}
        disabled={isLoading === "google"}
      >
        <GoogleIcon />
        <span>
          {isLoading === "google" ? "redirecting..." : "continue with google"}
        </span>
      </Button>
    </div>
  );
}
export default ThirdPartyAuth;
