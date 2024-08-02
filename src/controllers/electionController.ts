import { Response, Request } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
  electionModel as Election,
  getElectionById,
} from "../db/election/electionModel";
import { getUserById } from "../db/user/userModel";
export const createElection = asyncHandler(
  async (req: Request, res: Response) => {
    const {name,post,desp,startTime} = req.body;
    if(!name || !post || !desp || !startTime){
      throw new ApiError(400, "Field Required");
    }
    //to do call to blockchain
    //get the election Id
    const newElection = new Election({
      name,
      post,
      desp,
      startTime,
      creator: req.user._id,
    });
    await newElection.save();
    res
      .status(201)
      .json(new ApiResponse(20, newElection, "Election Created Successfully"));
  }
);

export const addCandidate = asyncHandler(
  async (req: Request, res: Response) => {
    const currentTime = new Date();
    const { electionId, candidateId } = req.query;
    const election = await getElectionById(electionId as string);
    if (election.startTime <= currentTime) {
      throw new ApiError(400, "Can't add election is going on");
    }
    const candidate = await getUserById(candidateId as string);
    if (!election) {
      throw new ApiError(404, "No Election Found");
    }
    if (!candidate) {
      throw new ApiError(404, "Candidate Not Found");
    }
    if (req.user._id != election.creator) {
      throw new ApiError(401, "Only Creator can add candidate");
    }
    if (election.candidates.includes(candidate._id)) {
      throw new ApiError(404, "Candidate Already Added");
    }
    election.candidates.push(candidate._id);
    await election.save();
    //to do call to blockchain
    res
      .status(201)
      .json(new ApiResponse(201, null, "Candidate added Successfully"));
  }
);
export const addVoter = asyncHandler(async (req: Request, res: Response) => {
  const { electionId, voterId } = req.query;
  const election = await getElectionById(electionId as string);
  if (election.startTime <= new Date()) {
    throw new ApiError(400, "Can't add election is going on");
  }
  const voter = await getUserById(voterId as string);
  if (!election) {
    throw new ApiError(404, "No Election Found");
  }
  if (!voter) {
    throw new ApiError(404, "Candidate Not Found");
  }
  if (req.user._id != election.creator) {
    throw new ApiError(401, "Only Creator can add voter");
  }
  if (election.candidates.includes(voter._id)) {
    throw new ApiError(404, "Candidate Already Added");
  }
  election.candidates.push(voter._id);
  await election.save();
  //to do call to blockchain
  res.status(201).json(new ApiResponse(201, null, "Voter added Successfully"));
});

export const isEligible = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.query;
  const election = await getElectionById(electionId as string);
  if (!election.voters.includes(req.user._id)) {
    throw new ApiError(401, "Not Eligible");
  }
  if(election.hasVoted.includes(req.user._id)){
    throw new ApiError(401, "Not Eligible");
  }
  res.status(200).json(new ApiResponse(200, null, "Eligible"));
});

export const hasVoted = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.query;
  const election = await getElectionById(electionId as string);
  election.hasVoted.push(req.user._id);
  await election.save();
  res.status(200).json(new ApiResponse(200, null, "Record Added"));
});

export const getElectionByCertainCreator = asyncHandler(
  async (req: Request, res: Response) => {
    const election = await Election.find({ creator: req.user._id },{
      name:1,
      post:1,
      desp:1,
      startTime:1,
      _id:1
    });
    res.status(200).json(new ApiResponse(200, election, "Election Found"));
  }
);

//get election candidates
export const getElectionCandidates = asyncHandler(
  async (req: Request, res: Response) => {
    const { electionId } = req.query;
    const election = await getElectionById(electionId as string).populate('candidates');
    const candidates = election.candidates;
    res.status(200).json(new ApiResponse(200, candidates, "Candidates Found"));
  }
);

//get election whose start time is less than now
export const getElections = asyncHandler(
  async (req: Request, res: Response) => {
    const currentTime = new Date();
    const ongoingElections = await Election.find({
      startTime: { $lt: currentTime },
    });
    const upcomingElections = await Election.find({
      startTime: { $gt: currentTime },
    });
    res.status(200).json(new ApiResponse(200, { ongoingElections, upcomingElections }, "Elections Found"));
  }
);