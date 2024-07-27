import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

const isAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const adminOrNot = req.user.role === "admin";
    if (!adminOrNot) {
      throw new ApiError(401, "Not Admin Access");
    }
    next();
  }
);

export default isAdmin;