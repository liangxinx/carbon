// CarbonEstimateDemo.jsx
import { useState } from "react";

const API_BASE = "/api"; 

export default function CarbonEstimateDemo() {
  const [item, setItem] = useState("vegetable");
  const [amountKg, setAmountKg] = useState(0.5);
  const [result, setResult] = useState(null);      // { kg_co2e, ef, ... }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const estimateFood = async (item, amount_kg) => {
    const res = await fetch(`${API_BASE}/estimate/food`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, amount_kg }),
    });
    if (!res.ok) throw new Error(`Estimate failed: ${res.status}`);
    return res.json(); // expected: { kg_co2e, item, amount_kg, ef }
  };

  const createActivity = async ({ user_id, payload, kg_co2e }) => {
    const res = await fetch(`${API_BASE}/activities/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        type: "food",
        payload,      // e.g. { item, amount_kg, ef }
        kg_co2e,
      }),
    });
    if (!res.ok) throw new Error(`Create failed: ${res.status}`);
    return res.json(); // expected: { status: "success", activity_id: ... }
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

  // 儲存活動紀錄到後端 目前後端尚未做這部分 [1024 沈]
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
    <div style={{ maxWidth: 420 }}>
      <h2>Food 碳排試算</h2>
      <div className="form-row">
        <label>選擇食物種類：</label>
        <select value={item} onChange={e=>setItem(e.target.value)}>
          <option value="vegetable">vegetable</option>
          <option value="beef">beef</option>
          <option value="pork">pork</option>
        </select>

        <label>重量： (kg)</label>
        <input
          type="number"
          step="0.1"
          value={amountKg}
          onChange={e=>setAmountKg(e.target.value)}
          min="0"
        />
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={onCalculate} disabled={loading}>計算碳排</button>
        <button onClick={onSave} disabled={loading || !result}>
          送出紀錄（/activities/create）
        </button>
      </div>

      {loading && <p>計算/寫入中…</p>}
      {error && <p style={{color:"red"}}>{error}</p>}

      {result && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd" }}>
          <div> CO₂e：<b>{result.kg_co2e}kg</b></div>
          <div>EF(排放因子)：{result.ef}</div>
          <small>輸入：{item} × {amountKg} kg</small>
        </div>
      )}
    </div>
  );
}
