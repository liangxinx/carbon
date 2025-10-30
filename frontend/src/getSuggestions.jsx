import { carbonSuggestions } from "./rules.jsx";

export function getSuggestions(type, payload) {
  return carbonSuggestions
    .filter(rule => rule.type === type && rule.condition(payload))
    .map(rule => rule.text);
}
