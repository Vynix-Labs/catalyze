import { createBrowserRouter } from "react-router-dom";
import { RoutePath } from "./routePath";
import Onboarding from "../pages/onBoarding";
import SignUp from "../pages/signup";

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
    ],
  },
]);
