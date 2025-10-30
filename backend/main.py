from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from collections import defaultdict
import csv

app = FastAPI()

# ----------------------
# CORS 設定
# ----------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # 允許的前端來源
    allow_credentials=True,
    allow_methods=["*"],         # 允許 GET, POST, PUT, DELETE…
    allow_headers=["*"],         # 允許所有標頭
)

# ----------------------
# 暫存活動紀錄
# ----------------------
activities_db = []
next_activity_id = 1  # 模擬自動增加的 ID

# ----------------------
# 讀取 CSV 排放因子（food）
# ----------------------
EF = defaultdict(dict)
try:
    with open('emission_factors.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            category = row['category']
            key = row['key']
            value = float(row['value'])
            if category == "food":
                EF[category][key] = value
except FileNotFoundError:
    print("⚠️ emission_factors.csv not found. Please put it in backend folder.")

# ----------------------
# Pydantic 模型
# ----------------------
class FoodReq(BaseModel):
    item: str
    amount_kg: float

class ActivityReq(BaseModel):
    user_id: int
    type: str
    payload: Dict[str, Any]
    kg_co2e: float

# ----------------------
# API
# ----------------------
@app.get("/health")
def health():
    return {"ok": True, "ef_version": "2025.1"}

@app.post("/estimate/food")
def estimate_food(req: FoodReq):
    ef = EF["food"].get(req.item, 0.0)
    kg_co2e = round(req.amount_kg * ef, 6)
    return {"kg_co2e": kg_co2e, "item": req.item, "amount_kg": req.amount_kg, "ef": ef}

@app.post("/activities/create")
def create_activity(req: ActivityReq):
    global next_activity_id
    activity = {
        "activity_id": next_activity_id,
        "user_id": req.user_id,
        "type": req.type,
        "payload": req.payload,
        "kg_co2e": req.kg_co2e,
    }
    activities_db.append(activity)
    next_activity_id += 1
    return {"status": "success", "activity_id": activity["activity_id"]}

@app.get("/activities")
def list_activities():
    return activities_db
