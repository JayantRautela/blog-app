import { Router } from "express";
import { getUserProfile, loginUser, myProfile, updateProfilePicture, updateUser } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";
import uplaodFile from "../middlewares/multer.js";

const router = Router();

router.post('/login', loginUser);
router.get('/me', isAuth, myProfile);
router.get('/user/:id', getUserProfile);
router.post('/user/update', isAuth, updateUser);
router.post('/user/update/profilePicture', isAuth, uplaodFile, updateProfilePicture);

export default router;