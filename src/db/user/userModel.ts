import mongoose, { Types } from "mongoose";

interface UserType {
  username: string;
  email: string;
  password: string;
  scholarId: string;
  branch: string;
  _id?: Types.ObjectId;
}
const userSchema = new mongoose.Schema<UserType>(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    scholarId: {
      type: String,
      required: true,
      maxlength: 7,
      minlength: 7,
      unique: true,
    },
    branch: {
      type: String,
      enum: ["cse", "ece", "me", "ce", "eie", "ee"],
      required: true,
    },
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
