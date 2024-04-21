import axois from "axios";

export const BASE_URL = "http://127.0.0.1:8000";

export const api = axois.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { Accept: "application/json" },
});
