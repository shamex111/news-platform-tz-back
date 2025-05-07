import express from "express";
import { register, login } from "../controllers/userController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify", auth, (req, res) => {
  res.json({ message: "Token is valid", user: req.user });
});


export default router;
