// App.jsx
import { useState } from "react";
import WhatIfDemo from "./WhatIfDemo";

const API_BASE = "/api";

export default function App() {
  const [view, setView] = useState("food"); 
  const [item, setItem] = useState("vegetable");
  const [amountKg, setAmountKg] = useState(0.5);
  const [result, setResult] = useState(null); // { kg_co2e, ef, ... }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 計算碳排
  const estimateFood = async (item, amount_kg) => {
    const res = await fetch(`${API_BASE}/estimate/food`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, amount_kg }),
    });
    if (!res.ok) throw new Error(`Estimate failed: ${res.status}`);
    return res.json();
  };

  // 儲存活動紀錄
  const createActivity = async ({ user_id, payload, kg_co2e }) => {
    const res = await fetch(`${API_BASE}/activities/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        type: "food",
        payload,
        kg_co2e,
      }),
    });
    if (!res.ok) throw new Error(`Create failed: ${res.status}`);
    return res.json();
  };

  // 取得暫存活動紀錄
  const fetchActivities = async () => {
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/activities`);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.json();
      console.log("暫存活動紀錄:", data);
      alert(`暫存活動紀錄筆數: ${data.length} `);
    } catch (e) {
      console.error(e);
      alert("取得活動紀錄失敗");
    } finally {
      setLoading(false);
    }
  };

  const onCalculate = async () => {
    setError(""); setLoading(true);
    try {
      if (!amountKg || amountKg <= 0) throw new Error("amount_kg 必須 > 0");
      const data = await estimateFood(item, Number(amountKg));
      setResult(data);
    } catch (e) {
      setError(e.message || "發生錯誤");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!result) return;
    setError(""); setLoading(true);
    try {
      const resp = await createActivity({
        user_id: 1,
        payload: { item, amount_kg: Number(amountKg), ef: result.ef },
        kg_co2e: result.kg_co2e,
      });
      if (resp.status !== "success") throw new Error("後端回應非 success");
      alert(`已寫入活動紀錄（id: ${resp.activity_id}）`);
    } catch (e) {
      setError(e.message || "寫入失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ maxWidth: 420, margin: "0 auto" }}
    >
      {/* 畫面切換按鈕 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setView("food")}>🥦 食物碳排試算</button>
        <button onClick={() => setView("whatif")}>🚗 What-if 減碳模擬</button>
      </div>

      {/* food 模式 */}
      {view === "food" ? (
        <div>
          <h2>Food 碳排試算</h2>
          <div className="form-row">
            <label>選擇食物種類：</label>
            <select value={item} onChange={e => setItem(e.target.value)}>
              <option value="vegetable">vegetable</option>
              <option value="beef">beef</option>
              <option value="pork">pork</option>
            </select>

            <label>重量： (kg)</label>
            <input
              type="number"
              step="0.1"
              value={amountKg}
              onChange={e => setAmountKg(e.target.value)}
              min="0"
            />
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={onCalculate} disabled={loading}>
              計算碳排
            </button>
            <button onClick={onSave} disabled={loading || !result}>
              送出紀錄
            </button>
            <button onClick={fetchActivities} disabled={loading}>
              查看暫存活動
            </button>
          </div>

          {loading && <p>寫入中…</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {result && (
            <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd" }}>
              <div>
                CO₂e：<b>{result.kg_co2e} kg</b>
              </div>
              <div>EF(排放因子)：{result.ef}</div>
              <small>
                輸入：{item} × {amountKg} kg
              </small>
            </div>
          )}
        </div>
      ) : (
        <WhatIfDemo />
      )}
    </div>
  );
}
