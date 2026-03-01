import express from "express";

import { user_create , get_me , verify_otp , user_login , get_user_details} from "../controllers/user_controller";
import { saveDailyMood , checkTodayMood, getTodayMood , getMoodStats,getMoodsByRange} from "../controllers/mood_controller";
import { bookSession } from "../controllers/session_controller";
import {sendMessage ,getAllMessages} from "../controllers/community_controller";
import { verifyToken } from "../middleware/auth";
import { getTodayWellnessExercises } from "../controllers/wellness_controller";
import { aiChat } from "../controllers/ai_controller";
const router = express.Router();

router.post("/create", user_create);
router.get("/me", get_me);
router.post("/login", user_login);
router.post("/verify_otp", verify_otp);
router.get("/user_details/:id", get_user_details);

router.post("/mood",verifyToken, saveDailyMood);
router.get("/check_mood", verifyToken, checkTodayMood);
router.get("/get_mood", verifyToken, getTodayMood);
router.get("/range", verifyToken, getMoodsByRange);
router.get("/stats", verifyToken, getMoodStats);

router.post("/session", bookSession);

router.post("/send_message", verifyToken, sendMessage);
router.get("/get_all_messages", getAllMessages);

router.get("/wellness_today", verifyToken, getTodayWellnessExercises);

router.post("/ai-chat", verifyToken, aiChat);
export default router;  