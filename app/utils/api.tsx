import axois from 'axios';

const BASE_URL = "https://api-lgf.imken.moe";

export const api = axois.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { Accept: 'application/json' },
});

