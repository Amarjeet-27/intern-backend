// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ElectionManager {
    address public admin;

    // Voter and Candidate structure
    struct Voter {
        bool isRegistered;
        bool hasVoted;
    }

    struct Candidate {
        bool isRegistered;
        uint256 voteCount;
    }

    // Election structure
    struct Election {
        string name;
        address creator;
        bool isActive;
        mapping(address => Candidate) candidates;
        address[] candidateList;
        mapping(address => Voter) voters;
        address[] voterList;
    }

    mapping(uint256 => Election) public elections;
    uint256 public electionCount;

    mapping(address => bool) public authorizedCreators;

    // Events for logging
    event ElectionCreated(uint256 electionId, string name, address creator);
    event CandidateAdded(uint256 electionId, address candidate);
    event VoterAdded(uint256 electionId, address voter);
    event VoteCast(uint256 electionId, address voter, address candidate);

    // Modifiers for access control
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyAuthorizedCreator() {
        require(authorizedCreators[msg.sender], "Not an authorized election creator");
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedCreators[msg.sender]=true;
    }

    // Authorize a new election creator
    function authorizeCreator(address _creator) public onlyAdmin {
        authorizedCreators[_creator] = true;
    }

    // Create a new election
    function createElection(string memory _name) public onlyAuthorizedCreator {
        electionCount++;
        Election storage newElection = elections[electionCount];
        newElection.name = _name;
        newElection.creator = msg.sender;
        newElection.isActive = true;

        emit ElectionCreated(electionCount, _name, msg.sender);
    }

    // Add a candidate to an election
    function addCandidate(uint256 _electionId, address _candidate) public {
        Election storage election = elections[_electionId];
        require(msg.sender == election.creator, "Only election creator can add candidates");
        require(election.isActive, "Election is not active");
        require(!election.candidates[_candidate].isRegistered, "Candidate already added");

        election.candidates[_candidate] = Candidate({ isRegistered: true, voteCount: 0 });
        election.candidateList.push(_candidate);

        emit CandidateAdded(_electionId, _candidate);
    }

    // Add a voter to an election
    function addVoter(uint256 _electionId, address _voter) public {
        Election storage election = elections[_electionId];
        require(msg.sender == election.creator, "Only election creator can add voters");
        require(election.isActive, "Election is not active");
        require(!election.voters[_voter].isRegistered, "Voter already added");

        election.voters[_voter] = Voter({ isRegistered: true, hasVoted: false });
        election.voterList.push(_voter);

        emit VoterAdded(_electionId, _voter);
    }

    // Cast a vote in an election
    function vote(uint256 _electionId, address _candidate) public {
        Election storage election = elections[_electionId];
        require(election.isActive, "Election is not active");
        require(election.voters[msg.sender].isRegistered, "You are not allowed to vote");
        require(!election.voters[msg.sender].hasVoted, "You have already voted");
        require(election.candidates[_candidate].isRegistered, "Invalid candidate");

        election.candidates[_candidate].voteCount++;
        election.voters[msg.sender].hasVoted = true; // Mark the voter as having voted

        emit VoteCast(_electionId, msg.sender, _candidate);
    }

    // End an election
    function endElection(uint256 _electionId) public {
        Election storage election = elections[_electionId];
        require(msg.sender == election.creator, "Only election creator can end the election");
        require(election.isActive, "Election is already ended");

        election.isActive = false;
    }

    // Get the vote count for a candidate
    function getVotes(uint256 _electionId, address _candidate) public view returns (uint256) {
        Election storage election = elections[_electionId];
        return election.candidates[_candidate].voteCount;
    }

    // Get the winner of an election
    function getWinner(uint256 _electionId) public view returns (address) {
        Election storage election = elections[_electionId];
        require(!election.isActive, "Election is still active");

        address winner;
        uint256 maxVotes = 0;

        for (uint256 i = 0; i < election.candidateList.length; i++) {
            address candidate = election.candidateList[i];
            if (election.candidates[candidate].voteCount > maxVotes) {
                maxVotes = election.candidates[candidate].voteCount;
                winner = candidate;
            }
        }

        return winner;
    }

    // Get the list of candidates in an election
    function getCandidates(uint256 _electionId) public view returns (address[] memory) {
        Election storage election = elections[_electionId];
        return election.candidateList;
    }
    //get the list of voters 
    function getVoters (uint256 _electionId) public view returns(address[] memory){
        Election storage election =elections[_electionId];
        return election.voterList;
    }
}
