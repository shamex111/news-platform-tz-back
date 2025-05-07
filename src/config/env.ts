import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

export const env = {
  PORT: process.env.PORT || "5000",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/news-platform",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  UPLOAD_DIR: path.join(__dirname, "../../uploads"),
} as const;

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set in .env file`);
  }
}
