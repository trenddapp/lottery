// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Lottery is Ownable {
    uint256 private lotteryID = 0;
    address payable[] private participants;
    uint256 private costPerTicket;
    uint256 private prizePool;
    uint256 private startingTimestamp;
    uint256 private closingTimestamp;
    address payable private winner;
    uint256 public randomResult;

    bool rewardClaimed = false;

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

    // constructor(
    //     address _vrfCoordinator,
    //     address _link,
    //     uint256 _fee,
    //     bytes32 _keyHash
    // ) public VRFConsumerBase(_vrfCoordinator, _link) Ownable {
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

    function claimReward() external ifCompleted notClaimed onlyWinnerOrOwner {
        uint256 winnerPrize = (prizePool * 9) / 10; // 90% of the prizePool is for the winner
        transferPrize(winnerPrize);
        rewardClaimed = true;
        lotteryStatus = Status.NOT_STARTED;
        addLotteryInfoAndReset();
    }

    function transferPrize(uint256 _winnerPrize) private {
        prizePool -= _winnerPrize;
        winner.transfer(_winnerPrize); // transfer the winnerPrize to the winner
        owner().transfer(prizePool); // transfer 10% of the prizePool to the owner
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
