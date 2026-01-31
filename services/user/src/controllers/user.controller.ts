import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";
import TryCatch from "../utils/TryCatch.js";
import type { AuthenticatedRequest } from "../middlewares/isAuth.js";

export const loginUser = TryCatch( async (req, res) => {
    const { name, email, image } = req.body;

    let user = await User.findOne({ email: email });
    
    if (!user) {
        user = await User.create({
            name: name,
                    email: email,
                    image: image
                });
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
        expiresIn: '5d'
    });

    res.status(200).json({
        message: "login success",
        token: token,
        user: user
    });
});

export const myProfile = TryCatch( async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    res.json({
        user
    });
});

export const getUserProfile = TryCatch( async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404).json({
            message: "user not found"
        });
        return;
    }

    res.status(200).json({
        user: user,
    });
});

export const updateUser = TryCatch( async (req: AuthenticatedRequest, res) => {
    const { name, instagram, facebook, linkedIn, bio } = req.body;

    const user = await User.findByIdAndUpdate(req.user?._id, {
        name,
        instagram,
        facebook,
        linkedIn,
        bio
    }, { new: true });

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
        expiresIn: '5d'
    });

    res.status(200).json({
        message: "user updated",
        token,
        user
    });
});