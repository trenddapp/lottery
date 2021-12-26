// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Lottery {
    // Counter for lottery IDs
    uint256 private lotteryIdCounter_;
    // Lottery size
    uint8 public sizeOfLottery_;

    // Represents the status of the lottery
    enum Status {
        NotStarted, // The lottery has not started yet
        Open, // The lottery is open for ticket purchases
        Closed, // The lottery is no longer open for ticket purchases
        Completed // The lottery has been closed and the numbers drawn
    }

    // All the needed info around a lottery
    struct LotteryInfo {
        uint256 lotteryID; // ID for lottery
        Status lotteryStatus; // Status for lottery
        uint256 prizePoolInCake; // The amount of cake for prize money
        uint256 costPerTicket; // Cost per ticket in $cake
        uint8[] prizeDistribution; // The distribution for prize money
        uint256 startingTimestamp; // Block timestamp for star of lotto
        uint256 closingTimestamp; // Block timestamp for end of entries
        uint16[] winningNumbers; // The winning numbers
    }

    // Lottery ID's to info
    mapping(uint256 => LotteryInfo) internal allLotteries_;

    //-------------------------------------------------------------------------
    // EVENTS
    //-------------------------------------------------------------------------

    event RequestNumbers(uint256 lotteryId, bytes32 requestId);

    event LotteryOpen(uint256 lotteryId, uint256 ticketSupply);

    event LotteryClose(uint256 lotteryId, uint256 ticketSupply);

    //-------------------------------------------------------------------------
    // VIEW FUNCTIONS
    //-------------------------------------------------------------------------

    function costToBuyTickets(uint256 _lotteryId, uint256 _numberOfTickets)
        external
        view
        returns (uint256 totalCost)
    {
        uint256 pricePer = allLotteries_[_lotteryId].costPerTicket;
        totalCost = pricePer * _numberOfTickets;
        return totalCost;
    }

    function getLotteryInfo(uint256 _lotteryId)
        external
        view
        returns (LotteryInfo memory)
    {
        return (allLotteries_[_lotteryId]);
    }
}
