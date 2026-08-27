import express from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../controller/userController.js";

const app = express.Router();
app.post("/", createUser);
app.get("/", getUsers);
app.get("/:id", getUserById);
app.put("/:id", updateUser);
app.delete("/:id", deleteUser);

export default app;