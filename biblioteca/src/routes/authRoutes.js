import express from "express";
import { login } from "../controller/authController.js";

const app = express.Router();
app.post("/", login);

export default app;