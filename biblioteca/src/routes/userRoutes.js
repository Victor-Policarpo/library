import express from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const app = express.Router();
app.post("/", createUser);
app.use(authMiddleware);
app.get("/", getUsers);
app.get("/:id", getUserById);
app.put("/:id", updateUser);
app.delete("/:id", deleteUser);

export default app;