import mongoose, { Schema, Document } from "mongoose";
import { IWellnessExercise } from "../interface/allinterface";

export interface IWellnessDocument extends IWellnessExercise, Document {}

const wellnessSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    emoji: { type: String },

    mood: {
      type: String,
      enum: ["very_bad", "bad", "average", "good", "awesome"],
      required: true,
    },

    order: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Wellness = mongoose.model<IWellnessDocument>(
  "Wellness",
  wellnessSchema
);