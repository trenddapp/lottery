// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Lottery is Ownable, VRFConsumerBase {
    uint256 public lotteryID = 0;
    address payable[] public participants;
    uint256 public costPerTicket;
    uint256 public prizePool;
    uint256 public startingTimestamp;
    uint256 public closingTimestamp;
    address payable public winner;
    uint256 public randomResult;
    uint256 public winnerIndex;
    bool public randomGenerated = false;

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
    Status public lotteryStatus = Status.NOT_STARTED;

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
        require(
            lotteryStatus == Status.CLOSED,
            "The lottery has not closed yet!"
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
            "Only winner or owner can claim reward!"
        );
        _;
    }

    modifier randomNumberGenerated() {
        require(randomGenerated == true, "The winner has not been selected!");
        _;
    }

    event RequestedRandomness(bytes32 requestId);
    event OpenedLottery(uint256 lotteryId);
    event ClosedLottery(uint256 lotteryId);
    event ClaimedReward(uint256 lotteryId);

    // constructor(
    //     address _linkToken,
    //     address _vrfCoordinator,
    //     bytes32 _keyHash,
    //     uint256 _fee,
    //     uint8 _winnerPercentage
    // ) public VRFConsumerBase(_vrfCoordinator, _linkToken) {
    //     keyHash = _keyHash;
    //     fee = _fee; // varies by network
    //     winnerPercentage = _winnerPercentage;
    //     lotteryStatus = Status.NOT_STARTED;
    // }

    constructor()
        VRFConsumerBase(
            0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, // VRF Coordinator
            0x01BE23585060835E02B77ef475b0Cc51aA1e0709 // LINK Token
        )
    {
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.1 * 10**18; // 0.1 LINK (Varies by network)
        winnerPercentage = 85;
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
        prizePool += costPerTicket; // add value to prizePool
    }

    function closeLottery() external ifOpen onlyOwner {
        lotteryStatus = Status.CLOSED; // pending
        closingTimestamp = block.timestamp; // closing time
        emit ClosedLottery(lotteryID);
    }

    function completeLottery() external ifClosed onlyOwner {
        // request random number
        bytes32 requestId = getRandomNumber();
        lotteryStatus = Status.COMPLETED; // winner picked
        emit RequestedRandomness(requestId);
    }

    /**
     * requests randomness
     */
    function getRandomNumber() private returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) >= fee,
            "Not enough LINK - fill contract with faucet"
        );
        return requestRandomness(keyHash, fee);
    }

    /**
     * callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness)
        internal
        override
    {
        randomGenerated = true;
        randomResult = randomness;
        winnerIndex = randomness % participants.length;
        winner = participants[winnerIndex];
    }

    function claimReward()
        external
        ifCompleted
        randomNumberGenerated
        onlyWinnerOrOwner
    {
        uint256 winnerPrize = prizePool * (winnerPercentage / 100);
        transferPrize(winnerPrize);
        lotteryStatus = Status.NOT_STARTED;
        addLotteryInfoAndReset();
        emit ClaimedReward(lotteryID);
    }

    function transferPrize(uint256 _winnerPrize) private {
        prizePool -= _winnerPrize;
        winner.transfer(_winnerPrize); // transfer the winnerPrize to the winner
        payable(owner()).transfer(prizePool); // transfer the rest of the prizePool to the owner
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
        // reset
        participants = new address payable[](0);
        prizePool = 0;
        randomResult = 0;
        winner = payable(address(0));
        randomGenerated = false;
    }

    function withdrawLink(uint256 _balance) external onlyOwner {
        LINK.transfer(owner(), _balance);
    }

    function withdrawEth() external onlyOwner {
        require(prizePool == 0, "prizePool is not empty!");
        payable(owner()).transfer(address(this).balance);
    }
}
