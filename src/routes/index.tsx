import { createBrowserRouter } from "react-router-dom";
import { RoutePath } from "./routePath";
import Onboarding from "../pages/onBoarding";
import SignUp from "../pages/signup";
import Home from "../pages/home";
import NotFound from "../pages/notFound";

export const routes = createBrowserRouter([
  {
    path: "/home",
    element: <Home />,
    errorElement: <NotFound />, // handles errors on this route
  },
  {
    path: "/",
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
    ],
  },
]);
