import axois from "axios";

export const BASE_URL = "https://api-benben.imken.dev";

export const api = axois.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { Accept: "application/json" },
});

export async function fetcher<T>(x: string) {
  return await api.get<T>(x).then(({ data }) => data);
}
