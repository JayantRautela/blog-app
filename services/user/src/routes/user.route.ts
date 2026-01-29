import { Router } from "express";
import { getUserProfile, loginUser, myProfile, updateUser } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = Router();

router.post('/login', loginUser);
router.get('/me', isAuth, myProfile);
router.get('/user/:id', getUserProfile);
router.post('/user/update', isAuth, updateUser);

export default router;