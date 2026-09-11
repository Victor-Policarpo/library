import api from "./api.js";

export async function login(email, password) {
  const response = await api.post("/auth", { email, password });
  return response.data;
}