import { Request, Response } from "express";
import { Session } from "../models/session_model";

// Create Session Booking
export const bookSession = async (req: Request, res: Response) => {
  try {
    const { username, phone, problem, sessionType } = req.body;

    // Basic Validation
    if (!username || !phone || !problem || !sessionType) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    if (!["call", "text"].includes(sessionType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid session type",
      });
    }

    // Create new session
    const newSession = await Session.create({
      username,
      phone,
      problem,
      sessionType,
    });

    return res.status(201).json({
      success: true,
      message: "Session booked successfully",
      data: newSession,
    });

  } catch (error) {
    console.error("Session Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};