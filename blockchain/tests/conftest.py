from brownie import accounts, config, LotteryMock, network, VRFCoordinatorMock
import pytest


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

    # add lottery to subscription
    vrf.addConsumer(subscription_id, lottery)

    return lottery, vrf
