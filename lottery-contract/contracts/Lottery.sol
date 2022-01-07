// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/VRFConsumerBase.sol";

contract Lottery is Ownable, VRFConsumerBase {
    uint256 private lotteryID = 0;
    address payable[] private participants;
    uint256 private costPerTicket;
    uint256 private prizePool;
    uint256 private startingTimestamp;
    uint256 private closingTimestamp;
    address payable private winner;
    uint256 public randomResult;

    bool rewardClaimed = false;

    address linkToken;

    uint8 public winnerPercentage; // % of the prizePool is for the winner
    // oracle
    bytes32 internal keyHash;
    uint256 internal fee;

    // represents the status of the lottery
    enum Status {
        NOT_STARTED, // The lottery is not started yet
        OPEN, // The lottery is open for ticket purchases
        CLOSED, // The lottery is no longer open for ticket purchases
        COMPLETED // The lottery has been closed and the numbers drawn
    }
    Status private lotteryStatus = Status.NOT_STARTED;

    // all the needed information about a lottery
    struct LotteryInfo {
        uint256 lotteryID; // ID for lottery
        address payable[] participants; // players
        uint256 prizePool; // the amount of ETH for prize money
        uint256 costPerTicket; // cost per ticket in ETH
        uint256 startingTimestamp; // block timestamp for start of lottery
        uint256 closingTimestamp; // block timestamp for end of entries
        address winner; // winner address
        uint256 randomNumber; // randomResult
    }
    // lottery ID's to info
    mapping(uint256 => LotteryInfo) public allLotteries;

    modifier ifNotStarted() {
        require(lotteryStatus == Status.NOT_STARTED);
        _;
    }
    modifier ifOpen() {
        require(
            lotteryStatus == Status.OPEN,
            "The lottery has not started yet!"
        );
        _;
    }
    modifier ifClosed() {
        require(lotteryStatus == Status.CLOSED);
        _;
    }
    modifier ifCompleted() {
        require(lotteryStatus == Status.COMPLETED);
        _;
    }

    modifier onlyWinnerOrOwner() {
        require(
            msg.sender == winner || msg.sender == owner(),
            "Only winner or owner can claim reward!"
        );
        _;
    }

    modifier notClaimed() {
        require(!rewardClaimed, "Reward not claimed by winner!");
        _;
    }

    event RequestedRandomness(bytes32 requestId);
    event OpenedLottery(uint256 lotteryId);
    event ClosedLottery(uint256 lotteryId);
    event ClaimedReward(uint256 lotteryId);

    constructor(
        address _vrfCoordinator,
        address _linkToken,
        bytes32 _keyHash,
        uint256 _fee,
        uint8 _winnerPercentage
    ) VRFConsumerBase(_vrfCoordinator, _linkToken) {
        linkToken = _linkToken;
        keyHash = _keyHash;
        fee = _fee; // varies by network
        winnerPercentage = _winnerPercentage;
        lotteryStatus = Status.NOT_STARTED;
    }

    function startLottery(uint256 _ticketPrice)
        external
        ifNotStarted
        onlyOwner
    {
        costPerTicket = _ticketPrice;
        lotteryStatus = Status.OPEN;
        startingTimestamp = block.timestamp; // now
        emit OpenedLottery(lotteryID);
    }

    function buyTicket() external payable ifOpen {
        require(msg.value >= costPerTicket, "Please enter a valid value!");
        participants.push(payable(msg.sender)); // add player to list
        prizePool += msg.value; // add value to prizePool
        payable(address(this)).transfer(msg.value); // transfer value to contract
    }

    function closeLottery() external ifOpen onlyOwner {
        lotteryStatus = Status.CLOSED; // pending
        closingTimestamp = block.timestamp; // closing time
        emit ClosedLottery(lotteryID);
    }

    function completeLottery() external ifClosed onlyOwner {
        pickWinner(); // pick winner
        lotteryStatus = Status.COMPLETED;
    }

    function pickWinner() private ifCompleted {
        bytes32 requestId = getRandomNumber();
        emit RequestedRandomness(requestId);
        uint256 winnerIndex = randomResult % participants.length;
        winner = participants[winnerIndex];
    }

    /**
     * Requests randomness
     */
    function getRandomNumber() private returns (bytes32 requestId) {
        require(
            linkToken.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        randomResult = randomness;
    }

    function claimReward() external ifCompleted notClaimed onlyWinnerOrOwner {
        uint256 winnerPrize = prizePool * (winnerPercentage / 100);
        transferPrize(winnerPrize);
        rewardClaimed = true;
        lotteryStatus = Status.NOT_STARTED;
        addLotteryInfoAndReset();
        emit ClaimedReward(lotteryID);
    }

    function transferPrize(uint256 _winnerPrize) private {
        prizePool -= _winnerPrize;
        winner.transfer(_winnerPrize); // transfer the winnerPrize to the winner
        owner().transfer(prizePool); // transfer the rest of the prizePool to the owner
    }

    // add lottery informations and reset
    function addLotteryInfoAndReset() private {
        LotteryInfo memory lottery = LotteryInfo(
            lotteryID,
            participants,
            prizePool,
            costPerTicket,
            startingTimestamp,
            closingTimestamp,
            winner,
            randomResult
        );
        allLotteries[lotteryID++] = lottery;
        // emptify
        participants = new address payable[](0);
    }
}
