import { Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { Chat } from "../models/chat_model";
import { AuthRequest } from "../middleware/auth";

export const aiChat = async (req: AuthRequest, res: Response) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key missing",
      });
    }

    const userId = req.userId;
    const { message, mood, level, classOrCourse, assistantType } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    let chat = await Chat.findOne({ user: userId });

    if (!chat) {
      chat = await Chat.create({
        user: userId,
        mood,
        messages: [],
      });
    }

    chat.messages.push({
      sender: "user",
      text: message,
      timestamp: new Date(),
    });

    const history = chat.messages
      .slice(-10)
      .map(m => `${m.sender === "user" ? "User" : "AI"}: ${m.text}`)
      .join("\n");

    const prompt = `
You are a caring mental health AI companion.

Mood: ${mood}
Level: ${level}
Course: ${classOrCourse}
Assistant: ${assistantType}

Conversation:
${history}

Respond empathetically.
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const aiReply = response.text ?? "I'm here with you.";

    chat.messages.push({
      sender: "ai",
      text: aiReply,
      timestamp: new Date(),
    });

    await chat.save();

    return res.json({
      success: true,
      reply: aiReply,
    });

  } catch (error: any) {
    console.error("GEMINI ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "AI failed",
    });
  }
};