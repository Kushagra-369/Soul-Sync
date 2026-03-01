import mongoose from "mongoose";
import { IChat } from "../interface/allinterface";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "ai"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema<IChat>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);