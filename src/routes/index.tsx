import { createBrowserRouter } from "react-router-dom";
import { RoutePath } from "./routePath";
import Home from "../pages/home";
import NotFound from "../pages/notFound";
import VerifyEmail from "../pages/auth/verifyEmail";
import Onboarding from "../pages/auth/onBoarding";
import SignUp from "../pages/auth/signup";
import CreatePin from "../pages/auth/createPin";

export const routes = createBrowserRouter([
  {
    path: RoutePath.DASHBOARD,
    element: <Home />,
    errorElement: <NotFound />, // handles errors on this route
  },
  {
    path: RoutePath.ROOT,
    element: <Onboarding />,
  },
  {
    path: "*", // catch-all
    element: <NotFound />,
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
      {
        path: RoutePath.CREATE_TRANSACTION_PIN,
        element: <CreatePin />,
      },
    ],
  },
]);
