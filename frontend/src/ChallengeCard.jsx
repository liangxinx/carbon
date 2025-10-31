import { useState } from "react";

export default function ChallengeCard({ challenge }) {
    const [completedDays, setCompletedDays] = useState(challenge.completedDays || 0);

    const handleCompleteDay = () => {
        if (completedDays < challenge.totalDays) {
            setCompletedDays(completedDays + 1);
        }
    };

    const isFinished = completedDays >= challenge.totalDays;

    return (
        <div
            style={{
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                background: isFinished ? "#d4edda" : "#f0f0f0",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
        >
            <h3 style={{ margin: 0 }}>{challenge.title} {isFinished && "🏆"}</h3>
            <p style={{ margin: "4px 0" }}>{challenge.description}</p>

            <div style={{ fontSize: 12, marginBottom: 8 }}>
                {completedDays} / {challenge.totalDays} 天完成
            </div>

            <div style={{ height: 8, borderRadius: 4, background: "#ddd", overflow: "hidden", marginBottom: 8 }}>
                <div
                    style={{
                        width: `${(completedDays / challenge.totalDays) * 100}%`,
                        height: "100%",
                        background: "#4caf50",
                        transition: "width 0.3s",
                    }}
                />
            </div>

            <p style={{ fontSize: 12, color: "#555" }}>
                已減少碳排：{(completedDays * challenge.co2PerDay).toFixed(2)} kg CO₂e
            </p>

            <button
                onClick={handleCompleteDay}
                disabled={isFinished}
                style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: isFinished ? "#ccc" : "#4caf50",
                    color: "white",
                    cursor: isFinished ? "default" : "pointer",
                }}
            >
                {isFinished ? "已完成" : "完成今日任務 ✅"}
            </button>
        </div>
    );
}
