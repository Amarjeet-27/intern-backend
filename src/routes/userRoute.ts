import express from "express";
import {loginUser,registerUser,updateUser,getUserByScholarId} from "../controllers/userController";
import protect from "../middleware/authMiddleware";
const userRouter = express.Router();

userRouter.post("/login",loginUser );
userRouter.post("/register",registerUser);
userRouter.get("/scholarId",protect,getUserByScholarId);
userRouter.get("/update",protect,updateUser);

export default userRouter;
