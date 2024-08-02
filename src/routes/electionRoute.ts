import { Router } from "express";
import protect from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/adminMiddleware";
import {
  createElection,
  addCandidate,
  addVoter,
  isEligible,
  hasVoted,
  getElectionByCertainCreator,
  getElectionCandidates,
  getElections
} from "../controllers/electionController";
const electionRouter = Router();

electionRouter.route("/").post(protect, isAdmin, createElection);
electionRouter.route("/getElection").get(getElections);
electionRouter.route("/addCandidate").post(protect, isAdmin, addCandidate);
electionRouter.route("/addVoter").post(protect, isAdmin, addVoter);
electionRouter.route("/eligible").get(protect, isEligible);
electionRouter.route("/voted").get(protect, hasVoted);
electionRouter.route("/elections").get(protect, getElectionByCertainCreator);
electionRouter.route("/getElectionCandidates").get(protect, getElectionCandidates);
export default electionRouter;
