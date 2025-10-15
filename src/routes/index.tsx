import { createBrowserRouter } from "react-router-dom";
import EnterAmountPageWrapper from "../components/EnterAmountPageWrapper";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../layout";
import CreatePassword from "../pages/auth/CreatePassword";
import CreatePin from "../pages/auth/createPin";
import ForgetPassword from "../pages/auth/forget-password";
import Login from "../pages/auth/login";
import Onboarding from "../pages/auth/onBoarding";
import SignUp from "../pages/auth/signup";
import VerifyEmail from "../pages/auth/verifyEmail";
import Home from "../pages/dashboard";
import CryptoTransferFlow from "../pages/dashboard/CryptoTransferFlow";
import InvestmentPage from "../pages/investment";
import LandingPage from "../pages/landing/page";
import MorePage from "../pages/more";
import StakingPage from "../pages/more/staking";
import NotFound from "../pages/notFound";
import RewardPage from "../pages/reward";
import PersonalInfo from "../pages/settings/personalInfo";
import SetPin from "../pages/settings/setPin";
import Settings from "../pages/settings/settings";
import UpdatePassword from "../pages/settings/updatePassword";
import { RoutePath } from "./routePath";
import ClaimRewardsPageWrapper from "../components/ClaimRewardPageWrapper";
import TransactionDetailsPage from "../pages/dashboard/transactionDetails";
import AssetDetail from "../pages/dashboard/AssetDetails";

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
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> }, // index route
      { path: "more", element: <MorePage /> },
      { path: "investment", element: <InvestmentPage /> },
      { path: "reward", element: <RewardPage /> },
      { path: "more/staking", element: <StakingPage /> },
      { path: "transactions", element: <TransactionDetailsPage /> },
      { path: "asset/:token", element: <AssetDetail /> },
      { path: "more/staking/claim-reward", element: <ClaimRewardsPageWrapper /> },
      {
        path: "more/staking/:crypto",
        element: <EnterAmountPageWrapper />, // Use the wrapper instead of direct component
      },
      { path: "transfer", element: <CryptoTransferFlow /> },
      { path: "more/settings", element: <Settings /> },
    ],
  },
  // Nested route under settings (protected)
  {
    path: RoutePath.PERSONAL_INFO,
    element: (
      <ProtectedRoute>
        <PersonalInfo />
      </ProtectedRoute>
    ),
  },
  {
    path: RoutePath.TRANSACTION_PIN,
    element: (
      <ProtectedRoute>
        <SetPin />
      </ProtectedRoute>
    ),
  },
  {
    path: RoutePath.UPDATE_PASSWORD,
    element: (
      <ProtectedRoute>
        <UpdatePassword />
      </ProtectedRoute>
    ),
  },

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
