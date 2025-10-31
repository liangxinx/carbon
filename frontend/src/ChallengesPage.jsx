import ChallengeCard from "./ChallengeCard";

export default function ChallengesPage() {
    const challenges = [
        {
            id: 1,
            title: "🥗 一週蔬食挑戰",
            description: "7 天內每天至少選擇一次蔬菜替代肉類",
            totalDays: 7,
            co2PerDay: 0.3, // 每天減碳 kg CO₂e
            completedDays: 0,
        },
        {
            id: 2,
            title: "🚶 步行挑戰",
            description: "連續 5 天每天步行超過 5 公里",
            totalDays: 5,
            co2PerDay: 0.2,
            completedDays: 0,
        },
    ];

    return (
        <div>
            <h2>🏆 減碳挑戰列表</h2>
            {challenges.map((ch) => (
                <ChallengeCard key={ch.id} challenge={ch} />
            ))}
        </div>
    );
}
