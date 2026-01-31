import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface IUser extends Document {
    name: string;
    email: string;
    image: string;
    instagram: string;
    facebook: string;
    x: string;
    linkedIn: string;
    bio: string;
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please login - No auth header"
            });
            return;
        }

        const token = authHeader.split(" ")[1] as string;

        if (!token) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded || !decoded.user) {
            res.status(401).json({
                message: "Invalid Token"
            });
            return;
        }

        req.user = decoded.user;
        next();
    } catch (error: any) {
        console.log("JWT Verification Error :- ", error);
        res.status(401).json({
            message: "Please login - JWT error"
        });
        return;
    }
}