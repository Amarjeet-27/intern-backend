import { Schema, Types, model } from "mongoose";

interface ElectionType {
  name: string;
  creator: Types.ObjectId;
  post: string;
  candidates?: [Types.ObjectId];
  voters?: [Types.ObjectId];
  hasVoted?:[Types.ObjectId];
  startTime: Date;
  desp:string;
  electionId?: number;
  _id?: Types.ObjectId;
}
const electionSchema = new Schema<ElectionType>(
  {
    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: String, enum: ["Gs", "Vp", "Cr"], required: true },
    desp:{type:String,required:true},
    candidates: [{ type: Schema.Types.ObjectId, ref: "User" }],
    voters: [{ type: Schema.Types.ObjectId, ref: "User" }],
    hasVoted: [{ type: Schema.Types.ObjectId, ref: "User" }],
    startTime: { type: Date, required: true },
    electionId: { type: Number, unique: true },
  },
  { timestamps: true }
);

const electionModel = model<ElectionType>("Election", electionSchema);

const getElectionById = (id: string) => electionModel.findById(id);
const getElectionByElectionId = (electionId: number) =>
  electionModel.findOne({ electionId });

export {
  electionModel,
  getElectionById,
  getElectionByElectionId,
  ElectionType,
};
