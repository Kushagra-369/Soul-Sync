import { Response } from "express";
import { Mood } from "../models/mood_model";
import { AuthRequest } from "../middleware/auth";

export const saveDailyMood = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { mood } = req.body;

    const allowedMoods = ["very_bad", "bad", "average", "good", "awesome"];

    if (!mood || !allowedMoods.includes(mood)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mood value",
      });
    }

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

export const checkTodayMood = async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mood = await Mood.findOne({
      user: req.userId,
      date: today,
    });

    return res.status(200).json({
      success: true,
      submitted: !!mood,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getTodayMood = async (
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMood = await Mood.findOne({
      user: userId,
      date: today,
    });

    if (!todayMood) {
      return res.status(404).json({
        success: false,
        message: "Mood not submitted",
      });
    }

    return res.status(200).json({
      success: true,
      mood: todayMood.mood,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};