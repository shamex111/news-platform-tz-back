import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { env } from "../config/env";

export const register = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;
    
    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new Error();
    }

    const token = jwt.sign({ id: user._id }, env.JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: "Invalid login credentials" });
  }
};
