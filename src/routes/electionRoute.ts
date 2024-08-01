import { Router } from "express";
import protect from "../middleware/authMiddleware";
import {isAdmin} from "../middleware/adminMiddleware";
import {
    createElection,
    addCandidate,
    addVoter,
    isEligible,
    hasVoted,
} from "../controllers/electionController";
const electionRouter = Router();

electionRouter.route("/").post(protect, isAdmin, createElection);
electionRouter.route("/addCandidate").post(protect, isAdmin, addCandidate);
electionRouter.route("/addVoter").post(protect, isAdmin, addVoter);
electionRouter.route("/eligible").get(protect, isEligible);
electionRouter.route("/voted").get(protect, hasVoted);
export default electionRouter;
