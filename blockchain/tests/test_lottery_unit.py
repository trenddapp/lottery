import brownie
from brownie import accounts, LotteryMock, VRFCoordinatorMock, network, config
import pytest
import time

TICKET_PRICE = 100000000000000000  # 1 ether
WINNER_PERCENTAGE = 80
DURATION = 10
ADDRESS_ONE = "0x0000000000000000000000000000000000000001"


@pytest.fixture
def deploy_lottery():
    config_network = config["networks"][network.show_active()]
    base_fee = config_network["base_fee"]
    gas_price_link = config_network["gas_price_link"]
    vrf_sub_fund_amount = config_network["vrf_sub_fund_amount"]
    key_hash = config_network["key_hash"]
    call_back_gas_limit = config_network["call_back_gas_limit"]

    vrf = VRFCoordinatorMock.deploy(
        base_fee, gas_price_link, {"from": accounts[0]})

    # create subscription
    tx = vrf.createSubscription()
    tx.wait(1)
    subscription_id = tx.events["SubscriptionCreated"]["subId"]

    # fund subscription
    vrf.fundSubscription(subscription_id, vrf_sub_fund_amount)

    lottery = LotteryMock.deploy(
        vrf, subscription_id, key_hash, call_back_gas_limit, {"from": accounts[0]})

    vrf.addConsumer(subscription_id, lottery)

    return lottery, vrf


def test_deployment(deploy_lottery):
    lottery = deploy_lottery[0]

    assert lottery.lotteryStatus() == 0

    assert lottery.owner() == accounts[0]

    assert lottery.winner() == ADDRESS_ONE

    assert lottery.randomResult() == 1


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
    assert lottery.startingTimestamp() != 1


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
    assert lottery.numberOfTickets(1, accounts[1]) == 1


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

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         2, {"from": accounts[0]})

    time.sleep(3)

    lottery.closeLottery({"from": accounts[0]})

    assert lottery.allLotteries(1)[0] == 1  # lottery id
    assert lottery.allLotteries(1)[1] == 1  # prize pool
    assert lottery.allLotteries(1)[2] == TICKET_PRICE  # ticket price
    assert lottery.allLotteries(1)[3] != 1  # starting timestamp
    assert lottery.allLotteries(1)[4] == ADDRESS_ONE  # winner
    assert lottery.allLotteries(1)[5] == 1  # random result
    assert lottery.allLotteries(1)[6] == 2  # lottery duration


def test_close_lottery(deploy_lottery):
    lottery, vrf = deploy_lottery

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})
    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    assert lottery.prizePool() == TICKET_PRICE*2
    assert lottery.numberOfTickets(1, accounts[1]) == 2

    time.sleep(DURATION)

    tx = lottery.closeLottery({"from": accounts[0]})

    assert lottery.lotteryStatus() == 2

    request_id = tx.events["RandomWordsRequested"]["requestId"]

    vrf.fulfillRandomWords(request_id, lottery)

    time.sleep(DURATION)

    assert lottery.lotteryStatus() == 3
    assert lottery.randomResult() != 1
    assert lottery.winner() == accounts[1]


def test_cant_claim_reward_not_ended(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    with brownie.reverts("The lottery has not completed yet!"):
        lottery.claimReward({"from": accounts[0]})


def test_cant_claim_reward_not_winner_or_owner(deploy_lottery):
    lottery, vrf = deploy_lottery

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    time.sleep(DURATION)

    tx = lottery.closeLottery({"from": accounts[0]})
    request_id = tx.events["RandomWordsRequested"]["requestId"]
    vrf.fulfillRandomWords(request_id, lottery)

    time.sleep(DURATION)

    with brownie.reverts("Only the winner can claim reward!"):
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

    lottery.claimReward({"from": accounts[1]})

    assert lottery.allLotteries(1)[0] == 1  # lottery id
    assert lottery.allLotteries(1)[1] == TICKET_PRICE  # prize pool
    assert lottery.allLotteries(1)[2] == TICKET_PRICE  # ticket price
    assert lottery.allLotteries(1)[3] != 1  # starting timestamp
    assert lottery.allLotteries(1)[4] == accounts[1]  # winner
    assert lottery.allLotteries(1)[5] != 1  # random result
    assert lottery.allLotteries(1)[6] == DURATION  # lottery duration


def test_cant_withdraw_eth_lottery_opened(deploy_lottery):
    lottery = deploy_lottery[0]

    lottery.startLottery(TICKET_PRICE, WINNER_PERCENTAGE,
                         DURATION, {"from": accounts[0]})

    lottery.buyTicket({"value": TICKET_PRICE, "from": accounts[1]})

    with brownie.reverts("The prizePool is not empty!"):
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

    lottery.claimReward({"from": accounts[1]})

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

    lottery.claimReward({"from": accounts[1]})

    assert lottery.balance() == TICKET_PRICE * 0.2

    lottery.withdrawEth({"from": accounts[0]})

    assert lottery.balance() == 0
