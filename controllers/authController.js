import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
const register = async (req, res) => {
    try {
        const exisitingUser = await userModel.findOne({
            email: req.body.email,
        });
        // console.log(req.body.email);
        const email = req.body.email;
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: "User Already exists",
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const user = new userModel(req.body);
        await user.save();
        return res.status(201).send({
            success: true,
            message: "User Registerd Successfully",
            user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error In Register API",
            error,
        });
    }
};

const login = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Invalid Credentials",
            });
        }

        const compare = await bcryptjs.compare(
            req.body.password,
            user.password
        );

        if (!compare) {
            return res.status(500).send({
                success: true,
                message: "Invalid credential",
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).send({
            success: true,
            message: "Login successfully",
            token,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login API",
        });
    }
};

const candidate = await User.findById(candidateId);
if (!candidate) {
    return res.status(404).json({ error: "Candidate not found" });
}

export { register, login };
