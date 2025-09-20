export type TabOption = {
  key: string;
  label: string;
};

export interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string; // optional styling override
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div
      className={`p-1.5 flex overflow-x-scroll items-center bg-neutral-100  rounded-md ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`text-sm p-2 w-full  rounded-md transition-colors ${
            activeTab === tab.key
              ? "bg-white text-black font-bold shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
