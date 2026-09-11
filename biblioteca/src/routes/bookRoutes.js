import express from "express";
import { createBook, getAllBooks, getBookById, getBooksByLibrary, updateBook, deleteBook } from "../controller/bookController.js";

const app = express.Router();
app.post("/", createBook);
app.get("/", getAllBooks);
app.get("/library/:libraryId", getBooksByLibrary);
app.get("/:id", getBookById);
app.put("/:id", updateBook);
app.delete("/:id", deleteBook);

export default app;