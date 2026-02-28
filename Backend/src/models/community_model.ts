import mongoose, { Document, Schema } from "mongoose";
import { ICommunityMessage } from "../interface/allinterface";

const CommunitySchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// 🔥 TTL Index (1 week = 7 days)
CommunitySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 }
);

export const Community = mongoose.model<ICommunityMessage>(
  "Community",
  CommunitySchema
);