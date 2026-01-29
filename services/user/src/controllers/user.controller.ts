import type { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

export const loginUser = async (req: Request, res: Response) => {
    try {
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
    } catch (error: any) {
        console.log("Error in login user :- ", error);
        res.status(500).json({
            message: error.message
        });
    }
}