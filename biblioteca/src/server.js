import express from "express";
import cors from "cors";
import libraryRoutes from "./routes/libraryRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ["http://localhost:5173"];
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.json());
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use('/libraries', authMiddleware, libraryRoutes);
app.use("/books", authMiddleware, bookRoutes);
app.use("/loans", authMiddleware, loanRoutes);


app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});