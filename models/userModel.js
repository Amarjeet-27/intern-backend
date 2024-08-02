import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["admin"],
      required: false,
      default: null,
    },
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
    branch: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      enum: [2025,2026, 2027, 2028 ],
    },
    scholar_id: {
      type: Number,
      required: true,
    },
    election_id: {
      type: Number,
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
