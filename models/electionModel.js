const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    post: {
        type: String,
        enum: ["President", "Vice President", "Secretary", "Treasurer"],
        required: true,
    },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }],
    voters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }],
    election_id:{
        type: string,  // from blockchain
        // required: true,
    },
    status: {
        type: String,
        enum: ["Open", "Closed"],
        required: true,
    },
});

const Election = mongoose.model("election", electionSchema);

module.exports = Election;
