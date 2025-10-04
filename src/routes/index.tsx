import { createBrowserRouter } from "react-router-dom";
import { RoutePath } from "./routePath";
import Home from "../pages/dashboard";
import NotFound from "../pages/notFound";
import VerifyEmail from "../pages/auth/verifyEmail";
import Onboarding from "../pages/auth/onBoarding";
import SignUp from "../pages/auth/signup";
import CreatePin from "../pages/auth/createPin";
import Login from "../pages/auth/login";
import ForgetPassword from "../pages/auth/forget-password";
import CreatePassword from "../pages/auth/CreatePassword";
import MorePage from "../pages/more";
import InvestmentPage from "../pages/investment";
import RewardPage from "../pages/reward";
import StakingPage from "../pages/more/staking";
import CryptoTransferFlow from "../pages/dashboard/CryptoTransferFlow";
import Settings from "../pages/settings/settings";
import Layout from "../layout";
import PersonalInfo from "../pages/settings/personalInfo";
import SetPin from "../pages/settings/SetPin";
import UpdatePassword from "../pages/settings/updatePassword";
import EnterAmountPageWrapper from "../components/EnterAmountPageWrapper";
import LandingPage from "../pages/landing/page";

export const routes = createBrowserRouter([
  {
    path: RoutePath.ROOT,
    element: <Onboarding />,
    errorElement: <NotFound />,
    index: true,
  },
  { path: RoutePath.LANDING, element: <LandingPage /> },

  {
    path: "/dashboard",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> }, // index route
      { path: RoutePath.MORE, element: <MorePage /> },
      { path: RoutePath.INVESTMENT, element: <InvestmentPage /> },
      { path: RoutePath.REWARD, element: <RewardPage /> },
      { path: RoutePath.STAKING, element: <StakingPage /> },
      {
        path: RoutePath.ENTERAMOUNTPAGE,
        element: <EnterAmountPageWrapper />, // Use the wrapper instead of direct component
      },
      { path: RoutePath.TRANSFER, element: <CryptoTransferFlow /> },
      { path: RoutePath.SETTINGS, element: <Settings /> },
    ],
  },
  // Nested route under settings
  { path: RoutePath.PERSONAL_INFO, element: <PersonalInfo /> },
  {
    path: RoutePath.TRANSACTION_PIN,
    element: <SetPin />,
  },

  { path: RoutePath.UPDATE_PASSWORD, element: <UpdatePassword /> },

  {
    path: "/auth",
    children: [
      { path: RoutePath.CREATE_ACCOUNT, element: <SignUp /> },
      { path: RoutePath.RESET_OTP, element: <VerifyEmail /> },
      { path: RoutePath.CREATE_TRANSACTION_PIN, element: <CreatePin /> },
      { path: RoutePath.SIGNIN, element: <Login /> },
      { path: RoutePath.FORGOT_PASSWORD, element: <ForgetPassword /> },
      { path: RoutePath.CREATE_PASSWORD, element: <CreatePassword /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
