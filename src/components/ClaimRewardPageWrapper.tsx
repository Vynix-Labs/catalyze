import { useNavigate, useLocation } from "react-router-dom";
import { RoutePath } from "../routes/routePath";
import ClaimRewardsPage from "../pages/more/claimRewards";

const ClaimRewardsPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the stake from location state
  const stake = location.state?.stake;

  // If no stake data, redirect back to staking page
  if (!stake) {
    console.warn("No stake data found, redirecting to staking page");
    navigate(RoutePath.STAKING);
    return null; // Important: return null to prevent rendering
  }

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return <ClaimRewardsPage onBack={handleBack} stake={stake} />;
};

export default ClaimRewardsPageWrapper;
