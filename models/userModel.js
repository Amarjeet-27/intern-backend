import { timeStamp } from "console";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // role: {
    //   type: String,
    //   enum: ["admin"],
    //   required: false,
    // },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    Registration_No: {
      type: Number,
      required: true,
    },
  },
  { timeStamp: true }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
