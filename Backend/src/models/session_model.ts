import mongoose, { Document, Schema } from "mongoose";

export type SessionType = "call" | "text";

import { ISessionBooking } from "../interface/allinterface";

export interface ISession extends Document, ISessionBooking {
  status: "pending" | "approved" | "completed" | "rejected";
}

const SessionSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    sessionType: {
      type: String,
      enum: ["call", "text"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Session = mongoose.model<ISession>(
  "Session",
  SessionSchema
);