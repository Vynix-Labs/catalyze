import { Home, TrendingUp, Trophy, MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";

interface StakingEmptyStateProps {
  title?: string;
  subtitle?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  showBottomNav?: boolean;
  customIcon?: ReactNode;
  className?: string;
}

const StakingEmptyState = ({
  title = "Staking",
  subtitle = "Track your active stakes and rewards",
  emptyStateTitle = "No Active Stakes Yet",
  emptyStateDescription = "Start Earning Rewards By Staking Your Crypto Assets. It's Secure, Beginner-Friendly, And You Can Begin With Small Amounts.",
  primaryButtonText = "Available Pools",
  secondaryButtonText = "Learn Staking",
  onPrimaryAction,
  onSecondaryAction,
  showBottomNav = true,
  customIcon,
  className = "",
}: StakingEmptyStateProps) => {
  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${className}`}>
      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Empty State Card */}
        <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 text-center max-w-md mx-auto">
          {customIcon && (
            <div className="mb-4 flex justify-center">{customIcon}</div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {emptyStateTitle}
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {emptyStateDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onPrimaryAction}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              {primaryButtonText}
            </button>

            <button
              onClick={onSecondaryAction}
              className="flex-1 bg-white text-blue-600 py-3 px-6 rounded-full font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              {secondaryButtonText}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Optional */}
      {showBottomNav && (
        <div className="bg-white border-t border-gray-200 px-6 py-3 safe-area-bottom">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <button className="flex flex-col items-center gap-1 py-2 px-4">
              <Home className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-600">Home</span>
            </button>

            <button className="flex flex-col items-center gap-1 py-2 px-4">
              <TrendingUp className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-600">Investment</span>
            </button>

            <button className="flex flex-col items-center gap-1 py-2 px-4">
              <Trophy className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-600">Rewards</span>
            </button>

            <button className="flex flex-col items-center gap-1 py-2 px-4">
              <MoreHorizontal className="w-6 h-6 text-blue-600" />
              <span className="text-xs text-blue-600 font-semibold">More</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StakingEmptyState;
