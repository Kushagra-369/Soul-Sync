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

export const getMoodsByRange = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Start date and end date required",
      });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const moods = await Mood.find({
      user: userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    return res.status(200).json(moods); // 👈 IMPORTANT
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMoodStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "Start date and end date required",
      });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const moods = await Mood.find({
      user: userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    const moodMap: Record<string, number> = {
      very_bad: 1,
      bad: 2,
      average: 3,
      good: 4,
      awesome: 5,
    };

    const distribution = {
      very_bad: 0,
      bad: 0,
      average: 0,
      good: 0,
      awesome: 0,
    };

    if (!moods.length) {
      return res.json({
        average: 0,
        bestDay: "",
        worstDay: "",
        streak: 0,
        totalEntries: 0,
        distribution,
      });
    }

    const values = moods.map((m) => {
      distribution[m.mood as keyof typeof distribution]++;
      return moodMap[m.mood];
    });

    const average =
      values.reduce((a, b) => a + b, 0) / values.length;

    const max = Math.max(...values);
    const min = Math.min(...values);

    let streak = 0;
    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i] >= 3) streak++;
      else break;
    }

    return res.json({
      average: Number(average.toFixed(1)),
      bestDay: moods[values.indexOf(max)].date,
      worstDay: moods[values.indexOf(min)].date,
      streak,
      totalEntries: moods.length,
      distribution,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};