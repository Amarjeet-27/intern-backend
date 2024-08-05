import { Response, Request } from "express";
import * as dotenv from "dotenv";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { UserModel as User } from "../db/user/userModel";
import { getUserByEmail } from "../db/user/userModel";
import bcryptjs from "bcryptjs";
import { RequestModel } from "../db/request/requestModel";
dotenv.config();

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
        throw new ApiError(401, "Invalid Password");
    }
    const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
    const user = await User.findOne({ email });
    res.status(200).json(
        new ApiResponse(200, { user, token }, "Logged In successfully")
    );
});



// generate otp 
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'try.ajchaurasia1214@gmail.com',
    pass: process.env.PASS_KEY,
  }
});
interface SendOtpRequest extends Request {
  body: {
    email: string;
  };
}

interface VerifyOtpRequest extends Request {
  body: {
    email: string;
    otp: number;
    otpToken: string;
  };
}
export const sendOtp = async (req: SendOtpRequest, res: Response) => {
 const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); 
  
  const otpToken = jwt.sign({ email, otp }, process.env.OTP_SECRET_KEY, { expiresIn: '10m' });

  const mailOptions = {
    from: 'try.ajchaurasia1214@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'OTP sent to email', otpToken });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending OTP', error });
  }
};

export const verifyOtp = (req: VerifyOtpRequest, res: Response) => {
  const { email, otp, otpToken} = req.body;
  try {
    const decoded = jwt.verify(otpToken,process.env.OTP_SECRET_KEY ) as { email: string, otp: number };
    if (decoded.email === email && decoded.otp === otp) {
      res.status(200).json({ success: true, message: 'OTP verified' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: 'OTP expired or invalid', error });
  }
};

//register a user
export const registerUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { username, email, password, branch, scholarId, address } =
            req.body;
        if (
            !username ||
            !email ||
            !password ||
            !branch ||
            !scholarId ||
            !address
        ) {
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
            address: address,
        });
        await newUser.save();
        const token = jwt.sign(
            { email: email, id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.status(201).json(
            new ApiResponse(201, { newUser, token }, "Created Successfully")
        );
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
        console.log(scholarId);
        // console.log(scholarId);
        // const scholarId = req.params.scholarId;

        if (!scholarId) {
            throw new ApiError(404, "Field Required");
        }
        const user = await User.findOne({ scholarId });
        if (!user) {
            throw new ApiError(404, "User not Exists");
        }
        res.status(200).json(
            new ApiResponse(200, user, "Fetched Successfully")
        );
    }
);

//make user admin

export const makeUserAdmin = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) {
            throw new ApiError(400, "Field Required");
        }
        const user = await User.findOneAndUpdate(
            { email },
            { role: "Admin" },
            { new: true }
        );
        await RequestModel.findOneAndUpdate(
            { email },
            { approved: true },
            { new: true }
        );
        res.status(200).json(
            new ApiResponse(200, user, "Updated Successfully")
        );
    }
);
//make user general again

export const makeUserGeneral = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) {
            throw new ApiError(400, "Field Required");
        }
        const user = await User.findOneAndUpdate(
            { email },
            { role: "General" },
            { new: true }
        );
        res.status(200).json(
            new ApiResponse(200, user, "Updated Successfully")
        );
    }
);

// add a request to make user admin
export const addRequest = asyncHandler(async (req: Request, res: Response) => {
    const { email, name } = req.body;
    if (!email || !name) {
        throw new ApiError(400, "Field Required");
    }
    const request = await RequestModel.create({ email, name });
    await request.save();
    res.status(201).json(new ApiResponse(201, request, "Created Successfully"));
});
//return request which is not approved
export const getRequests = asyncHandler(async (req: Request, res: Response) => {
    const requests = await RequestModel.find({ approved: false });
    res.status(200).json(
        new ApiResponse(200, requests, "Fetched Successfully")
    );
});
// export const addElection = asyncHandler(201 , request, "hello");
