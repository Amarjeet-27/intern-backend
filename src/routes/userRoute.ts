import express from "express";
import {
    loginUser,
    registerUser,
    updateUser,
    getUserByScholarId,
    makeUserAdmin,
    makeUserGeneral,
    addRequest,
    getRequests,
} from "../controllers/userController";
import protect from "../middleware/authMiddleware";
import { isSuperAdmin } from "../middleware/adminMiddleware";
const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);
userRouter.get("/scholarId", protect, getUserByScholarId);
userRouter.get("/update", protect, updateUser);
// userRouter.get("/update", protect, );
userRouter.post("/makeAdmin", protect, isSuperAdmin, makeUserAdmin);
userRouter.post("/makeGeneral", protect, isSuperAdmin, makeUserGeneral);
userRouter.post("/makeRequest", protect, addRequest);
userRouter.get("/requests", protect, isSuperAdmin, getRequests);
export default userRouter;
