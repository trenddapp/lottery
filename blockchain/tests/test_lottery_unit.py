import brownie
from brownie import accounts, Wei, ZERO_ADDRESS
import time

TICKET_PRICE = Wei("1 ether")
WINNER_PERCENTAGE = 80
DURATION = 10


def test_deployment(deploy_lottery):
    lottery = deploy_lottery[0]

    assert lottery.lotteryStatus() == 0

    assert lottery.owner() == accounts[0]

    assert lottery.winner() == ZERO_ADDRESS

    assert lottery.randomResult() == 0


def test_cant_start_lottery_not_owner(deploy_lottery):
    lottery = deploy_lottery[0]

    with brownie.reverts("Ownable: caller is not the owner"):
        lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                             DURATION, {"from": accounts[1]})


def test_cant_start_lottery_started(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    with brownie.reverts():
        lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                             DURATION, {"from": accounts[0]})


def test_start_lottery(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    assert lottery.lotteryStatus() == 1
    assert lottery.costPerTicket() == TICKET_PRICE
    assert lottery.winnerPercentage() == WINNER_PERCENTAGE
    assert lottery.lotteryDuration() == DURATION
    assert lottery.startingTimestamp() != 0


def test_cant_buy_ticket_not_started(deploy_lottery):
    lottery = deploy_lottery[0]

    with brownie.reverts("The lottery has not started yet!"):
        lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})


def test_cant_buy_ticket_ended(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         0, {"from": accounts[0]})

    time.sleep(3)

    with brownie.reverts("Time is over!"):
        lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})


def test_cant_buy_ticket_invalid_value(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    with brownie.reverts("Enter a valid price!"):
        lottery.buyTicket({"value": 1, "from": accounts[1]})


def test_buy_ticket(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    assert lottery.prizePool() == TICKET_PRICE
    assert lottery.participants(0) == accounts[1]
    assert lottery.numberOfTickets(0, accounts[1]) == 1


def test_cant_close_lottery_not_owner(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         0, {"from": accounts[0]})

    time.sleep(3)

    with brownie.reverts("Ownable: caller is not the owner"):
        lottery.closeLottery({"from": accounts[1]})


def test_cant_close_lottery_opened(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    with brownie.reverts("Time is not over!"):
        lottery.closeLottery({"from": accounts[0]})


def test_cant_close_lottery_not_started(deploy_lottery):
    lottery = deploy_lottery[0]

    with brownie.reverts("You can not close the unstarted lottery!"):
        lottery.closeLottery({"from": accounts[0]})


def test_close_lottery_without_player(deploy_lottery):
    lottery = deploy_lottery[0]
    lottery_duration = 2

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         lottery_duration, {"from": accounts[0]})

    time.sleep(3)

    lottery.closeLottery({"from": accounts[0]})

    assert lottery.allLotteries(0)[0] == 0  # lottery id
    assert lottery.allLotteries(0)[1] == 0  # prize pool
    assert lottery.allLotteries(0)[2] == TICKET_PRICE  # ticket price
    assert lottery.allLotteries(0)[3] != 0  # starting timestamp
    assert lottery.allLotteries(0)[4] == ZERO_ADDRESS  # winner
    assert lottery.allLotteries(0)[5] == 0  # random result
    assert lottery.allLotteries(0)[6] == lottery_duration  # lottery duration


def test_close_lottery(deploy_lottery):
    lottery, vrf = deploy_lottery

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})
    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    assert lottery.prizePool() == 2 * TICKET_PRICE
    assert lottery.numberOfTickets(0, accounts[1]) == 2

    time.sleep(DURATION)

    tx = lottery.closeLottery({"from": accounts[0]})

    assert lottery.lotteryStatus() == 2

    request_id = tx.events["RandomWordsRequested"]["requestId"]

    vrf.fulfillRandomWords(request_id, lottery)

    time.sleep(DURATION)

    assert lottery.lotteryStatus() == 3
    assert lottery.randomResult() != 0
    assert lottery.winner() == accounts[1]


def test_cant_claim_reward_not_winner(deploy_lottery):
    lottery, vrf = deploy_lottery

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    time.sleep(DURATION)

    tx = lottery.closeLottery({"from": accounts[0]})
    request_id = tx.events["RandomWordsRequested"]["requestId"]
    vrf.fulfillRandomWords(request_id, lottery)

    time.sleep(DURATION)

    with brownie.reverts("You are not a winner!"):
        lottery.claimReward({"from": accounts[2]})


