from brownie import config, Lottery, LotteryProxy, LotteryProxyAdmin, network
from scripts.useful import encode_function_data, get_account

ACCOUNT = get_account()


def deploy_lottery():
    config_network = config["networks"][network.show_active()]
    vrf = config_network["coordinator"]
    subscription_id = config_network["subscription_id"]
    key_hash = config_network["key_hash"]
    call_back_gas_limit = config_network["call_back_gas_limit"]

    upgradeable_lottery = Lottery.deploy(
        vrf, subscription_id, key_hash, call_back_gas_limit,
        {"from": ACCOUNT}, publish_source=True
    )

    return upgradeable_lottery


def deploy_proxy_admin():
    proxy_admin = LotteryProxyAdmin.deploy(
        {"from": ACCOUNT},
        publish_source=True,
    )
    return proxy_admin


def deploy_proxy(lottery, proxy_admin):
    encoded_initializer_function = encode_function_data()
    proxy = LotteryProxy.deploy(
        lottery,
        proxy_admin,
        encoded_initializer_function,
        {"from": ACCOUNT},
        publish_source=True,
    )
    return proxy


def main():
    lottery = deploy_lottery()
    print(f"Lottery deployed to {lottery} !")
    lottery.initialize({"from": ACCOUNT})

    proxy_admin = deploy_proxy_admin()
    print(f"Proxy admin deployed to {proxy_admin} !")

    proxy = deploy_proxy(lottery, proxy_admin)
    print(f"Proxy deployed to {proxy} !")
