const Election = require("../models/electionController.js");
const User = require("../models/userModel.js");


// Create an election
const createElection = async (req, res) => {
    try {

        const { name, date, post } = req.body;

        //calling blockchain for creating election

        // send election_id and  createElection id to frontend


        // Check if the candidate exists
        // const candidate = await User.findById(candidateId);
        // if (!candidate) {
        //     return res.status(404).json({ error: "Candidate not found" });
        // }

        // Create the election



        const election = new Election({
            name,
            date,
            post,
            candidate: candidateId,
            status,
        });

        await election.save();
        res.status(201).json(election);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const addCandidate = async (req, res) => {
    try {
        const { election_id, candidate_id } = req.body;

        //calling blockchain for adding candidate to election

        // send election_id and candidate_id to frontend

        res.status(201).json({ message: "Candidate added to election" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addVoter = async (req, res) => {  
    try {
        const { election_id, voter_id } = req.body;

        //calling blockchain for adding voter to election

        // send election_id and voter_id to frontend

        res.status(201).json({ message: "Voter added to election" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.createElection = createElection;
