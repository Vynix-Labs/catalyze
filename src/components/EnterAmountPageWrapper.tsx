import { useNavigate, useLocation } from "react-router-dom";
import { RoutePath } from "../routes/routePath";
import EnterAmountPage from "../pages/more/enterAmount";


const EnterAmountPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the pool from location state
  const pool = location.state?.pool;

  // If no pool data, redirect back to staking page
  if (!pool) {
    navigate(RoutePath.STAKING);
    return null;
  }

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return <EnterAmountPage pool={pool} onBack={handleBack} />;
};

export default EnterAmountPageWrapper;
