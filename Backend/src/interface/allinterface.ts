export type Level = "school" | "college";
export type AssistantType = "boy" | "girl";

export interface IUser {
    id: string;
    username: string;
    level: Level;
    classOrCourse: string;
    assistantType: AssistantType;
    createdAt: string;
    deviceId: string;
}