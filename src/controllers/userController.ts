import { Response, Request } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { UserModel as User } from "../db/user/userModel";
import { getUserByEmail } from "../db/user/userModel";
import bcryptjs from "bcryptjs";

//login the user

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Fill all the Fields");
  }
  const existingUser = await User.findOne({ email }).select("password");
  if (!existingUser) throw new ApiError(404, "user doesn't exist");
  // checking password
  const isPasswordCorrect = await bcryptjs.compare(
    password,
    existingUser.password
  );
  // if not correct
  if (!isPasswordCorrect) {
    throw new ApiError(404, "Password is wrong");
  }
  const token = jwt.sign(
    { email: existingUser.email, id: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  const user = existingUser._id;
  res
    .status(200)
    .json(new ApiResponse(200, { user, token }, "Logged In successfully"));
});

//register a user
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password, branch, scholarId } = req.body;
    if (!username || !email || !password || !branch || !scholarId) {
      throw new ApiError(400, "All Field Required");
    }
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new ApiError(400, "User Already Exists");
    }
    //creating hashed password
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);
    //creating new user
    const newUser = await User.create({
      username: username,
      branch: branch,
      scholarId: scholarId,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = jwt.sign(
      { email: email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res
      .status(201)
      .json(new ApiResponse(201, { newUser, token }, "Created Successfully"));
  }
);

//update User data
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  if (data.password) {
    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(data.password, salt);
    data.password = hashedPassword;
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { data },
    { new: true }
  );
  res.status(200).json(new ApiResponse(201, user, "Updated Successfully"));
});

//get user using scholarId

export const getUserByScholarId = asyncHandler(
  async (req: Request, res: Response) => {
    const { scholarId } = req.query;
    if (!scholarId) {
      throw new ApiError(404, "Field Required");
    }
    const user = User.findOne({ scholarId });
    if (!user) {
      throw new ApiError(404, "User not Exists");
    }
    res.status(200).json(new ApiResponse(200, user, "Fetched Successfully"));
  }
);
