import express from "express";
import libraryRoutes from "./routes/libraryRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();
app.use(express.json());
app.use('/libraries', libraryRoutes);
app.use("/books", bookRoutes);
app.use("/users", userRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});