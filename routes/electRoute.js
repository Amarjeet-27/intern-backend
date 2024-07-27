const express = require("express");
const router = express.Router();
import { createElection } from "../controllers/electionController.js";

// Route to create an election
router.post("/election", createElection);
router.post("/election/candidate", postCandidate);

module.exports = router;
