import express from "express";
import { createLoan, getLoans, getLoanById, updateLoan, deleteLoan } from "../controller/loanController.js";

const app = express.Router();
app.post("/", createLoan);
app.get("/", getLoans);
app.get("/:id", getLoanById);
app.put("/:id", updateLoan);
app.delete("/:id", deleteLoan);
export default app;