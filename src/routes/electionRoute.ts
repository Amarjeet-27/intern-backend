import { Router } from "express";
import protect from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";
import { getElections } from "../controllers/electionController";
import {
    createElection,
    addCandidate,
    addVoter,
    isEligible,
    hasVoted,
    getElectionByCertainCreator,
    getElectionInfo,
    getVoters,
} from "../controllers/electionController";
const electionRouter = Router();

electionRouter.route("/createElection").post(protect, isAdmin, createElection);
electionRouter.route("/addCandidate").post(protect, isAdmin, addCandidate);
electionRouter.route("/addVoter").post(protect, isAdmin, addVoter);
electionRouter.route("/eligible").get(protect, isEligible);
electionRouter.route("/getElection").get(getElections);
electionRouter.route("/voted").get(protect, hasVoted);
electionRouter.route("/getVoters").get(protect, getVoters);
electionRouter.route("/elections").get(protect, getElectionByCertainCreator);
electionRouter.route("/getElectionInfo").get(getElectionInfo);
export default electionRouter;
