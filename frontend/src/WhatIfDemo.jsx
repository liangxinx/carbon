import { useState } from "react";

const API_BASE = "/api"; // ⚠️ 跟 App.jsx 一樣的 base

export default function WhatIfDemo() {
  const [currentMode, setCurrentMode] = useState("motorcycle");
  const [currentKm, setCurrentKm] = useState(10);
  const [newMode, setNewMode] = useState("metro");
  const [newKm, setNewKm] = useState(10);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSimulate = async () => {
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/simulate/what-if`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_mode: currentMode,
          current_km: Number(currentKm),
          new_mode: newMode,
          new_km: Number(newKm),
        }),
      });
      if (!res.ok) throw new Error("伺服器回應錯誤");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "發生未知錯誤");
    } finally {
      setLoading(false);
    }
  };

// ... (WhatIfDemo.jsx)

  return (
    // 💡 為了讓排版好看，我們把外層 div 換成 React.Fragment (<>...</>)
    //    這樣它就不會繼承 .app-container div 的方塊樣式
    <> 
      <h2>🚗 What-if 減碳模擬</h2>
      
      {/* 💡 用 div 包起來，並加上間距 */}
      <div style={{ marginBottom: '12px', textAlign: 'left' }}>
        <label>
          現在的交通方式：
          <select value={currentMode} onChange={(e) => setCurrentMode(e.target.value)}>
            <option value="car">car</option>
            <option value="motorcycle">motorcycle</option>
            <option value="metro">metro</option>
            <option value="bike">bike</option>
            <option value="walk">walk</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '12px', textAlign: 'left' }}>
        <label>
          現在每天公里數：
          <input type="number" value={currentKm} onChange={(e) => setCurrentKm(e.target.value)} />
        </label>
      </div>

      <div style={{ marginBottom: '12px', textAlign: 'left' }}>
        <label>
          改成的交通方式：
          <select value={newMode} onChange={(e) => setNewMode(e.target.value)}>
            <option value="car">car</option>
            <option value="motorcycle">motorcycle</option>
            <option value="metro">metro</option>
            <option value="bike">bike</option>
            <option value="walk">walk</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <label>
          改成後每天公里數：
          <input type="number" value={newKm} onChange={(e) => setNewKm(e.target.value)} />
        </label>
      </div>

      <button onClick={handleSimulate} disabled={loading}>
        {loading ? "計算中..." : "開始模擬"}
      </button>

      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

      {result && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ccc" }}>
          <p>目前碳排：{result.current_co2} kg CO₂e</p>
          <p>新方案碳排：{result.new_co2} kg CO₂e</p>
          <p style={{ color: "green" }}>
            減碳量：<b>{result.reduction} kg CO₂e</b>
          </p>
        </div>
      )}
    </> // 💡 結束 React.Fragment
  );
}
