import { Request, Response } from "express";
import { User } from "../models/user_model";

export const user_login = async (req: Request, res: Response) => {
  try {
    const { level, classOrCourse, assistantType, deviceId } = req.body;

    if (!level || !classOrCourse || !assistantType || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // 🔎 Check if device already registered
    const existingUser = await User.findOne({ deviceId });

    if (existingUser) {
      return res.json({
        success: true,
        user: existingUser,
      });
    }

    // 🔥 Generate username
    const prefixes = ["Frost","Shadow","Ember","Void","Storm"];
    const suffixes = ["Vale","Nova","Knight","Hunter","Strike"];

    const generateUsername = () => {
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const randomNumber = Math.floor(100 + Math.random() * 900);
      return `${randomPrefix}${randomSuffix}${randomNumber}`;
    };

    let username = "";
    let exists = true;

    while (exists) {
      username = generateUsername();
      const check = await User.findOne({ username });
      if (!check) exists = false;
    }

    const user = await User.create({
      username,
      level,
      classOrCourse,
      assistantType,
      deviceId,
    });

    return res.json({
      success: true,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET /api/me?id=USER_ID
export const checkUser = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;

    const user = await User.findOne({ deviceId });

    if (!user) {
      return res.status(401).json({ success: false });
    }

    return res.json({ success: true, user });

  } catch {
    return res.status(500).json({ success: false });
  }
};