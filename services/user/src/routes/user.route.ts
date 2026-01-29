import { Router } from "express";
import { getUserProfile, loginUser, myProfile } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = Router();

router.post('/login', loginUser);
router.get('/me', isAuth, myProfile);
router.get('/user/:id', getUserProfile);

export default router;