import { Response } from "express";
import { Community } from "../models/community_model";
import { User } from "../models/user_model";
import { AuthRequest } from "../middleware/auth";

// 🔥 Ban duration helper
const getBanDuration = (strike: number): number => {
  const durations = [
    5 * 60 * 1000,            // 5 min
    30 * 60 * 1000,           // 30 min
    24 * 60 * 60 * 1000,      // 1 day
    7 * 24 * 60 * 60 * 1000,  // 1 week
    30 * 24 * 60 * 60 * 1000, // 1 month
    365 * 24 * 60 * 60 * 1000 // 1 year
  ];

  return durations[strike - 1] || durations[durations.length - 1];
};


// ✅ POST Message
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🚫 Check if user is blocked
    if (
      user.validation.isBlockedUntil &&
      user.validation.isBlockedUntil > new Date()
    ) {
      return res.status(403).json({
        success: false,
        message: `You are blocked until ${user.validation.isBlockedUntil.toLocaleString()}`,
      });
    }

    // 🧠 Spam Detection (5 messages within 10 seconds)
    const recentMessages = await Community.find({
      user: req.userId,
      createdAt: { $gte: new Date(Date.now() - 10000) },
    });

    if (recentMessages.length >= 5) {
      user.validation.spamStrikes += 1;

      const banDuration = getBanDuration(user.validation.spamStrikes);
      user.validation.isBlockedUntil = new Date(Date.now() + banDuration);

      await user.save();

      return res.status(403).json({
        success: false,
        message: `Spam detected. You are blocked for ${Math.round(
          banDuration / 60000
        )} minutes.`,
      });
    }

    // ✅ Create Message
    const newMessage = await Community.create({
      user: req.userId,
      text: text.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Message sent",
      data: newMessage,
    });

  } catch (error) {
    console.error("Send Message Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ✅ GET All Messages
export const getAllMessages = async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Community.find()
      .populate("user", "username")
      .sort({ createdAt: 1 }); // oldest first

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });

  } catch (error) {
    console.error("Get Messages Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};