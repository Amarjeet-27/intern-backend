import jwt, { JwtPayload } from "jsonwebtoken";
import { getUserById } from "../db/user/userModel";
import express from "express";

const protect = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            //Get token   sksn
            token = req.headers.authorization.split(" ")[1];
            //verify the token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            ) as JwtPayload;
            //
            req.user = await getUserById(decoded.id);
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
    }
    if (!token) {
        res.status(401).json({ message: "token not there" });
        return;
    }
};
export default protect;
