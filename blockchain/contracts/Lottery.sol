// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelinUpgradeable/contracts/access/OwnableUpgradeable.sol";
import "@openzeppelinUpgradeable/contracts/proxy/utils/Initializable.sol";

contract Lottery is
    Initializable,
    OwnableUpgradeable,
    VRFConsumerBaseV2(0x6168499c0cFfCaCD319c818142124B7A15E857ab)
{
    VRFCoordinatorV2Interface constant COORDINATOR =
        VRFCoordinatorV2Interface(0x6168499c0cFfCaCD319c818142124B7A15E857ab);
    bytes32 constant KEY_HASH =
        0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint64 constant SUBSCRIPTION_ID = 247; // https://vrf.chain.link
    uint32 constant CALLBACK_GAS_LIMIT = 1000000;
    uint32 constant NUM_WORDS = 1;
    uint16 constant REQUEST_CONFIRMATIONS = 3;
    uint256[] randomWords;
    uint256 requestId;

    uint256 public lotteryID;
    address payable[] public participants;
    uint256 public costPerTicket;
    uint256 public prizePool;
    uint256 public startingTimestamp;
    uint256 private closingTimestamp;
    address payable public winner;
    uint256 public randomResult;
    uint256 public lotteryDuration;
    uint8 public winnerPercentage;

    enum Status {
        NOT_STARTED, // The lottery is not started yet
        OPEN, // The lottery is open for ticket purchases
        CLOSED, // The lottery is no longer open for ticket purchases
        COMPLETED // The lottery has been closed and the winner picked
    }
    Status public lotteryStatus = Status.NOT_STARTED;

    struct LotteryInfo {
        uint256 lotteryID;
        uint256 prizePool;
        uint256 costPerTicket;
        uint256 startingTimestamp;
        uint256 closingTimestamp;
        address winner;
        uint256 randomNumber;
    }
    mapping(uint256 => LotteryInfo) public allLotteries;

    event ClaimedReward(uint256 lotteryId);
    event ClosedLottery(uint256 lotteryId);
    event CompletedLottery(uint256 lotteryId);
    event OpenedLottery(uint256 lotteryId);
    event RequestedRandomWords(uint256 requestId);

    modifier canClose() {
        require(
            lotteryStatus == Status.OPEN,
            "You can not close the unstarted lottery!"
        );
        require(
            block.timestamp >= startingTimestamp + lotteryDuration,
            "Time is not over!"
        );
        require(randomResult == 0, "Already closed!"); // to prevent re-closing
        _;
    }

    modifier ifNotStarted() {
        require(lotteryStatus == Status.NOT_STARTED);
        _;
    }

    modifier ifOpen() {
        require(
            lotteryStatus == Status.OPEN,
            "The lottery has not started yet!"
        );
        require(
            block.timestamp <= startingTimestamp + lotteryDuration,
            "Time is over!"
        );
        _;
    }

    modifier ifCompleted() {
        require(
            lotteryStatus == Status.COMPLETED,
            "The lottery has not completed yet!"
        );
        _;
    }

    modifier onlyWinnerOrOwner() {
        require(
            msg.sender == winner || msg.sender == owner(),
            "Only winner can claim reward!"
        );
        _;
    }

    modifier randomNumberGenerated() {
        require(winner != address(0), "The winner has not been selected!");
        _;
    }

    // constructor
    function initialize() external initializer {
        __Ownable_init();
    }

    function startLottery(
        uint256 _ticketPrice,
        uint8 _winnerPercentage,
        uint256 _lotteryDuration
    ) external ifNotStarted onlyOwner {
        costPerTicket = _ticketPrice;
        winnerPercentage = _winnerPercentage;
        lotteryDuration = _lotteryDuration;
        lotteryStatus = Status.OPEN;
        startingTimestamp = block.timestamp;
        emit OpenedLottery(lotteryID);
    }

    function buyTicket() external payable ifOpen {
        require(msg.value >= costPerTicket, "Please enter a valid value!");
        prizePool += costPerTicket;
        participants.push(payable(msg.sender));
    }

    function closeLottery() external canClose onlyOwner {
        _requestRandomWords();
        lotteryStatus = Status.CLOSED;
        closingTimestamp = block.timestamp;
        emit RequestedRandomWords(requestId);
        emit ClosedLottery(lotteryID);
    }

    function claimReward()
        external
        ifCompleted
        randomNumberGenerated
        onlyWinnerOrOwner
    {
        _addLottery();
        uint256 winnerPrize = prizePool * (winnerPercentage / 100);
        _transferPrize(winnerPrize);
        _reset();
        emit ClaimedReward(lotteryID);
    }

    function withdrawEth() external onlyOwner {
        require(prizePool == 0, "prizePool is not empty!");
        payable(msg.sender).transfer(address(this).balance);
    }

    function fulfillRandomWords(uint256, uint256[] memory _randomWords)
        internal
        override
    {
        randomWords = _randomWords;
        randomResult = randomWords[0];
        winner = participants[randomResult % participants.length];
        lotteryStatus = Status.COMPLETED;
        emit CompletedLottery(lotteryID);
    }

    function _requestRandomWords() private onlyOwner {
        requestId = COORDINATOR.requestRandomWords(
            KEY_HASH,
            SUBSCRIPTION_ID,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );
    }

    function _transferPrize(uint256 _winnerPrize) private {
        prizePool -= _winnerPrize;
        winner.transfer(_winnerPrize); // transfer the winnerPrize to the winner
        payable(owner()).transfer(prizePool); // transfer the rest of the prizePool to the owner
    }

    function _addLottery() private {
        allLotteries[lotteryID++] = LotteryInfo(
            lotteryID,
            prizePool,
            costPerTicket,
            startingTimestamp,
            closingTimestamp,
            winner,
            randomResult
        );
    }

    function _reset() private {
        closingTimestamp = 0;
        costPerTicket = 0;
        lotteryDuration = 0;
        lotteryStatus = Status.NOT_STARTED;
        participants = new address payable[](0);
        prizePool = 0;
        randomResult = 0;
        startingTimestamp = 0;
        winner = payable(address(0));
    }
}
