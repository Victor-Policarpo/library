import api from "./api.js";

export const userService = {
  create: (payload) => api.post("/users", payload).then((response) => response.data),

  getById: (id) => api.get(`/users/${id}`).then((response) => response.data),

  update: (id, payload) => api.put(`/users/${id}`, payload).then((response) => response.data),
};