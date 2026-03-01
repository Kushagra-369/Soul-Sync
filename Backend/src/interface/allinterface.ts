import mongoose, { Document, Types } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  level: "school" | "college";
  classOrCourse: string;
  assistantType: "boy" | "girl";
  deviceId: string;

  validation: {
    isEmailVerified: boolean;
    otp?: string;
    otpExpiry?: Date;
    isDelete: boolean;

    // 🔥 Spam Control Fields
    spamStrikes: number;
    isBlockedUntil: Date | null;
  };
}


export interface IMood extends Document {
  user: Types.ObjectId;
  mood: "very_bad" | "bad" | "average" | "good" | "awesome";
  date: Date;
}


export type SessionType = "call" | "text";

export interface ISessionBooking {
  username: string;
  phone: string;
  problem: string;
  sessionType: SessionType;
}

export interface ICommunityMessage extends Document {
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface IWellnessExercise {
  title: string;
  category: string;
  content: string;
  emoji?: string;
  mood: "very_bad" | "bad" | "average" | "good" | "awesome";
  order: number;
}

export interface IUserWellnessProgress {
  user: mongoose.Types.ObjectId;
  exercise: mongoose.Types.ObjectId;
  completedAt: Date;
}

export interface IMessage {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

/* ---------------- CHAT DOCUMENT INTERFACE ---------------- */

export interface IChat extends Document {
  user: Types.ObjectId;   // Reference to User model
  mood?: string;          // User ka mood at time of chat
  messages: IMessage[];   // Conversation array
  createdAt: Date;
  updatedAt: Date;
}