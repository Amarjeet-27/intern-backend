import { Response, Request } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import {
  electionModel as Election,
  getElectionById,
} from "../db/election/electionModel";
import { getUserById, UserModel } from "../db/user/userModel";
export const createElection = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, post, desp, startTime, electionId } = req.body;
    console.log(name, post, desp, startTime, electionId);
    if (!name || !post || !desp || !startTime || !electionId) {
      throw new ApiError(400, "Field Required");
    }
    const newElection = new Election({
      name,
      post,
      desp,
      startTime,
      electionId,
      creator: req.user._id,
    });
    await newElection.save();
    res
      .status(201)
      .json(new ApiResponse(200, newElection, "Election Created Successfully"));
  }
);

export const addCandidate = asyncHandler(
  async (req: Request, res: Response) => {
    const currentTime = new Date();
    const { electionId, candidateId } = req.body;
    console.log(req.body);
    if (!electionId || !candidateId) {
      throw new ApiError(400, "Bad Request");
    }
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
    console.log(req.user._id, election.creator);
    if (!req.user._id.equals(election.creator)) {
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
  const { electionId, startingScholarId, endingScholarId } = req.body;
  const election = await getElectionById(electionId as string);
  if (election.startTime <= new Date()) {
    throw new ApiError(400, "Can't add election is going on");
  }
  if (!election) {
    throw new ApiError(404, "No Election Found");
  }
  if (!req.user._id.equals(election.creator)) {
    throw new ApiError(401, "Only Creator can add voter");
  }
  const voters = await UserModel.find({
    scholarId: { $gte: startingScholarId, $lte: endingScholarId },
  });
  //to do call to blockchain
  voters.forEach((voter) => {
    if (!election.voters.includes(voter._id)) {
      election.voters.push(voter._id);
    }
  });
  await election.save();
  res.status(201).json(new ApiResponse(201, null, "Voter added Successfully"));
});

export const isEligible = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.query;
  const election = await getElectionById(electionId as string);
  let eligible = true;
  if (!election.voters.includes(req.user._id)) {
    eligible = false;
  }
  if (election.hasVoted.includes(req.user._id)) {
    eligible = false;
  }
  res.status(200).json(new ApiResponse(200, eligible));
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
    const election = await Election.find(
      { creator: req.user._id },
      {
        name: 1,
        post: 1,
        desp: 1,
        startTime: 1,
        _id: 1,
      }
    );
    res.status(200).json(new ApiResponse(200, election, "Election Found"));
  }
);

//get election candidates
export const getElectionInfo = asyncHandler(
  async (req: Request, res: Response) => {
    const { electionId } = req.query;
    const election = await Election.findById(electionId).populate("candidates");
    res.status(200).json(new ApiResponse(200, election, "Election Found"));
  }
);

//get election whose start time is less than now
export const getElections = asyncHandler(
  async (req: Request, res: Response) => {
    const currentTime = new Date();
    const ongoingElections = await Election.find({
      startTime: { $lt: currentTime },
      hasEnded: false,
    });
    const upcomingElections = await Election.find({
      startTime: { $gt: currentTime },
      hasEnded: false,
    });
    const endedElections = await Election.find({
      hasEnded: true,
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ongoingElections, upcomingElections, endedElections },
          "Elections Found"
        )
      );
  }
);
//function to get voters for certain elections
export const getVoters = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.query;
  const election = await getElectionById(electionId as string).populate(
    "voters"
  );
  const voters = election.voters;
  res.status(200).json(new ApiResponse(200, voters, "Candidates Found"));
});

//function to end the election
export const endElection = asyncHandler(async (req: Request, res: Response) => {
  const { electionId } = req.body;
  const election = await getElectionById(electionId as string);
  if (req.user._id !== election.creator) {
    throw new ApiError(401, "Only Creator can end election");
  }
  election.hasEnded = true;
  await election.save();
  res.status(200).json(new ApiResponse(200, null, "Election Ended"));
});
