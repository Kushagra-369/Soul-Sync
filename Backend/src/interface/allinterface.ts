export type Level = "school" | "college";

export type AssistantType = "boy" | "girl";

export type Mood =
    | "very_bad"
    | "bad"
    | "normal"
    | "good"
    | "excited";

export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    level: Level;
    classOrCourse: string;
    assistantType: AssistantType;
    mood: Mood;
    createdAt: string;
    deviceId: string;
    validation: {
        isEmailVerified: boolean;
        otp?: string;
        otpExpiry?: Date;   // ✅ CHANGE THIS
        isDelete: boolean;
    };
}