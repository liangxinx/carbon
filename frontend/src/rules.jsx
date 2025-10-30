export const carbonSuggestions = [
  {
    type: "food",
    condition: ({ item, amount_kg }) => item === "beef" && amount_kg > 0.5,
    text: "建議減少紅肉攝取，改吃蔬菜或豆類可以減少碳排。",
  },
  {
    type: "food",
    condition: ({ item, amount_kg }) => item === "pork" && amount_kg > 1,
    text: "過量肉類會增加碳足跡，建議控制份量。",
  },
  {
    type: "transport",
    condition: ({ current_mode, new_mode }) => current_mode === "car" && new_mode === "metro",
    text: "使用大眾運輸代替開車可以顯著降低碳排。",
  },
  {
    type: "transport",
    condition: ({ current_km }) => current_km > 20,
    text: "每日行駛距離過長，考慮共乘或搭乘公共交通工具。",
  },
];
