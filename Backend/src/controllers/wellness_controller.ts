import { Response } from "express";
import { Wellness } from "../models/wellness_model";
import { Mood } from "../models/mood_model";
import { AuthRequest } from "../middleware/auth";

export const getTodayWellnessExercises = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🔥 Get today's date (00:00 reset)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔎 Find today's mood
    const todayMood = await Mood.findOne({
      user: userId,
      date: today,
    });

    if (!todayMood) {
      return res.status(404).json({
        success: false,
        message: "You haven't submitted today's mood",
      });
    }

    // 🎯 Fetch exercises according to mood
    const exercises = await Wellness.find({
      mood: todayMood.mood,
    }).sort({ order: 1 });

    return res.status(200).json({
      success: true,
      mood: todayMood.mood,
      data: exercises,
    });

  } catch (error) {
    console.error("Wellness Fetch Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};