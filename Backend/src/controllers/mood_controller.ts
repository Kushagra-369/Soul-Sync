import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Mood } from "../models/mood_model";

export const saveDailyMood = async (req: Request, res: Response) => {
  try {
    const { mood } = req.body;

    const allowedMoods = ["very_bad", "bad", "average", "good", "awesome"];
    if (!mood || !allowedMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mood value",
      });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    let userId: string;

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      userId = decoded.id;
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 🔥 Today date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ❌ Direct create (findOne ki zarurat nahi)
    const newMood = await Mood.create({
      user: userId,
      mood,
      date: today,
    });

    return res.status(201).json({
      success: true,
      message: "Mood saved successfully",
      data: newMood,
    });

  } catch (error: any) {

    // 💥 Duplicate Entry Error (11000)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already submitted today's mood",
      });
    }

    console.error("Mood Save Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};