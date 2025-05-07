import express from "express";
import { auth } from "../middleware/auth";
import {
  createNews,
  getNews,
  getNewsById,
  updateNews,
  deleteNews,
} from "../controllers/newsController";

const router = express.Router();

router.use(auth);

router.post("/", createNews);
router.get("/", getNews);
router.get("/:id", getNewsById);
router.patch("/:id", updateNews);
router.delete("/:id", deleteNews);

export default router;
