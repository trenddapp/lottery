// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Lottery {
    address payable[] private participants;
    uint256 private startingTimestamp;
    uint256 private closingTimestamp;
    uint256 private costPerTicket;
    address payable private winner;
    uint256 private prizePool;

    uint256 public lotteryID;

    uint256 prizeAdmin;

    uint256 public randomResult;

    address admin;

    // represents the status of the lottery
    enum Status {
        NOT_STARTED,
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

    modifier onlyWinner() {
        require(msg.sender == winner);
        _;
    }

    modifier onlyOwner() {
        _;
    }

    // constructor(
    //     address _vrfCoordinator,
    //     address _link,
    //     uint256 _fee,
    //     bytes32 _keyHash
    // ) public VRFConsumerBase(_vrfCoordinator, _link) {
    //     lotteryStatus = Status.Completed;
    //     linkFee = _fee;
    //     linkKeyHash = _keyHash;
    // }

    function startLottery(uint256 _ticketPrice)
        external
        ifNotStarted
        onlyOwner
    {
        costPerTicket = _ticketPrice;
        lotteryStatus = Status.OPEN;
        startingTimestamp = block.timestamp; // now
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
    }

    function completeLottery() external ifClosed onlyOwner {
        pickWinner(); // pick winner
        lotteryStatus = Status.COMPLETED;
    }

    function pickWinner() private ifCompleted {
        uint256 winnerIndex = randomResult % participants.length;
        winner = participants[winnerIndex];
    }

    function requestRandomNumber() private {
        // bytes32 requestId = requestRandomness(linkKeyHash, linkFee);
        // emit RequestedRandomness(requestId);
    }

    // /**
    //  * Callback function used by VRF Coordinator
    //  * recieve random number
    //  */
    // function fulfillRandomness(bytes32 requestId, uint256 randomness)
    //     internal
    //     override
    // {
    //     require(randomness > 0, "Random not found!");
    //     randomResult = randomness;
    // }

    function claimReward() external ifCompleted onlyWinner {
        // uint256 winnerPrize = 0.9 * prizePool; // 90% of the prizePool is for the winner
        // winner.transfer(winnerPrize); // transfer prize to the winner
        // prizePool -= winnerPrize;
    }

    function notStareted() internal ifCompleted onlyOwner {
        // lotteryStatus = Status.NOT_STARTED;
        // admin.transfer(prizePool); // transfer 10% of the prizePool to the winner
    }
}
