import { Schema, Types, model } from "mongoose";

interface RequestType {
  email: string;
  name: string;
  approved: boolean;
  _id?: Types.ObjectId;
}

const requestSchema = new Schema<RequestType>(
  {
    email: { type: String, required: true ,unique:true},
    name: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const RequestModel = model<RequestType>("Request", requestSchema);

export { RequestModel, RequestType };
