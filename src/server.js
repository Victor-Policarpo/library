import express from "express";
import libraryRoutes from "./routes/libraryRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use('/libraries', authMiddleware, libraryRoutes);
app.use("/books", authMiddleware, bookRoutes);
app.use("/loans", authMiddleware, loanRoutes);


app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});