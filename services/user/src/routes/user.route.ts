import { Router } from "express";
import { loginUser, myProfile } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = Router();

router.post('/login', loginUser);
router.get('/me', isAuth, myProfile);

export default router;