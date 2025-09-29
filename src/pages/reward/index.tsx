import { useState } from "react";
import Tabs from "../../components/Tabs";
import {
  FileIcon,
  GiftIcon,
  HandCoinIcon,
  MedalIcon,
  StarIcon,
} from "../../assets/svg";

const RewardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeItem, setActiveItem] = useState(3);

  const streaks = [
    {
      id: "learning",
      value: 12,
      label: "Learning",
      icon: <FileIcon className="w-8 h-8 text-secondary-100" />,
      bg: "bg-secondary-300",
    },
    {
      id: "investing",
      value: 23,
      label: "Investing",
      icon: <HandCoinIcon className="w-8 h-8 text-success-500" />,
      bg: "bg-success-100",
    },
    {
      id: "daily",
      value: 7,
      label: "Daily Check",
      icon: <StarIcon className="w-8 h-8 text-primary-100" />,
      bg: "bg-primary-50",
    },
  ];

  // Sample active stakes data
  const Milestones = [
    {
      id: 1,
      title: "Learning Enthusiast",
      description: "Complete T1 Learning Modules",
      progress: 75,
      currentStep: "7/10",
      completionText: "75% Complete",
      reward: "100 Tokens",
    },
    {
      id: 2,
      title: "Smart Investor",
      description: "Finish 5 Investment Challenges",
      progress: 40,
      currentStep: "2/5",
      completionText: "40% Complete",
      reward: "250 Tokens",
    },
    {
      id: 3,
      title: "Daily Streak Master",
      description: "Log in 7 consecutive days",
      progress: 35,
      currentStep: "3/7",
      completionText: "35% Complete",
      reward: "50 Tokens",
    },
  ];

  const leaderboardData = [
    { id: 1, name: "InvestorPro_234", points: 1000 },
    { id: 2, name: "CryptoKing_892", points: 450 },
    { id: 3, name: "You", points: 250, isUser: true },
    { id: 4, name: "StakeMaster_567", points: 400 },
  ];

  const [claimedRewards, setClaimedRewards] = useState<number[]>([]);

  const handleClaim = (id: number) => {
    setClaimedRewards([...claimedRewards, id]);
  };

  const rewards = [
    {
      id: 1,
      title: "7-Day Learning Streak",
      description: "Completed Lessons For 7 Days Straight",
      tokens: "100 Tokens",
    },
    {
      id: 2,
      title: "Investment Milestone",
      description: "Made 5 Successful Investments",
      tokens: "100 Tokens",
    },
    {
      id: 3,
      title: "Daily Check-In Bonus",
      description: "Logged In For 14 Consecutive Days",
      tokens: "100 Tokens",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 p-4">
        <h1 className="text-3xl font-bold text-gray-800">Rewards</h1>
        <p className="text-gray-600">Track Your Progress And Earn Rewards</p>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        tabs={[
          { key: "overview", label: "Overview" },
          { key: "challenges", label: "Challenges" },
          { key: "leaderboard", label: "Leaderboard" },
          { key: "rewards", label: "Rewards" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content based on active tab */}
      {activeTab === "overview" && (
        <div className="space-y-6 p-4 text-white">
          <div className="bg-blue-50 p-4 rounded-xl bg-gradient-to-t from-[#7540EA] to-[#4057EB] h-full flex flex-col justify-center space-y-2">
            <div className="flex gap-2 items-start">
              <div className="bg-[#DAE5FFE5] p-2 rounded-full w-fit">
                <MedalIcon className="w-10 h-10 text-primary-100" />
              </div>
              <div className="flex flex-col text-white">
                <p className="font-bold">Level 4</p>
                <p className="">Complete more challenges to reach Level 3</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-2 w-full bg-[#B8D2FF]/60 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#B8D2FF] transition-all duration-300"
                  style={{ width: `${70}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="">40/100 XP</span>
                <span className="">Next: Level 5</span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white">2,750</h3>
              <p className="text-sm text-neutral-300">Total hours</p>
            </div>
          </div>

          {/* Activity Streaks */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Activity Streaks
            </h2>

            <div className="flex w-full justify-between items-center gap-4 border border-gray-200 rounded-lg p-4">
              {streaks.map((streak) => (
                <div
                  key={streak.id}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`${streak.bg} p-3 rounded-full flex items-center justify-center`}
                  >
                    {streak.icon}
                  </div>
                  <h3 className="text-base py-2 font-bold text-gray-800">
                    {streak.value}
                  </h3>
                  <p className="text-sm text-gray-600">{streak.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Current Milestones */}
          <div className="">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Current Milestones
            </h2>

            {/* Milestone 1 */}
            <div className="space-y-4">
              {Milestones.map((stake) => {
                return (
                  <div
                    key={stake.id}
                    className="bg-white rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-[#DAE5FFE5] p-2 rounded-full">
                        <MedalIcon className="w-8 h-8 text-primary-100" />
                      </div>

                      <div className="text-sm">
                        <h3 className="font-bold text-gray-800">
                          {stake.title}
                        </h3>
                        <p className=" text-gray-600">{stake.description}</p>
                      </div>
                    </div>

                    <div className="">
                      <div className="flex justify-between w-full">
                        <p className="text-gray-500 text-sm font-medium">
                          Progress
                        </p>
                        <span className="text-gray-500 text-xs">
                          {stake.progress}%
                        </span>
                      </div>

                      <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-neutral-900 transition-all duration-300"
                          style={{ width: `${stake.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{stake.currentStep}</span>
                        <span>{stake.completionText}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <div className="flex gap-2 items-center text-xs text-gray-100">
                        <GiftIcon className="w-4 h-4 text-[#0092B8]" />
                        <span>
                          Reward: <b>{stake.reward}</b>
                        </span>
                      </div>

                      <div>
                        <button className="px-4 py-2 text-sm cursor-pointer border-primary-100 text-primary-100 border rounded-lg">
                          continue
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === "challenges" && (
        <div className=" p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Explore Challenges
          </h2>
          <div className="">
            {/* Milestone 1 */}
            <div className="space-y-4">
              {Milestones.map((stake) => {
                return (
                  <div
                    key={stake.id}
                    className="bg-white rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-[#DAE5FFE5] p-2 rounded-full">
                        <MedalIcon className="w-8 h-8 text-primary-100" />
                      </div>

                      <div className="text-sm">
                        <h3 className="font-bold text-gray-800">
                          {stake.title}
                        </h3>
                        <p className=" text-gray-600">{stake.description}</p>
                      </div>
                    </div>

                    <div className="">
                      <div className="flex justify-between w-full">
                        <p className="text-gray-500 text-sm font-medium">
                          Progress: <b>1/3</b>
                        </p>
                        <span className="text-gray-500 text-xs">
                          4 days left
                        </span>
                      </div>

                      <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-neutral-900 transition-all duration-300"
                          style={{ width: `${stake.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <div className="flex gap-2 items-center text-xs text-gray-100">
                        <GiftIcon className="w-4 h-4 text-[#0092B8]" />
                        <span>
                          Reward: <b>{stake.reward}</b>
                        </span>
                      </div>

                      <div>
                        <button className="px-4 py-2 text-sm cursor-pointer bg-primary-100 text-white rounded-lg">
                          start
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>{" "}
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="p-4 ">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Leaderboard</h2>

          <div className="space-y-2">
            {leaderboardData.map((player) => {
              // Check if this item is currently active
              const isHighlighted = activeItem === player.id;
              return (
                <div
                  key={player.id}
                  className={`flex justify-between items-center p-5 rounded-lg border 
              ${
                isHighlighted
                  ? "bg-blue-50 border-blue-300"
                  : "bg-white border-gray-200"
              }`}
                  onClick={() => setActiveItem(player.id)}
                >
                  <div className="flex items-center gap-2">
                    {player.isUser ? (
                      <MedalIcon className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                        {player.name.charAt(0)}
                      </div>
                    )}

                    <span
                      className={`text-sm font-bold ${
                        player.isUser ? "text-blue-700" : "text-gray-700"
                      }`}
                    >
                      {player.name}
                    </span>
                  </div>

                  <span className="text-base flex flex-col font-black text-black">
                    {player.points}
                    <span className="text-xs text-gray-500">points</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "rewards" && (
        <div className=" p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Rewards</h2>

          <div className="max-w-4xl mx-auto">
            {/* Rewards Grid */}
            <div className="grid grid-cols-1  gap-6">
              {rewards.map((reward) => (
                <div key={reward.id} className="bg-white rounded-xl">
                  <div className="p-5 flex justify-between">
                    <div className="flex gap-2">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                        icons
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2">
                          {reward.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 max-w-48">
                          {reward.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-bold mb-5">
                          <GiftIcon className="text-green-500" />
                          {reward.tokens}
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleClaim(reward.id)}
                        disabled={claimedRewards.includes(reward.id)}
                        className={`w-full py-2 px-4 rounded-lg transition-colors ${
                          claimedRewards.includes(reward.id)
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {claimedRewards.includes(reward.id)
                          ? "Claimed"
                          : "Claim"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardPage;
