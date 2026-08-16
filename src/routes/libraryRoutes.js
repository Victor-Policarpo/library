import express from "express";
import { createLibrary, deleteLibrary, getAllLibraries, getLibraryById, updateLibrary } from "../controller/libraryController.js";

const app = express.Router();
app.post("/", createLibrary);
app.get("/", getAllLibraries);
app.get("/:id", getLibraryById);
app.put("/:id", updateLibrary);
app.delete("/:id", deleteLibrary);

export default app;