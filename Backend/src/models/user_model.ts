import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interface/allinterface";

export interface IUserDocument extends IUser, Document { }

const userSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        level: {
            type: String,
            enum: ["school", "college"],
            required: true,
        },

        classOrCourse: {
            type: String,
            required: true,
        },

        assistantType: {
            type: String,
            enum: ["boy", "girl"],
            required: true,
        },

        mood: {
            type: String,
            enum: ["very_bad", "bad", "normal", "good", "excited"],
            default: "normal",
        },

        deviceId: {
            type: String,
            required: true,
            unique: true,
        },
        validation: {
            isEmailVerified: { type: Boolean, default: false },
            otp: { type: String },
            otpExpiry: { type: Date },   // ✅ CHANGE THIS
            isDelete: { type: Boolean, default: false },
        }
    },
    {
        timestamps: true, // createdAt & updatedAt auto handle karega
    }
);

export const User = mongoose.model<IUserDocument>("User", userSchema);