from brownie import (
    Lottery,
    LotteryProxyAdmin,
    LotteryProxy,
)
from scripts.useful import get_account, encode_function_data

ACCOUNT = get_account()


def deploy_lottery():
    upgradeable_dappz_lottery = Lottery.deploy(
        {"from": ACCOUNT},
        publish_source=True,
    )
    return upgradeable_dappz_lottery


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
    proxy.initialize({"from": ACCOUNT})
