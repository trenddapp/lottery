// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/ILottery.sol";
import "@chainlink/contracts/src/v0.8/dev/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@openzeppelinUpgradeable/contracts/access/OwnableUpgradeable.sol";
import "@openzeppelinUpgradeable/contracts/proxy/utils/Initializable.sol";

/// @dev The winner will be chosen with a random number generated by Chainlink
contract Lottery is
    ILottery,
    Initializable,
    OwnableUpgradeable,
    VRFConsumerBaseV2(0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D)
{
    // Goerli testnet configurations
    VRFCoordinatorV2Interface constant COORDINATOR =
        VRFCoordinatorV2Interface(0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D);
    bytes32 constant KEY_HASH =
        0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15;
    uint64 constant SUBSCRIPTION_ID = 44;
    uint32 constant CALLBACK_GAS_LIMIT = 100000;
    uint32 constant NUM_WORDS = 1;
    uint16 constant REQUEST_CONFIRMATIONS = 3;
    uint256 requestId = 1;

    /// @inheritdoc ILottery
    uint256 public override lotteryID;
    /// @inheritdoc ILottery
    address[] public override participants;
    /// @inheritdoc ILottery
    uint256 public override costPerTicket;
    /// @inheritdoc ILottery
    uint256 public override prizePool;
    /// @inheritdoc ILottery
    uint256 public override startingTimestamp;
    /// @inheritdoc ILottery
    address public override winner;
    /// @inheritdoc ILottery
    uint256 public override randomResult;
    /// @inheritdoc ILottery
    uint256 public override lotteryDuration;
    /// @inheritdoc ILottery
    uint8 public override winnerPercentage;
    /// @inheritdoc ILottery
    Status public override lotteryStatus = Status.NOT_STARTED;

    // stores the number of tickets for all participants
    mapping(uint256 => mapping(address => uint256)) public numberOfTickets;

    // stores the prize amount of the winners
    mapping(address => uint256) private prizeAmountOfWinners;

    // stores the amount of the admin for all lotteries
    uint256 private adminAmount;
    // stores the amount of the currnet lottery winner
    uint256 private winnerAmount;

    struct LotteryInfo {
        uint256 lotteryID;
        uint256 prizePool;
        uint256 costPerTicket;
        uint256 startingTimestamp;
        address winner;
        uint256 randomNumber;
        uint256 lotteryDuration;
    }
    /// @inheritdoc ILottery
    mapping(uint256 => LotteryInfo) public override allLotteries;

    modifier canClose() {
        require(
            lotteryStatus == Status.OPEN,
            "You can not close the unstarted lottery!"
        );
        require(
            block.timestamp >= startingTimestamp + lotteryDuration,
            "Time is not over!"
        );
        require(randomResult == 0, "The lottery is already closed!"); // to prevent re-closing
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

    modifier randomNumberGenerated() {
        require(winner != address(0), "The winner has not been selected!");
        _;
    }

    /// @inheritdoc ILottery
    function buyTicket() external payable override ifOpen {
        require(msg.value == costPerTicket, "Enter a valid price!");
        address participant = msg.sender;
        prizePool += costPerTicket;
        participants.push(participant);
        numberOfTickets[lotteryID][participant]++;
        emit BoughtTicket(lotteryID, participant);
    }

    /// @inheritdoc ILottery
    function claimReward() external override {
        address payee = msg.sender;
        uint256 amount = prizeAmountOfWinners[payee];
        require(amount > 0, "You are not a winner!");
        prizeAmountOfWinners[payee] = 0;
        _transferPrize(amount);
        emit ClaimedReward(payee);
    }

    /// @inheritdoc ILottery
    function closeLottery() external override canClose onlyOwner {
        if (participants.length == 0) {
            _addLottery();
            _reset();
            emit ClosedLottery(lotteryID, 0);
            emit CompletedLottery(lotteryID, 0, address(0));
            emit ResetLottery(lotteryID);
        } else {
            lotteryStatus = Status.CLOSED;
            winnerAmount = _calculateWinnerAmount();
            _increaseAdminAmount(prizePool - winnerAmount);
            _requestRandomWords();
            emit RequestedRandomWords(requestId);
            emit ClosedLottery(lotteryID, prizePool);
        }
    }

    // constructor
    function initialize() external initializer {
        __Ownable_init();
    }

    function resetLottery()
        external
        override
        ifCompleted
        randomNumberGenerated
        onlyOwner
    {
        _addLottery();
        _reset();
        emit ResetLottery(lotteryID);
    }

    /// @inheritdoc ILottery
    function startLottery(
        uint256 _ticketPrice,
        uint8 _winnerPercentage,
        uint256 _lotteryDuration
    ) external override ifNotStarted onlyOwner {
        lotteryStatus = Status.OPEN;
        costPerTicket = _ticketPrice;
        winnerPercentage = _winnerPercentage;
        lotteryDuration = _lotteryDuration;
        startingTimestamp = block.timestamp;
        emit OpenedLottery(
            lotteryID,
            _ticketPrice,
            startingTimestamp,
            _lotteryDuration
        );
    }

    /// @inheritdoc ILottery
    function withdrawEth() external override onlyOwner {
        uint256 amount = adminAmount;
        require(amount > 0, "The admin amount is zero!");
        adminAmount = 0;
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to withdraw!");
    }

    function fulfillRandomWords(
        uint256,
        uint256[] memory _randomWords
    ) internal override {
        lotteryStatus = Status.COMPLETED;
        randomResult = _randomWords[0];
        winner = _findWinner();
        _setWinnerPrize(winner, winnerAmount);
        emit CompletedLottery(lotteryID, randomResult, winner);
    }

    function _addLottery() private {
        allLotteries[lotteryID++] = LotteryInfo(
            lotteryID,
            prizePool,
            costPerTicket,
            startingTimestamp,
            winner,
            randomResult,
            lotteryDuration
        );
    }

    function _calculateWinnerAmount() private view returns (uint256) {
        return (prizePool * winnerPercentage) / 100;
    }

    function _findWinner() private view returns (address) {
        return participants[randomResult % participants.length];
    }

    function _increaseAdminAmount(uint256 amount) private {
        adminAmount += amount;
    }

    function _reset() private {
        lotteryStatus = Status.NOT_STARTED;
        costPerTicket = 0;
        lotteryDuration = 0;
        participants = new address[](0);
        prizePool = 0;
        randomResult = 0;
        startingTimestamp = 0;
        winner = address(0);
        winnerAmount = 0;
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

    function _setWinnerPrize(address _winner, uint256 _amount) private {
        prizeAmountOfWinners[_winner] = _amount;
    }

    function _transferPrize(uint256 amount) private {
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send winner prize!");
    }
}
