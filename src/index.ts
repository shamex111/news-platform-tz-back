import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import multer from "multer";

import userRoutes from "./routes/userRoutes";
import newsRoutes from "./routes/newsRoutes";
import { env } from "./config/env";

const app = express();
const httpServer = createServer(app);


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(env.UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.use("/api/users", userRoutes);
app.use(
  "/api/news",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "files", maxCount: 5 },
  ]),
  newsRoutes
);

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ filename: req.file.filename });
});


mongoose
  .connect(env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = parseInt(env.PORT);
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
