import mongoose, { Schema } from "mongoose";
import { IMood } from "../interface/allinterface";

const moodSchema = new Schema<IMood>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mood: {
      type: String,
      enum: ["very_bad", "bad", "average", "good", "awesome"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 Important: Ek user ek din me ek hi mood
moodSchema.index({ user: 1, date: 1 }, { unique: true });

export const Mood = mongoose.model<IMood>("Mood", moodSchema);