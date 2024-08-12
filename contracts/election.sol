// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ElectionManager {
    address public admin;

    // Voter and Candidate structure
    struct Voter {
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
    }

    mapping(uint256 => Election) public elections;
    uint256 public electionCount;

    mapping(address => bool) public authorizedCreators;

    // Events for logging
    event ElectionCreated(
        uint256 electionId,
        string name,
        address indexed creator
    );
    event CandidateAdded(uint256 electionId, address indexed candidate);
    event VoteCast(
        uint256 electionId,
        address indexed voter,
        address indexed candidate
    );

    // Modifiers for access control
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can do it");
        _;
    }

    modifier onlyAuthorizedCreator() {
        require(authorizedCreators[msg.sender], "Not authorized");
        _;
    }

    constructor() {
        admin = msg.sender;
        authorizedCreators[msg.sender] = true;
    }

    // Authorize a new election creator
    function authorizeCreator(address _creator) public onlyAdmin {
        authorizedCreators[_creator] = true;
    }

    // Create a new election
    function createElection(
        string memory _name
    ) public onlyAuthorizedCreator returns (uint256) {
        electionCount++;
        Election storage newElection = elections[electionCount];
        newElection.name = _name;
        newElection.creator = msg.sender;
        newElection.isActive = true;

        emit ElectionCreated(electionCount, _name, msg.sender);
        return electionCount;
    }

    // Add a candidate to an election
    function addCandidate(uint256 _electionId, address _candidate) public {
        Election storage election = elections[_electionId];
        require(msg.sender == election.creator, "Only election creator can");
        require(election.isActive, "Election isn't active");
        require(
            !election.candidates[_candidate].isRegistered,
            "Candidate already added"
        );

        election.candidates[_candidate] = Candidate({
            isRegistered: true,
            voteCount: 0
        });
        election.candidateList.push(_candidate);

        emit CandidateAdded(_electionId, _candidate);
    }

    // Cast a vote in an election
    function vote(uint256 _electionId, address _candidate) public {
        Election storage election = elections[_electionId];
        require(election.isActive, "Election isn't active");
        require(!election.voters[msg.sender].hasVoted, "Already voted");
        require(
            election.candidates[_candidate].isRegistered,
            "Invalid candidate"
        );

        election.candidates[_candidate].voteCount++;
        election.voters[msg.sender] = Voter({hasVoted: true}); // Mark the voter as having voted

        emit VoteCast(_electionId, msg.sender, _candidate);
    }

    // End an election
    function endElection(uint256 _electionId) public {
        Election storage election = elections[_electionId];
        require(msg.sender == election.creator, "Only election creator can");
        require(election.isActive, "Election is already ended");

        election.isActive = false;
    }

    // Get the vote count for a candidate
    function getVotes(
        uint256 _electionId,
        address _candidate
    ) public view returns (uint256) {
        Election storage election = elections[_electionId];
        return election.candidates[_candidate].voteCount;
    }

    // Get the winner of an election
    function getWinner(uint256 _electionId) public view returns (address) {
        Election storage election = elections[_electionId];
        require(!election.isActive, "Election is still active");

        address winner;
        uint256 maxVotes = 0;
        uint256 length = election.candidateList.length;
        for (uint256 i = 0; i < length; ++i) {
            address candidate = election.candidateList[i];
            if (election.candidates[candidate].voteCount > maxVotes) {
                maxVotes = election.candidates[candidate].voteCount;
                winner = candidate;
            }
        }

        return winner;
    }

    // Get the list of candidates in an election
    function getCandidates(
        uint256 _electionId
    ) public view returns (address[] memory) {
        Election storage election = elections[_electionId];
        return election.candidateList;
    }
}
