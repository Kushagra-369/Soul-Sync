import express from "express";

import { user_create , get_me , verify_otp , user_login} from "../controllers/user_controller";
import { saveDailyMood } from "../controllers/mood_controller";

const router = express.Router();

router.post("/create", user_create);
router.get("/me", get_me);
router.post("/login", user_login);
router.post("/verify_otp", verify_otp);

router.post("/mood", saveDailyMood);
export default router;  