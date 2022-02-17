// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/openzeppelin-contracts-upgradeable@4.5.0/contracts/access/OwnableUpgradeable.sol";
import "@openzeppelin/openzeppelin-contracts-upgradeable@4.5.0/contracts/proxy/utils/Initializable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBaseV2.sol";

contract LotteryUpgradeable is
    Initializable,
    OwnableUpgradeable,
    VRFConsumerBaseV2(0x6168499c0cFfCaCD319c818142124B7A15E857ab)
{
    // Chainlink VRFConsumerBaseV2
    VRFCoordinatorV2Interface constant COORDINATOR =
        VRFCoordinatorV2Interface(0x6168499c0cFfCaCD319c818142124B7A15E857ab);
    LinkTokenInterface constant LINKTOKEN =
        LinkTokenInterface(0x01BE23585060835E02B77ef475b0Cc51aA1e0709);
    bytes32 constant keyHash =
        0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint64 constant subscriptionId = 247; // https://vrf.chain.link/
    uint32 constant callbackGasLimit = 1000000;
    uint32 constant numWords = 1;
    uint16 constant requestConfirmations = 3;
    uint256[] randomWords;
    uint256 requestId;

    uint256 public lotteryID;
    address payable[] public participants;
    uint256 public costPerTicket;
    uint256 public prizePool;
    uint256 startingTimestamp;
    uint256 closingTimestamp;
    address payable public winner;
    uint256 public randomResult;
    uint256 lotteryDuration;
    uint8 winnerPercentage;

    // represents the status of the lottery
    enum Status {
        NOT_STARTED, // The lottery is not started yet
        OPEN, // The lottery is open for ticket purchases
        CLOSED, // The lottery is no longer open for ticket purchases
        COMPLETED // The lottery has been closed and the numbers drawn
    }
    Status public lotteryStatus = Status.NOT_STARTED;

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
            block.timestamp <= startingTimestamp + lotteryDuration,
            "Time is over!"
        );
        require(
            lotteryStatus == Status.OPEN,
            "The lottery has not started yet!"
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

    event RequestedRandomWords(uint256 requestId);
    event OpenedLottery(uint256 lotteryId);
    event ClosedLottery(uint256 lotteryId);
    event CompletedLottery(uint256 lotteryId);
    event ClaimedReward(uint256 lotteryId);

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
        startingTimestamp = block.timestamp; // now
        emit OpenedLottery(lotteryID);
    }

    function buyTicket() external payable ifOpen {
        require(msg.value >= costPerTicket, "Please enter a valid value!");
        prizePool += costPerTicket; // add value to prizePool
        participants.push(payable(msg.sender)); // add player to list
    }

    function closeLottery() external canClose onlyOwner {
        _requestRandomWords(); // request random number
        lotteryStatus = Status.CLOSED; // pending
        closingTimestamp = block.timestamp;
        emit ClosedLottery(lotteryID);
        emit RequestedRandomWords(requestId);
    }

    function _requestRandomWords() private onlyOwner {
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory _randomWords
    ) internal override {
        randomWords = _randomWords;
        randomResult = randomWords[0];
        winner = participants[randomResult % participants.length];
        lotteryStatus = Status.COMPLETED; // winner picked
        emit CompletedLottery(lotteryID);
    }

    function claimReward()
        external
        ifCompleted
        randomNumberGenerated
        onlyWinnerOrOwner
    {
        uint256 winnerPrize = prizePool * (winnerPercentage / 100);
        _transferPrize(winnerPrize);
        _reset();
        emit ClaimedReward(lotteryID);
    }

    function _transferPrize(uint256 _winnerPrize) private {
        prizePool -= _winnerPrize;
        winner.transfer(_winnerPrize); // transfer the winnerPrize to the winner
        payable(owner()).transfer(prizePool); // transfer the rest of the prizePool to the owner
    }

    function _reset() private {
        lotteryStatus = Status.NOT_STARTED;
        lotteryID++;
        participants = new address payable[](0);
        prizePool = 0;
        costPerTicket = 0;
        startingTimestamp = 0;
        closingTimestamp = 0;
        winner = payable(address(0));
        randomResult = 0;
        lotteryDuration = 0;
    }

    function withdrawEth() external onlyOwner {
        require(prizePool == 0, "prizePool is not empty!");
        payable(msg.sender).transfer(address(this).balance);
    }
}
