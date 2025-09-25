import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();
const app = express();

import authRoutes from "./routes/auth.js";
import summaryRoutes from "./routes/summaries.js";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use("/api/auth", authRoutes);
app.use("/api/summaries", summaryRoutes);

const PORT = process.env.PORT || 6000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo connected");
    app.listen(PORT, () => console.log("Server listening on", PORT));
  })
  .catch((err) => {
    console.error("DB connection error", err);
    process.exit(1);
  });
