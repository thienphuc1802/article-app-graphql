import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        const user = await User.findOne({
            token: token
        }).select("-password");
        if (user) {
            req["user"] = user;
        }
    }
    next();
}