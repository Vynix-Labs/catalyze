// components/EmptyState.tsx
import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionButton,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-2xl p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-gray-800 font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-4">{description}</p>
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="bg-primary-100 text-white font-semibold py-2 px-6 rounded-full hover:opacity-90 transition"
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
};
