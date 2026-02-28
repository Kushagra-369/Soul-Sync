import mongoose, { Document, Types } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  password: string;
  level: "school" | "college";
  classOrCourse: string;
  assistantType: "boy" | "girl";
  mood?: "very_bad" | "bad" | "normal" | "good" | "excited";
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