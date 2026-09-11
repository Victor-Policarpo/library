import api from "./api.js";

export const libraryService = {
  list: () => api.get("/libraries").then((response) => response.data),

  get: (id) => api.get(`/libraries/${id}`).then((response) => response.data),

  create: (payload) => api.post("/libraries", payload).then((response) => response.data),

  update: (id, payload) => api.put(`/libraries/${id}`, payload).then((response) => response.data),

  remove: (id) => api.delete(`/libraries/${id}`).then((response) => response.data),
};