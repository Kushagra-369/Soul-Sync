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

        createdAt: {
            type: String,
            default: () => new Date().toISOString(),
        },
        deviceId: {
            type: String,
            required: true,
            unique: true,
        },
    },

    {
        timestamps: true, // createdAt & updatedAt auto add karega
    }
);

export const User = mongoose.model<IUserDocument>("User", userSchema);