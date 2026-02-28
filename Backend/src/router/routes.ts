import express from "express";

import { user_login , checkUser} from "../controllers/user_controller";

const router = express.Router();

router.post("/login", user_login);
router.get("/me/:deviceId", checkUser);
export default router;