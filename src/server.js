import express from "express";
import libraryRoutes from "./routes/libraryRoutes.js";
const app = express();
app.use(express.json());
app.use('/libraries', libraryRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});