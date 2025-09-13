import { createBrowserRouter } from "react-router-dom";
import { RoutePath } from "./routePath";
import Onboarding from "../pages/auth/onBoarding";
import SignUp from "../pages/auth/signup";
import VerifyEmail from "../pages/auth/verifyEmail";

export const routes = createBrowserRouter([
  {
    path: RoutePath.ROOT,
    element: <Onboarding />,
  },
  {
    path: "/auth",
    children: [
      {
        path: RoutePath.CREATE_ACCOUNT,
        element: <SignUp />,
      },
      {
        path: RoutePath.RESET_OTP,
        element: <VerifyEmail />,
      },
    ],
  },
]);
