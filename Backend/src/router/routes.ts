import express from "express";

import { user_create , get_me , verify_otp , user_login} from "../controllers/user_controller";
import { saveDailyMood , checkTodayMood, getTodayMood} from "../controllers/mood_controller";
import { bookSession } from "../controllers/session_controller";
import {sendMessage ,getAllMessages} from "../controllers/community_controller";
import { verifyToken } from "../middleware/auth";
import { getTodayWellnessExercises } from "../controllers/wellness_controller";

const router = express.Router();

router.post("/create", user_create);
router.get("/me", get_me);
router.post("/login", user_login);
router.post("/verify_otp", verify_otp);

router.post("/mood",verifyToken, saveDailyMood);
router.get("/check_mood", verifyToken, checkTodayMood);
router.get("/get_mood", verifyToken, getTodayMood);

router.post("/session", bookSession);

router.post("/send_message", verifyToken, sendMessage);
router.get("/get_all_messages", getAllMessages);

router.get("/wellness_today", verifyToken, getTodayWellnessExercises);
export default router;  