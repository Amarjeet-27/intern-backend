import mongoose, { Types } from "mongoose";

interface UserType {
    username: string;
    email: string;
    password: string;
    scholarId: string;
    branch: string;
    role: string;
    address: string;
    _id?: Types.ObjectId;
}
const userSchema = new mongoose.Schema<UserType>(
    {
        username: { type: String, required: [true, "username is required"] },
        role: {
            type: String,
            required: true,
            enum: {
                values: ["General", "Admin", "Super Admin"],
                message: "{VALUE} is not supported",
            },
            default: "General",
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password length is short."],
            select: false,
        },
        scholarId: {
            type: String,
            required: [true, "scholarId is required"],
            maxlength: [7, "mustbe Of length 7"],
            minlength: [7, "mustbe Of length 7"],
            unique: true,
        },
        branch: {
            type: String,
            enum: {
                values: ["cse", "ece", "me", "ce", "eie", "ee"],
                message: "{VALUE} is not Supported",
            },
            required: [true, "Branch is required"],
        },
        address: { type: String, required: true },
    },
    { timestamps: true }
);
const UserModel = mongoose.model<UserType>("User", userSchema);

//server actions on user model

const getUsers = () => UserModel.find();
const getUserByEmail = (email: string) => UserModel.findOne({ email });
const getUserById = (id: string) => UserModel.findById(id);
const getUserByScholarId = (scholarId: string) =>
    UserModel.findOne({ scholarId });
const createUser = (values: Record<string, any>) =>
    new UserModel(values).save().then((user) => user.toObject());

const deleteUser = (id: string) => UserModel.findOneAndDelete({ _id: id });

const updateUser = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, values);

export {
    UserModel,
    deleteUser,
    updateUser,
    createUser,
    getUserByEmail,
    getUserById,
    getUserByScholarId,
    getUsers,
    UserType,
};