def test_cant_claim_reward_double(deploy_lottery):
    lottery, vrf = deploy_lottery

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    time.sleep(DURATION)

    tx = lottery.closeLottery({"from": accounts[0]})
    request_id = tx.events["RandomWordsRequested"]["requestId"]
    vrf.fulfillRandomWords(request_id, lottery)

    time.sleep(DURATION)

    lottery.claimReward({"from": accounts[1]})

    with brownie.reverts():
        lottery.claimReward({"from": accounts[1]})


def test_claim_reward(deploy_lottery):
    lottery, vrf = deploy_lottery

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    time.sleep(DURATION)

    tx = lottery.closeLottery({"from": accounts[0]})
    request_id = tx.events["RandomWordsRequested"]["requestId"]
    vrf.fulfillRandomWords(request_id, lottery)

    time.sleep(DURATION)

    lottery.resetLottery({"from": accounts[0]})

    lottery.claimReward({"from": accounts[1]})

    assert lottery.allLotteries(0)[0] == 0  # lottery id
    assert lottery.allLotteries(0)[1] == TICKET_PRICE  # prize pool
    assert lottery.allLotteries(0)[2] == TICKET_PRICE  # ticket price
    assert lottery.allLotteries(0)[3] != 0  # starting timestamp
    assert lottery.allLotteries(0)[4] == accounts[1]  # winner
    assert lottery.allLotteries(0)[5] != 0  # random result
    assert lottery.allLotteries(0)[6] == DURATION  # lottery duration


def test_cant_reset_lottery_not_closed(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    with brownie.reverts("The lottery has not completed yet!"):
        lottery.resetLottery({"from": accounts[0]})


def test_cant_reset_lottery_not_completed(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    time.sleep(DURATION)

    tx = lottery.closeLottery({"from": accounts[0]})

    with brownie.reverts("The lottery has not completed yet!"):
        lottery.resetLottery({"from": accounts[0]})


def test_reset_lottery(deploy_lottery):
    lottery, vrf = deploy_lottery

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    time.sleep(DURATION)

    tx = lottery.closeLottery({"from": accounts[0]})
    request_id = tx.events["RandomWordsRequested"]["requestId"]
    vrf.fulfillRandomWords(request_id, lottery)

    time.sleep(DURATION)

    lottery.resetLottery({"from": accounts[0]})

    assert lottery.lotteryStatus() == 0
    assert lottery.owner() == accounts[0]
    assert lottery.winner() == ZERO_ADDRESS
    assert lottery.randomResult() == 0

    assert lottery.allLotteries(0)[0] == 0  # lottery id
    assert lottery.allLotteries(0)[1] == TICKET_PRICE  # prize pool
    assert lottery.allLotteries(0)[2] == TICKET_PRICE  # ticket price
    assert lottery.allLotteries(0)[3] != 0  # starting timestamp
    assert lottery.allLotteries(0)[4] == accounts[1]  # winner
    assert lottery.allLotteries(0)[5] != 0  # random result
    assert lottery.allLotteries(0)[6] == DURATION  # lottery duration


def test_cant_withdraw_eth_lottery_opened(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    with brownie.reverts("The admin amount is zero!"):
        lottery.withdrawEth({"from": accounts[0]})


def test_cant_withdraw_eth_not_owner(deploy_lottery):
    lottery, vrf = deploy_lottery

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    time.sleep(DURATION)

    tx = lottery.closeLottery({"from": accounts[0]})
    request_id = tx.events["RandomWordsRequested"]["requestId"]
    vrf.fulfillRandomWords(request_id, lottery)

    time.sleep(DURATION)

    lottery.resetLottery({"from": accounts[0]})

    with brownie.reverts("Ownable: caller is not the owner"):
        lottery.withdrawEth({"from": accounts[1]})


def test_withdraw_eth(deploy_lottery):
    lottery, vrf = deploy_lottery

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    time.sleep(DURATION)

    tx = lottery.closeLottery({"from": accounts[0]})
    request_id = tx.events["RandomWordsRequested"]["requestId"]
    vrf.fulfillRandomWords(request_id, lottery)

    time.sleep(DURATION)

    lottery.resetLottery({"from": accounts[0]})

    assert lottery.balance() == TICKET_PRICE

    lottery.withdrawEth({"from": accounts[0]})

    assert lottery.balance() == TICKET_PRICE * 0.8  # winner amount
