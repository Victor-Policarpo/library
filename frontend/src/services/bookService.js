import api from "./api.js";

export const bookService = {
  list: () => api.get("/books").then((response) => response.data),

  get: (id) => api.get(`/books/${id}`).then((response) => response.data),

  listByLibrary: (libraryId) =>
    api.get(`/books/library/${libraryId}`).then((response) => response.data),

  create: (payload) => api.post("/books", payload).then((response) => response.data),

  update: (id, payload) => api.put(`/books/${id}`, payload).then((response) => response.data),

  remove: (id) => api.delete(`/books/${id}`).then((response) => response.data),
};