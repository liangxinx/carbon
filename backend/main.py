from fastapi import FastAPI
from pydantic import BaseModel
import csv
from collections import defaultdict

app = FastAPI()

EF = defaultdict(dict) 

# --- 讀取 CSV 數據並填充 EF 字典（只關注 'food' 類別）---
try:
    with open('emission_factors.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            category = row['category']
            key = row['key']
            value = float(row['value'])
            
            # 確保只讀取 'food' 類別的數據
            if category == "food":
                EF[category][key] = value
            # 如果之後要支持其他類別，可以在這裡擴展
except FileNotFoundError:
    print("Error: emission_factors.csv not found. Please make sure it's in the same directory.")
    # 如果文件不存在，EF 字典將會是空的，後續計算會返回 0
except ValueError as e:
    print(f"Error parsing CSV value: {e}. Please check data format.")

# --- Pydantic 模型定義 for Food ---
class FoodReq(BaseModel):
    item: str  # 例如: "beef", "chicken", "vegetable"
    amount_kg: float # 食物重量，單位公斤

# --- FastAPI 端點定義 ---

@app.get("/health")
def health():
    """
    健康檢查端點，返回服務狀態和排放係數版本。
    """
    return {"ok": True, "ef_version": "2025.1"} # 硬編碼版本號，或從數據中提取

@app.post("/estimate/food") # 新的端點名稱
def estimate_food(req: FoodReq):
    """
    計算指定食物種類和重量的碳排放量。
    """
    # 從 EF 字典的 'food' 類別中獲取對應的排放係數
    # 如果找不到該食物，默認為 0.0
    ef = EF["food"].get(req.item, 0.0)
    
    # 計算碳排放量
    kg_co2e = round(req.amount_kg * ef, 6)
    
    # 返回計算結果以及輸入參數
    return {
        "kg_co2e": kg_co2e,
        "item": req.item,
        "amount_kg": req.amount_kg,
        "ef": ef
    }