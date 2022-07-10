from brownie import Lottery
from scripts.deploy import deploy_lottery
from scripts.useful import get_account
import time

TICKET_PRICE = 1000000000000000  # 0.01 ether
WINNER_PERCENTAGE = 80
DURATION = 60
OWNER = get_account()
ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"


def test_deployment():
    lottery = deploy_lottery()

    lottery.initialize({"from": OWNER})

    assert lottery.lotteryStatus() == 0

    assert lottery.owner() == OWNER

    assert lottery.winner() == ZERO_ADDRESS

    assert lottery.randomResult() == 0


def test_hold_a_lottery():
    lottery = Lottery[-1]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": OWNER})

    assert lottery.lotteryStatus() == 1
    assert lottery.startingTimestamp() != 0

    lottery.buyTicket({"from": OWNER, "value": TICKET_PRICE})

    assert lottery.prizePool() == TICKET_PRICE
    assert lottery.participants(0) == OWNER

    time.sleep(DURATION)
    lottery.closeLottery({"from": OWNER})

    assert lottery.lotteryStatus() == 2

    time.sleep(DURATION)  # wait for chainlink

    assert lottery.lotteryStatus() == 3
    assert lottery.randomResult() != 0
    assert lottery.winner() == OWNER

    # contract address has been added to the chainlink subscription by me (https://vrf.chain.link)
    lottery.claimReward({"from": OWNER})

    assert lottery.lotteryStatus() == 0
    assert lottery.owner() == OWNER
    assert lottery.winner() == ZERO_ADDRESS
    assert lottery.randomResult() == 0
    assert lottery.allLotteries(0)[1] == TICKET_PRICE  # prize pool
    assert lottery.allLotteries(0)[5] == OWNER  # winner
