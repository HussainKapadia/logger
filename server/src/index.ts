import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import logsRouter from "./routes/logs";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(cors());
app.use(express.json());
app.use("/logs", logsRouter);

app.get("/", (_req, res) => {
  res.send("Server is running!");
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
